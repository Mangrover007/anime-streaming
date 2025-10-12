import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// TODO: Error Handling
// TODO: Payload Validation

const router = Router();

router.post("/", async (req, res) => {
  try {
    const episodeId = parseInt(req.query.ep);
    if (isNaN(episodeId)) return res.status(400).send("Inavlid episode id");

    const {
      content
    } = req.body;
    
    const createComment = await prisma.comment.create({
      data: {
        content: content,
        episodeId: episodeId,
        userId: req.user.id,
      },
      include: {
        episode: true,
        user: true,
      }
    });

    return res.json(createComment);
  } catch (error) {
    console.log("caught error in /comment POST", error);
    return res.status(500).send("caught error in /comment POST");
  }
});

router.patch("/", async (req, res) => {
  try {
    const commentId = parseInt(req.query.id);
    const userId = parseInt(req.user.id);
    const { content } = req.body;

    if (isNaN(commentId)) return res.status(400).send("Invalid comment id");
    if (isNaN(userId)) return res.status(400).send("Invalid user id");
    if (!content || content.length===0) return res.status(400).send("content is required and not empty");

    const updateComment = await prisma.comment.update({
      where: {
        id: commentId,
        userId: userId
      },
      data: {
        content: content,
      }
    });

    return res.json(updateComment);
  } catch (error) {
    console.log("error in /comment PATCH", error);
    return res.status(500).send("error in /comment PATCH - either internal server error, or not authorized, or comment with given id not found");
  }
});

router.delete("/", async (req, res) => {
  try {
    const commentId = parseInt(req.query.id);
    const userId = parseInt(req.user.id);

    if (isNaN(commentId)) return res.status(400).send("Invalid comment id");
    if (isNaN(userId)) return res.status(400).send("Invalid user id");

    const deleteComment = await prisma.comment.delete({
      where: {
        id: commentId,
        userId: userId
      }
    });

    return res.json(deleteComment);
  } catch (error) {
    console.log("error in /comment DELETE", error);
    return res.status(500).send("cannot delete comment");
  }
});

export { router as userRoute };
