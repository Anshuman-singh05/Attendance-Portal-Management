import asyncHandler from 'express-async-handler';
import Attendance from '../models/attendanceModel.js';
import Geofence from '../models/geofenceModel.js';
import User from '../models/userModel.js';

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

const clockIn = asyncHandler(async (req, res) => {
    const { location } = req.body;
    const user = await User.findById(req.user._id).populate('assignedGeofences');

    if (!location) {
        res.status(400);
        throw new Error('Location data is required for punch-in.');
    }

    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));
    let todayAttendance = await Attendance.findOne({ user: user._id, date: { $gte: startOfDay, $lt: endOfDay } });

    // Geofence check logic
    let geofencesToCheck = user.assignedGeofences;
    if (!geofencesToCheck || geofencesToCheck.length === 0) {
        const defaultGeofence = await Geofence.findOne({ name: 'Default' });
        if (defaultGeofence) geofencesToCheck = [defaultGeofence];
    }

    let validGeofenceId = null;
    if (geofencesToCheck && geofencesToCheck.length > 0) {
        for (const geofence of geofencesToCheck) {
            const officeLocation = { latitude: geofence.center.coordinates[1], longitude: geofence.center.coordinates[0] };
            const distance = getDistanceFromLatLonInKm(location.latitude, location.longitude, officeLocation.latitude, officeLocation.longitude);
            if (distance <= (geofence.radius+20)) {
                validGeofenceId = geofence._id;
                break;
            }
        }
        if (!validGeofenceId) {
            res.status(401);
            throw new Error('You are not within your assigned work area to punch in.');
        }
    }

    if (todayAttendance) {
        const lastPunch = todayAttendance.punches[todayAttendance.punches.length - 1];
        if (lastPunch && !lastPunch.punchOutTime) {
            res.status(400);
            throw new Error('You must punch out before punching in again.');
        }
        todayAttendance.punches.push({ punchInTime: new Date() });
    } else {
        todayAttendance = await Attendance.create({
            user: user._id,
            date: new Date(),
            punches: [{ punchInTime: new Date() }],
            clockInGeofence: validGeofenceId, // Save the first geofence for the day
        });
    }
    
    const updatedAttendance = await todayAttendance.save();
    res.status(201).json(updatedAttendance);
});

const clockOut = asyncHandler(async (req, res) => {
    const { location } = req.body;
    const userId = req.user._id;

    if (!location) {
        res.status(400);
        throw new Error('Location data is required for punch-out.');
    }

    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));
    const todaysAttendance = await Attendance.findOne({ user: userId, date: { $gte: startOfDay, $lt: endOfDay } }).populate('clockInGeofence');

    if (!todaysAttendance || todaysAttendance.punches.length === 0) {
        res.status(400);
        throw new Error('You have not punched in yet today');
    }

    const lastPunch = todaysAttendance.punches[todaysAttendance.punches.length - 1];
    if (lastPunch.punchOutTime) {
        res.status(400);
        throw new Error('You have already punched out. Punch in again first.');
    }

    const punchInGeofence = todaysAttendance.clockInGeofence;
    if (punchInGeofence) {
        const officeLocation = { latitude: punchInGeofence.center.coordinates[1], longitude: punchInGeofence.center.coordinates[0] };
        const distance = getDistanceFromLatLonInKm(location.latitude, location.longitude, officeLocation.latitude, officeLocation.longitude);

        if (distance > (punchInGeofence.radius+20)) {
            res.status(401);
            throw new Error('You must be in the same location to punch out where you punched in.');
        }
    }

    lastPunch.punchOutTime = new Date();
    const updatedAttendance = await todaysAttendance.save();
    res.status(200).json(updatedAttendance);
});

const getAttendanceStatus = asyncHandler(async (req, res) => {
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));
    const attendance = await Attendance.findOne({ user: req.user._id, date: { $gte: startOfDay, $lt: endOfDay } });
    
    if (attendance) {
        res.json(attendance);
    } else {
        res.json(null);
    }
});

const getMyAttendanceHistory = asyncHandler(async(req,res)=>{
    const attendanceRecords = await Attendance.find({ user: req.user._id })
        .sort({ date: -1 })
        .populate('clockInGeofence', 'name'); // Geofence ka naam bhi le aao
    res.status(200).json(attendanceRecords);
});

export { clockIn, clockOut, getAttendanceStatus, getMyAttendanceHistory };