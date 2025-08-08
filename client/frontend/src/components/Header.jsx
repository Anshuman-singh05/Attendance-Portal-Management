import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import useAuthStore from '../store/authStore.js';
import { useNavigate } from 'react-router-dom';
import axios from '../api.js';

const Header = () => {
  const { userInfo, logoutUser } = useAuthStore();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.post('/api/users/logout');
      logoutUser();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>Attendance Portal</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userInfo ? (
                // Agar user logged-in hai, toh yeh hissa dikhega
                <>
                  {/* User ka Naam waala Dropdown */}
                  <NavDropdown title={userInfo.name} id='username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/history'>
                      <NavDropdown.Item>History</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/myleaves'>
                      <NavDropdown.Item>My Leaves</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* Admin ka Dropdown (Sirf admin ko dikhega) */}
                  {userInfo.role === 'admin' && (
                    <NavDropdown title='Admin Panel' id='adminmenu'>
                      <LinkContainer to='/admin/dashboard'>
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/userlist'>
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/leavelist'>
                        <NavDropdown.Item>Leaves</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </>
              ) : (
                // Agar user logged-out hai, toh yeh hissa dikhega
                <>
                  <LinkContainer to='/login'>
                    <Nav.Link>Sign In</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/register'>
                    <Nav.Link>Sign Up</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;