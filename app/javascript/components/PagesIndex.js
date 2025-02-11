import React, { useState, useEffect } from 'react';
import useLocalCart from '../hooks/useLocalCart';
import useToast from '../hooks/useToast';

const PagesIndex = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [cartItems, setCartItems] = useState([]);

  const { toastMessage, showToast, showNotImplemented } = useToast();
  const { loadCart, saveCart, updateCartBadges, getCurrentUser } = useLocalCart();

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(`/api/v1/items?search=${search}`);
      const data = await response.json();
      setItems(data.data);
    };

    fetchItems();
  }, [search]);

  useEffect(() => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (searchForm && searchInput) {
      const handleSubmit = (event) => {
        event.preventDefault();
        setSearch(searchInput.value);
      };

      searchForm.addEventListener('submit', handleSubmit);

      return () => {
        searchForm.removeEventListener('submit', handleSubmit);
      };
    }
  }, []);

  // Loading cart from localStorage
  useEffect(() => {
      setCartItems(loadCart());
      updateCartBadges();
  }, []);

  // Saving cart to localStorage
  useEffect(() => {
      saveCart(cartItems);
      updateCartBadges();
  }, [cartItems]);

  const handleAddToCart = (item) => {
    if (getCurrentUser() == '') {
      showToast('You need to sign in or sign up before continuing.');
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        const updatedItems = prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        showToast('Item quantity increased');
        return updatedItems;
      } else {
        const updatedItems = [...prevItems, { ...item.attributes, quantity: 1, id: item.id }];
        showToast('Item added to your shopping cart');
        return updatedItems;
      }
    });
  };

  return (
    <div className="container-fluid pt-3 pb-3">
      <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Products</span></h2>
      <div className="row px-xl-5">
      {items.map(item => (
        <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 pb-1">
          <div id={item.id} className="product-item bg-light mb-4">
            <div className="product-img position-relative overflow-hidden">
              <img className="img-fluid w-100" src={`img/${item.attributes.image_url}`} alt="" />
              <div className="product-action">
                <a className="btn btn-outline-dark btn-square" onClick={() => handleAddToCart(item)}><i className="fa fa-shopping-cart"></i></a>
                <a className="btn btn-outline-dark btn-square" onClick={showNotImplemented}><i className="far fa-heart"></i></a>
                <a className="btn btn-outline-dark btn-square" onClick={showNotImplemented}><i className="fa fa-sync-alt"></i></a>
                <a className="btn btn-outline-dark btn-square" onClick={showNotImplemented}><i className="fa fa-search"></i></a>
              </div>
            </div>
            <div className="text-center py-4">
              <a className="h6 text-decoration-none text-truncate" href="#">{item.attributes.name}</a>
              <div className="text-decoration-none text-truncate">{item.attributes.description}</div>
              <div className="d-flex align-items-center justify-content-center mt-2">
                <h5>${item.attributes.price}</h5>
              </div>

              <div className="d-flex align-items-center justify-content-center mb-1">
                <small className="fa fa-star text-primary mr-1"></small>
                <small className="fa fa-star text-primary mr-1"></small>
                <small className="fa fa-star text-primary mr-1"></small>
                <small className="fa fa-star text-primary mr-1"></small>
                <small className="fa fa-star text-primary mr-1"></small>
                <small>(99)</small>
              </div>
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default PagesIndex;