import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Carousel, Button, Row, Col, Card } from 'react-bootstrap';
import ProductList from './Components/ProductList';
import Cart from './Components/Cart';
import OrderConfirmationPage from './Components/OrderConfirmationPage'; 
import CheckoutPage from './Components/CheckoutPage';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import './App.css'; 

// HomePage with Carousel and Feature Cards
function HomePage() {
  return (
    <>
//       <Carousel indicators={true} controls={true}>
//         <Carousel.Item>
//           <img
            className="d-block w-100"
            src="/images/slide1.png"
            alt="Welcome Slide"
            style={{ height: "392px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3 style={{ color: "black" }}>Discover Our Latest Collection</h3>
            <p style={{ color: "black" }}>
              Explore exclusive deals and the newest arrivals!
            </p>
            <Button variant="primary" as={Link} to="/register">
              Join Now
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/slide2.png"
            alt="Offers Slide"
            style={{ height: "392px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3 style={{ color: "black" }}>Exclusive Offers</h3>
            <p style={{ color: "black" }}>
              Enjoy amazing discounts and offers only here.
            </p>
            <Button variant="success" as={Link} to="/login">
              Login to Shop
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/slide3.png"
            alt="Guaranteed Shipping"
            style={{ height: "392px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3 style={{ color: "black" }}>Guaranteed Shipping, Guaranteed Satisfaction</h3>
            <p style={{ color: "black" }}>
              Experience fast, secure delivery with our ironclad guarantee for every order.
            </p>
            <Button variant="info" as={Link} to="/register">
              Learn More
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <Container className="mt-5">
         <Row className="text-center">
           <Col md={4}>
             <Card className="mb-4 shadow-sm">
               <Card.Body>
                <Card.Title>Quality Products</Card.Title>
                 <Card.Text>
                   We offer the best quality products to suit your lifestyle.
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

// Footer Component
function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 p-4 text-center">
      <Container>
        <p>&copy; {new Date().getFullYear()} eCommerce. All Rights Reserved.</p>
      </Container>
    </footer>
  );
}

function App() {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : []; // Fallback to empty array if no cart in localStorage
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return []; // Return empty array if there's an error
    }
  });

  // Update cart in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage
  }, [cart]);

  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
          <Container>
            <Navbar.Brand as={Link} to="/">
              eCommerce
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/products">Products</Nav.Link> {/* Added Products link */}
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/cart">
                  Cart ({cart.length}) {/* Show number of items in the cart */}
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductList cart={cart} setCart={setCart} />} /> {/* Added Route for ProductList */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} /> {/* Added Route for Cart */}
          <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} />} /> {/* Added CheckoutPage route */}
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} /> {/* Added OrderConfirmationPage route */}
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
