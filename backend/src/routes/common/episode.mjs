import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { getEpisodeByIdSchema, getEpisodesBySeasonSchema } from "../../schemas/common/episode.mjs";
const prisma = new PrismaClient();

const router = Router();

/**
 * GET all episodes of a season (seasonId)
 */
router.get("/:seasonId/all",
  function (req, res, next) {
    const seasonId = parseInt(req.params.seasonId);
    const validation = getEpisodesBySeasonSchema.safeParse({ seasonId });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async (req, res) => {
    try {
      const seasonId = req.validated.seasonId;

      const findEpisodes = await prisma.episode.findMany({
        where: {
          seasonId: seasonId
        },
        orderBy: {
          episodeNumber: 'asc',
        },
      })

      res.status(200).json(findEpisodes);
    } catch (error) {
      console.log("caught error in /seasons/:seasonId/all", error);
      res.status(500).send("caught error in /seasons/:seasonId/all");
    }
  });

router.get("/:episodeId",
  function (req, res, next) {
    const episodeId = parseInt(req.params.episodeId);
    const validation = getEpisodeByIdSchema.safeParse({ episodeId });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async (req, res) => {
    try {
      const episodeId = req.validated.episodeId;

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
