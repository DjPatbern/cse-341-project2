const express = require("express");
const Manufacturer = require("../models/manufacturer");
const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  try {
    const data = await Manufacturer.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET manufacturer by ID
router.get("/:id", async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findById(req.params.id);
    if (!manufacturer) return res.status(404).json({ message: "Manufacturer not found" });
    res.status(200).json(manufacturer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    if (!req.body.name || !req.body.country) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const newManufacturer = await Manufacturer.create(req.body);
    res.status(201).json(newManufacturer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.name || !req.body.country) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const updated = await Manufacturer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Manufacturer.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
