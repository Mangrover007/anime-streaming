import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// CREATE Genre
router.post("/add", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Genre name is required." });

  try {
    const genre = await prisma.genre.create({ data: { name } });
    res.status(201).json(genre);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Genre
router.put("/update/:id", async (req, res) => {
  const genreId = parseInt(req.params.id);
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "Genre name is required." });

  try {
    const updated = await prisma.genre.update({
      where: { id: genreId },
      data: { name },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Genre
router.delete("/delete/:id", async (req, res) => {
  const genreId = parseInt(req.params.id);

  try {
    const deleted = await prisma.genre.delete({ where: { id: genreId } });
    res.json({ message: "Genre deleted", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { router as genreRoute };
