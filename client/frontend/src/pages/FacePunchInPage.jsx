import React, { useState, useEffect, useRef } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import FormContainer from '../components/FormContainer.jsx';
import { toast } from 'react-toastify';
import axios from '../api.js';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import formatDate from '../utils/formatDate.js';

const FacePunchInPage = () => {
  const videoRef = useRef();
  const streamRef = useRef(null);
  const [status, setStatus] = useState('Initializing...');
  const navigate = useNavigate();

  useEffect(() => {
    const setupAndPunchIn = async () => {
      try {
        // Models load karo
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        
        // Webcam start karo
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Thoda wait karo taaki video stabilize ho jaaye
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStatus('Detecting face...');

        // Face detect karo
        const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions());
        if (!detection) {
          setStatus('No face detected. Please try again.');
          toast.error('No face detected. Please position your face in the camera.');
          return;
        }

        setStatus('Face detected. Getting location...');
        
        // Location get karo
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            try {
              setStatus('Processing punch-in...');
              await axios.post('/api/attendance/clockin', { location });
              toast.success('Punched in successfully!');
              navigate('/');
            } catch (err) {
              toast.error(err?.response?.data?.message || 'Punch-in failed.');
              setStatus('Error. Please try again.');
            }
          },
          () => {
            toast.error('Location access is required to punch in.');
            setStatus('Location access denied. Please enable and try again.');
          }
        );

      } catch (err) {
        setStatus('Error initializing. Check camera permissions.');
        toast.error('Could not start face punch-in setup.');
      }
    };

    setupAndPunchIn();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [navigate]);

  return (
    <FormContainer>
      <h1>Automatic Punch In</h1>
      <p>Please look at the camera. The system will automatically punch you in.</p>
      <div className="d-flex justify-content-center my-3">
        <video ref={videoRef} width="480" height="360" autoPlay muted></video>
      </div>
      <Alert variant='info'>{status}</Alert>
    </FormContainer>
  );
};

export default FacePunchInPage;