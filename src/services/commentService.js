const Post = require('../models/postModel');
const app_constants = require('../constants/app.json')
const { Types } = require('mongoose');
const Comment = require('../models/commentModel');


exports.addComment = async (data, user_data) => {
    const { _id } = user_data;
    const { post_id, text } = data
    const parent_id = data.parent_id ? data.parent_id : null

    const post_data = await Post.findOne({ _id: post_id })
    if (!post_data) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'Post does not exists!', result: {} };
    }

    if (parent_id) {
        const cmnt_parent_data = await Comment.findOne({ _id: parent_id })
        if (!cmnt_parent_data) {
            return { success: 0, status: app_constants.BAD_REQUEST, message: 'Parent comment does not exists!', result: {} };
        }
    }

    const add_comment = await Comment.create({
        text,
        user_id: _id,
        post_id,
        parent_id
    })

    if (add_comment) {
        return { success: 1, status: app_constants.SUCCESS, message: 'Comment added successfully!', result: add_comment };
    }

    return { success: 0, status: app_constants.INTERNAL_SERVER_ERROR, message: 'Internal server error!', result: {} }
}


exports.commentList = async (data) => {
    const { post_id } = data

    const post_data = await Post.findOne({ _id: post_id })
    if (!post_data) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'Post does not exists!', result: {} };
    }

    let result = []
    // const top_level_comments = await Comment.find({ post_id, parent_id: null })

    // result = await Promise.all(top_level_comments.map(async (elem) => {
    //     return {
    //         ...elem['_doc'],
    //         replies: await getReplies(elem)
    //     }
    // })
    // )

    const all_comments = await Comment.find({ post_id })
    result = nestedComments(all_comments, null)

    if (result) {
        return { success: 1, status: app_constants.SUCCESS, message: 'Comment list fetched successfully!', result };
    }

    return { success: 0, status: app_constants.INTERNAL_SERVER_ERROR, message: 'Internal server error!', result: {} }
}


async function getReplies(parent) {
    const parent_id = parent._id
    const replies = await Comment.find({ parent_id })

    const resilt = await Promise.all(replies.map(async (element) => {
        return {
            ...element['_doc'],
            replies: await getReplies(element)
        }
    }))

    return resilt;
}


function nestedComments(comments, parent_id) {
    console.log(parent_id);

    const top_level = comments.filter((e) => String(e.parent_id) == String(parent_id))
    console.log(top_level);

}