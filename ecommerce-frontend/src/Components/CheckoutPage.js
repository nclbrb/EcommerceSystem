// src/Components/CheckoutPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartContext } from '../contexts/CartContext';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, ListGroup } from 'react-bootstrap';

const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const [payment, setPayment] = useState('');
  const navigate = useNavigate();

  // Calculate the total price of the cart
  const totalPrice = Array.isArray(cart)
    ? cart.reduce((total, product) => {
        const price = parseFloat(product.price);
        return total + (isNaN(price) ? 0 : price * product.quantity);
      }, 0)
    : 0;
  const formattedTotalPrice = totalPrice && !isNaN(totalPrice) ? totalPrice.toFixed(2) : '0.00';

  // Handle checkout submission with API call
  const handleCheckout = (e) => {
    e.preventDefault();

    if (!payment) {
      alert('Please select a payment method.');
      return;
    }

    // Retrieve token from localStorage and configure headers
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Transform cart items: rename 'id' to 'product_id' and ensure price is numeric
    const transformedCart = cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: parseFloat(item.price) || 0
    }));

    if (transformedCart.length === 0) {
      alert('Cart is empty.');
      return;
    }

    // Only send the cart and payment method.
    axios
      .post('http://127.0.0.1:8000/api/cart/checkout', 
        { 
          cart: transformedCart,
          payment    // Send payment method
        }, 
        config
      )
      .then((response) => {
        alert(response.data.message || 'Checkout successful! Thank you for your purchase.');
        clearCart(); // Clear the cart after a successful checkout
        navigate('/order-confirmation');
      })
      .catch((error) => {
        console.error("Checkout error:", error.response || error);
        alert('Checkout failed: ' + (error.response?.data.error || error.message));
      });
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Checkout</h2>
      <Row>
        {/* Payment Information */}
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Header as="h5">Payment Information</Card.Header>
            <Card.Body>
              <Form onSubmit={handleCheckout}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select 
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                    required
                  >
                    <option value="">Select a payment method</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="PayMaya">PayMaya</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Credit/Debit Card">Credit/Debit Card</option>
                    <option value="GCash">GCash</option>
                  </Form.Select>
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">
                  Complete Checkout
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Header as="h5">Your Order</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {Array.isArray(cart) && cart.map((product) => (
                  <ListGroup.Item key={product.id}>
                    {product.name} - ${product.price} x {product.quantity}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">Total: ${formattedTotalPrice}</span>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
