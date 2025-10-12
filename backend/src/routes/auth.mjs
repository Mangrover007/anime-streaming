import { Router } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { validatePayload } from "../middlewares/validate.mjs";
import { loginSchema, registerSchema } from "../schemas/validators.mjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

// ✅ LOGIN
router.post("/login", validatePayload(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  const findUser = await prisma.user.findUnique({
    where: { email }
  });

  if (!findUser) {
    return res.status(404).send("Email not found.");
  }

  const isPasswordCorrect = await bcryptjs.compare(password, findUser.password);
  if (!isPasswordCorrect) {
    return res.status(401).send("Incorrect Password");
  }

  const token = jwt.sign(
    { username: findUser.username, id: findUser.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { id: findUser.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: "lax"
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax"
  });

  res.send("Login successful");
});


// ✅ REGISTER
router.post("/register", validatePayload(registerSchema) ,async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return res.status(409).send("Email is already registered.");
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: {
        connect: {
          id: 1
        }
      }
    },
  });

  const token = jwt.sign(
    { username: newUser.username, id: newUser.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { id: newUser.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: "lax"
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "lax"
  });

  res.status(201).send("User registered successfully");
});

export { router as authRoute };
