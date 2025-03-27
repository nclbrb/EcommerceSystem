// src/Components/DashboardEmployee.js
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Form, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { AddProductModal, EditProductModal } from './ProductModals'; // Import the modals

const DashboardEmployee = () => {
  // Retrieve token from localStorage
  const token = localStorage.getItem('token');
  const config = { headers: { 'Authorization': `Bearer ${token}` } };

  // State for orders (for order monitoring)
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  // State for products (for product management)
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // States for the Add Product modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', description: '', stock: '', image: '',
  });

  // States for the Edit Product modal
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState({
    name: '', price: '', description: '', stock: '', image: '',
  });

  // State for the checkout filter date
  const [filterDate, setFilterDate] = useState('');

  // Fetch orders for monitoring (all orders)
  const fetchOrders = () => {
    axios
      .get('http://127.0.0.1:8000/api/orders', config)
      .then((response) => {
        setOrders(response.data);
        setLoadingOrders(false);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error.response || error);
        setOrdersError('Failed to fetch orders.');
        setLoadingOrders(false);
      });
  };

  // Fetch orders filtered by date
  const fetchOrdersByDate = (date) => {
    axios
      .get(`http://127.0.0.1:8000/api/orders/filter/${date}`, config)
      .then((response) => {
        setOrders(response.data);
        setLoadingOrders(false);
      })
      .catch((error) => {
        console.error('Error fetching filtered orders:', error.response || error);
        setOrdersError('Failed to fetch orders for the selected date.');
        setLoadingOrders(false);
      });
  };

  // Initial fetch of orders
  useEffect(() => {
    fetchOrders();
  }, [config]);

  // Function to fetch products for management
  const fetchProducts = () => {
    axios
      .get('http://127.0.0.1:8000/api/products', config)
      .then((response) => {
        setProducts(response.data);
        setLoadingProducts(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error.response || error);
        setProductsError('Failed to fetch products.');
        setLoadingProducts(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [config]);

  // Handler to add a new product (with default image fallback)
  const handleAddProduct = () => {
    const productToAdd = {
      ...newProduct,
      image: newProduct.image.trim() === '' ? '/images/default.png' : newProduct.image,
    };

    axios
      .post('http://127.0.0.1:8000/api/products', productToAdd, config)
      .then(() => {
        fetchProducts();
        setShowAddModal(false);
        setNewProduct({ name: '', price: '', description: '', stock: '', image: '' });
      })
      .catch((error) => {
        console.error('Error adding product:', error.response || error);
        alert('Failed to add product.');
      });
  };

  // Handler to update an existing product
  const handleEditProduct = () => {
    if (!editingProduct) return;
    axios
      .put(`http://127.0.0.1:8000/api/products/${editingProduct.id}`, editProduct, config)
      .then(() => {
        fetchProducts();
        setShowEditModal(false);
        setEditingProduct(null);
        setEditProduct({ name: '', price: '', description: '', stock: '', image: '' });
      })
      .catch((error) => {
        console.error('Error updating product:', error.response || error);
        alert('Failed to update product.');
      });
  };

  // Handler to delete a product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios
        .delete(`http://127.0.0.1:8000/api/products/${productId}`, config)
        .then(() => {
          fetchProducts();
        })
        .catch((error) => {
          console.error('Error deleting product:', error.response || error);
          alert('Failed to delete product.');
        });
    }
  };

  // Open the edit modal and pre-fill with the selected product's data
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      image: product.image || '',
    });
    setShowEditModal(true);
  };

  // Handler for filtering orders by date
  const handleFilterOrders = () => {
    if (filterDate.trim() === '') {
      fetchOrders();
    } else {
      setLoadingOrders(true);
      fetchOrdersByDate(filterDate);
    }
  };

  // Handler for resetting the order filter
  const handleResetFilter = () => {
    setFilterDate('');
    setLoadingOrders(true);
    fetchOrders();
  };

  return (
    <Container className="mt-4">
      <h3>Employee Dashboard</h3>

      {/* Orders Section */}
      <section className="mt-5">
        <h4>Orders</h4>
        <Form className="mb-3">
          <Row>
            <Col md={4}>
              <Form.Group controlId="filterDate">
                <Form.Label>Filter by Date:</Form.Label>
                <Form.Control
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="primary" onClick={handleFilterOrders} className="me-2">
                Filter
              </Button>
              <Button variant="secondary" onClick={handleResetFilter}>
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
        {loadingOrders ? (
          <div className="text-center my-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : ordersError ? (
          <Alert variant="danger">{ordersError}</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Customer</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                // Compute product names and quantities separately from order_details
                const productNames =
                  order.order_details && order.order_details.length
                    ? order.order_details
                        .map((detail) =>
                          detail.product && detail.product.name
                            ? detail.product.name
                            : `Unknown (ID: ${detail.product_id})`
                        )
                        .join(', ')
                    : 'N/A';

                const productQuantities =
                  order.order_details && order.order_details.length
                    ? order.order_details
                        .map((detail) => detail.quantity)
                        .join(', ')
                    : 'N/A';

                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{productNames}</td>
                    <td>{productQuantities}</td>
                    <td>{order.customer_name || (order.user && order.user.name) || 'N/A'}</td>
                    <td>${parseFloat(order.total_price).toFixed(2)}</td>
                    <td>{order.status}</td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </section>

      {/* Product Management Section */}
      <section className="mt-5">
        <h4>Product Management</h4>
        <Button variant="success" onClick={() => setShowAddModal(true)}>
          Add Product
        </Button>
        {loadingProducts ? (
          <div className="text-center my-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : productsError ? (
          <Alert variant="danger">{productsError}</Alert>
        ) : (
          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id}>
                  <td>{prod.id}</td>
                  <td>{prod.name}</td>
                  <td>${parseFloat(prod.price).toFixed(2)}</td>
                  <td>{prod.description}</td>
                  <td>{prod.stock}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => openEditModal(prod)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(prod.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      {/* Add Product Modal */}
      <AddProductModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        handleAddProduct={handleAddProduct}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        editProduct={editProduct}
        setEditProduct={setEditProduct}
        handleEditProduct={handleEditProduct}
      />
    </Container>
  );
};

export default DashboardEmployee;
