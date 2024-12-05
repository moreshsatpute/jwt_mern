const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with hashed password
    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user._id);
    res.status(201).json({ message: 'User registered', token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = generateToken(user._id);
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { register, login };
