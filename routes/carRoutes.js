const express = require('express');
const { body, validationResult } = require('express-validator');
const Car = require('../models/car');
const Manufacturer = require('../models/manufacturer');
const { ensureAuth } = require('../middleware/auth');

const router = express.Router();

// GET all (populated)
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().populate('manufacturer', 'name country');
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving cars', error: err.message });
  }
});

// GET by id
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('manufacturer', 'name country');
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.status(200).json(car);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving car', error: err.message });
  }
});

// POST (protected)
router.post('/',
  ensureAuth,
  body('model').notEmpty().withMessage('model required'),
  body('year').isInt({ min: 1886 }).withMessage('valid year required'),
  body('price').isFloat({ min: 0 }).withMessage('price required'),
  body('type').notEmpty().withMessage('type required'),
  body('manufacturer').notEmpty().withMessage('manufacturer id required'),
  body('fuel').notEmpty().withMessage('fuel required'),
  body('horsepower').isInt({ min: 1 }).withMessage('horsepower required'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { manufacturer } = req.body;
      const m = await Manufacturer.findById(manufacturer);
      if (!m) return res.status(400).json({ message: 'manufacturer id does not exist' });

      const saved = await Car.create(req.body);
      res.status(201).json({ message: 'Car created', carId: saved._id });
    } catch (err) {
      res.status(err.name === 'ValidationError' ? 400 : 500).json({ message: 'Error creating car', error: err.message });
    }
  }
);

// PUT (protected)
router.put('/:id',
  ensureAuth,
  body('model').optional().notEmpty(),
  body('year').optional().isInt({ min: 1886 }),
  body('price').optional().isFloat({ min: 0 }),
  body('manufacturer').optional().notEmpty(),
  body('fuel').optional().notEmpty(),
  body('horsepower').optional().isInt({ min: 1 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      if (req.body.manufacturer) {
        const m = await Manufacturer.findById(req.body.manufacturer);
        if (!m) return res.status(400).json({ message: 'manufacturer id does not exist' });
      }

      const updated = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ message: 'Car not found' });

      res.status(200).json({ message: 'Car updated' });
    } catch (err) {
      res.status(err.name === 'ValidationError' ? 400 : 500).json({ message: 'Error updating car', error: err.message });
    }
  }
);

// DELETE (protected)
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const removed = await Car.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Car not found' });
    res.status(200).json({ message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting car', error: err.message });
  }
});

module.exports = router;
