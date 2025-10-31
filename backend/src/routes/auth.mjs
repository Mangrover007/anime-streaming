import { Router } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { validatePayload } from "../middlewares/validate.mjs";
import { loginSchema, registerSchema } from "../schemas/auth.mjs";
import { PrismaClient } from "@prisma/client";
import { userRole } from "../utils/userRole.mjs";

import { verifyToken } from "../middlewares/verifyToken.mjs";

import { transporter } from "../index.mjs";

const prisma = new PrismaClient();

const router = Router();


router.post("/login", validatePayload(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  const findUser = await prisma.user.findUnique({
    where: { email }
  });

  if (!findUser) {
    return res.status(404).send("Email not found.");
  }

  if (!findUser.verified) {
    return res.status(401).send("Email not verified. Please verify email before logging in.");
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

  const temp = await userRole(findUser.username);
  if (temp === "ADMIN") {
    console.log("ADMIN log in", findUser.username);
  }
  else {
    console.log("USER log in", findUser.username);
  }

  res.send(findUser);
});


router.post("/register", validatePayload(registerSchema), async (req, res) => {
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

  const verifyEmailToken = await prisma.verifyEmail.create({
    data: {
      expiresAt: new Date(Date.now() + 1000*60*60),
      token: crypto.randomUUID(),
      user: {
        connect: {
          id: newUser.id
        }
      }
    }
  });

  const verificationLink = `http://localhost:5000/auth/verify-registration?token=${verifyEmailToken.token}`;
  transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: newUser.email,
    subject: "VERIFY EMAIL BITCH",
    text: `Yo verify token bitch: ${verificationLink}`
  })

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

  res.status(201).send(newUser);
});


router.get("/who", async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(400).send("no token");
  const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
  if (!tokenPayload) return res.status(401).send("youre nobody");
  const findUser = await prisma.user.findUnique({
    where: {
      id: tokenPayload.id
    },
    include: {
      favoriteAnimes: true
    }
  });
  if (!findUser) return res.status(404).send("you do not exist");
  return res.send(findUser);
});


router.get("/logout", verifyToken, async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  res.status(200).send({ message: "Logged out successfully" });
});


router.get("/verify-registration", async (req, res) => {
  const { token } = req.query;
  console.log(token);
  const findToken = await prisma.verifyEmail.findUnique({
    where: {
      token: token
    }
  });
  console.log(findToken);
  if (!findToken) res.status(401).send("Token not found.");
  if (new Date(Date.now()) > findToken.expiresAt) res.status(401).send("Token expired");
  const updatedUser = await prisma.user.update({
    where: {
      id: findToken.userId
    },
    data: {
      verified: true
    }
  });
  const fuckyou = await prisma.verifyEmail.delete({
    where: {
      token: token
    }
  });
  console.log(fuckyou);
  return res.status(200).send(updatedUser);;
});


export { router as authRoute };
