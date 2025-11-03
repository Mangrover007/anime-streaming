import { userRole } from "../utils/userRole.mjs";

export async function isAdmin(req, res, next) {
    try {
        const role = await userRole(req.user.username);
        if (role === "ADMIN") next();
        else return res.status(401).send("not an admin");
    } catch (e) {
        console.error("isAdmin error:", e);
        res.sendStatus(500);
    }
}
