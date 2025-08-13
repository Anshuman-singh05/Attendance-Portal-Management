import asyncHandler from 'express-async-handler';
import Attendance from '../models/attendanceModel.js';
import User from '../models/userModel.js';
import Geofence from '../models/geofenceModel.js';

const getAllUsersAttendance = asyncHandler(async (req, res) => {
  const records = await Attendance.find({}).populate('user', 'name email').sort({ date: -1 });
  res.status(200).json(records);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await User.deleteOne({ _id: user._id });
  res.status(200).json({ message: 'User Deleted successfully' });
});

const getAllUsers = asyncHandler(async (req, res) => {
  // .populate() ke saath-saath .select() add karein
  const users = await User.find({})
    .select('-password') // Password ke alawa sab kuch bhejo
    .populate('assignedGeofences', 'name');
  res.status(200).json(users);
});

const createGeofence = asyncHandler(async (req, res) => {
  const { name, latitude, longitude, radius } = req.body;
  const geofence = await Geofence.create({
    name,
    center: { type: 'Point', coordinates: [longitude, latitude] },
    radius,
  });
  res.status(201).json(geofence);
});

const getGeofences = asyncHandler(async (req, res) => {
  const geofences = await Geofence.find({});
  res.json(geofences);
});

const deleteGeofence = asyncHandler(async (req, res) => {
  const geofence = await Geofence.findById(req.params.id);
  if (geofence) {
    await Geofence.deleteOne({ _id: geofence._id });
    res.json({ message: 'Geofence removed' });
  } else {
    res.status(404);
    throw new Error('Geofence not found');
  }
});

const assignGeofence = asyncHandler(async (req, res) => {
  const { geofenceIds } = req.body;
  const user = await User.findById(req.params.id);
  if (user) {
    user.assignedGeofences = geofenceIds;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// updateUserByAdmin function missing tha, use add kar rahe hain
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.dob= req.body.dob || user.dob;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const getDefaultGeofence = asyncHandler(async (req, res) => {
  const geofence = await Geofence.findOne({ name: /Default/i });
  if (geofence) {
    res.json(geofence);
  } else {
    res.json(null); // Agar default set nahi hai
  }
});

export {
  getAllUsersAttendance, deleteUser, getAllUsers, createGeofence,
  getGeofences, deleteGeofence, assignGeofence, getUserById, updateUserByAdmin, getDefaultGeofence
};