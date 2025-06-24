import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

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
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/orders?skip=${(page - 1) * 10}&limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({
          data: [
            { id: 1, type: 'Sand', volume: 50, location: 'Site A', status: 'pending' },
            { id: 2, type: 'Gravel', volume: 30, location: 'Site B', status: 'in_progress' },
          ],
        }));
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    wsRef.current = new WebSocket('ws://localhost:8000/ws/customer/user1');
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
            <p>Type: {order.type}</p>
            <p>Volume: {order.volume} tons</p>
            <p>Location: {order.location}</p>
            <span className={`px-2 py-1 rounded ${getStatusClass(order.status)}`}>
              {order.status}
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