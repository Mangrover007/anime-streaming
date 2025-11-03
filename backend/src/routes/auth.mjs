import { Router } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { validatePayload } from "../middlewares/validate.mjs";
import { loginSchema, registerSchema } from "../schemas/auth.mjs";
import { PrismaClient } from "@prisma/client";

import { verifyToken } from "../middlewares/verifyToken.mjs";

import { transporter } from "../index.mjs";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

const router = Router();


router.post("/login", validatePayload(loginSchema), async (req, res) => {
  try {
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

    // const temp = await userRole(findUser.username);
    // if (temp === "ADMIN") {
    //   console.log("ADMIN log in", findUser.username);
    // }
    // else {
    //   console.log("USER log in", findUser.username);
    // }

    res.send(findUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong please try again.");
  }
});


router.post("/register", validatePayload(registerSchema), async (req, res) => {
  try {
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
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
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
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong please try again.");
  }
});


router.get("/who", verifyToken, async (req, res) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        id: parseInt(req.user.id),
      },
      include: {
        favoriteAnimes: true
      }
    });
    if (!findUser) return res.status(404).send("User not found.");
    return res.send({
      ...findUser,
      profilePicture: findUser.profilePicture ? cloudinary.url(findUser.profilePicture) : null
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong.");
  }
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
  try {
    const { token } = req.query;
    const findToken = await prisma.verifyEmail.findUnique({
      where: {
        token: token
      }
    });
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
    await prisma.verifyEmail.delete({
      where: {
        token: token
      }
    });
    return res.status(200).send({
      ...updatedUser,
      profilePicture: updatedUser.profilePicture ? cloudinary.url(updatedUser.profilePicture) : null
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});


export { router as authRoute };
