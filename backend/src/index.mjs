import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

import express from "express";
import cookieParser from "cookie-parser";
import { router } from "./routes.mjs";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(router);

app.get("/", (req, res) => {
  res.send("OK");
})

app.listen(process.env.PORT, () => {
  console.log("Server is up and running :thumbs up:");
})
