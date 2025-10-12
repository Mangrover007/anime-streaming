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
router.post("/add", async (req, res) => {
  const {
    seasonId,
    title,
    episodeNumber,
    length,
    airedAt,
    subUrl,
  } = req.body;

  try {
    const episode = await prisma.episode.create({
      data: {
        seasonId,
        title,
        episodeNumber,
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


router.patch("/update/:id", async (req, res) => {
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

    return res.json(updated);
  } catch (error) {
    console.error("Error updating episode:", error);
    return res.status(500).json({ error: error.message });
  }
});


router.delete("/delete/:id", async (req, res) => {
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
