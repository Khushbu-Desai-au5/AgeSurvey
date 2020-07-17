const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController')



router.get("/", userController.homepage)
router.get("/calculate", userController.calculate)

module.exports = router