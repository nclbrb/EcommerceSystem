import { useState } from 'react';
import axios from 'axios';

const AddProduct = ({ onProductAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Get token from localStorage after login
      const response = await axios.post('http://127.0.0.1:8000/api/products', {
        name,
        description,
        price,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onProductAdded(response.data);
      setName('');
      setDescription('');
      setPrice('');
      setQuantity('');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required type="number" />
      <input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" required type="number" />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;
