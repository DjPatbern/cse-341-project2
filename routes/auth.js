const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const router = express.Router();

/**
 * @route POST /auth/register
 * @desc Register local user
 * @body { email, password, displayName }
 */
router.post('/register',
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, password, displayName } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already in use' });

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, passwordHash, displayName });

      res.status(201).json({ message: 'User created', userId: newUser._id });
    } catch (err) {
      res.status(500).json({ message: 'Error registering user', error: err.message });
    }
  }
);

/**
 * @route POST /auth/login
 * @desc Login and receive JWT
 * @body { email, password }
 */
router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });

      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      res.status(500).json({ message: 'Error logging in', error: err.message });
    }
  }
);

/**
 * @route POST /auth/logout
 * @desc For JWT, instruct client to discard token
 */
router.post('/logout', (req, res) => {
  // Client should delete the token. We cannot truly invalidate JWT without token store.
  res.status(200).json({ message: 'Logout OK. Client should delete token.' });
});

/**
 * @route GET /auth/me
 * @desc Return current user info if Authorization Bearer token is provided
 */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Not authenticated' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'Not authenticated' });

    res.status(200).json({ id: user._id, email: user.email, displayName: user.displayName });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
});

module.exports = router;
