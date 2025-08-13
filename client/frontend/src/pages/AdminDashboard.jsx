import React, { useState, useEffect } from "react";
import { Table, Container, Alert } from "react-bootstrap";
import axios from "../api.js";
import './AdminDashboard.css';
import formatDate from "../utils/formatDate.js"; // formatDate ko import karein
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [allAttendance, setAllAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllAttendance = async () => {
            try {
                const res = await axios.get('/api/admin/attendance');
                setAllAttendance(res.data);
            } catch (err) {
                toast.error('Could not fetch attendance records');
            } finally {
                setLoading(false);
            }
        };

        fetchAllAttendance();
    }, []);

    if (loading) {
        return <p>Loading all attendance records...</p>
    }

    // Helper functions to get first punch in and last punch out
    const getFirstPunchIn = (punches) => punches && punches.length > 0 ? new Date(punches[0].punchInTime).toLocaleTimeString() : 'N/A';
    const getLastPunchOut = (punches) => {
        if (!punches || punches.length === 0) return 'N/A';
        const lastPunch = punches[punches.length - 1];
        return lastPunch.punchOutTime ? new Date(lastPunch.punchOutTime).toLocaleTimeString() : 'N/A';
    };

    return (
        <Container className="mt-5">
            <h1>Admin Dashboard: All Attendance</h1>
            {allAttendance.length === 0 ? (
                <Alert variant='info'>No attendance records found.</Alert>
            ) : (
                <Table striped bordered hover responsive className='table-sm admin-table'>
                    <thead>
                        <tr>
                            <th>EMPLOYEE NAME</th>
                            <th>EMAIL</th>
                            <th>DATE</th>
                            <th>FIRST PUNCH IN</th>
                            <th>LAST PUNCH OUT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allAttendance.map((record) => (
                            <tr key={record._id}>
                                <td>{record.user ? record.user.name : 'N/A'}</td>
                                <td>{record.user ? record.user.email : 'N/A'}</td>
                                <td>{formatDate(record.date)}</td>
                                <td>{getFirstPunchIn(record.punches)}</td>
                                <td>{getLastPunchOut(record.punches)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    )
};

export default AdminDashboard;