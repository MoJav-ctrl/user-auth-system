const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/authentication');
const userController = require('../controllers/userController');

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

module.exports = router;

