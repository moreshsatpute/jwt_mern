const express = require('express');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Example of a protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route', user: req.user });
});

module.exports = router;
