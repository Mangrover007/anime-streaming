import { Router } from "express";
import { commonAnime } from "./common/anime.mjs";
import { commonEpisode } from "./common/episode.mjs";
import { commonSeason } from "./common/season.mjs";
import { commonComment } from "./common/comment.mjs";

const router = Router();

router.use("/anime", commonAnime);
router.use("/episode", commonEpisode);
router.use("/season", commonSeason);
router.use("/comment", commonComment);

export { router as commonRoute };
