const express = require('express');
const router = express.Router();

// @route   GET /api/opportunities/test
// @desc    Test opportunities route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ message: 'Opportunities route working!' });
});

module.exports = router;
