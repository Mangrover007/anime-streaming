import { Router } from "express";
import { PrismaClient } from "@prisma/client";

// TODO: add input validation for the routes

const prisma = new PrismaClient();
const router = Router();

/**
 * POST /admin/episode/add
 * Creates a new Episode
 *
 * Required in body:
 * - seasonId, title, episodeNumber, length, airedAt, subUrl
 */
router.post("/", async (req, res) => {
  const {
    seasonId,
    title,
    length,
    airedAt,
    subUrl,
  } = req.body;

  try {
    const seasonExist = await prisma.season.findUnique({
      where: {
        id: parseInt(seasonId)
      },
      include: {
        episodes: true
      }
    })

    if (!seasonExist) return res.status(404).send(`season not found with id - ${seasonId}`);
    const episode = await prisma.episode.create({
      data: {
        seasonId: parseInt(seasonId),
        title,
        episodeNumber: seasonExist.episodes.length + 1,
        length,
        airedAt: new Date(airedAt),
        subUrl,
      },
    });

    return res.status(201).json(episode);
  } catch (error) {
    console.error("Error creating episode:", error);
    return res.status(500).json({ error: error.message });
  }
});


router.patch("/:id", async (req, res) => {
  const episodeId = parseInt(req.params.id);
  const {
    title,
    episodeNumber,
    length,
    airedAt,
    subUrl,
    seasonId,
  } = req.body;

  try {
    const updated = await prisma.episode.update({
      where: { id: episodeId },
      data: {
        ...(title !== undefined && { title }),
        ...(episodeNumber !== undefined && { episodeNumber }),
        ...(length !== undefined && { length }),
        ...(airedAt !== undefined && { airedAt: new Date(airedAt) }),
        ...(subUrl !== undefined && { subUrl }),
        ...(seasonId !== undefined && { seasonId }),
      },
    });

    console.log("updated - ", updated);

    return res.json(updated);
  } catch (error) {
    console.error("Error updating episode:", error);
    return res.status(500).json({ error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  const episodeId = parseInt(req.params.id);
  if (isNaN(episodeId)) return res.status(400).send("Invalid episode id");

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
});


export { router as episodeRoute };
