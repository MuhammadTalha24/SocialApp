import express from 'express'
import { createPostController, deletePost, loggedInUserPosts, getFriendsPosts, postDetails, getPostComments, postLikeOrUnlike } from '../controllers/postControllers.js';
import authVerify from '../middleware/authMiddleware.js';
import upload from '../utils/multerConfig.js';
const router = express.Router();

router.post('/create', authVerify, upload.single('postImage'), createPostController);
router.delete('/delete/:id', authVerify, deletePost);
router.get('/myposts', authVerify, loggedInUserPosts);
router.get('/friendsposts', authVerify, getFriendsPosts);
router.get('/postdetail/:id', authVerify, postDetails)
router.get('/postcomments/:id', authVerify, getPostComments)
router.post('/likeorunlike/:id', authVerify, postLikeOrUnlike);


export default router;