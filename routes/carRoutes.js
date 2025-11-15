const express = require("express");
const Car = require("../models/car");
const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  try {
    const data = await Car.find().populate("manufacturer");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET car by ID
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.status(200).json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const { model, year, manufacturer } = req.body;
    if (!model || !year || !manufacturer) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const newCar = await Car.create(req.body);
    res.status(201).json(newCar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT
router.put("/:id", async (req, res) => {
  try {
    const { model, year, manufacturer } = req.body;
    if (!model || !year || !manufacturer) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const updated = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
