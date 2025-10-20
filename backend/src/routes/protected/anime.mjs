import { PrismaClient } from "@prisma/client";
import { Router } from "express";
const prisma = new PrismaClient;

const router = Router();

router.get("/fav", async (req, res) => {
  const userId = parseInt(req.query.id);
  if (isNaN(userId)) return res.status(400).send("inavlid user id");
  const findUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      favoriteAnimes: true
    }
  });
  if (!findUser) return res.status(404).send("user not found");
  return res.send(findUser.favoriteAnimes);
});

router.post("/add-fav", async (req, res) => {
  try {
    const { animeId, userId } = req.body;

    const parsedAnimeId = parseInt(animeId);
    const parsedUserId = parseInt(userId);

    if (isNaN(parsedAnimeId) || isNaN(parsedUserId)) {
      return res.status(400).json({ error: "Invalid animeId or userId." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parsedUserId },
      data: {
        favoriteAnimes: {
          connect: { id: parsedAnimeId },
        },
      },
      include: { favoriteAnimes: true },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "User not found." });
    }

    console.error("Failed to add favorite anime:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/remove-fav", async (req, res) => {
  try {
    const { animeId, userId } = req.body;

    const parsedAnimeId = parseInt(animeId);
    const parsedUserId = parseInt(userId);

    if (isNaN(parsedAnimeId) || isNaN(parsedUserId)) {
      return res.status(400).json({ error: "Invalid animeId or userId." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parsedUserId },
      data: {
        favoriteAnimes: {
          disconnect: { id: parsedAnimeId },
        },
      },
      include: { favoriteAnimes: true },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "User not found." });
    }

    console.error("Failed to remove favorite anime:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


export { router as userAnimeRoute };
