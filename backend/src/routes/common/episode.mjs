import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = Router();

/**
 * GET all episodes of a season (seasonId)
 */
router.get("/:seasonId", async (req, res) => {
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
    console.log("caught error in /seasons/:seasonId", error);
    res.status(500).send("caught error in /seasons/:seasonId");
  }
});

export { router as commonEpisode };
