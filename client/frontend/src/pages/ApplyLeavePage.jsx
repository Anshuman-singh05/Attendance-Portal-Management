import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer.jsx';
import { toast } from 'react-toastify';
import axios from '../api.js';
import { useNavigate } from 'react-router-dom';
import './ApplyLeavePage.css';


const ApplyLeavePage = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!fromDate || !toDate || !reason) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      await axios.post('/api/leaves', { fromDate, toDate, reason });
      toast.success('Leave applied successfully!');
      navigate('/history'); // User ko history page par bhej do
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not apply for leave');
    }
  };

  return (
    <FormContainer>
      <h1>Apply for Leave</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='fromDate'>
          <Form.Label>From Date</Form.Label>
          <Form.Control
            type='date'
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='toDate'>
          <Form.Label>To Date</Form.Label>
          <Form.Control
            type='date'
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='reason'>
          <Form.Label>Reason</Form.Label>
          <Form.Control
            as='textarea'
            rows={3}
            placeholder='Enter reason for leave'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3'>
          Apply
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ApplyLeavePage;