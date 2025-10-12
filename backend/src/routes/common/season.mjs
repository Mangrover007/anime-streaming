import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = Router();

router.get("/:animeId", async (req, res) => {
  try {
    const animeId = parseInt(req.params.animeId);
    if (isNaN(animeId)) res.status(400).send("Invalid anime id");
    const findSeasons = await prisma.season.findMany({
      where: {
        animeId: animeId
      }
    })
    res.status(200).json(findSeasons);
  } catch (error) {
    console.log("caught error in /seasons/:animeId", error);
    res.status(500).send("caught error in /seasons/:animeId");
  }
});

export { router as commonSeason };
