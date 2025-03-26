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
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card d-flex h-100 shadow-sm product-card">
              <img
                src={product.image}
                alt={product.name}
                className="card-img-top"
                height="200"
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">
                  <strong>Price: </strong>${product.price}
                </p>
                <p className="card-text">
                  <strong>Stock: </strong>{product.stock}
                </p>
                <button
                  className="btn btn-primary mt-auto"
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
