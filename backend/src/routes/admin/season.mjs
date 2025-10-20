import { Router } from "express";
import { PrismaClient } from "@prisma/client";

// TODO: add input validation for the routes

const prisma = new PrismaClient();
const router = Router();


// CREATE
router.post("/:animeName", async (req, res) => {

  const animeName = req.params.animeName;

  const {
    isFinished,
    startedAiring,
    finishedAiring,
  } = req.body;

  try {
    const anime = await prisma.anime.findUnique({
      where: {
        title: animeName
      },
      include: {
        seasons: true
      }
    });

    if (!anime) {
      return res.status(404).json({ error: `No anime found with name: ${animeName}` });
    }

    const season = await prisma.season.create({
      data: {
        animeId: anime.id,
        seasonNumber: anime.seasons.length + 1,
        isFinished: isFinished,

        startedAiring: startedAiring ? new Date(startedAiring) : null,
        finishedAiring: finishedAiring ? new Date(finishedAiring) : null,
      },
    });

    return res.status(201).json(season);
  } catch (error) {
    console.error("Error creating season:", error);
    return res.status(500).json({ error: error.message });
  }
});


// DELETE
router.delete("/:id", async (req, res) => {
  const seasonId = parseInt(req.params.id);
  if (isNaN(seasonId)) return res.status(400).send("Invalid season id in request");

  try {
    const deleted = await prisma.season.delete({
      where: { id: seasonId },
    });

    return res.status(200).json({ message: "Season deleted successfully.", deleted: deleted });
  } catch (error) {
    console.error("Error deleting season:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Season not found." });
    }
    return res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  const seasonId = parseInt(req.params.id);
  if (isNaN(seasonId)) return res.status(400).send("Invalid season id in request");

  const {
    animeId,
    seasonNumber,
    isFinished,
    startedAiring,
    finishedAiring,
  } = req.body;

  try {
    const updateData = {
      ...(animeId !== undefined && isNaN(parseInt(animeId)) !== true && { animeId: parseInt(animeId) }),
      ...(seasonNumber !== undefined && { seasonNumber }),
      ...(isFinished !== undefined && { isFinished }),
      
      ...(startedAiring !== undefined && (startedAiring === null ? null : { startedAiring: new Date(startedAiring) })),
      ...(finishedAiring !== undefined && (finishedAiring === null ? null : { finishedAiring: new Date(finishedAiring) })),
    };

    const updatedSeason = await prisma.season.update({
      where: { id: seasonId },
      data: updateData,
    });

    return res.status(200).json(updatedSeason);
  } catch (error) {
    console.error("Error updating season:", error);
    return res.status(500).json({ error: error.message });
    // P2003 -> foreign key constriant violation -> animeId DNE in anime table
    // P2025 -> no record found for update -> seasonId DNE in season table
  }
});


export { router as seasonRoute };
