import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Alert, Badge, Spinner } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import axios from '../api.js';
import { toast } from 'react-toastify';
import './AdminDashboard.css';
import formatDate from '../utils/formatDate.js'; // <-- Helper function import karein

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [defaultGeofence, setDefaultGeofence] = useState(null);

  const fetchUsersAndDefaultGeofence = async () => {
    try {
      const [usersRes, defaultGfRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/geofence/default')
      ]);
      setUsers(usersRes.data);
      setDefaultGeofence(defaultGfRes.data);
    } catch (err) {
      toast.error('Could not fetch data from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndDefaultGeofence();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/admin/users/${id}`);
        toast.success('User deleted successfully');
        fetchUsersAndDefaultGeofence();
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Could not delete user');
      }
    }
  };

  if (loading) {
    return <Container className='mt-5'><Spinner animation="border" /></Container>;
  }

  return (
    <Container className='mt-5'>
      <h1>Admin: All Users</h1>
      <Table striped bordered hover responsive className='table-sm admin-table'>
        <thead>
          <tr>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ROLE</th>
            <th>DOB</th>
            <th>ASSIGNED GEOFENCES</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.role === 'admin' ? (
                  <Badge bg='success'>Admin</Badge>
                ) : (
                  <Badge bg='secondary'>Employee</Badge>
                )}
              </td>
              <td>{formatDate(user.dob)}</td> {/* <-- Yahan change hua hai */}
              <td>
                {user.assignedGeofences.length > 0 ? (
                  user.assignedGeofences.map(gf => (
                    <Badge key={gf._id} pill bg="info" className="me-1">
                      {gf.name}
                    </Badge>
                  ))
                ) : (
                  defaultGeofence ? (
                    <Badge pill bg="warning" text="dark">
                      {defaultGeofence.name} 
                    </Badge>
                  ) : (
                    <Badge pill bg="secondary">
                      None
                    </Badge>
                  )
                )}
              </td>
              <td>
                <LinkContainer to={`/admin/users/${user._id}/edit`}>
                  <Button variant='light' className='btn-sm me-2'>
                    <FaEdit />
                  </Button>
                </LinkContainer>
                <Button
                  variant='danger'
                  className='btn-sm'
                  onClick={() => deleteHandler(user._id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserListPage;