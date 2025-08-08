import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import axios from '../api.js';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const LeaveListPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/leaves/all');
      setLeaves(res.data);
    } catch (err) {
      toast.error('Could not fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const statusUpdateHandler = async (id, status) => {
    try {
      await axios.put(`/api/leaves/${id}`, { status });
      toast.success(`Leave has been ${status}`);
      fetchLeaves(); // Refresh the list
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <p>Loading leave requests...</p>;
  }

  return (
    <Container className='mt-5'>
      <h1>Admin: All Leave Requests</h1>
      {leaves.length === 0 ? (
        <Alert variant='info'>No leave requests found.</Alert>
      ) : (
        <Table striped bordered hover responsive className='table-sm admin-table'>
          <thead>
            <tr>
              <th>EMPLOYEE</th>
              <th>FROM</th>
              <th>TO</th>
              <th>REASON</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.user ? leave.user.name : 'N/A'}</td>
                <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                <td>{leave.reason}</td>
                <td>{leave.status}</td>
                <td>
                  {leave.status === 'Pending' && (
                    <>
                      <Button variant='success' className='btn-sm me-2' onClick={() => statusUpdateHandler(leave._id, 'Approved')}>
                        Approve
                      </Button>
                      <Button variant='danger' className='btn-sm' onClick={() => statusUpdateHandler(leave._id, 'Rejected')}>
                        Reject
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default LeaveListPage;