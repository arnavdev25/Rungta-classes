const User = require("../models/userModel")
const bcrypt = require('bcrypt');
const app_constants = require('../constants/app.json')
const jwt = require('jsonwebtoken');
require('dotenv').config()


exports.userSignUp = async (data) => {
    // for unique email check
    const user_data = await User.findOne({ email: data.email })
    if (user_data) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'Email already exists!', result: {} };
    }

    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(data.password, salt)

    const add_user = await User.create({ ...data, password: hash_password })
    return { success: 1, status: app_constants.SUCCESS, message: 'User added successfully!', result: add_user };
}


exports.userLogIn = async (data) => {
    const { email, password } = data
    const user_data = await User.findOne({ email })

    if (!user_data) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'Email does not exist!', result: {} }
    }

    const password_check = await bcrypt.compare(password, user_data.password)

    if (!password_check) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'Invalid Credentials!', result: {} }
    }

    const token = await jwt.sign({ id: user_data._id }, process.env.JST_SECRET_KEY)

    return { success: 1, status: app_constants.SUCCESS, message: 'User logged in successfully!', result: { token } };
}


exports.userProfile = async (data) => {
    const { id } = data
    const user_data = await User.findById(id)

    if (!user_data) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'User does not exist!', result: {} }
    }

    return { success: 1, status: app_constants.SUCCESS, message: 'User logged in successfully!', result: user_data };
}