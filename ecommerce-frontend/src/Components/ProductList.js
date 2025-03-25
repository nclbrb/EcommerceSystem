import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductList = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Fetch products from the API
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

  // Search functionality
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Add to Cart function
  const handleAddToCart = (product) => {
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex >= 0) {
      // If the product exists in the cart, increment the quantity
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // If product does not exist, add it with quantity 1
      const newProduct = { ...product, quantity: 1 };
      setCart([...cart, newProduct]);
    }
  };

  if (loading) return <div className="alert alert-info">Loading products...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

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
                  onClick={() => handleAddToCart(product)} // Add product to cart
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
