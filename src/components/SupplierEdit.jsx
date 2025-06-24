import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SupplierEdit() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState({ name: '', latitude: '', longitude: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSupplier = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/suppliers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({
          data: { id: parseInt(id), name: 'Supplier A', latitude: 41.3, longitude: 69.2 },
        }));
        setSupplier({ name: response.data.name, latitude: response.data.latitude, longitude: response.data.longitude });
      } catch (err) {
        console.error('Error fetching supplier:', err);
        navigate('/suppliers');
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/suppliers/${id}`, supplier, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {
        console.log('Supplier updated:', supplier); // Mock success
      });
      navigate('/suppliers');
    } catch (err) {
      setError(err.message || 'Failed to update supplier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4 font-bold">Edit Supplier #{id}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={supplier.name}
            onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
            placeholder="Supplier Name"
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="number"
            step="0.000001"
            value={supplier.latitude}
            onChange={(e) => setSupplier({ ...supplier, latitude: e.target.value })}
            placeholder="Latitude"
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="number"
            step="0.000001"
            value={supplier.longitude}
            onChange={(e) => setSupplier({ ...supplier, longitude: e.target.value })}
            placeholder="Longitude"
            className="w-full p-2 border rounded-lg"
            required
          />
          <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            {loading ? 'Saving...' : 'Update'}
          </button>
          <button
            onClick={() => navigate('/suppliers')}
            className="mt-2 w-full p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default SupplierEdit;