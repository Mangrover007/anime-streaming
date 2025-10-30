import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { seasonCreateSchema, seasonDeleteSchema, seasonPatchSchema } from "../../schemas/admin/season.mjs";


const prisma = new PrismaClient();
const router = Router();


// CREATE
router.post("/:animeName",
  function (req, res, next) {
    const animeName = req.params.animeName;
    const validation = seasonCreateSchema.safeParse({ animeName, ...req.body });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    console.log(validation.error);
    console.log(req.body);
    return res.status(400).send("Bad request");
  }, async (req, res) => {

    const { animeName, ...rest } = req.validated;

    try {
      const anime = await prisma.anime.findUnique({
        where: {
          title: animeName
        },
        include: {
          seasons: true
        }
      });

      if (!anime) {
        return res.status(404).json({ error: `No anime found with name: ${animeName}` });
      }

      const season = await prisma.season.create({
        data: {
          animeId: anime.id,
          seasonNumber: anime.seasons.length + 1,
          ...rest
        }
      });

      return res.status(201).json(season);
    } catch (error) {
      console.error("Error creating season:", error);
      return res.status(500).json({ error: error.message });
    }
  });


// DELETE
router.delete("/:id",
  function (req, res, next) {
    const seasonId = req.params.id;
    const validation = seasonDeleteSchema.safeParse({ seasonId });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async (req, res) => {
    const seasonId = req.validated.seasonId;

    try {
      const deleted = await prisma.season.delete({
        where: { id: seasonId },
      });

      return res.status(200).json({ message: "Season deleted successfully.", deleted: deleted });
    } catch (error) {
      console.error("Error deleting season:", error);
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Season not found." });
      }
      return res.status(500).json({ error: error.message });
    }
  });


router.patch("/:id",
  function (req, res, next) {
    const seasonId = req.params.id;
    const validation = seasonPatchSchema.safeParse({ seasonId, ...req.body });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async (req, res) => {

    const { seasonId, ...rest } = req.validated;

    try {
      const updateData = rest;

      const updatedSeason = await prisma.season.update({
        where: { id: seasonId },
        data: updateData,
      });

      return res.status(200).json(updatedSeason);
    } catch (error) {
      console.error("Error updating season:", error);
      return res.status(500).json({ error: error.message });
    }
  });


export { router as seasonRoute };
