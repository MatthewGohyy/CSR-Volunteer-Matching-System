const express = require('express');
const router = express.Router();

// @route   GET /api/organizations/test
// @desc    Test organizations route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ message: 'Organizations route working!' });
});

module.exports = router;
