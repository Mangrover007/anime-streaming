import { userRole } from "../utils/userRole.mjs";

export async function isAdmin(req, res, next) {
    try {
        const role = await userRole(req.user.username);
        if (role === "ADMIN") next();
        else return res.status(401).send("not and admin");
    } catch (e) {
        console.log("isAdmin error:", e);
        res.sendStatus(500);
    }
}
