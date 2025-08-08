import mongoose from "mongoose";

const attendanceSchema= mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date:{
        type: Date,
        required: true,
    },
    clockInTime:{
        type: Date,
        required: true,
    },
    clockOutTime:{
        type: Date,
    },
    status:{
        type:String,
        required: true,
        enum: ['Present', 'On Leave'],
        default: 'Present',
    },
},
{
    timestamps: true,
}
);

const Attendance= mongoose.model('Attendance', attendanceSchema);
export default Attendance;