import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { adminAnimeDeleteSchema, adminAnimePatchSchema, adminAnimePostSchema } from "../../schemas/admin/anime.mjs";

// TODO: add genre connect/disconnect feature

const prisma = new PrismaClient();
const router = Router();


router.post("/add",
  function (req, res, next) {
    const validation = adminAnimePostSchema.safeParse(req.body);
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad requesrt");
  }, async (req, res) => {
    try {
      const anime = await prisma.anime.create({
        data: req.validated,
      });

      return res.status(201).json(anime);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  });


router.delete("/:id",
  function (req, res, next) {
    const animeId = req.params.id;
    const validation = adminAnimeDeleteSchema.safeParse({ animeId });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async (req, res) => {

    const animeId = req.validated.animeId;

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


router.patch("/update/:id",
  function (req, res, next) {
    const animeId = req.params.id;
    const validation = adminAnimePatchSchema.safeParse({ animeId, ...req.body });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async function (req, res) {

    try {
      const { animeId, ...updatedData } = req.validated;

      const existing = await prisma.anime.findUnique({ where: { id: animeId } });
      if (!existing) return res.status(404).json({ error: "Anime not found." });

      const updated = await prisma.anime.update({
        where: { id: animeId },
        data: updatedData,
        include: { genres: true },
      });

      return res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  });


export { router as animeRoute };
