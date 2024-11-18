import { Comment } from "../schema/commentModel.js";
import { Post } from "../schema/postModel.js";
import { User } from "../schema/userModel.js";


export const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { comment } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const newComment = await Comment.create({
            comment,
            post: post._id,
            user: req.user.id
        })

        post.comments.push(newComment._id)
        await post.save();

        return res.status(201).json({
            success: true,
            message: "Comment created successfully",
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


export const updateComment = async (req, res) => {
    try {
        const id = req.params.id;
        const { comment } = req.body;
        const updateComment = await Comment.findByIdAndUpdate(id, { comment }, { new: true });
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            updateComment,
        });

    } catch (error) {
        console.error("Error updating comment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }

}


export const deleteComment = async (req, res) => {
    try {
        const id = req.params.id;
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own comments",
            });
        }

        await comment.deleteOne();
        const post = await Post.findById(comment.post);
        post.comments.pull(comment._id);
        await post.save();
        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};