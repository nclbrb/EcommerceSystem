// src/Components/Cart.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';

const Cart = () => {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const handleRemoveFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalPrice = Array.isArray(cart)
    ? cart.reduce((total, product) => {
        const price = parseFloat(product.price);
        return total + (isNaN(price) ? 0 : price * product.quantity);
      }, 0)
    : 0;
  const totalItems = Array.isArray(cart) ? cart.reduce((sum, product) => sum + product.quantity, 0) : 0;
  const formattedTotalPrice = totalPrice && !isNaN(totalPrice) ? totalPrice.toFixed(2) : '0.00';

  return (
    <div className="container">
      <h2 className="my-4">Your Cart</h2>
      {Array.isArray(cart) && cart.length === 0 ? (
        <div className="alert alert-warning">Your cart is empty.</div>
      ) : (
        <div className="row">
          {Array.isArray(cart) &&
            cart.map((product, index) => (
              <div className="col-md-4 mb-4" key={product.id}>
                <div className="card d-flex h-100 shadow-sm cart-card">
                  <img
                    src={product.image || '/images/placeholder.png'}
                    alt={product.name}
                    className="card-img-top"
                    height="200"
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text">
                      <strong>Price: </strong>${product.price} x {product.quantity}
                    </p>
                    <button
                      className="btn btn-danger mt-auto"
                      onClick={() => handleRemoveFromCart(index)}
                    >
                      Remove from Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
      {Array.isArray(cart) && cart.length > 0 && (
        <div className="text-center">
          <h3>Total Items: {totalItems}</h3>
          <h3>Total Price: ${formattedTotalPrice}</h3>
          <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-warning me-3" onClick={handleClearCart}>
              Clear Cart
            </button>
            <Link to="/checkout" className="btn btn-primary">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
