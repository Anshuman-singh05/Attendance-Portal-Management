import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer-main">
      <Container>
        <Row className="text-center text-md-start">
          {/* Section 1: About */}
          <Col md={4} className="mb-4">
            <h5>About Portal</h5>
            <p className="text-muted-footer">
              An intuitive solution to streamline attendance and leave management for modern teams.
            </p>
          </Col>

          {/* Section 2: Quick Links */}
          <Col md={2} className="mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><LinkContainer to='/'><a href='/'>Dashboard</a></LinkContainer></li>
              <li><LinkContainer to='/profile'><a href='/profile'>Profile</a></LinkContainer></li>
              <li><LinkContainer to='/history'><a href='/history'>History</a></LinkContainer></li>
            </ul>
          </Col>

          {/* Section 3: Contact Info */}
          <Col md={3} className="mb-4">
            <h5>Contact Info</h5>
            <ul className="list-unstyled footer-contact">
              <li> support@attendance.com</li>
              <li><FaPhone /> +91-XXXXXXXXXX</li>
            </ul>
          </Col>

          {/* Section 4: Follow Us */}
          <Col md={3} className="mb-4">
            <h5>Follow Us</h5>
            <div className="social-icons">
              <a href="#!"><FaFacebook /> Facebook</a>
              <a href="#!"><FaTwitter /> Twitter</a>
              <a href="#!"><FaLinkedin /> LinkedIn</a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="footer-bottom text-center">
            <p className="mb-0">&copy; {currentYear} Attendance Portal. Developed by Anshuman Singh.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;