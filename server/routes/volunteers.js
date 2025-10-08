const express = require('express');
const router = express.Router();

// @route   GET /api/volunteers/test
// @desc    Test volunteers route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ message: 'Volunteers route working!' });
});

module.exports = router;
