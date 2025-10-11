import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();


// CREATE
router.post("/add/:title", async (req, res) => {
  const {
    seasonNumber,
    isFinished = false,
    startedAiring,
    finishedAiring,
  } = req.body;

  const { title } = req.params;

  try {
    const anime = await prisma.anime.findFirst({
      where: {
        title: {
          equals: title,
          mode: "insensitive",
        },
      },
    });

    if (!anime) {
      return res.status(404).json({ error: `No anime found with title: ${title}` });
    }

    const season = await prisma.season.create({
      data: {
        animeId: anime.id,
        seasonNumber,
        isFinished,
        startedAiring: startedAiring ? new Date(startedAiring) : undefined,
        finishedAiring: finishedAiring ? new Date(finishedAiring) : undefined,
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

  try {
    const deleted = await prisma.season.delete({
      where: { id: seasonId },
    });

    return res.status(200).json({ message: "Season deleted successfully.", deleted });
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
        animeId,
        seasonNumber,
        isFinished,
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


// READ
router.get("/all/:title", async (req, res) => {
  const { title } = req.params;

  try {
    const anime = await prisma.anime.findFirst({
      where: {
        title: {
          equals: title,
          mode: "insensitive",
        },
      },
    });

    if (!anime) {
      return res.status(404).json({ error: `Anime not found: ${title}` });
    }

    const seasons = await prisma.season.findMany({
      where: { animeId: anime.id },
      orderBy: { seasonNumber: "asc" },
    });

    return res.json({ anime: anime.title, seasons });
  } catch (error) {
    console.error("Error fetching seasons:", error);
    return res.status(500).json({ error: error.message });
  }
});


export { router as seasonRoute };
