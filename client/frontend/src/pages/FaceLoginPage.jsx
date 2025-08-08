import React, { useState, useEffect, useRef } from 'react';
import { Container, Alert } from 'react-bootstrap';
import FormContainer from '../components/FormContainer.jsx';
import { toast } from 'react-toastify';
import axios from '../api.js';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import * as faceapi from 'face-api.js';

const FaceLoginPage = () => {
  const videoRef = useRef();
  const intervalRef = useRef();
  const streamRef = useRef(null); // Hum stream ko yahan store karenge
  const [status, setStatus] = useState('Initializing...');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo } = useAuthStore();

  useEffect(() => {
    const startFaceLogin = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);
        startVideo();
      } catch (err) {
        setStatus('Could not load models. Please refresh.');
        toast.error('Could not load face recognition models.');
      }
    };
    startFaceLogin();

    // Sahi Cleanup function (Component hatne par yeh chalega)
    return () => {
      clearInterval(intervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current= null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream; // Stream ko ref mein save karein
        }
      })
      .catch((err) => {
        setStatus('Could not access webcam.');
        toast.error('Could not access webcam');
      });
  };
  
  const handleVideoPlay = async () => {
    setStatus('Fetching known faces...');
    try {
      const res = await axios.get('/api/users/faces');
      if (res.data.length === 0) {
        setStatus('No faces registered in the system.');
        return;
      }

      const labeledFaceDescriptors = res.data.map(user => {
        const descriptor = new Float32Array(user.faceDescriptor);
        return new faceapi.LabeledFaceDescriptors(user.email, [descriptor]);
      });

      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
      setStatus('Ready to scan. Look at the camera.');

      intervalRef.current = setInterval(async () => {
        if (videoRef.current && !isProcessing) {
          setIsProcessing(true);
          const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
          
          if (detection) {
            const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
            
            if (bestMatch.label !== 'unknown') {
              setStatus(`Welcome, ${bestMatch.label}! Logging in...`);
              clearInterval(intervalRef.current);
              try {
                const loginRes = await axios.post('/api/users/facelogin', { email: bestMatch.label });
                setUserInfo(loginRes.data);
                navigate('/');
              } catch (loginErr) {
                 setStatus('Login failed. Please try again.');
                 toast.error('Login failed.');
              }
            } else {
               setStatus('Face detected, but not recognized.');
            }
          }
          setIsProcessing(false);
        }
      }, 2000);

    } catch (err) {
      toast.error('Could not fetch face data from server.');
      setStatus('Error. Please refresh the page.');
    }
  };

  return (
    <FormContainer>
      <h1>Face Login</h1>
      <p>The system will automatically log you in when it recognizes your face.</p>
      <div className="d-flex justify-content-center my-3">
        <video ref={videoRef} width="480" height="360" autoPlay muted onPlay={handleVideoPlay}></video>
      </div>
      <Alert variant='info'>{status}</Alert>
    </FormContainer>
  );
};

export default FaceLoginPage;