import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { getAnimeByNameSchema, getAnimeSchema } from "../../schemas/common/anime.mjs";
const prisma = new PrismaClient();
const PAGE_SIZE = 10;

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
    console.log(req.query);
    const validation = getAnimeSchema.safeParse(req.query);
    if (validation.success) {
      req.validated = validation.data;
      console.log(validation);
      return next();
    }
    return res.status(400).send("Bad request");
  }, async (req, res) => {
    try {
      let { p, q } = req.validated;

      const findCount = await prisma.anime.count({
        where: {
          title: {
            startsWith: q,
            mode: "insensitive",
          }
        },
      });

      let maxPage = Math.ceil(findCount / PAGE_SIZE);
      if (maxPage === 0) maxPage = 1;
      if (p > maxPage) p = maxPage;

      const findAllAnime = await prisma.anime.findMany({
        skip: (p - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        where: {
          title: {
            contains: q,
            mode: "insensitive",
          }
        },
        include: {
          genres: true,
        }
      });

      // this for testing only
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      return res.status(200).send(findAllAnime);
    } catch (error) {
      console.log("anime /all error", error);
      res.status(500).send("caught error in anime /all")
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

router.get("/popular/:p", async (req, res) => {
  try {
    let p = req.params.p;
    console.log(p, "fuck me right");
    p = parseInt(p);
    if (isNaN(p)) p = 1;

    const findCount = await prisma.anime.count();

    let maxPage = Math.ceil(findCount / PAGE_SIZE);
    if (maxPage === 0) maxPage = 1;
    if (p > maxPage) p = maxPage;

    const findAllAnime = await prisma.anime.findMany({
      skip: (p - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: {
        popularity: "desc",
      },
      include: {
        genres: true,
      },
    });

    // Simulate network delay for testing
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    return res.status(200).send({
      data: findAllAnime,
      metadata: {
        page: {
          max: maxPage,
          current: p,
        }
      }
    });
  } catch (error) {
    console.error("anime /popular error", error);
    res.status(500).send("Caught error in anime /popular");
  }
});

router.get("/latest/:p", async (req, res) => {
  try {
    let p = req.params.p;
    p = parseInt(p);
    if (isNaN(p)) p = 1;

    const findCount = await prisma.anime.count();

    let maxPage = Math.ceil(findCount / PAGE_SIZE);
    if (maxPage === 0) maxPage = 1;
    if (p > maxPage) p = maxPage;

    const findAllAnime = await prisma.anime.findMany({
      skip: (p - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        genres: true,
      },
    });

    // Simulate network delay for testing
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(findAllAnime, "fuck me right");
    return res.status(200).send({
      data: findAllAnime,
      metadata: {
        page: {
          current: p,
          max: maxPage
        }
      }
    });
  } catch (error) {
    console.error("anime /popular error", error);
    res.status(500).send("Caught error in anime /popular");
  }
});

export { router as commonAnime };
