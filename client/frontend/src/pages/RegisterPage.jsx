import { useState } from "react";
import{Link, useNavigate} from "react-router-dom";
import { Form, Button, Row, Col} from "react-bootstrap";
import FormContainer from "../components/FormContainer.jsx";
import axios from "../api.js";
import useAuthStore from "../store/authStore.js";
import './RegisterPage.css';
import {toast} from 'react-toastify';

const RegisterPage= ()=>{
    const[name, setName]= useState('');
    const[email, setEmail]= useState('');
    const[password,setPassword]= useState('');
    const[confirmPassword, setConfirmPassword]= useState('');

    const navigate= useNavigate();
    const {setUserInfo}= useAuthStore();

    const submitHandler= async(e)=>{
        e.preventDefault();
        if(!name || !email || !password){
            toast.error('Please fill all fields');
            return;
        }
        if(password!== confirmPassword){
            toast.error('Passwords do not match');
            return;
        }
            try{
                const res= await axios.post('/api/users',{name,email,password});
                setUserInfo(res.data);
                navigate('/');
            }catch(err){
                toast.error(err?.response?.data?.message || err.error);
            }
        
    };

    return(
        <FormContainer>
            <h1>Sign Up</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-2" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

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
                    placeholder="Enter password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='confirmPassword'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                    type='password'
                    placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary" className="mt-3">
                    Sign Up
                </Button>
            </Form>

            <Row className="py-3">
                <Col>
                Already have an account?<Link to='/login'>Login</Link>
                </Col>
            </Row>
        </FormContainer>
    );
};

export default RegisterPage;