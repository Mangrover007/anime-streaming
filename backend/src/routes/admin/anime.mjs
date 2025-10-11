import { Router } from "express";
import { PrismaClient, AnimeStatus } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

/**
 * CREATE Anime
 * Required:
 * - title, description, author, status, thumbnailUrl, startedAiring
 * Optional:
 * - rating, finishedAiring, genres (array of genre IDs)
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
        genres, // [1, 2, 3]
    } = req.body;

    try {
        const anime = await prisma.anime.create({
            data: {
                title,
                description,
                rating,
                author,
                startedAiring: new Date(startedAiring),
                finishedAiring: finishedAiring ? new Date(finishedAiring) : null,
                status,
                thumbnailUrl,
                genres: genres
                    ? {
                          connect: genres.map((id) => ({ id })),
                      }
                    : undefined,
            },
            include: { genres: true },
        });

        return res.status(201).json(anime);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET All Animes
 */
router.get("/all", async (req, res) => {
    try {
        const animes = await prisma.anime.findMany({
            include: {
                genres: true,
                seasons: true,
            },
        });
        return res.status(200).json(animes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET Anime by ID
 */
router.get("/get/:id", async (req, res) => {
    const animeId = parseInt(req.params.id);
    try {
        const anime = await prisma.anime.findUnique({
            where: { id: animeId },
            include: {
                genres: true,
                seasons: true,
            },
        });

        if (!anime) return res.status(404).json({ error: "Anime not found." });

        return res.status(200).json(anime);
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
                title: title ? title : null,
                description,
                rating,
                author,
                startedAiring: startedAiring ? new Date(startedAiring) : undefined,
                finishedAiring: finishedAiring ? new Date(finishedAiring) : undefined,
                status,
                thumbnailUrl
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

/**
 * GET /anime/search?q=somequery
 * Returns anime titles starting with query string (case-insensitive)
 */
router.get("/search", async (req, res) => {
  const query = (req.query.q)?.trim();

  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required." });
  }

  try {
    const matches = await prisma.anime.findMany({
      where: {
        title: {
          startsWith: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
      },
    });

    return res.json(matches);
  } catch (err) {
    console.error("Error during search:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { router as adminRoute };
