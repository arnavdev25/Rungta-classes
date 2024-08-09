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

    const token = await jwt.sign({ id: user_data._id }, process.env.JWT_SECRET_KEY)

    return { success: 1, status: app_constants.SUCCESS, message: 'User logged in successfully!', result: { token } };
}


exports.userProfile = async (data) => {
    const { id } = data
    const user_data = await User.findOne({ _id: id }, { _id: 0, __v: 0, password: 0 })

    const result = {}
    const followers_count = user_data.followers.length
    const following_count = user_data.followings.length
    result.user_data = user_data;

    result.followers_count = followers_count
    result.following_count = following_count

    if (!user_data) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'User does not exist!', result: {} }
    }

    return { success: 1, status: app_constants.SUCCESS, message: 'User profile fetched successfully!', result: result };
}


exports.followUser = async (data, auth_user_data) => {
    const auth_user_id = auth_user_data._id
    const existing_followings = auth_user_data.followings
    const follow_user_id = data.id;

    if (auth_user_id == follow_user_id) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'Can not follow yourself!', result: {} }
    }

    const user_data = await User.findOne({ _id: follow_user_id })
    if (!user_data) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'User does not exist!', result: {} }
    }

    const follow_check = existing_followings.includes(follow_user_id)
    if (follow_check) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'User is already followed!', result: {} }
    }

    existing_followings.push(follow_user_id)
    user_data.followers.push(auth_user_id)

    const [update_follow_user, update_auth_user] = await Promise.all([
        User.updateOne(
            { _id: follow_user_id },
            { $set: { followers: user_data.followers } }
        ),
        User.updateOne(
            { _id: auth_user_id },
            { $set: { followings: existing_followings } }
        )
    ])

    if (update_follow_user && update_auth_user) {
        return { success: 1, status: app_constants.SUCCESS, message: 'User followed successfully!', result: {} };
    }

    return { success: 0, status: app_constants.INTERNAL_SERVER_ERROR, message: 'Internal server error!', result: {} }
}


exports.getFollowersList = async (user_data, data) => {
    const { _id } = user_data;

    const limit = data.limit ? data.limit : 10000;
    const offset = data.offset ? data.offset : 0;
    const search = data.search ? data.search : ''
    let search_query = {}

    const pipeline = [
        { $match: { _id: _id } },
        {
            $lookup: {
                from: 'users',
                localField: "followers",
                foreignField: "_id",
                as: "followers_details"
            }
        },
        { $unwind: "$followers_details" },
        { $match: search_query }
    ]

    if (search) {
        const regex = new RegExp(search, 'i')

        search_query = { "followers_details.username": regex }
    }

    const [result, total_count] = await Promise.all([
        User.aggregate([
            ...pipeline,
            {
                $project: {
                    _id: 0,
                    email: "$followers_details.email",
                    username: "$followers_details.username"
                }
            },
            { $skip: +offset },
            { $limit: Number(limit) },
        ]),
        User.aggregate([
            ...pipeline,
            { $count: "total_count" }
        ])
    ])

    if (result) {
        return { success: 1, status: app_constants.SUCCESS, message: 'Followers list fetched successfully!', total_count: total_count.length ? total_count[0].total_count : 0, result };
    }

    return { success: 0, status: app_constants.INTERNAL_SERVER_ERROR, message: 'Internal server error!', result: {} }
}


exports.getFollowingsList = async (user_data, data) => {
    const { followings } = user_data;

    const limit = data.limit ? data.limit : 10000;
    const offset = data.offset ? data.offset : 0;
    const search = data.search ? data.search : ''
    const query = { _id: { $in: followings } }

    const total_count = user_data.followings.length

    if (search) {
        const regex = new RegExp(search, 'i')
        query.username = regex
    }

    // const result = await User.findById(_id).select({ _id: 0, followings: 1 }).populate('followings')

    const result = await User.find(query).select({ username: 1, email: 1, _id: 0 }).skip(offset).limit(limit)

    if (result) {
        return { success: 1, status: app_constants.SUCCESS, message: 'Following list fetched successfully!', total_count, result };
    }

    return { success: 0, status: app_constants.INTERNAL_SERVER_ERROR, message: 'Internal server error!', result: {} }
}