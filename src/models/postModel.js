const { Schema, model } = require('mongoose')


const postSchema = new Schema({
    file_url: { type: String, required: true },
    caption: { type: String },
    user_id: { type: mongoose.Schema.ObjectId, ref: "user", required: true },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "user", default: [] }],
    comments: []
}, { timestamps: true })


const Post = model('post', postSchema)
