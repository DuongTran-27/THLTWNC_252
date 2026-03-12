const express = require('express');
const router = express.Router();

// utils
const JwtUtil = require('../utils/JwtUtil');

// daos
const AdminDAO = require('../models/AdminDAO');

// login
router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    try {
      const admin = await AdminDAO.selectByUsernameAndPassword(
        username,
        password
      );

      if (admin) {
        const token = JwtUtil.genToken(username, password);
        res.json({
          success: true,
          message: 'Authentication successful',
          token: token
        });
      } else {
        res.json({
          success: false,
          message: 'Incorrect username or password'
        });
      }
    } catch (err) {
      console.error('Error during admin login:', err);
      res.status(500).json({
        success: false,
        message: 'Server error while accessing database'
      });
    }
  } else {
    res.json({
      success: false,
      message: 'Please input username and password'
    });
  }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token =
    req.headers['x-access-token'] || req.headers['authorization'];

  res.json({
    success: true,
    message: 'Token is valid',
    token: token
  });
});

module.exports = router;
