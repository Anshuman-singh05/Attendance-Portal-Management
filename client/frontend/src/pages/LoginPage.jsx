import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from '../components/FormContainer.jsx';
import axios from '../api.js';
import useAuthStore from "../store/authStore.js";
import './LoginPage.css';
import {toast} from 'react-toastify';

const LoginPage=()=>{
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');

    const navigate= useNavigate();
    const {setUserInfo}=useAuthStore();

    const submitHandler= async(e)=>{
        e.preventDefault();
        try{
            const res= await axios.post('/api/users/login',{email,password});
            setUserInfo(res.data);
            navigate('/');
        } catch(err){
            const message= err.response?.data?.message || err.message ||'An unexpected error occurred';
            toast.error(message);
            // toast.error(err?.response?.data?.message || err.error)
            // console.error(err);
        }
    };

    return (
        <FormContainer>
            <h1>Sign In</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-2" controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="password">
                    <Form.Label>Password</Form.Label> 
                    <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary" className="mt-3">
                    Sign In
                </Button>
                
            </Form>
            <Row className="py-3">
                <Col>
                New Employee?<Link to='/register'>Register</Link>
                </Col>
                <Col className="text-end">
                    <Link to='/facelogin'>Login with your Face</Link>
                </Col>
            </Row>
        </FormContainer>
    );
};

export default LoginPage;
