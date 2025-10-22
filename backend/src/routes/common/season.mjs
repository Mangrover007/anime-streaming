import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { getSeasonSchema } from "../../schemas/common/season.mjs";
const prisma = new PrismaClient();

const router = Router();

router.get("/:title",
  function (req, re, next) {
    const title = req.params.title;
    const validation = getSeasonSchema.safeParse({ title });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async (req, res) => {
    try {
      const title = req.validated.title;

      const findAnime = await prisma.anime.findUnique({
        where: {
          title: title
        }
      });

      if (!findAnime) return res.status(404).send("That anime do NOT exist bro");

      const findSeasons = await prisma.season.findMany({
        where: {
          animeId: findAnime.id
        },
        orderBy: {
          seasonNumber: 'asc',  // or 'desc' if you want descending order
        }
      });

      console.log(findSeasons);
      res.status(200).json(findSeasons);
    } catch (error) {
      console.log("caught error in /seasons/:title", error);
      res.status(500).send("caught error in /seasons/:title");
    }
  });

// router.get("/:animeId", async (req, res) => {
//   try {
//     const animeId = 4+(req.params.animeId);
//     if (isNaN(animeId)) res.status(400).send("Invalid anime id");
//     const findSeasons = await prisma.season.findMany({
//       where: {
//         animeId: animeId
//       }
//     })
//     res.status(200).json(findSeasons);
//   } catch (error) {
//     console.log("caught error in /seasons/:animeId", error);
//     res.status(500).send("caught error in /seasons/:animeId");
//   }
// });

export { router as commonSeason };
