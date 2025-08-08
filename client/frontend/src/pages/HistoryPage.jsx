import React, {useState, useEffect} from "react";
import { Table, Container, Alert } from "react-bootstrap";
import axios from '../api.js';
import './HistoryPage.css';

const HistoryPage=()=>{
    const [history, setHistory]= useState([]);
    const[loading, setLoading]= useState(true);

    useEffect(()=>{
        const fetchHistory= async()=>{
            try{
                const res= await axios.get('/api/attendance/history');
                setHistory(res.data);
            } catch(err){
                console.error(err);
            }finally{
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);
    if(loading){
        return<p>Loading History...</p>
    }

    return (
    <Container className='mt-5'>
      <h1>My Attendance History</h1>
      {history.length === 0 ? (
        <Alert variant='info'>No attendance records found.</Alert>
      ) : (
        <Table striped bordered hover responsive className='table-sm history-table'>
          <thead>
            <tr>
              <th>DATE</th>
              <th>CLOCK IN</th>
              <th>CLOCK OUT</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record._id}>
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
  );
};

export default HistoryPage;