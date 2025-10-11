import { Router } from "express";
import { PrismaClient, AnimeStatus } from "@prisma/client";

// TODO: add genre connect/disconnect feature

const prisma = new PrismaClient();
const router = Router();


/**
 * POST - add a new record in Anime table
 */
router.post("/add", async (req, res) => {
  const {
    title,
    description,
    rating,
    author,
    startedAiring,
    finishedAiring,
    status,
    thumbnailUrl,
  } = req.body;

  try {
    const anime = await prisma.anime.create({
      data: {
        title: title,
        description: description,
        author: author,
        startedAiring: new Date(startedAiring),
        status: status,
        thumbnailUrl: thumbnailUrl,

        rating: rating ? Number(rating) : null,
        finishedAiring: finishedAiring ? new Date(finishedAiring) : null,
      },
    });

    return res.status(201).json(anime);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});



/**
 * UPDATE Anime by ID
 */
router.put("/update/:id", async (req, res) => {
  const animeId = parseInt(req.params.id);

  const {
    title,
    description,
    rating,
    author,
    startedAiring,
    finishedAiring,
    status,
    thumbnailUrl,
  } = req.body;

  try {
    // Ensure anime exists
    const existing = await prisma.anime.findUnique({ where: { id: animeId } });
    if (!existing) return res.status(404).json({ error: "Anime not found." });

    const updated = await prisma.anime.update({
      where: { id: animeId },
      data: {
        title: title,
        description: description,
        author: author,
        startedAiring: new Date(startedAiring),
        status: status,
        thumbnailUrl: thumbnailUrl,

        rating: rating ? Number(rating) : null,
        finishedAiring: finishedAiring ? new Date(finishedAiring) : null,
      },
      include: { genres: true },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});


/**
 * DELETE Anime by ID
 */
router.delete("/delete/:id", async (req, res) => {
  const animeId = parseInt(req.params.id);

  if (isNaN(animeId)) return res.status(400).json({ error: "Invalid anime ID." });

  try {
    const deleted = await prisma.anime.delete({
      where: { id: animeId },
    });

    return res.status(200).json({ message: "Anime deleted successfully", deleted });
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).send(`No anime exists with ID - ${animeId}`)
    }
    return res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH Anime by ID (Partial Update)
 */
router.patch("/update/:id", async (req, res) => {
  const animeId = parseInt(req.params.id);

  if (isNaN(animeId)) return res.status(400).json({ error: "Invalid anime ID." });

  const {
    title,
    description,
    rating,
    author,
    startedAiring,
    finishedAiring,
    status,
    thumbnailUrl,
  } = req.body;

  try {
    const existing = await prisma.anime.findUnique({ where: { id: animeId } });
    if (!existing) return res.status(404).json({ error: "Anime not found." });

    const updateData = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(rating !== undefined && { rating }),
      ...(author !== undefined && { author }),
      ...(startedAiring !== undefined && { startedAiring: new Date(startedAiring) }),
      ...(finishedAiring !== undefined && { finishedAiring: new Date(finishedAiring) }),
      ...(status !== undefined && { status }),
      ...(thumbnailUrl !== undefined && { thumbnailUrl }),
    };

    const updated = await prisma.anime.update({
      where: { id: animeId },
      data: {
        ...updateData,
      },
      include: { genres: true },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});


export { router as animeRoute };
