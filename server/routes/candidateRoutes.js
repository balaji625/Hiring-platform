const express = require('express');
const router = express.Router();
const { getCandidateDashboard } = require('../controllers/candidateController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getCandidateDashboard);

module.exports = router;
