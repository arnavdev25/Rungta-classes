const express = require('express')
const userRoute = express.Router();
const userController = require('../controllers/userController')


userRoute.post('/signup', userController.userSignUp)
userRoute.post('/login', userController.userLogIn)


module.exports = userRoute;