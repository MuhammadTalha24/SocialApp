import { User } from "../schema/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';




export const userRegister = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({
                status: false,
                message: 'Password must be at least 6 characters long',
            });
        }

        const alreadyRegisterUser = await User.findOne({ email });
        if (alreadyRegisterUser) {
            return res.status(400).json({ status: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({ id: newUser._id, email: newUser.email, username: newUser.username }, process.env.JWT_SECRET, {
            expiresIn: '24h'  // Token expires in 24 hours
        })
        return res.status(200).json({ success: true, message: "Account Register Successfully", newUser, token });
    } catch (error) {
        if (error.name == 'ValidationError') {
            error.message = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email not found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            })
        }

        const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '24h' // Token expires in 24 hours
        })


        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export const getOtherProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, username, bio, location } = req.body;
        if (!name && !email && !username && !bio && !location) {
            return res.status(400).json({ success: false, message: "No fields to update" });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (name && name.trim()) {
            user.name = name;
        }
        if (email && email.trim()) {
            user.email = email;
        }
        if (username && username.trim()) {
            user.username = username;
        }
        if (bio && bio.trim()) {
            user.bio = bio;
        }
        if (location && location.trim()) {
            user.location = location;
        }
        await user.save();
        return res.status(200).json({ success: true, message: "Profile Updated Successfully", user });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}


export const addToFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedInUser = await User.findById(req.user._id);
        const otherUser = await User.findById(id);
        if (!otherUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (loggedInUser.friends.includes(otherUser.id)) {
            return res.status(400).json({ success: false, message: "User is already a friend" });
        }

        if (loggedInUser._id === otherUser._id) {
            return res.status(400).json({ success: false, message: "You cannot add yourself as a friend" });
        }



        loggedInUser.friends.push(otherUser._id);
        otherUser.friends.push(loggedInUser._id);
        await Promise.all([loggedInUser.save(), otherUser.save()]);
        return res.status(200).json({ success: true, message: "Friend added successfully" });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}



export const unFriendController = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedInUser = await User.findById(req.user._id);
        const otherUser = await User.findById(id);
        if (!otherUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (!loggedInUser.friends.includes(otherUser._id)) {
            return res.status(400).json({ success: false, message: "User is not a friend" });
        }

        loggedInUser.friends = loggedInUser.friends.filter((friendId) => friendId.toString() !== otherUser._id.toString());
        otherUser.friends = otherUser.friends.filter((friendId) => friendId.toString() !== loggedInUser._id.toString());
        await Promise.all([loggedInUser.save(), otherUser.save()]);
        return res.status(200).json({
            success: true, message: "Friend removed successfully"
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}



export const getAllFriends = async (req, res) => {
    try {
        const loggedInUser = await User.findById(req.user._id);
        if (!loggedInUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const friends = await User.find({ _id: { $in: loggedInUser.friends } }).select('-password');
        return res.status(200).json({ success: true, friends });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


//update profile image

export const updateProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const profileImage = req.file ? req.file.path : null;
        if (!profileImage) {
            return res.status(400).json({ success: false, message: "No profile image provided" });
        }
        user.profile_image = profileImage;
        await user.save();
        return res.status(200).json({ success: true, message: "Profile Image Updated", profileImage: user.profile_image })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export const updateCoverImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const coverImage = req.file ? req.file.path : null;
        if (!coverImage) {
            return res.status(400).json({ success: false, message: "No cover image provided" });
        }
        user.cover_image = coverImage;
        await user.save();
        return res.status(200).json({ success: true, message: "Cover Image Updated", coverImage: user.cover_image });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

}