import { Router } from "express";
import { PrismaClient } from "@prisma/client";

// TODO: add input validation for the routes

const prisma = new PrismaClient();
const router = Router();


// CREATE
router.post("/add/:animeId", async (req, res) => {

  const animeId = parseInt(req.params.animeId);
  if (isNaN(animeId)) return res.status(400).send("Invalid anime id in request");

  const {
    seasonNumber,
    isFinished,
    startedAiring,
    finishedAiring,
  } = req.body;

  try {
    const anime = await prisma.anime.findUnique({
      where: {
        id: animeId
      }
    });

    if (!anime) {
      return res.status(404).json({ error: `No anime found with id: ${animeId}` });
    }

    const season = await prisma.season.create({
      data: {
        animeId: animeId,
        seasonNumber: seasonNumber,
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
router.delete("/delete/:id", async (req, res) => {
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


// UPDATE
router.put("/update/:id", async (req, res) => {
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
    const updated = await prisma.season.update({
      where: { id: seasonId },
      data: {
        animeId: animeId,
        seasonNumber: seasonNumber,
        isFinished: isFinished,

        startedAiring: startedAiring ? new Date(startedAiring) : null,
        finishedAiring: finishedAiring ? new Date(finishedAiring) : null,
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating season:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Season not found." });
    }
    return res.status(500).json({ error: error.message });
  }
});


router.patch("/update/:id", async (req, res) => {
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
  }
});


export { router as seasonRoute };
