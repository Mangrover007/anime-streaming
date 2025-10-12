import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.mjs";
import { animeRoute } from "./admin/anime.mjs";
import { seasonRoute } from "./admin/season.mjs";
import { episodeRoute } from "./admin/episode.mjs";
import { genreRoute } from "./admin/genre.mjs";
import { verifyToken } from "../middlewares/verifyToken.mjs";
import { commentRoute } from "./admin/comment.mjs";

const router = Router();

router.use(verifyToken);
router.use(isAdmin);
router.use("/anime", animeRoute);
router.use("/season", seasonRoute);
router.use("/episode", episodeRoute);
router.use("/comment", commentRoute);
router.use("/genre", genreRoute);

export { router as adminRoute };
