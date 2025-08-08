import mongoose from "mongoose";

const leaveSchema= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    fromDate:{
        type: Date,
        required:true,
    },
    toDate:{
        type:Date,
        required:true,
    },
    reason:{
        type:String,
        required: true,
    },
    status:{
        type: String,
        enum: ['Pending','Approved','Rejected'],
        default: 'Pending'
    },
},
{
    timestamps: true,
}
);

const Leave= mongoose.model('Leave',leaveSchema);
export default Leave;
