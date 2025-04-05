// src/Components/DashboardEmployee.js
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Table, Button, Spinner, Alert, Form, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { AddProductModal, EditProductModal } from './ProductModals';

const DashboardEmployee = () => {
  // Retrieve token from localStorage
  const token = localStorage.getItem('token');

  // Memoize the config object so it only updates when the token changes
  const config = useMemo(() => {
    return { headers: { 'Authorization': `Bearer ${token}` } };
  }, [token]);

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
    name: '',
    price: '',
    description: '',
    stock: '',
    imageFile: null,
  });

  // States for the Edit Product modal
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    imageFile: null,
  });

  // State for the checkout filter date
  const [filterDate, setFilterDate] = useState('');

  // Fetch all orders
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

  // Fetch orders filtered by date using the correct endpoint
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

  // Fetch products for management
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

  // Handler to add a new product using FormData (for file uploads)
  const handleAddProduct = () => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('description', newProduct.description);
    formData.append('stock', newProduct.stock);
    if (newProduct.imageFile) {
      formData.append('image', newProduct.imageFile);
    }

    axios
      .post('http://127.0.0.1:8000/api/products', formData, {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        fetchProducts();
        setShowAddModal(false);
        setNewProduct({ name: '', price: '', description: '', stock: '', imageFile: null });
      })
      .catch((error) => {
        console.error('Error adding product:', error.response || error);
        alert('Failed to add product.');
      });
  };

  // Handler to update an existing product using FormData
  const handleEditProduct = () => {
    if (!editingProduct) return;
    const formData = new FormData();
    formData.append('name', editProduct.name);
    formData.append('price', editProduct.price);
    formData.append('description', editProduct.description);
    formData.append('stock', editProduct.stock);
    if (editProduct.imageFile) {
      formData.append('image', editProduct.imageFile);
    }

    axios
      .put(`http://127.0.0.1:8000/api/products/${editingProduct.id}`, formData, {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        fetchProducts();
        setShowEditModal(false);
        setEditingProduct(null);
        setEditProduct({ name: '', price: '', description: '', stock: '', imageFile: null });
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

  // Open the edit modal with pre-filled data
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      imageFile: null, // New file to be uploaded if needed
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
      <h2 style={{ textAlign: 'center' }}>Employee Dashboard</h2>

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
          // Wrap the table in a div to enable scrolling
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product Name</th>
                  <th>Customer</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
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

                  return (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{productNames}</td>
                      <td>{order.customer_name || (order.user && order.user.name) || 'N/A'}</td>
                      <td>${parseFloat(order.total_price).toFixed(2)}</td>
                      <td>{order.status}</td>
                      <td>{new Date(order.created_at).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
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
          // Wrap the table in a div to enable scrolling
          <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="mt-3">
            <Table striped bordered hover responsive>
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
          </div>
        )}
      </section>

      {/* Modals */}
      <AddProductModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        handleAddProduct={handleAddProduct}
      />

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
