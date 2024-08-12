const postService = require('../services/postService')
const validationHelper = require('../helpers/validation')
const app_constants = require('../constants/app.json')


exports.uploadPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: 0, status: app_constants.BAD_REQUEST, message: 'Please upload the file!', result: {} })
        }

        req.body.file = req.file
        const upload_post = await postService.uploadPost(req.body, req.user)
        return res.json(upload_post)
    }
    catch (ex) {
        console.log(ex);
    }
}