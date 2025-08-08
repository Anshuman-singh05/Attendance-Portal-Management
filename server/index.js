import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import cookieParser from 'cookie-parser';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app= express();

app.use(express.json());
app.use(cookieParser());

const PORT= process.env.PORT || 8000;

app.get('/', (req, res)=>{
    res.send("Hello, Your attendance portal is running");
});

app.use('/api/users', userRoutes)
app.use('/api/attendance',attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/admin',adminRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});