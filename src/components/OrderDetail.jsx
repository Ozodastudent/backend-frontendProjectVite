import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await api.get(`suppliers/orders-history/${id}/`); // Adjusted endpoint
        setOrder(response.data); // Adjust based on response structure
      } catch (err) {
        console.error('Error fetching order:', err);
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  if (loading) return <p className="p-4 text-gray-500">Loading...</p>;
  if (!order) return <p className="p-4 text-red-500">Order not found</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4 font-bold">Order Detail #{order.id}</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <p><strong>Type:</strong> {order.material_type || 'Unknown'}</p>
        <p><strong>Volume:</strong> {order.volume || 0} tons</p>
        <p><strong>Location:</strong> {order.location || 'N/A'}</p>
        <p><strong>Status:</strong> <span className={`px-2 py-1 rounded ${getStatusClass(order.status)}`}>{order.status || 'pending'}</span></p>
        <p><strong>Driver:</strong> {order.driver || 'Not assigned'}</p>
        <p><strong>Supplier:</strong> {order.supplier || 'Not assigned'}</p>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Back to Orders
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

export default OrderDetail;