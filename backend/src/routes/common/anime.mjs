import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const PAGE_SIZE = 5;

const router = Router();

router.get("/all", async (req, res) => {
  try {
    let pageNumber = parseInt(req.query.p);
    let query = req.query.q;
    if (!query) query="";
    if (isNaN(pageNumber) || pageNumber < 1) pageNumber=1;

    const findCount = await prisma.anime.count({
      where: {
        title: {
          startsWith: query,
          mode: "insensitive",
        }
      }
    });
    let maxPage = Math.ceil(findCount/PAGE_SIZE);
    if (maxPage === 0) maxPage=1;
    if (pageNumber > maxPage) pageNumber=maxPage;
    
    const findAllAnime = await prisma.anime.findMany({
      skip: (pageNumber-1)*PAGE_SIZE,
      take: PAGE_SIZE,
      where: {
        title: {
          startsWith: query,
          mode: "insensitive",
        }
      }
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return res.status(200).send(findAllAnime);
  } catch (error) {
    console.log("anime /all/:pageNumber error", error);
    res.status(500).send("caught error in anime /all/:pageNumber")
  }
})

router.get("/:name", async (req, res) => {
  try {
    const title = req.params.name;
    if (!title) return res.status(400).send("Invalid anime name");
    const findAnime = await prisma.anime.findUnique({
      where: {
        title: title
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
