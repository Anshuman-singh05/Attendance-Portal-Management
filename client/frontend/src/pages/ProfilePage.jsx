import React from "react";
import { useState,useEffect, useRef } from "react";
import { Form, Button, Container } from "react-bootstrap";
import FormContainer from "../components/FormContainer.jsx";
import useAuthStore from "../store/authStore.js";
import { toast } from "react-toastify";
import axios from '../api.js';
import './ProfilePage.css';
import * as faceapi from 'face-api.js';

const ProfilePage=()=>{

    const[name, setName]= useState('');
    const[email, setEmail]= useState('');
    const[password, setPassword]= useState('');
    const[confirmPassword, setConfirmPassword]= useState('');
    

    const videoRef= useRef();
    const streamRef= useRef(null);

    const {userInfo,setUserInfo}= useAuthStore();
    
    //Face API MODEL LOAD

    useEffect(()=>{
        const loadModels= async()=>{
            try{
                console.log("Loading Models...");
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                ]);
                startVideo();
                console.log("Models loaded Successfully.");
            }catch(error){
                console.error("Error loading models:",error);
                toast.error("Could not load face recognition models.");
            }
        };
        loadModels();

         return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
          if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject = null; // <-- Yeh aakhri trick hai
          }
        }
    }, []);

    //StartWEB CAM

    const startVideo= ()=>{
        navigator.mediaDevices.getUserMedia({video:true})
        .then((stream)=>{
            if(videoRef.current){
                videoRef.current.srcObject= stream;
                streamRef.current= stream;
            }
        })
        .catch((err)=>{
            console.error('Error accessing webcam:',err)
            toast.error('Could not access webcam');
        });
    };
    
    useEffect(()=>{
        if(userInfo){
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo]);

    const submitHandler= async(e)=>{
        e.preventDefault();
        if(password!==confirmPassword){
            toast.error('Passwords do not match');
        }else{
            try{
                const res= await axios.put('/api/users/profile',{
                    _id: userInfo._id,
                    name,
                    email,
                    password,
                });
                setUserInfo(res.data);
                toast.success('Profile Updated Successfully!');
            }catch(err){
                toast.error(err?.response?.data?.message || 'An error occurred');
            }
        }
    };

    const captureHandler= async()=>{
        if(videoRef.current){
            toast.info('Detecting face...Please wait.');
            const detections= await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

            if(detections){
                const descriptorArray= Array.from(detections.descriptor);
                try{
                    await axios.put('/api/users/profile/addface',{faceDescriptor: descriptorArray});
                    toast.success('Face registered successfully!');
                }catch(err){
                    toast.error(err?.response?.data?.message || 'Could not save face data.');
                    
                }
            }else{
                toast.error('No Face detected. Please look directly at the camera.');
            }
        }
    };

   return (
    <Container>
    <FormContainer>
      <h1>Update Profile</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter new password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3'>
          Update
        </Button>
      </Form>
    </FormContainer>

    {/*face Registration */}
    <FormContainer>
        <h2 className='mt-5'>Register Your Face</h2>
        <p>Look directly at the camera and click capture.</p>
        <div className="d-flex justify-content-center my-3">
          <video ref={videoRef} width="320" height="240" autoPlay muted></video>
        </div>
        <Button variant='info' className='w-100' onClick={captureHandler}>
          Capture & Save Face
        </Button>
      </FormContainer>


    </Container>
  );
};

export default ProfilePage;