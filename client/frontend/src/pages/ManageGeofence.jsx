import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Alert, Form, Row, Col, Spinner } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import FormContainer from '../components/FormContainer.jsx';
import { toast } from 'react-toastify';
import axios from '../api.js';

const ManageGeofences = () => {
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState(100);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const fetchGeofences = async () => {
    try {
      const { data } = await axios.get('/api/admin/geofence');
      setGeofences(data);
    } catch (err) {
      toast.error('Could not fetch geofences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeofences();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/admin/geofence/${id}`);
        toast.success('Geofence deleted');
        fetchGeofences();
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Deletion failed');
      }
    }
  };

  const createHandler = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    try {
      await axios.post('/api/admin/geofence', { name, latitude, longitude, radius });
      toast.success('Geofence created!');
      fetchGeofences();
      setName(''); setLatitude(''); setLongitude(''); setRadius(100);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Creation failed');
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <Container className='mt-5'>
      <Row>
        <Col md={8}>
          <h1>Manage Geofences</h1>
          {loading ? <p>Loading...</p> : (
            <Table striped bordered hover responsive className='table-sm admin-table'>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>COORDINATES</th>
                  <th>RADIUS (m)</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {geofences.map((gf) => (
                  <tr key={gf._id}>
                    <td>{gf.name}</td>
                    <td>{`${gf.center.coordinates[1]}, ${gf.center.coordinates[0]}`}</td>
                    <td>{gf.radius}</td>
                    <td>
                      <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(gf._id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
        <Col md={4}>
          <h2>Add New Geofence</h2>
          <Form onSubmit={createHandler}>
             <Form.Group controlId='name' className='my-2'>
                <Form.Label>Name</Form.Label>
                <Form.Control type='text' placeholder='e.g., Mumbai Office' value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId='latitude' className='my-2'>
                <Form.Label>Latitude</Form.Label>
                <Form.Control type='number' step='any' placeholder='e.g., 19.0760' value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId='longitude' className='my-2'>
                <Form.Label>Longitude</Form.Label>
                <Form.Control type='number' step='any' placeholder='e.g., 72.8777' value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId='radius' className='my-2'>
                <Form.Label>Radius (meters)</Form.Label>
                <Form.Control type='number' value={radius} onChange={(e) => setRadius(e.target.value)} required />
            </Form.Group>
            <Button type='submit' variant='primary' className='mt-3' disabled={loadingCreate}>
                {loadingCreate ? <Spinner size='sm' /> : 'Create'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ManageGeofences;