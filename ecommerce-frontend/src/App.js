// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { Navbar, Nav, Container, Carousel, Button, Row, Col, Card, Badge } from 'react-bootstrap';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import DashboardCustomer from './Components/DashboardCustomer';
import DashboardEmployee from './Components/DashboardEmployee'; // Import employee dashboard
import Cart from './Components/Cart';
import CheckoutPage from './Components/CheckoutPage';
import OrderConfirmationPage from './Components/OrderConfirmationPage';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { CartProvider, CartContext } from './contexts/CartContext';
import './App.css';

// HomePage component with Carousel and Feature Cards
function HomePage() {
  const { user } = useContext(AuthContext);
  
  // If user is logged in, redirect them to the appropriate dashboard
  if (user) {
    return user.role === 'employee' ? <Navigate to="/DashboardEmployee" /> : <Navigate to="/DashboardCustomer" />;
  }
  
  // Define captions based on login status (for non-authenticated users)
  const slides = [
    {
      image: "/images/slide1.jpg",
      title: "Discover Our Latest Collection",
      text: "Explore exclusive deals and the newest arrivals!",
      button: { variant: "primary", text: "Join Now", link: "/register" },
    },
    {
      image: "/images/slide2.jpg",
      title: "Exclusive Offers",
      text: "Enjoy amazing discounts and offers only here.",
      button: { variant: "success", text: "Login to Shop", link: "/login" },
    },
    {
      image: "/images/slide3.jpg",
      title: "Guaranteed Shipping, Guaranteed Satisfaction",
      text: "Experience fast, secure delivery with our ironclad guarantee for every order.",
      button: { variant: "info", text: "Learn More", link: "/register" },
    },
  ];

  return (
    <>
     <Carousel indicators={true} controls={true}>
      {slides.map((slide, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={slide.image}
            alt={`Slide ${index + 1}`}
            style={{ height: "435px", objectFit: "cover" }}
          />
          <Carousel.Caption
           style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '2.5rem',
            width: '100%',
            left: 0,
            right: 0,
            bottom: 0,
          }}
          >
            <h3 style={{ color: "black" }}>{slide.title}</h3>
            <p style={{ color: "black" }}>{slide.text}</p>
            {slide.button && (
              <Button variant={slide.button.variant} as={Link} to={slide.button.link}>
                {slide.button.text}
              </Button>
            )}
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>

      <Container className="mt-5">
        <Row className="text-center">
          <Col md={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title>Quality Products</Card.Title>
                <Card.Text>
                  We offer the best quality products to suit you best!.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title>Secure Payment</Card.Title>
                <Card.Text>
                  Enjoy a secure and hassle-free payment process.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title>Fast Delivery</Card.Title>
                <Card.Text>
                  Get your orders delivered to your doorstep quickly.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

// Header component with cart counter styled as in DashboardCustomer
function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  // Calculate total items in cart (sum of quantities)
  const totalItems = Array.isArray(cart)
    ? cart.reduce((acc, product) => acc + product.quantity, 0)
    : 0;

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home after logout
  };

  const isEmployee = user && user.role === 'employee';
  const dashboardLink = isEmployee ? '/DashboardEmployee' : '/DashboardCustomer';

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-white">
          eCommerce
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <span className="navbar-text text-white me-3">
                  Welcome, {user.name}
                </span>
                <Nav.Link as={Link} to={dashboardLink}>Products</Nav.Link>
                {/* Only show Cart link for customers */}
                {!isEmployee && (
                  <Button
                    variant="info"
                    onClick={() => navigate('/cart')}
                    className="ms-3"
                  >
                    Cart <Badge bg="secondary">{totalItems}</Badge>
                  </Button>
                )}
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// Footer component to display at the bottom of every page
function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 p-4 text-center">
      <Container>
        <p>&copy; {new Date().getFullYear()} eCommerce. All Rights Reserved.</p>
      </Container>
    </footer>
  );
}

// Main App component wrapped in AuthProvider and CartProvider with flex styling to push footer down
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* Routes for dashboards */}
                <Route path="/DashboardCustomer" element={<DashboardCustomer />} />
                <Route path="/DashboardEmployee" element={<DashboardEmployee />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
