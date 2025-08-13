import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import useAuthStore from '../store/authStore.js';
import axios from '../api.js';
import './Dashboard.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { userInfo } = useAuthStore();
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  // Punch In ab face se hoga
  const punchInHandler = () => {
    navigate('/punch-in'); // Naye Face Punch In page par bhej do
  };
  
  // Punch out ab face se hoga
  const punchOutHandler = () => {
    navigate('/punch-out'); // Naye Face Punch Out page par bhej do
  };

  if (loading) {
    return <Container className='mt-5'><Spinner animation="border" /></Container>;
  }
  
  const lastPunch = attendanceStatus ? attendanceStatus.punches[attendanceStatus.punches.length - 1] : null;
  const isPunchedIn = attendanceStatus && lastPunch && !lastPunch.punchOutTime;

  return (
    <Card className="dashboard-card">
      <Card.Header as="h5" className="dashboard-header">Dashboard</Card.Header>
      <Card.Body>
        <Card.Title className="welcome-title">Welcome, {userInfo ? userInfo.name : 'Employee'}</Card.Title>
        <Card.Text className="text-secondary">
          You can mark your attendance from here.
        </Card.Text>
        
        {error && <Alert variant='danger'>{error}</Alert>}

        {attendanceStatus && attendanceStatus.punches.length > 0 ? (
            attendanceStatus.punches.map((punch, index) => (
                <Alert key={index} variant={punch.punchOutTime ? 'light' : 'info'}>
                    Punch {index + 1}: In at {new Date(punch.punchInTime).toLocaleTimeString()}
                    {punch.punchOutTime && ` | Out at ${new Date(punch.punchOutTime).toLocaleTimeString()}`}
                </Alert>
            ))
        ) : (
            <Alert variant='warning'>You have not punched in yet today.</Alert>
        )}

        <Row className='dashboard-buttons'>
          <Col>
            {isPunchedIn ? (
                // Agar user punched-in hai, toh Punch Out button (jo page par le jaayega) dikhao
                <Button variant="danger" onClick={punchOutHandler} className="w-100 fw-bold">
                    Punch Out
                </Button>
            ) : (
                // Agar nahi, toh Punch In button (jo page par le jaayega) dikhao
                <Button variant="success" onClick={punchInHandler} className="w-100 fw-bold">
                    Punch In
                </Button>
            )}
          </Col>
        </Row>

        <Row className="mt-3">
            <Col>
                <LinkContainer to='/apply-leave'>
                    <Button variant='secondary' className='w-100 fw-bold'>Apply for Leave</Button>
                </LinkContainer>
            </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default HomePage;