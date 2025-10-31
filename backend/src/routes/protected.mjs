import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.mjs";
import { userCommentRoute } from "./protected/comment.mjs";
import { userAnimeRoute } from "./protected/anime.mjs";
import { transporter } from "../index.mjs";

const router = Router();

router.use(verifyToken);
router.use("/anime", userAnimeRoute);
router.use("/comment", userCommentRoute);

router.post("/email", async function (req, res) {
  try {
    const { senderEmail, subject, content } = req.body;
    const mail = await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL,
      replyTo: senderEmail,
      subject: subject,
      text: content
    });
    if (mail.accepted?.length) return res.status(200).send("Mail received");
    return res.status(500).send("Something went wrong try again kiddo.");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error idk");
  }
});

export { router as protectedRoutes };
