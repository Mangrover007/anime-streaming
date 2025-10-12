import { Router } from "express";
import { authRoute } from "./routes/auth.mjs";
import { adminRoute } from "./routes/admin.mjs";
import { commonRoute } from "./routes/common.mjs";
import { protectedRoutes } from "./routes/protected.mjs";

const router = Router();

router.use(commonRoute); // common routes like view anime, seasons, episodes, etc
router.use("/auth", authRoute); // register + login routes
router.use("/prot", protectedRoutes); // comment POST, PATCH, DELETE - user
router.use("/admin", adminRoute); // admin

export { router as routes };
