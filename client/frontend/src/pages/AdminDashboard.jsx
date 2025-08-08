import React, {useState,useEffect } from "react";
import { Table, Container, Alert } from "react-bootstrap";
import axios from "../api.js";
import './AdminDashboard.css';

const AdminDashboard =()=>{
    const [allAttendance, setAllAttendance]= useState([]);
    const[loading, setLoading]= useState(true);

    useEffect(()=>{
        const fetchAllAttendance= async()=>{
            try{
                const res= await axios.get('/api/admin/attendance');
                setAllAttendance(res.data);
            }catch(err){
                console.error(err);
            }finally{
                setLoading(false);
            }
        };

        fetchAllAttendance();
    }, []);

    if(loading){
        return <p>Loading all attendance records...</p>
    }

    return(
        <Container className="mt-5">
            <h1>Admin Dashboard: All Attendance </h1>
            {allAttendance.length === 0 ? (
        <Alert variant='info'>No attendance records found.</Alert>
      ) : (
        <Table striped bordered hover responsive className='table-sm admin-table'>
          <thead>
            <tr>
              <th>EMPLOYEE NAME</th>
              <th>EMAIL</th>
              <th>DATE</th>
              <th>CLOCK IN</th>
              <th>CLOCK OUT</th>
            </tr>
          </thead>
          <tbody>
            {allAttendance.map((record) => (
              <tr key={record._id}>
                <td>{record.user ? record.user.name : 'N/A'}</td>
                <td>{record.user ? record.user.email : 'N/A'}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{new Date(record.clockInTime).toLocaleTimeString()}</td>
                <td>
                  {record.clockOutTime
                    ? new Date(record.clockOutTime).toLocaleTimeString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
        </Container>
    )
};

export default AdminDashboard;