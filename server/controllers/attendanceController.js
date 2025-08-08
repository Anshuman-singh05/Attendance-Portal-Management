import asyncHandler from 'express-async-handler';
import Attendance from '../models/attendanceModel.js';


const clockIn= asyncHandler(async (req, res)=>{
    const userId= req.user._id;
    const today= new Date();
    const startOfDay= new Date(today.setHours(0,0,0,0));
    const endOfDay=new Date(today.setHours(23,59,59,999));

    const existingAttendance= await Attendance.findOne({
        user:userId,
        date:{
            $gte:startOfDay,
            $lt:endOfDay,
        },
    })
    if (existingAttendance){
    res.status(400);
    throw new Error('You have already clocked in today');
}

    const attendance= await Attendance.create({
    user: userId,
    date:new Date(),
    clockInTime: new Date(),
    });
    res.status(201).json(attendance);
});

const clockOut= asyncHandler(async(req,res)=>{
    const userId= req.user._id;

    const today= new Date();
    const startOfDay= new Date(today.setHours(0,0,0,0));
    const endOfDay= new Date(today.setHours(23,59,59,999));

    const todaysAttendance= await Attendance.findOne({
        user: userId,
        date:{
            $gte: startOfDay,
            $lt: endOfDay,
        },
    });
    if(!todaysAttendance){
        res.status(400);
        throw new Error('You have not clocked in yet today');
    }

    if(todaysAttendance.clockOutTime){
        res.status(400);
        throw new Error('You have already clocked out today');
    }
    todaysAttendance.clockOutTime= new Date();
    const updatedAttendance= await todaysAttendance.save();
    res.status(200).json(updatedAttendance);
})

const getMyAttendanceHistory= asyncHandler(async(req,res)=>{
    const attendanceRecords= await Attendance.find({
        user: req.user._id
    }).select('date clockInTime clockOutTime ')
        .sort({
        date: -1
    });
    res.status(200).json(attendanceRecords);
})

const getAttendanceStatus = asyncHandler(async (req, res) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const attendance = await Attendance.findOne({
        user: req.user._id,
        date: { $gte: startOfDay, $lt: endOfDay },
    });

    if (attendance) {
        res.json(attendance);
    } else {
        res.json(null); // Bhejein null agar record nahi hai
    }
});

export {clockIn,clockOut, getMyAttendanceHistory, getAttendanceStatus};
