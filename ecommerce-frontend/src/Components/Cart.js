import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';

const Cart = () => {
  const { cart, setCart, updateQuantity, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Remove an item from the cart using its product id
  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  };

  // Calculate total price based on quantity of each product
  const totalPrice = Array.isArray(cart)
    ? cart.reduce((total, product) => {
        const price = parseFloat(product.price);
        return total + (isNaN(price) ? 0 : price * product.quantity);
      }, 0)
    : 0;
  const formattedTotalPrice = totalPrice && !isNaN(totalPrice)
    ? totalPrice.toFixed(2)
    : '0.00';

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Your Cart</h2>

      {/* Order Summary Card at the Top */}
      {Array.isArray(cart) && cart.length > 0 && (
        <Card className="mb-4 shadow-sm">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Total Price: ${formattedTotalPrice}</h4>
            <div>
              <Button 
                variant="outline-primary" 
                className="me-3 custom-outline-btn" 
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              <Link to="/checkout" className="btn custom-outline-btn">
                Proceed to Checkout
              </Link>
            </div>
          </Card.Body>
        </Card>
      )}

      {Array.isArray(cart) && cart.length === 0 ? (
        <Alert variant="warning">Your cart is empty.</Alert>
      ) : (
        <Row>
          {cart.map((product) => (
            <Col key={product.id} lg={3} md={4} sm={6} className="mb-4">
              <Card className="shadow-sm product-card h-100">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <Card.Img
                    variant="top"
                    src={
                      product.image && product.image.trim() !== ''
                        ? `http://127.0.0.1:8000${product.image}`
                        : 'http://127.0.0.1:8000/images/default.png'
                    }
                    alt={product.name}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="text-truncate">{product.description}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    {/* Apply the custom badge style */}
                    <span className="badge custom-badge">
                      Stock: {product.stock}
                    </span>
                  </div>
                  <div className="mt-2">
                    <Form.Label className="small">Quantity:</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) =>
                        updateQuantity(product.id, parseInt(e.target.value, 10))
                      }
                      size="sm"
                    />
                  </div>
                  <Card.Text className="mt-auto">
                    <strong>Subtotal:</strong> ${(product.price * product.quantity).toFixed(2)}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="w-100 custom-outline-btn"
                    onClick={() => handleRemoveFromCart(product.id)}
                  >
                    Remove from Cart
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Cart;
