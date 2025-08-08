import asyncHandler from 'express-async-handler';
import Leave from '../models/leaveModel.js';

const applyLeave = asyncHandler(async (req, res) => {
  const { fromDate, toDate, reason } = req.body;

  if (!fromDate || !toDate || !reason) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const leave = new Leave({
    user: req.user._id,
    fromDate,
    toDate,
    reason,
  });
  const createdLeave = await leave.save();
  res.status(201).json(createdLeave);
});

const getMyLeaves = asyncHandler(async (req, res) => {
  const leaves = await Leave.find({ user: req.user._id });
  res.json(leaves);
});

const getAllLeaves = asyncHandler(async (req, res) => {
  const leaves = await Leave.find({}).populate('user', 'id name');
  res.json(leaves);
});

const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const leave = await Leave.findById(req.params.id);

  if (leave) {
    leave.status = status;
    const updatedLeave = await leave.save(); // Sahi variable naam
    res.json(updatedLeave); // Sahi variable naam
  } else {
    res.status(404);
    throw new Error('Leave not found');
  }
});

export { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus };