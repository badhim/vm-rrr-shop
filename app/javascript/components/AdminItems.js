import React, { useState, useEffect } from 'react';
import useToast from '../hooks/useToast';

const DeleteConfirmationModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <>
    <div className="modal-backdrop show"></div>
    <div className="modal fade show" id="modalDeleteItem" tabIndex="-1" role="dialog" style={{ display: 'block', paddingLeft: '0px' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalDeleteItemLongTitle">Delete Item</h5>
          </div>
          <div className="modal-body">
            Are you sure you want to delete this item?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={onDelete}>Delete</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

const Modal = ({ isOpen, item, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (item) {
      setName(item.attributes.name);
      setDescription(item.attributes.description);
      setImageURL(item.attributes.image_url);
      setPrice(item.attributes.price);
    } else {
      setName("");
      setDescription("");
      setImageURL("");
      setPrice(0);
    }
  }, [item]);

  const handleCancel = () => {
    onClose();
  };

  const handleSave = () => {
    onSave(name, description, imageURL, price);
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="modal-backdrop show"></div>
    <div className="modal fade show" id="modalEditItem" tabIndex="-1" role="dialog" style={{ display: 'block', paddingLeft: '0px' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalEditItemTitle">{item ? "Edit Item" : "Add Item"}</h5>
          </div>
          <div className="modal-body">
              <label htmlFor="name">Name</label>
              <input
                name="name"
                className="form-control mb-3"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor='description'>Description</label>
              <input
                name="description"
                className="form-control mb-3"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <label htmlFor="image-url">Image URL</label>
              <input
                name="image-url"
                className="form-control mb-3"
                type="text"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
              />
              <label htmlFor="price">Price</label>
              <input
                name="price"
                className="form-control"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

const AdminItems = () => {
  const [csrfToken, setCsrfToken] = useState('');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { toastMessage, showToast, showNotImplemented } = useToast();

  useEffect(() => {
    const token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    setCsrfToken(token);

    const fetchItems = async () => {
          const response = await fetch(`/api/v1/items`);
          const data = await response.json();
          setItems(data.data);
      };

      fetchItems();
  }, []);

  const handleEdit = (item) => {
    setCurrentItem(item);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentItem(null);
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setCurrentItem(null);
  };

  const handleSave = async (name, description, imageURL, price) => {
    setLoading(true);

    try {
      if (currentItem) {
        // Update existing item
        const updatedItem = await updateItemAPI(currentItem.id, name, description, imageURL, price);
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === updatedItem.data.id ? updatedItem.data : item
          )
        );
      } else {
        // Add new item
        const newItem = await addItemAPI(name, description, imageURL, price);
        setItems((prevItems) => [...prevItems, newItem.data]);
      }

      setModalOpen(false);
      setCurrentItem(null);
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addItemAPI = async (name, description, imageURL, price) => {
    const response = await fetch('/api/v1/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({ name, description, image_url: imageURL, price }),
    });

    const responseJson = await response.json();

    if (!response.ok) {
      const errorMessage = responseJson.errors ? responseJson.errors[0] : 'Failed to add item. Please try again.';
      throw new Error(errorMessage);
    }

    return responseJson;
  };

  const updateItemAPI = async (id, name, description, imageURL, price) => {

    const response = await fetch(`/api/v1/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({ name, description, image_url: imageURL, price }),
    });

    const responseJson = await response.json();

    if (!response.ok) {
      const errorMessage = responseJson.errors ? responseJson.errors[0] : 'Failed to update item. Please try again.';
      throw new Error(errorMessage);
    }

    return responseJson;
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`/api/v1/items/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });

      if (!response.ok) {
        const responseJson = await response.json();
        const errorMessage = responseJson.errors ? responseJson.errors[0] : 'Failed to  item. Please try again.';
        throw new Error(errorMessage);
      }

      setItems((prevItems) => prevItems.filter(item => item.id !== itemToDelete.id));
      showToast('Item deleted successfully!');
    } catch (err) {
      showToast(err.message);
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="container-fluid py-3">
      <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Edit Items</span></h2>
      <button type="button" className="btn btn-primary ml-5 mb-3" disabled={loading} onClick={handleAdd}>{loading ? "Loading..." : "Add Item"}</button>

      <div className="row px-xl-5">

      {items.map(item => (
      <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 pb-1">
        <div id={item.id} className="product-item bg-light mb-4">
          <div className="product-img position-relative overflow-hidden" style={{ width: '410px', height: '410px' }}>
            <img className="img-fluid w-100 h-100" src={item.attributes.image_url.startsWith('http') ? item.attributes.image_url : `/img/${item.attributes.image_url}`} alt="" style={{ objectFit: 'cover' }} />
            <div className="product-action">
              <a className="btn btn-outline-dark btn-square" disabled={loading} onClick={() => handleEdit(item)}><i className="fa fa-pen"></i></a>
              <a className="btn btn-outline-dark btn-square" onClick={() => handleDelete(item)}><i className="far fa-trash-alt"></i></a>
            </div>
          </div>
          <div className="text-center py-4">
            <a className="h6 text-decoration-none text-truncate" href="#">{item.attributes.name}</a>
            <div className="text-decoration-none text-truncate">{item.attributes.description}</div>
            <div className="d-flex align-items-center justify-content-center mt-2">
              <h5>${item.attributes.price}</h5>
            </div>
          </div>
        </div>
      </div>
    ))}
    </div>

    <Modal
      item={currentItem}
      isOpen={isModalOpen}
      onClose={handleCancel}
      onSave={handleSave}
    />

    <DeleteConfirmationModal
      isOpen={isDeleteModalOpen}
      onClose={handleDeleteCancel}
      onDelete={handleDeleteConfirmation}
    />
  </div>
  );
}

export default AdminItems;