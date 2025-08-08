import React, { useState, useEffect } from 'react';
import { Table, Container, Alert, Badge } from 'react-bootstrap';
import axios from '../api.js';
import { toast } from 'react-toastify';
import './HistoryPage.css';

const MyLeavesPage = () => {
  const [myLeaves, setMyLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyLeaves = async () => {
      try {
        // Backend se apni leaves fetch karo
        const res = await axios.get('/api/leaves');
        setMyLeaves(res.data);
      } catch (err) {
        toast.error('Could not fetch your leave records');
      } finally {
        setLoading(false);
      }
    };

    fetchMyLeaves();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <Badge bg="success">Approved</Badge>;
      case 'Rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="warning">Pending</Badge>;
    }
  };

  if (loading) {
    return <p>Loading your leave records...</p>;
  }

  return (
    <Container className='mt-5'>
      <h1>My Leave Requests</h1>
      {myLeaves.length === 0 ? (
        <Alert variant='info'>You have not applied for any leaves yet.</Alert>
      ) : (
        <Table striped bordered hover responsive className='table-sm history-table'>
          <thead>
            <tr>
              <th>FROM</th>
              <th>TO</th>
              <th>REASON</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {myLeaves.map((leave) => (
              <tr key={leave._id}>
                <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                <td>{leave.reason}</td>
                <td>{getStatusBadge(leave.status)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MyLeavesPage;