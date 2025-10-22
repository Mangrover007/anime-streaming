import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { episodeCreateSchema, episodeDeleteSchema, episodePatchSchema } from "../../schemas/admin/episode.mjs";

const prisma = new PrismaClient();
const router = Router();

/**
 * POST /admin/episode/add
 * Creates a new Episode
 *
 * Required in body:
 * - seasonId, title, episodeNumber, length, airedAt, subUrl
 */
router.post("/",
  function (req, res, next) {
    const validation = episodeCreateSchema.safeParse(req.body);
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async (req, res) => {
    const { seasonId } = req.validated;

    try {
      const seasonExist = await prisma.season.findUnique({
        where: {
          id: seasonId
        },
        include: {
          episodes: true
        }
      })

      if (!seasonExist) return res.status(404).send(`season not found with id - ${seasonId}`);

      const episode = await prisma.episode.create({
        data: {
          ...req.validated,
          episodeNumber: seasonExist.episodes.length + 1
        },
      });

      return res.status(201).json(episode);
    } catch (error) {
      console.error("Error creating episode:", error);
      return res.status(500).json({ error: error.message });
    }
  });


router.patch("/:id",
  function (req, res, next) {
    const episodeId = req.params.id;
    const validation = episodePatchSchema.safeParse({ episodeId, ...req.body });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async (req, res) => {
    const { episodeId, ...rest } = req.validated;
    
    try {
      const updated = await prisma.episode.update({
        where: { id: episodeId },
        data: rest,
      });

      console.log("updated - ", updated);

      return res.json(updated);
    } catch (error) {
      console.error("Error updating episode:", error);
      return res.status(500).json({ error: error.message });
    }
  });


router.delete("/:id",
  function (req, res, next) {
    const episodeId = req.params.id;
    const validation = episodeDeleteSchema.safeParse({ episodeId });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  },
  async (req, res) => {
    const { episodeId } = req.validated;

    try {
      const deleted = await prisma.episode.delete({
        where: { id: episodeId },
      });

      return res.json({ message: "Episode deleted successfully", deleted });
    } catch (error) {
      console.error("Error deleting episode:", error);
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Episode not found." });
      }
      return res.status(500).json({ error: error.message });
    }
  }
);


export { router as episodeRoute };
