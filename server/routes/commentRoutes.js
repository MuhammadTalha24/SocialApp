import express from 'express'
import authVerify from '../middleware/authMiddleware.js'
import { createComment, deleteComment, updateComment } from '../controllers/commentController.js';

const router = express.Router()

router.post('/create/:id', authVerify, createComment);
router.put('/update/:id', authVerify, updateComment)
router.delete('/delete/:id', authVerify, deleteComment);


export default router;