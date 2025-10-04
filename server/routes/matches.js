const express = require('express');
const router = express.Router();

// @route   GET /api/matches/test
// @desc    Test matches route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ message: 'Matches route working!' });
});

module.exports = router;
