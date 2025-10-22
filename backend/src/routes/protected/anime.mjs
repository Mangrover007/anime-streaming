import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { protectedAnimeGetFavoriteSchema, protectedAnimePostFavoriteSchema } from "../../schemas/protected/anime.mjs";
const prisma = new PrismaClient;

const router = Router();

router.get("/fav",
  function (req, res, next) {
    const userId = req.query.id;
    const validation = protectedAnimeGetFavoriteSchema.safeParse({ userId });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async function (req, res) {
    const { userId } = req.validated;
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

router.post("/add-fav",
  function (req, res, next) {
    const { animeId, userId } = req.body;
    const parsedAnimeId = animeId;
    const parsedUserId = userId;
    const validation = protectedAnimePostFavoriteSchema.safeParse({ animeId: parsedAnimeId, userId: parsedUserId });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async (req, res) => {
    try {
      const { animeId, userId } = req.validated;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          favoriteAnimes: {
            connect: { id: animeId },
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

router.post("/remove-fav",
  function (req, res, next) {
    const { animeId, userId } = req.body;
    const parsedAnimeId = animeId;
    const parsedUserId = userId;
    const validation = protectedAnimePostFavoriteSchema.safeParse({ animeId: parsedAnimeId, userId: parsedUserId });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async function (req, res) {
    try {
      const { animeId, userId } = req.validated;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          favoriteAnimes: {
            disconnect: { id: animeId },
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
