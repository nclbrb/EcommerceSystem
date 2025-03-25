// src/Components/LoginPage.js
import React, { useState, useContext } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState(null);
  const [variant, setVariant]   = useState('');
  const { login }               = useContext(AuthContext);
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
      // Assume the response contains user details (e.g., name, email) along with token.
      // You might need to adjust according to your API response.
      login(response.data.user, response.data.token);
      setMessage(response.data.message);
      setVariant('success');
      // Redirect after login
      navigate('/');
    } catch (error) {
      console.error(error);
      setMessage('Login failed. Please check your credentials.');
      setVariant('danger');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow border-0">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              {message && <Alert variant={variant}>{message}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="loginEmail" className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="loginPassword" className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 py-2">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="text-center mt-3">
            <small>
              Don't have an account? <Link to="/register">Register here</Link>
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
