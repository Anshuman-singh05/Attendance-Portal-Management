import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api.js';

const UserEditPage = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [dob, setDob] = useState('');
  const [allGeofences, setAllGeofences] = useState([]);
  const [assignedGeofences, setAssignedGeofences] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData } = await axios.get(`/api/admin/users/${userId}`);
        const { data: geofencesData } = await axios.get('/api/admin/geofence');
        
        setName(userData.name);
        setEmail(userData.email);
        setRole(userData.role);
        if (userData.dob) {
          setDob(new Date(userData.dob).toISOString().split('T')[0]);
        }
        setAllGeofences(geofencesData);
        setAssignedGeofences(userData.assignedGeofences || []);
      } catch (err) {
        toast.error('Could not fetch user data');
        setLoading(false); // <-- YEH SABSE ZAROORI FIX HAI
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/users/${userId}`, { name, email, role, dob });
      await axios.put(`/api/admin/users/${userId}/assign-geofence`, { geofenceIds: assignedGeofences });
      
      toast.success('User updated successfully');
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    }
  };
      
  const handleGeofenceChange = (geofenceId) => {
    const isAssigned = assignedGeofences.includes(geofenceId);
    if (isAssigned) {
      setAssignedGeofences(assignedGeofences.filter(id => id !== geofenceId));
    } else {
      setAssignedGeofences([...assignedGeofences, geofenceId]);
    }
  };

  return (
    <Container className='mt-5'>
      <Link to='/admin/userlist' className='btn btn-light my-3'>Go Back</Link>
      <h1>Edit User</h1>
      {loading ? <Spinner /> : (
        <Form onSubmit={submitHandler}>
          {/* Form fields... */}
          <Form.Group controlId='name' className='my-2'><Form.Label>Name</Form.Label><Form.Control type='text' value={name} onChange={(e) => setName(e.target.value)} /></Form.Group>
          <Form.Group controlId='email' className='my-2'><Form.Label>Email</Form.Label><Form.Control type='email' value={email} onChange={(e) => setEmail(e.target.value)} /></Form.Group>
          <Form.Group controlId='dob' className='my-2'>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control type='date' value={dob} onChange={(e) => setDob(e.target.value)} />
          </Form.Group>
          <Form.Group controlId='role' className='my-2'><Form.Label>Role</Form.Label><Form.Select value={role} onChange={(e) => setRole(e.target.value)}><option value='employee'>Employee</option><option value='admin'>Admin</option></Form.Select></Form.Group>
          <Form.Group controlId='geofences' className='my-3'>
            <Form.Label>Assign Geofences</Form.Label>
            {allGeofences.map(gf => (
              <Form.Check 
                type='checkbox'
                key={gf._id}
                label={gf.name}
                value={gf._id}
                checked={assignedGeofences.includes(gf._id)}
                onChange={() => handleGeofenceChange(gf._id)}
              />
            ))}
          </Form.Group>
          <Button type='submit' variant='primary' className='mt-3'>Update</Button>
        </Form>
      )}
    </Container>
  );
};
export default UserEditPage;