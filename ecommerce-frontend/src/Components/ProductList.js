// src/Components/ProductList.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';

const ProductList = () => {
  const { user } = useContext(AuthContext);
  const { cart, setCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState('');
  const [message, setMessage]   = useState('');

  // Fetch products from API
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/products')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Add product to cart with feedback
  const handleAddToCart = (product) => {
    if (!user) {
      alert("Please login to add products to your cart.");
      return;
    }

    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    let updatedCart = [];
    if (existingProductIndex >= 0) {
      updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updatedCart);
    setMessage(`${product.name} added to cart!`);
    setTimeout(() => setMessage(''), 2000);
  };

  if (loading) return <div className="alert alert-info">Loading products...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  // Filter products based on search input
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or description..."
          value={search}
          onChange={handleSearch}
        />
      </div>
      {message && <div className="alert alert-success">{message}</div>}
      <div className="row">
        {filteredProducts.map((product) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product.id}>
            <div className="card product-card border-0 shadow-sm">
              <div className="overflow-hidden" style={{ height: '200px' }}>
                <img
                  src={product.image || '/images/default.png'}
                  alt={product.name}
                  className="card-img-top"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-truncate">{product.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">${parseFloat(product.price).toFixed(2)}</span>
                  <span className="badge bg-success">Stock: {product.stock}</span>
                </div>
              </div>
              <div className="card-footer bg-transparent border-0">
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
