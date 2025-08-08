import express from 'express';
const router= express.Router();
import { applyLeave, getMyLeaves, getAllLeaves,updateLeaveStatus } from '../controllers/leaveController.js';
import { protect,isAdmin } from '../middleware/authmiddleware.js';

router.route('/')
.post(protect, applyLeave)
.get(protect,getMyLeaves)

router.route('/all')
.get(protect, isAdmin, getAllLeaves);
router.route('/:id')
.put(protect, isAdmin, updateLeaveStatus);


export default router;