import { Router } from "express";
import { authRoute } from "./routes/auth.mjs";
import { adminRoute } from "./routes/admin.mjs";
import { verifyToken } from "./middlewares/verifyToken.mjs";

const router = Router();

router.use("/auth", authRoute); // register + login routes

// protected routes
router.use(verifyToken);
router.use("/admin", adminRoute); // at this point, verify token has run and we have req.user
// and because i was signing jwt tokens with username and id both, it means i have req.user.username

export { router };
