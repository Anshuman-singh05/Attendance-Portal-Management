import React, { useState, useEffect, useRef } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import FormContainer from '../components/FormContainer.jsx';
import { toast } from 'react-toastify';
import axios from '../api.js';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import formatDate from '../utils/formatDate.js';

const FacePunchOutPage = () => {
  const videoRef = useRef();
  const streamRef = useRef(null);
  const [status, setStatus] = useState('Initializing...');
  const navigate = useNavigate();

  useEffect(() => {
    const setupAndPunchOut = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        setStatus('Detecting face...');

        const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions());
        if (!detection) {
          setStatus('No face detected. Please try again.');
          toast.error('No face detected. Please position your face in the camera.');
          return;
        }

        setStatus('Face detected. Getting location...');
        
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            try {
              setStatus('Processing punch-out...');
              await axios.post('/api/attendance/clockout', { location });
              toast.success('Punched out successfully!');
              navigate('/');
            } catch (err) {
              toast.error(err?.response?.data?.message || 'Punch-out failed.');
              setStatus('Error. Please try again.');
            }
          },
          () => {
            toast.error('Location access is required to punch out.');
            setStatus('Location access denied. Please enable and try again.');
          }
        );

      } catch (err) {
        setStatus('Error initializing. Check camera permissions.');
        toast.error('Could not start face punch-out setup.');
      }
    };

    setupAndPunchOut();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [navigate]);

  return (
    <FormContainer>
      <h1>Automatic Punch Out</h1>
      <p>Please look at the camera. The system will automatically punch you out.</p>
      <div className="d-flex justify-content-center my-3">
        <video ref={videoRef} width="480" height="360" autoPlay muted></video>
      </div>
      <Alert variant='info'>{status}</Alert>
    </FormContainer>
  );
};

export default FacePunchOutPage;