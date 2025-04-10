import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardCustomer = () => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState('');

  // Fetch products from the backend
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch products.');
        setLoading(false);
      });
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Filter products based on search input
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
  );

  // Add product to cart (always adds 1 unit)
  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <Container className="mt-4">
      <h2>Products</h2>
      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by name or description..."
          value={search}
          onChange={handleSearch}
        />
      </Form.Group>
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger" className="my-4">{error}</Alert>
      ) : (
        <Row className="mt-3">
          {filteredProducts.map((product) => (
            <Col key={product.id} lg={3} md={4} sm={6} className="mb-4">
              <Card className="shadow-sm product-card">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <Card.Img
                    variant="top"
                    src={
                      product.image && product.image.trim() !== ''
                        ? `http://127.0.0.1:8000${product.image}`
                        : 'http://127.0.0.1:8000/images/default.png'
                    }
                    alt={product.name}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="text-truncate">
                    {product.description}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">
                      PHP{parseFloat(product.price).toFixed(2)}
                    </span>
                    {/* Apply the custom badge style */}
                    <span className="badge custom-badge">
                      Stock: {product.stock}
                    </span>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0">
                  {/* Apply the custom button class */}
                  <Button 
                    variant="outline-primary" 
                    className="w-100 custom-outline-btn" 
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default DashboardCustomer;
