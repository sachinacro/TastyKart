// MyOrders.js

import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import parcelIcon from '../../assets/parcel_icon.png'; // Replace with actual path

export const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(
                `${url}/api/order/userorders`,
                {},
                { headers: { token } }
            );
            setData(response.data.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            <div className="container">
                {data.length === 0 ? (
                    <p>No orders found</p>
                ) : (
                    data.map((order, index) => (
                        <div key={index} className="my-order-order">
                            <img src={parcelIcon} alt="Parcel Icon" />
                            <p>
                                {order.items.map((item, i) =>
                                    `${item.name} x ${item.quantity}${i === order.items.length - 1 ? '' : ', '}`
                                )}
                            </p>
                            <p>₹{order.amount}.00</p>
                            <p>Items: {order.items.length}</p>

                            {/* Order Status */}
                            <p><span>&#x25cf;</span> <b>Status: {order.status}</b></p>

                            {/* Display Delivery Time if available */}
                            {order.deliveryTime && (
                                <p><span>&#x25cf;</span> <b>Expected Delivery: {new Date(order.deliveryTime).toLocaleString()}</b></p>
                            )}

                            {/* Display Shipping Address */}
                            <p>
                                <span>&#x25cf;</span> <b>Address:</b> {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zipcode}
                            </p>

                            {/* Track Order Button */}
                            <button onClick={fetchOrders}>Track Order</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
