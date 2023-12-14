const express = require('express');

const { register, verifyEmail, login, logout } = require('../controllers/auth');

const router = express.Router();

router.route('/register').post(register);
router.route('/verify-email').post(verifyEmail);
router.route('/login').post(login);
router.route('/logout').get(logout);

module.exports = router;
