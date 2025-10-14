import dotenv from "dotenv";
dotenv.config();

import path from "path";
const __dirname = "/home/mangrover/Desktop/web/anime/backend"

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import express from "express";
import cookieParser from "cookie-parser";
import { routes } from "./routes.mjs";
import { uploadVideo } from "./cloudinary.mjs";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(routes);

app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/upload", async (req,res) => {
  try {
    const result = await uploadVideo(path.join(__dirname, "public", "videos", "video.mp4"));
    console.log(result);
    res.send("OK\n");
  } catch (err) {
    console.log(err);
    res.status(500).send("NOT OK\n");
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is up and running :thumbs up:");
});
