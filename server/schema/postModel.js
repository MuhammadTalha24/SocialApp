import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [3, 'Description must be at least 3 characters long'],
    },
    image: {
        type: String,
        default: ''
    },
    likes: {
        type: [String],
        default: []
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment',
        default: []
    },
    shares: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

export const Post = mongoose.model('Posts', postSchema);
