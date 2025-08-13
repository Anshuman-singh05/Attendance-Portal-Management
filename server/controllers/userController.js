import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import LoginHistory from '../models/loginHistoryModel.js';
import Geofence from '../models/geofenceModel.js';

// Helper function to calculate distance in meters
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d * 1000; // Distance in meters
}

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, dob } = req.body;

  if (!dob) {
    res.status(400);
    throw new Error('Date of Birth is required');
  }

  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 18) {
    res.status(400);
    throw new Error('User must be at least 18 years old');
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password, dob });

  if (user) {
    const defaultGeofence = await Geofence.findOne({ name: /Default/i });
    if (defaultGeofence) {
      user.assignedGeofences.push(defaultGeofence._id);
      await user.save();
    }

    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'User logged out successfully' });
});

const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const addFaceDescriptor = asyncHandler(async (req, res) => {
  const { faceDescriptor } = req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    user.faceDescriptor = faceDescriptor;
    await user.save();
    res.status(200).json({ message: 'Face descriptor added successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getAllFaceDescriptors = asyncHandler(async (req, res) => {
  const users = await User.find({ faceDescriptor: { $exists: true, $not: { $size: 0 } } }).select('name email faceDescriptor');
  res.json(users);
});

const loginUserByFace = asyncHandler(async (req, res) => {
  const { email, location, browser, device } = req.body;
  
  const user = await User.findOne({ email }).populate('assignedGeofences');

  if (!user) {
    res.status(401);
    throw new Error('User not found for face login');
  }

  let geofencesToCheck = user.assignedGeofences;
  let geofenceCheckRequired = true;

  if (!geofencesToCheck || geofencesToCheck.length === 0) {
    const defaultGeofence = await Geofence.findOne({ name: /Default/i });
    if (defaultGeofence) {
      geofencesToCheck = [defaultGeofence];
    } else {
      geofenceCheckRequired = false;
    }
  }

  if (geofenceCheckRequired) {
    let isWithinGeofence = false;
    for (const geofence of geofencesToCheck) {
      const officeLocation = {
        latitude: geofence.center.coordinates[1],
        longitude: geofence.center.coordinates[0],
      };
      const officeRadius = geofence.radius;

      const distance = getDistanceFromLatLonInKm(
        location.latitude,
        location.longitude,
        officeLocation.latitude,
        officeLocation.longitude
      );

      if (distance <= (officeRadius + 20)) { // 20 meter ka buffer
        isWithinGeofence = true;
        break;
      }
    }

    if (!isWithinGeofence) {
      res.status(401);
      throw new Error('You are not within your assigned/default work area');
    }
  }

  await LoginHistory.create({
    user: user._id,
    ip: req.ip,
    browser,
    device,
    location: {
      type: 'Point',
      coordinates: [location.longitude, location.latitude],
    },
  });

  generateToken(res, user._id);
  res.status(200).json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
  });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  addFaceDescriptor,
  getAllFaceDescriptors,
  loginUserByFace,
};
