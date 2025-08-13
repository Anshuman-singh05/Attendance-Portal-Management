import React, { useState, useEffect } from 'react';
import { Table, Container, Alert, Badge, Button, Collapse } from 'react-bootstrap';
import axios from '../api.js';
import { toast } from 'react-toastify';
import './HistoryPage.css';
import formatDate from '../utils/formatDate.js';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState({}); // Har row ke dropdown ka state

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/attendance/history');
        setHistory(res.data);
      } catch (err) {
        toast.error('Could not fetch history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const toggleOpen = (id) => {
    setOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return <p>Loading history...</p>;
  }

  const getFirstPunchIn = (punches) => punches && punches.length > 0 ? punches[0].punchInTime : null;
  const getLastPunchOut = (punches) => {
    if (!punches || punches.length === 0) return null;
    const lastPunch = punches[punches.length - 1];
    return lastPunch.punchOutTime || null;
  };

  return (
    <Container className='mt-5'>
      <h1>My Attendance History</h1>
      {history.length === 0 ? (
        <Alert variant='info'>No attendance records found.</Alert>
      ) : (
        <Table striped bordered hover responsive className='table-sm history-table'>
          <thead>
            <tr>
              <th>DATE</th>
              <th>FIRST PUNCH IN</th>
              <th>LAST PUNCH OUT</th>
              <th>STATUS</th>
              <th>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => {
              const firstPunchIn = getFirstPunchIn(record.punches);
              const lastPunchOut = getLastPunchOut(record.punches);

              return (
                <React.Fragment key={record._id}>
                  <tr>
                    <td>{formatDate(record.date)}</td>
                    <td>{firstPunchIn ? new Date(firstPunchIn).toLocaleTimeString() : 'N/A'}</td>
                    <td>{lastPunchOut ? new Date(lastPunchOut).toLocaleTimeString() : 'N/A'}</td>
                    <td><Badge bg="success">{record.status}</Badge></td>
                    <td>
                      <Button
                        onClick={() => toggleOpen(record._id)}
                        aria-controls={`collapse-${record._id}`}
                        aria-expanded={open[record._id]}
                        size="sm"
                      >
                        View Punches
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="p-0 border-0">
                      <Collapse in={open[record._id]}>
                        <div id={`collapse-${record._id}`} className="p-3 bg-light">
                          <h6>Punches for{formatDate(record.date)}:</h6>
                          {record.punches && record.punches.length > 0 ? (
                            record.punches.map((punch, index) => (
                             <p key={index} className="mb-1">
                                <strong>Punch {index + 1}:</strong> In at {new Date(punch.punchInTime).toLocaleTimeString()} 
                                {punch.punchOutTime ? ` - Out at ${new Date(punch.punchOutTime).toLocaleTimeString()}` : ' - (Not punched out yet)'}
                             </p>
                            ))
                          ) : (
                            <p>No punch data for this day.</p>
                          )}
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default HistoryPage;