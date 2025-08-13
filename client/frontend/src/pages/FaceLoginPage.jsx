import React, { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-bootstrap';
import FormContainer from '../components/FormContainer.jsx';
import { toast } from 'react-toastify';
import axios from '../api.js';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import * as faceapi from 'face-api.js';

const FaceLoginPage = () => {
  const videoRef = useRef();
  const intervalRef = useRef();
  const streamRef = useRef(null);
  const [status, setStatus] = useState('Initializing...');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo } = useAuthStore();

  // Stop video & interval instantly
  const stopVideoAndInterval = () => {
    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Stop all tracks (camera LED off)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    // Reset video element completely
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.removeAttribute('src'); // Safari/Chrome fix
      videoRef.current.load();
    }
  };

  useEffect(() => {
    const setupFaceAPI = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setStatus('Error initializing. Check camera permissions.');
        toast.error('Could not start face login setup.');
      }
    };
    setupFaceAPI();

    // Cleanup on unmount
    return () => {
      stopVideoAndInterval();
    };
  }, []);

  const handleVideoPlay = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setStatus('Fetching known faces...');
    try {
      const res = await axios.get('/api/users/faces');
      if (res.data.length === 0) {
        setStatus('No faces registered in the system.');
        stopVideoAndInterval(); // stop if no faces
        return;
      }
      const labeledFaceDescriptors = res.data.map(user => (
        new faceapi.LabeledFaceDescriptors(user.email, [new Float32Array(user.faceDescriptor)])
      ));
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
      setStatus('Ready to scan. Look at the camera.');

      intervalRef.current = setInterval(async () => {
        if (videoRef.current && !isProcessing) {
          setIsProcessing(true);
          const detection = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();
          
          if (detection) {
            const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
            
            if (bestMatch.label !== 'unknown') {
              setStatus(`Welcome, ${bestMatch.label}! Getting location...`);
              stopVideoAndInterval(); // instantly stop LED

              navigator.geolocation.getCurrentPosition(
                async (position) => {
                  const location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                  const browser = navigator.userAgent;
                  const device = 'Web Browser';
                  try {
                    setStatus('Logging in...');
                    const loginRes = await axios.post('/api/users/facelogin', { 
                      email: bestMatch.label, location, browser, device 
                    });
                    setUserInfo(loginRes.data);
                    navigate('/');
                  } catch (loginErr) {
                     setStatus('Login failed. Please try again.');
                     toast.error(loginErr?.response?.data?.message || 'Login Failed');
                  }
                }, 
                () => {
                  setStatus('Login failed. Location access is required.');
                  toast.error('Location access is required to log in.');
                }
              );
            } else {
              setStatus('Face detected, but not recognized.');
            }
          } else {
            setStatus('No face detected.');
          }
          setIsProcessing(false);
        }
      }, 2000);

    } catch (err) {
      toast.error('Could not fetch face data from server.');
      setStatus('Error. Please refresh the page.');
      stopVideoAndInterval(); // stop on error
    }
  };

  return (
    <FormContainer>
      <h1>Face Login</h1>
      <p>The system will automatically log you in when it recognizes your face.</p>
      <div className="d-flex justify-content-center my-3">
        <video 
          ref={videoRef} 
          width="480" 
          height="360" 
          autoPlay 
          muted 
          onPlay={handleVideoPlay}
        ></video>
      </div>
      <Alert variant='info'>{status}</Alert>
    </FormContainer>
  );
};

export default FaceLoginPage;
