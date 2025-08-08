import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import axios from '../api.js';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Could not fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await axios.delete(`/api/admin/user/${id}`);
        toast.success(res.data.message);
        fetchUsers(); // Refresh the user list
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Could not delete user');
      }
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <Container className='mt-5'>
      <h1>Admin: All Users</h1>
      {users.length === 0 ? (
        <Alert variant='info'>No users found.</Alert>
      ) : (
        <Table striped bordered hover responsive className='table-sm admin-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>DELETE</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
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
      )}
    </Container>
  );
};

export default UserListPage;