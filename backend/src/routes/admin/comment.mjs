import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { commentDeleteSchema } from "../../schemas/admin/comment.mjs";
const prisma = new PrismaClient();

// TODO: Error Handling

const router = Router();

router.delete("/",
  function (req, res, next) {
    const commentId = req.query.id;
    const validation = commentDeleteSchema.safeParse({ commentId });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async (req, res) => {
    try {
      const commentId = req.validated.commentId;

      const deleteComment = await prisma.comment.delete({
        where: {
          id: commentId,
        }
      });

      return res.json(deleteComment);
    } catch (error) {
      console.error("error in /comment DELETE", error);
      return res.status(500).send("cannot delete comment");
    }
  });

export { router as commentRoute };
