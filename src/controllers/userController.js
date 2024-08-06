const userServices = require('../services/userService')
const validationHelper = require('../helpers/validation')
const app_constants = require('../constants/app.json')


exports.userSignUp = async (req, res) => {
    // validation checks
    try {
        const required_fields = ['username', 'email', 'password']

        const validation = validationHelper.validation(required_fields, req.body)

        if (Object.keys(validation).length) {
            return res.json({ success: 0, status: app_constants.BAD_REQUEST, message: validation, result: {} })
        }

        const add_user = await userServices.userSignUp(req.body)
        return res.json(add_user)
    }
    catch (ex) {
        console.log(ex);
    }
}


exports.userLogIn = async (req, res) => {
    // validation checks
    try {
        const required_fields = ['email', 'password']

        const validation = validationHelper.validation(required_fields, req.body)

        if (Object.keys(validation).length) {
            return res.json({ success: 0, status: app_constants.BAD_REQUEST, message: validation, result: {} })
        }

        const add_user = await userServices.userLogIn(req.body)
        return res.json(add_user)
    }
    catch (ex) {
        console.log(ex);
    }
}