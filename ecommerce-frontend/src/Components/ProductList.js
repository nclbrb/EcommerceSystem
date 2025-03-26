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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e) => setSearch(e.target.value);

  // Add product to cart with feedback
  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please login to add products to your cart.');
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

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    console.log('Deleting product ID:', productId); // ✅ Check if ID is logged
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
  
  // Handle create product
  const handleCreateProduct = async () => {
    const name = prompt('Enter product name:');
    const description = prompt('Enter product description:');
    const price = parseFloat(prompt('Enter product price:'));
    const stock = parseInt(prompt('Enter product stock:'), 10);
    const image = prompt('Enter product image URL:');

    if (!name || !description || !price || !stock || !image) {
      alert('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/products', {
        name,
        description,
        price,
        stock,
        image,
      });
      setProducts([...products, response.data]);
      setMessage('Product created successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error(error);
      setMessage('Failed to create product.');
    }
  };

  // Handle update product
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
      console.error(error);
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
      {user?.role === 'employee' && (
        <button className="btn btn-success mb-3" onClick={handleCreateProduct}>
          + Add New Product
        </button>
      )}

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by name or description..."
        value={search}
        onChange={handleSearch}
      />

      {message && <div className="alert alert-success">{message}</div>}

      <div className="row">
        {filteredProducts.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card d-flex h-100 shadow-sm">
              <img src={product.image} alt={product.name} className="card-img-top" height="200" />
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

                {/* Show CRUD buttons only for employees */}
                {user?.role === 'employee' && (
                  <div className="mt-2">
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleUpdateProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
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
