import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get(`suppliers/orders-history/?skip=${(page - 1) * 10}&limit=10`);
        setOrders(response.data.results || []); // Adjust based on response structure
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    wsRef.current = new WebSocket('wss://katlavan24.uz/api/v1/ws/customer/user1'); // Adjusted WebSocket URL
    wsRef.current.onopen = () => console.log('WebSocket connected');
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type.startsWith('customer.order_progress.')) {
        const orderId = data.type.split('.')[2];
        setOrders((prev) =>
          prev.map((order) =>
            order.id === parseInt(orderId) ? { ...order, status: data.status } : order
          )
        );
      }
    };
    wsRef.current.onerror = (error) => console.error('WebSocket error:', error);
    wsRef.current.onclose = () => console.log('WebSocket disconnected');

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [page]);

  useEffect(() => {
    if (location.pathname === '/orders') setPage(1);
  }, [location]);

  const handleOrderClick = (id) => {
    navigate(`/orders/${id}`);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4 font-bold">My Orders</h2>
      {loading && <p className="text-gray-500">Loading...</p>}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer transition"
            onClick={() => handleOrderClick(order.id)}
          >
            <p>Order ID: {order.id}</p>
            <p>Type: {order.material_type || 'Unknown'}</p>
            <p>Volume: {order.volume || 0} tons</p>
            <p>Location: {order.location || 'N/A'}</p>
            <span className={`px-2 py-1 rounded ${getStatusClass(order.status)}`}>
              {order.status || 'pending'}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="p-2 bg-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="p-2 bg-gray-300 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function getStatusClass(status) {
  const statusMap = {
    pending: 'bg-yellow-200 text-yellow-800',
    in_progress: 'bg-blue-200 text-blue-800',
    completed: 'bg-green-200 text-green-800',
    matched: 'bg-purple-200 text-purple-800',
  };
  return statusMap[status] || 'bg-gray-200';
}

export default OrderList;