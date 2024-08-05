const User = require("../models/userModel")

exports.userSignUp = async (data) => {
    
    const add_user = await User.create(data)
    return add_user;
}