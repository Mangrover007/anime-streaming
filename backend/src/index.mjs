import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import express from "express";
import cookieParser from "cookie-parser";
import { routes } from "./routes.mjs";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(routes);

app.get("/", (req, res) => {
  res.send("OK");
})

app.listen(process.env.PORT, () => {
  console.log("Server is up and running :thumbs up:");
})
