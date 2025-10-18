import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.mjs";
import { userCommentRoute } from "./protected/comment.mjs";
import { userAnimeRoute } from "./protected/anime.mjs";

const router = Router();

router.use(verifyToken);
router.use("/anime", userAnimeRoute);
router.use("/comment", userCommentRoute);

export { router as protectedRoutes };
