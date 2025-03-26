import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';

const EmployeeDashboard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  // ✅ Load products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${productId}`);
      setProducts(products.filter((product) => product.id !== productId));
      setMessage('Product deleted successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error(error);
      setMessage('Failed to delete product.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Employee Dashboard</h2>

      {/* ✅ Success Message */}
      {message && <div className="alert alert-success">{message}</div>}

      {/* ✅ Create Product Button */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setSelectedProduct(null);
          setShowForm(true);
        }}
      >
        Create Product
      </button>

      {/* ✅ Product Form for Create/Update */}
      {showForm && (
        <ProductForm
          product={selectedProduct}
          onSuccess={() => {
            fetchProducts(); // Reload after success
            setShowForm(false);
          }}
        />
      )}

      {/* ✅ Product List */}
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                {/* ✅ Edit Button */}
                <button
                  className="btn btn-warning me-2"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>

                {/* ✅ Delete Button */}
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDashboard;
