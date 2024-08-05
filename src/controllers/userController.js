const userServices = require('../services/userService')


exports.userSignUp = async (req, res) => {
   //
    const add_user = await userServices.userSignUp(req.body)
    return res.json(add_user)
}

