import { Post } from "../schema/postModel.js";
import { User } from "../schema/userModel.js";


export const createPostController = async (req, res) => {
    try {
        const loggedInUser = await User.findById(req.user._id);
        const { description } = req.body;
        const postImage = req.file ? req.file.path : null;

        if (!postImage) {
            return res.status(400).json({
                success: false,
                message: "No post image provided"
            })
        }



        if (!description) {
            return res.status(400).json({
                success: false,
                message: "Description is required"
            })
        }





        const newPost = await Post.create({
            description,
            image: postImage,
            user: req.user._id
        })


        loggedInUser.posts.push(newPost._id);
        await loggedInUser.save();


        return res.status(200).json({
            success: true,
            message: "Post created successfully",
            newPost
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"

        })
    }
}


export const postDetails = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!Post) {
            return res.status(400).json({
                success: false,
                message: "Post Not Found",
            })
        }

        return res.status(200).json({
            success: true,
            post
        })
    }

    catch {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"

        })
    }
}


export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own posts"
            });
        }

        await post.deleteOne();
        await user.posts.pull(post._id);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}



export const loggedInUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id });
        return res.status(200).json(posts);
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        })
    }
}


export const getFriendsPosts = async (req, res) => {
    try {

        const loggedinUser = await User.findById(req.user.id);
        const friendsPosts = await Post.find({ user: loggedinUser.friends.filter((friendId) => friendId !== loggedinUser._id) })

        if (!friendsPosts) {
            return res.status(400).json({
                success: false,
                message: "No Friends Posts Found"
            })
        }

        return res.status(200).json({
            success: true,
            friendsPosts
        })


    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        })
    }
}



export const getPostComments = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id).populate('comments');
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found"
            })
        }
        const comments = post.comments
        return res.status(200).json({
            success: true,
            comments: comments,
        })

    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        })
    }
}

export const postLikeOrUnlike = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        if (post.likes.includes(req.user.id)) {
            post.likes.pull(req.user.id);
            await post.save();
            return res.status(200).json({
                success: true,
                message: "Post unliked",
            })
        } else {
            post.likes.push(req.user.id);
            await post.save();
            return res.status(200).json({
                success: true,
                message: "Post liked",
            })
        }

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
