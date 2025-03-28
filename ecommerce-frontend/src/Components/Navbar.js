// src/Components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const AppNavbar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">MyApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? 'nav-link active-nav-link' : 'nav-link'
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? 'nav-link active-nav-link' : 'nav-link'
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? 'nav-link active-nav-link' : 'nav-link'
              }
            >
              Orders
            </NavLink>
            {/* Add other nav links as needed */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
