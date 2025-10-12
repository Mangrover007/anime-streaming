import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// TODO: Error Handling
// TODO: Payload Validation

const router = Router();

router.get("/", async (req, res) => {
  try {
    const episodeId = parseInt(req.query.id);
    if (isNaN(episodeId)) return res.status(400).send("Invalid episode id");

    const allComments = await prisma.episode.findUnique({
      where: {
        id: episodeId
      },
      include: {
        comments: true
      }
    });

    if (!allComments) return res.status(404).send(`No episode found with id - ${episodeId}`);

    return res.json({
      data: allComments.comments,
      metadata: ""
    });
  } catch (error) {
    console.log("caught error in /comment GET", error);
    return res.status(500).send({
      code: 500,
      message: ""
    });
  }
});

export { router as commonComment };
