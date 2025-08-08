import express from 'express';
import { clockIn, clockOut, getAttendanceStatus, getMyAttendanceHistory,} from '../controllers/attendanceController.js';
import { protect } from '../middleware/authmiddleware.js';

const router= express.Router();

router.post('/clockin', protect, clockIn);
router.post('/clockout', protect, clockOut);
router.get('/status',protect, getAttendanceStatus);
router.get('/history',protect,getMyAttendanceHistory);

export default router;