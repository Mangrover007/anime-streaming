import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = Router();

/**
 * GET all episodes of a season (seasonId)
 */
router.get("/:seasonId/all", async (req, res) => {
  try {
    const seasonId = parseInt(req.params.seasonId);
    if (isNaN(seasonId)) res.status(400).send("Invalid anime id");
    const findEpisodes = await prisma.episode.findMany({
      where: {
        seasonId: seasonId
      },
    })
    res.status(200).json(findEpisodes);
  } catch (error) {
    console.log("caught error in /seasons/:seasonId/all", error);
    res.status(500).send("caught error in /seasons/:seasonId/all");
  }
});

router.get("/:episodeId", async (req, res) => {
  try {
    const episodeId = parseInt(req.params.episodeId);
    if (isNaN(episodeId)) res.status(400).send("Invalid episode id");
    const findEpisode = await prisma.episode.findUnique({
      where: {
        id: episodeId
      },
    })
    console.log("EPISODE SERVED", findEpisode);
    res.status(200).json(findEpisode);
  } catch (error) {
    console.log("caught error in /seasons/:episodeId", error);
    res.status(500).send("caught error in /seasons/:episodeId");
  }
});

export { router as commonEpisode };
