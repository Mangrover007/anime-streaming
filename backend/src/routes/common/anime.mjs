import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { getAnimeByNameSchema, getAnimeSchema } from "../../schemas/common/anime.mjs";
const prisma = new PrismaClient();
const PAGE_SIZE = 5;

const router = Router();

router.post("/all/genre", async (req, res) => {
  const { genre: inputGenres } = req.body;

  if (!Array.isArray(inputGenres) || inputGenres.length === 0) {
    return res.status(400).json({ error: "Genre array is required in the request body." });
  }

  try {
    const animeList = await prisma.anime.findMany({
      where: {
        genres: {
          some: {
            in: inputGenres,
          },
        },
      },
    });

    return res.json(animeList);
  } catch (error) {
    console.error("Error fetching anime by genre:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/all",
  function (req, res, next) {
    const validation = getAnimeSchema.safeParse(req.query);
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async (req, res) => {
    try {
      const { pageNumber, query } = req.validated;

      const findCount = await prisma.anime.count({
        where: {
          title: {
            startsWith: query,
            mode: "insensitive",
          }
        },
      });

      const maxPage = Math.ceil(findCount / PAGE_SIZE);
      if (maxPage === 0) maxPage = 1;
      if (pageNumber > maxPage) pageNumber = maxPage;

      const findAllAnime = await prisma.anime.findMany({
        skip: (pageNumber - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        where: {
          title: {
            startsWith: query,
            mode: "insensitive",
          }
        },
        include: {
          genres: true,
        }
      });

      // this for testing only
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return res.status(200).send(findAllAnime);
    } catch (error) {
      console.log("anime /all/:pageNumber error", error);
      res.status(500).send("caught error in anime /all/:pageNumber")
    }
  });

router.get("/:name",
  function (req, res, next) {
    const title = req.params.name;
    const validation = getAnimeByNameSchema.safeParse({ title });
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
        },
        include: {
          genres: true,
        }
      });

      if (!findAnime) return res.status(404).send(`No anime found with name - ${title}`);

      return res.status(200).send(findAnime);
    } catch (error) {
      console.log("anime /:name error", error);
      res.status(500).send("caught error in anime /:name");
    }
  });

// router.get("/:id", async (req, res) => {
//   try {
//     const animeId = parseInt(req.params.id);
//     if (isNaN(animeId)) return res.status(400).send("Invalid anime id");
//     const findAnime = await prisma.anime.findUnique({
//       where: {
//         id: animeId
//       }
//     });
//     if (!findAnime) return res.status(404).send(`No anime found with id - ${animeId}`);
//     return res.status(200).send(findAnime);
//   } catch (error) {
//     console.log("anime /:id error", error);
//     res.status(500).send("caught error in anime /:id");
//   }
// });

export { router as commonAnime };
