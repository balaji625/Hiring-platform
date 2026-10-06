const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, verifyHrCode } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/verify-hr-code', verifyHrCode);
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
