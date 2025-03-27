// src/Components/ProductModals.js
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

// Add Product Modal
export const AddProductModal = ({
  show,
  handleClose,
  newProduct,
  setNewProduct,
  handleAddProduct,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formProductName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group controlId="formProductPrice" className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group controlId="formProductDescription" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group controlId="formProductStock" className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group controlId="formProductImage" className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              value={newProduct.image || ''}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
            />
            <Form.Text className="text-muted">
              Leave blank to use the default image.
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddProduct}>
          Add Product
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Edit Product Modal
export const EditProductModal = ({
  show,
  handleClose,
  editProduct,
  setEditProduct,
  handleEditProduct,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="editProductName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group controlId="editProductPrice" className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={editProduct.price}
              onChange={(e) =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group controlId="editProductDescription" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={editProduct.description}
              onChange={(e) =>
                setEditProduct({ ...editProduct, description: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group controlId="editProductStock" className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              value={editProduct.stock}
              onChange={(e) =>
                setEditProduct({ ...editProduct, stock: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group controlId="editProductImage" className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              value={editProduct.image || ''}
              onChange={(e) =>
                setEditProduct({ ...editProduct, image: e.target.value })
              }
            />
            <Form.Text className="text-muted">
              Leave blank to use the default image.
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleEditProduct}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
