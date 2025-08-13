import mongoose from "mongoose";

const loginHistorySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        ip: { type: String },
        browser: { type: String },
        device: { type: String },
        location: { // <-- Location ek object hai
            type: {
                type: String,
                enum: ['Point'], // Sirf 'Point' ho sakta hai
            },
            coordinates: { // <-- Coordinates iske andar hai
                type: [Number], // [Longitude, Latitude]
            },
        },
    },
    {
        timestamps: true,
    }
);

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);

export default LoginHistory;