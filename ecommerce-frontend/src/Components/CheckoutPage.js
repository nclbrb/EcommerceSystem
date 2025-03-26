// src/Components/CheckoutPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartContext } from '../contexts/CartContext';

const CheckoutPage = () => {
  const { cart, setCart } = useContext(CartContext);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
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

  // Handle checkout submission
  const handleCheckout = (e) => {
    e.preventDefault();

    if (!name || !address || !payment) {
      alert('Please fill all the fields.');
      return;
    }

    // Simulate a payment process
    alert(`Checkout successful! Thank you for your purchase using ${payment}.`);

    // Clear the cart after checkout
    setCart([]);

    // Redirect to the order confirmation page
    navigate('/order-confirmation');
  };

  return (
    <div className="container mt-5">
      <h2>Checkout</h2>
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Billing Information</h4>
          <form onSubmit={handleCheckout}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Payment Method</label>
              <select
                className="form-control"
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
              </select>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Complete Checkout
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <h4>Your Order</h4>
          <ul>
            {Array.isArray(cart) && cart.map((product) => (
              <li key={product.id}>
                {product.name} - ${product.price} x {product.quantity}
              </li>
            ))}
          </ul>
          <h5>Total: ${formattedTotalPrice}</h5>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
