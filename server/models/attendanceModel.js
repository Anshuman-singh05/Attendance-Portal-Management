import mongoose from 'mongoose';

const punchSchema = new mongoose.Schema({
  punchInTime: { type: Date, required: true },
  punchOutTime: { type: Date },
});

const attendanceSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        date: {
            type: Date,
            required: true,
        },
        punches: [punchSchema],
        status: {
            type: String,
            required: true,
            enum: ['Present', 'On Leave'],
            default: 'Present',
        },
        clockInGeofence: { // <-- Yeh field zaroori hai
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Geofence',
        },
    },
    {
        timestamps: true,
    }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;