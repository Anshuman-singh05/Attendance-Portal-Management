import express from 'express';
import { getAllUsersAttendance,deleteUser,getAllUsers } from '../controllers/adminController.js';
import { protect,isAdmin } from '../middleware/authmiddleware.js';

const router= express.Router();

router.get('/attendance', protect, isAdmin, getAllUsersAttendance);
router.delete('/user/:id',protect,isAdmin,deleteUser);
router.get('/users', protect, isAdmin, getAllUsers);

export default router;