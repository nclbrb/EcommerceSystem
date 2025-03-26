// OrderConfirmationPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmationPage = () => {
  return (
    <div className="container mt-5 text-center">
      <h2>Thank You for Your Order!</h2>
      <p>Your order has been successfully processed.</p>
      <Link to="/" className="btn btn-primary mt-3">Go to Home</Link>
    </div>
  );
};

export default OrderConfirmationPage;