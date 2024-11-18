import mongoose, { mongo, Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'], // Field is required
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name must be less than 50 characters']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true, // Ensures username is unique in the collection
        minlength: [5, 'Username must be at least 3 characters long'],
        maxlength: [20, 'Username must be less than 20 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // Ensures email is unique in the collection
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'] // Regular expression for email format
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    profile_image: {
        type: String,
        default: '',
    },
    cover_image: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    friends: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []

    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Post',
        default: []
    }
}, { timestamps: true });



export const User = mongoose.model('User', userSchema);


