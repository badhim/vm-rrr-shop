import React, { useState, useEffect } from 'react';
import useLocalCart from '../hooks/useLocalCart';
import useToast from '../hooks/useToast';

const PagesShoppingCart = () => {
    const [csrfToken, setCsrfToken] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const { toastMessage, showToast, showNotImplemented } = useToast();
    const { loadCart, saveCart, updateCartBadges } = useLocalCart();

    // Loading cart from localStorage
    useEffect(() => {
        const tokenElement = document.querySelector("meta[name='csrf-token']");
        const token = tokenElement ? tokenElement.getAttribute("content") : '';
        setCsrfToken(token);

        setCartItems(loadCart());
        updateCartBadges();
    }, []);

    // Saving cart to localStorage
    useEffect(() => {
        saveCart(cartItems);
        updateCartBadges();
    }, [cartItems]);

    const handleQuantityChange = (e, id, newQuantity) => {
        if (typeof newQuantity == "string") {
            newQuantity = parseInt(newQuantity);
        }

        if (isNaN(newQuantity)) {
            e.stopPropagation();
            return false;
        }

        if (newQuantity < 1) {
            e.stopPropagation();
            return false;
        }

        const updatedCart = cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );

        setCartItems(updatedCart);
        return true;
    };

    const handleRemoveItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
    };

    const handleOrder = async () => {
        if (cartItems.length === 0) {
            showToast('Your shopping cart is empty.');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                order: {
                    amount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
                },
                order_descriptions: cartItems.map(item => ({
                    item_id: item.id,
                    quantity: item.quantity,
                }))
            };

            const response = await fetch('/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const responseJson = await response.json();
                const errorMessage = responseJson.errors ? responseJson.errors[0] : 'Failed to place your order. Please try again.';
                throw new Error(errorMessage);
            }

            showToast('Your order placed successfully!');

            setCartItems([]);
            saveCart([]);
        } catch (error) {
            console.error(error);
            showToast(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-3">
            <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Shopping Cart</span></h2>

            <div className="row px-xl-5">
            <div className="col-lg-8 table-responsive mb-5">
                <table className="table table-light table-borderless table-hover text-center mb-0">
                    <thead className="thead-dark">
                        <tr>
                            <th className="text-left">Item</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody className="align-middle">
                        {cartItems.map(item => (
                        <tr key={item.id}>
                            <td className="text-left"><img className="mx-3" src={item.image_url.startsWith('http') ? item.image_url : `/img/${item.image_url}`} alt="" style={{ width: '50px' }} />{item.name}</td>
                            <td className="align-middle">{item.price}</td>
                            <td className="align-middle text-center">
                                <div className="input-group quantity mx-auto" style={{ width: '100px' }}>
                                    <div className="input-group-btn">
                                        <button
                                            onClick={(e) => handleQuantityChange(e, item.id, item.quantity - 1)}
                                            className="btn btn-sm btn-primary btn-minus"
                                        >
                                            <i className="fa fa-minus"></i>
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(e, item.id, e.target.value)}
                                        className="form-control form-control-sm bg-secondary border-0 text-center"
                                    />
                                    <div className="input-group-btn">
                                        <button
                                            className="btn btn-sm btn-primary btn-plus"
                                            onClick={(e) => handleQuantityChange(e, item.id, item.quantity + 1)}
                                        >
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td className="align-middle">${ item.price * item.quantity }</td>
                            <td className="align-middle">
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="btn btn-sm btn-danger"
                                >
                                    <i className="fa fa-times"></i>
                                </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="col-lg-4">
                <div className="bg-light p-30 mb-5">
                    <div className="border-bottom pb-2">
                        <div className="d-flex justify-content-between mb-3">
                            <h6>Subtotal</h6>
                            <h6>{cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h6>
                        </div>
                        <div className="d-flex justify-content-between">
                            <h6 className="font-weight-medium">Shipping</h6>
                            <h6 className="font-weight-medium">$0</h6>
                        </div>
                    </div>
                    <div className="pt-2">
                        <div className="d-flex justify-content-between mt-2">
                            <h5>Total</h5>
                            <h5>{cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h5>
                        </div>
                        <button onClick={handleOrder} disabled={loading} className="btn btn-block btn-primary font-weight-bold my-3 py-3">
                            {loading ? 'Processing Order...' : 'Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PagesShoppingCart;
