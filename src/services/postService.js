const cloudinary = require('../helpers/cloudinary');
const Post = require('../models/postModel');
const app_constants = require('../constants/app.json')


exports.uploadPost = async (data, user_data) => {
    const { _id } = user_data;
    const { file } = data
    const caption = data.caption ? data.caption : ''

    const file_url = await cloudinary.uploader.upload(file.path)
    console.log(file_url);

    const upload_post = await Post.create({
        file_url: file_url.url, caption, user_id: _id
    })

    if (upload_post) {
        return { success: 1, status: app_constants.SUCCESS, message: 'Post uploaded successfully!', result: upload_post };
    }

    return { success: 0, status: app_constants.INTERNAL_SERVER_ERROR, message: 'Internal server error!', result: {} }
}