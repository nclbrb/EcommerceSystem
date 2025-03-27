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

    const existingProductIndex = cart.findIndex((item) => item.id === product.id);
    let updatedCart = [...cart];
    if (existingProductIndex >= 0) {
      updatedCart[existingProductIndex].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }
    setCart(updatedCart);
    setMessage(`${product.name} added to cart!`);
    setTimeout(() => setMessage(''), 2000);
  };

  // Handle delete product (for employees)
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${productId}`);
      setProducts(products.filter((product) => product.id !== productId));
      setMessage('Product deleted successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Delete Error:', error.response || error.message);
      setMessage('Failed to delete product.');
    }
  };

  // Handle update product (for employees)
  const handleUpdateProduct = async (product) => {
    const name = prompt('Enter new product name:', product.name);
    const description = prompt('Enter new product description:', product.description);
    const price = parseFloat(prompt('Enter new product price:', product.price));
    const stock = parseInt(prompt('Enter new product stock:', product.stock), 10);
    const image = prompt('Enter new product image URL:', product.image);

    if (!name || !description || !price || !stock || !image) {
      alert('All fields are required.');
      return;
    }

    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/products/${product.id}`, {
        name,
        description,
        price,
        stock,
        image,
      });
      setProducts(
        products.map((p) => (p.id === product.id ? response.data : p))
      );
      setMessage('Product updated successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Update Error:', error);
      setMessage('Failed to update product.');
    }
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
                  src={product.image && product.image.trim() !== '' ? product.image : '/images/default.png'}
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
                {user?.role === 'employee' && (
                  <div className="mt-2 d-flex justify-content-between">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleUpdateProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
