import express from 'express';
import {
    userLogin, userRegister, getMyProfile, getOtherProfile,
    updateUserProfile, addToFriends, unFriendController,
    getAllFriends, updateProfileImage, updateCoverImage
} from '../controllers/userControllers.js';
import authVerify from '../middleware/authMiddleware.js';
const router = express.Router();
import upload from '../utils/multerConfig.js';

router.post('/register', userRegister);
router.post('/login', userLogin);
router.get('/my_profile', authVerify, getMyProfile);
router.get('/user_profile/:id', authVerify, getOtherProfile);
router.put('/update_profile/:id', authVerify, updateUserProfile);
router.post('/add_friend/:id', authVerify, addToFriends);
router.post('/unfriend/:id', authVerify, unFriendController);
router.get('/friendlists', authVerify, getAllFriends);
router.post('/update-profile-image', authVerify, upload.single('profileImage'), updateProfileImage)
router.post('/update-cover-image', authVerify, upload.single('coverImage'), updateCoverImage);



export default router;