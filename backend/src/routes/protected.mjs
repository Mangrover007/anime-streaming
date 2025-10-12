import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.mjs";
import { userRoute } from "./protected/user.mjs";

const router = Router();

router.use(verifyToken);
router.use(userRoute);;

export { router as protectedRoutes };
