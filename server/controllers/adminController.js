import asyncHandler from 'express-async-handler';
import Attendance from '../models/attendanceModel.js';
import User from '../models/userModel.js';

const getAllUsersAttendance= asyncHandler(async(req,res)=>{
    const records= await Attendance.find({})
    .populate('user','name email')
    .sort({date:-1});

    res.status(200).json(records);
});

const deleteUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        res.status(404);
        throw new Error('User not found');
    }
    await User.deleteOne({_id: user._id});
    res.status(200).json({message: 'User Deleted successfully'});

});

const getAllUsers= asyncHandler(async(req,res)=>{
        const users= await User.find({});
        res.status(200).json(users);
});

export {getAllUsersAttendance, deleteUser, getAllUsers};