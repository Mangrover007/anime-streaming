import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { protectedCommentDeleteSchema, protectedCommentPatchSchema, protectedCommentPostSchema } from "../../schemas/protected/comment.mjs";

const prisma = new PrismaClient();

// TODO: Error Handling

const router = Router();

router.post("/",
  function (req, res, next) {
    const episodeId = req.query.ep;
    const {
      content
    } = req.body;
    const validation = protectedCommentPostSchema.safeParse({ episodeId, content });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async function (req, res) {
    try {
      const { episodeId, content } = req.validated;

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

      return res.json({
        data: {
          id: createComment.id,
          content: createComment.content,
          createdAt: createComment.createdAt,
          user: {
            id: createComment.user.id,
            username: createComment.user.username,
            profilePicture: createComment.user.profilePicture
          }
        },
        metadata: ""
      });
    } catch (error) {
      console.log("caught error in /comment POST", error);
      return res.status(500).send("caught error in /comment POST");
    }
  });

router.patch("/",
  function (req, res, next) {
    const commentId = req.query.id;
    const userId = req.user.id;
    const { content } = req.body;
    const validation = protectedCommentPatchSchema.safeParse({ commentId, userId, content });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async function (req, res) {
    try {
      const { commentId, userId, content } = req.validated;

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

router.delete("/",
  function (req, res, next) {
    const commentId = req.query.id;
    const userId = req.user.id;
    const validation = protectedCommentDeleteSchema.safeParse({ commentId, userId });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("Bad request");
  }, async function (req, res) {
    try {
      const { commentId, userId } = req.validated;

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

export { router as userCommentRoute };
