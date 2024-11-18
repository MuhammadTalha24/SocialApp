import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1000
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})


export const Comment = mongoose.model('Comment', commentSchema);