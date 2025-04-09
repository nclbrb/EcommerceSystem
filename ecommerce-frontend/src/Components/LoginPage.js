import React, { useState, useContext } from 'react';
import '../App.css';
import { Container, Form, Button, Alert, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function LoginPage() {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage]         = useState(null);
  const [variant, setVariant]         = useState('');
  const { login }                     = useContext(AuthContext);
  const navigate                      = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
      const user  = response.data.user;
      const token = response.data.token;

      login(user, token);
      setMessage(response.data.message);
      setVariant('success');

      if (user.role === 'employee') {
        navigate('/DashboardEmployee');
      } else {
        navigate('/DashboardCustomer');
      }
    } catch (error) {
      console.error(error);
      setMessage('Login failed. Please check your credentials.');
      setVariant('danger');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '75vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={4}>
          <Card className="shadow border-2 login-card">
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
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ borderLeft: 'none' }}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Button className="w-100 py-2 login-btn" type="submit">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="text-center mt-3">
            <medium>
              Don't have an account? <Link to="/register">Register here</Link>
            </medium>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;