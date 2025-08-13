import express from 'express';
import {
  getAllUsersAttendance, deleteUser, getAllUsers, createGeofence,
  getGeofences, deleteGeofence, assignGeofence, getUserById, updateUserByAdmin, getDefaultGeofence
} from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authmiddleware.js';

const router = express.Router();

// Attendance Route
router.get('/attendance', protect, isAdmin, getAllUsersAttendance);

// User Management Routes
router.route('/users')
  .get(protect, isAdmin, getAllUsers);

router.route('/users/:id')
  .get(protect, isAdmin, getUserById)
  .delete(protect, isAdmin, deleteUser)
  .put(protect, isAdmin, updateUserByAdmin);

router.route('/users/:id/assign-geofence')
  .put(protect, isAdmin, assignGeofence);

// Geofence Management Routes
router.get('/geofence/default', protect, isAdmin, getDefaultGeofence); // <-- Yeh naya route

router.route('/geofence')
  .post(protect, isAdmin, createGeofence)
  .get(protect, isAdmin, getGeofences);

router.route('/geofence/:id')
  .delete(protect, isAdmin, deleteGeofence);

export default router;