import mongoose from "mongoose";


const replySchema = new mongoose.Schema({
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    reply: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timeseries: true })


export const Reply = mongoose.model('Reply', replySchema);