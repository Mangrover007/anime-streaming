import dotenv from "dotenv";
dotenv.config();

import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import express, { response } from "express";
import cookieParser from "cookie-parser";
import { routes } from "./routes.mjs";
// import { uploadVideo } from "./cloudinary.mjs";

import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS
  }
});

import multer, { memoryStorage } from "multer";
import { uploadAvatar } from "./cloudinary.mjs";
import { verifyToken } from "./middlewares/verifyToken.mjs";
export const upload = multer({
  storage: memoryStorage()
});

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(routes);

app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/upload-avatar", verifyToken, upload.single("avatar"), async (req, res) => {
  try {
    const result = await uploadAvatar(req.file.buffer, req.user.id);
    await prisma.user.update({
      where: {
        username: req.user.username
      },
      data: {
        profilePicture: result.public_id
      }
    });
    return res.send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send("NOT OK\n");
  }
});

// app.post("/upload-episode", isAdmin, )

app.listen(process.env.PORT, () => {
  console.log("Server is up and running :thumbs up:");
});
