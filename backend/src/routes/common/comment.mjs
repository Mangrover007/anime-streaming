import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { getCommentSchema } from "../../schemas/common/comment.mjs";
const prisma = new PrismaClient();
import { v2 as cloudinary } from "cloudinary";

// TODO: Error Handling

const router = Router();

router.get("/",
  function (req, res, next) {
    const episodeId = req.query.id;
    const validation = getCommentSchema.safeParse({ episodeId });
    if (validation.success) {
      req.validated = validation.data;
      return next();
    }
    return res.status(400).send("bad request");
  }, async (req, res) => {
    try {
      const episodeId = req.validated.episodeId;

      const allComments = await prisma.episode.findUnique({
        where: {
          id: episodeId
        },
        include: {
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  profilePicture: true
                }
              }
            }
          },
        }
      });

      if (!allComments) return res.status(404).send(`No episode found with id - ${episodeId}`);

      return res.json({
        data: allComments.comments.map(comment => ({
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          user: {
            id: comment.user.id,
            username: comment.user.username,
            profilePicture: cloudinary.url(comment.user.profilePicture)
          }
        })),
        metadata: ""
      });

    } catch (error) {
      console.error("caught error in /comment GET", error);
      return res.status(500).send({
        code: 500,
        message: ""
      });
    }
  });

export { router as commonComment };
