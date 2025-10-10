import { Router } from "express";
import { prisma } from "../index.mjs";

const router = Router();

router.post("/anime", async (req, res) => {
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
    const createAnime = await prisma.anime.create({
      data:{ 
        author: author,
        description: description,
        startedAiring: startedAiring,
        status: "HIATUS",
        thumbnailUrl: thumbnailUrl,
        title: title,
      }
    })
    console.log(createAnime);
    res.send(createAnime);
  } catch (e) {
    console.log("e", e);
    res.sendStatus(500);
  }
});

export { router as animeRoute };
