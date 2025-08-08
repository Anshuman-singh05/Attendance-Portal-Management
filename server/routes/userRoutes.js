import express from 'express';
import { loginUser, registerUser, logoutUser, getUserProfile, updateUserProfile, addFaceDescriptor,getAllFaceDescriptors, loginUserByFace } from '../controllers/userController.js';
import { protect } from '../middleware/authmiddleware.js';
const router = express.Router();

router.post('/',registerUser)
router.post('/login',loginUser);
router.post('/facelogin', loginUserByFace);
router.post('/logout', protect, logoutUser);
router
.route('/profile')
.get(protect,getUserProfile)
.put(protect,updateUserProfile)
router.get('/faces', getAllFaceDescriptors);
router.put('/profile/addface',protect, addFaceDescriptor);

export default router;