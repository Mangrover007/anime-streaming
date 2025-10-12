import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// TODO: Error Handling
// TODO: Payload Validation

const router = Router();

router.delete("/", async (req, res) => {
  try {
    const commentId = parseInt(req.query.id);

    if (isNaN(commentId)) return res.status(400).send("Invalid comment id");

    const deleteComment = await prisma.comment.delete({
      where: {
        id: commentId,
      }
    });

    return res.json(deleteComment);
  } catch (error) {
    console.log("error in /comment DELETE", error);
    return res.status(500).send("cannot delete comment");
  }
});

export { router as commentRoute };
