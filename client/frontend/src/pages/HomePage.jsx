import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import useAuthStore from '../store/authStore.js';
import axios from '../api.js';
import './Dashboard.css';

const HomePage = () => {
  const { userInfo } = useAuthStore();
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getTodaysStatus = async () => {
    try {
      const res = await axios.get('/api/attendance/status');
      setAttendanceStatus(res.data);
    } catch (err) {
      setAttendanceStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodaysStatus();
  }, []);

  const clockInHandler = async () => {
    setError('');
    try {
      await axios.post('/api/attendance/clockin');
      getTodaysStatus();
    } catch (err) {
      setError(err?.response?.data?.message || 'An error occurred');
    }
  };

  const clockOutHandler = async () => {
    setError('');
    try {
      await axios.post('/api/attendance/clockout');
      getTodaysStatus();
    } catch (err) {
      setError(err?.response?.data?.message || 'An error occurred');
    }
  };

  if (loading) {
    return <p>Loading attendance status...</p>;
  }

  return (
    <Card className="dashboard-card">
      <Card.Header as="h5" className="dashboard-header">Dashboard</Card.Header>
      <Card.Body>
        <Card.Title className="welcome-title">Welcome, {userInfo ? userInfo.name : 'Employee'}</Card.Title>
        <Card.Text className="text-secondary">
          You can mark your attendance from here.
        </Card.Text>
        
        {error && <Alert variant='danger'>{error}</Alert>}

        {attendanceStatus ? (
          <Alert variant='info'>
            Clocked In at: {new Date(attendanceStatus.clockInTime).toLocaleTimeString()}
            <br />
            {attendanceStatus.clockOutTime && `Clocked Out at: ${new Date(attendanceStatus.clockOutTime).toLocaleTimeString()}`}
          </Alert>
        ) : (
          <Alert variant='warning'>You have not clocked in yet today.</Alert>
        )}

        <Row className='dashboard-buttons'>
          <Col>
            <Button
              variant="success"
              onClick={clockInHandler}
              className="w-100 fw-bold"
              disabled={!!attendanceStatus}
            >
              Clock In
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
              onClick={clockOutHandler}
              className="w-100 fw-bold"
              disabled={!attendanceStatus || !!attendanceStatus.clockOutTime}
            >
              Clock Out
            </Button>
          </Col>
        </Row>

        <Row className="mt-3">
            <Col>
                <LinkContainer to='/apply-leave'>
                    <Button variant='info' className='w-100 fw-bold'>Apply for Leave</Button>
                </LinkContainer>
            </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default HomePage;