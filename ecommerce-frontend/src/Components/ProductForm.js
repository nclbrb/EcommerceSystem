import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = ({ product, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
  });

  const [error, setError] = useState('');

  // ✅ Pre-fill form for editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image || '',
      });
    }
  }, [product]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      setError('All fields except image are required');
      return;
    }

    try {
      if (product) {
        // ✅ Update existing product
        await axios.put(`http://127.0.0.1:8000/api/products/${product.id}`, formData);
      } else {
        // ✅ Create new product
        await axios.post('http://127.0.0.1:8000/api/products', formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product');
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h4>{product ? 'Edit Product' : 'Create Product'}</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* ✅ Name */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="form-control mb-2"
          required
        />

        {/* ✅ Description */}
        <input
          type="text"
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
          className="form-control mb-2"
          required
        />

        {/* ✅ Price */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="form-control mb-2"
          required
        />

        {/* ✅ Stock */}
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          className="form-control mb-2"
          required
        />

        {/* ✅ Image URL */}
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <button type="submit" className="btn btn-success">
          {product ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => onSuccess()}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
