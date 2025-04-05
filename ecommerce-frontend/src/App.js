import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
  useNavigate,
  Navigate
} from 'react-router-dom';
import { Navbar, Nav, Container, Carousel, Button, Row, Col, Card, Badge } from 'react-bootstrap';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import DashboardCustomer from './Components/DashboardCustomer';
import DashboardEmployee from './Components/DashboardEmployee';
import Cart from './Components/Cart';
import CheckoutPage from './Components/CheckoutPage';
import OrderConfirmationPage from './Components/OrderConfirmationPage';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { CartProvider, CartContext } from './contexts/CartContext';
import './App.css';

function HomePage() {
  const { user } = useContext(AuthContext);
  
  if (user) {
    return user.role === 'employee' ? <Navigate to="/DashboardEmployee" /> : <Navigate to="/DashboardCustomer" />;
  }
  
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

function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  // Calculate total items in cart
  const totalItems = Array.isArray(cart)
    ? cart.reduce((acc, product) => acc + product.quantity, 0)
    : 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isEmployee = user && user.role === 'employee';
  const dashboardLink = isEmployee ? '/DashboardEmployee' : '/DashboardCustomer';

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="text-white">
          Online Shop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <span className="navbar-text text-white me-3">
                  Welcome, {user.name}
                </span>
                <NavLink
                  to={dashboardLink}
                  className={({ isActive }) =>
                    isActive ? 'nav-link active-nav-link' : 'nav-link'
                  }
                >
                  Products
                </NavLink>
                {
                }
                {!isEmployee && (
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active-nav-link' : 'nav-link'
                    }
                  >
                    Cart <Badge bg="secondary">{totalItems}</Badge>
                  </NavLink>
                )}
                {
                }
                <Nav.Link onClick={handleLogout} className="nav-link">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active-nav-link' : 'nav-link'
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active-nav-link' : 'nav-link'
                  }
                >
                  Register
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// Footer component
function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 p-4 text-center">
      <Container>
        <p>&copy; {new Date().getFullYear()} Online Shop. All Rights Reserved.</p>
      </Container>
    </footer>
  );
}

// Main App component
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
