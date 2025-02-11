import React, { useState, useEffect } from 'react';

const PagesMyOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch(`/api/v1/orders`);
            const data = await response.json();
            setOrders(data);
        };

        fetchOrders();
    }, []);

    return (
    <div className="container-fluid py-3">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">My Orders</span></h2>
        <div className="row px-xl-5">
        <div className="accordion w-100" id="accordion-orders">
        {orders.map(order => (
            <div key={order.id} id={order.id} className="card">
                <h2 className="card-header" id={`order${order.id}`}>
                    <button
                        className="btn btn-block text-left"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${order.id}`}
                        aria-expanded="false"
                        aria-controls={`collapse${order.id}`}>
                        <h5>Order {order.id}: ${order.amount.toFixed(2)}</h5>
                    </button>
                </h2>
                <div
                    id={`collapse${order.id}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`order${order.id}`}
                    data-bs-parent="#accordion-orders">

                    <div className="card-body">
                        <table className="table table-light table-hover table-borderless text-left mb-0">
                        <thead className="thead-dark">
                            <tr>
                                <th>Item</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.order_descriptions.map(description => (
                            <tr key={description.id}>
                                <td><img className="mx-3" src={description.item.image_url.startsWith('http') ? description.item.image_url : `/img/${description.item.image_url}`} alt="" style={{ width: '50px' }}/>{description.item.name}</td>
                                <td className="align-middle">${description.item.price}</td>
                                <td className="align-middle">{description.quantity}</td>
                                <td className="align-middle">${(description.item.price * description.quantity).toFixed(2)}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        ))}
        </div>
        </div>
    </div>
    );
}

export default PagesMyOrders;