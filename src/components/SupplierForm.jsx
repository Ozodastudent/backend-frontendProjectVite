import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function SupplierForm() {
  const [formData, setFormData] = useState({
    shop_name: '',
    shop_status: true,
    location_latitude: '',
    location_longitude: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('suppliers/', {
        ...formData,
        user: 0, // Placeholder; replace with authenticated user ID if needed
      });
      navigate('/suppliers');
    } catch (err) {
      console.error('Error creating supplier:', err);
      setError('Failed to create supplier. Only moderators can create suppliers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4 font-bold">Create Supplier</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={formData.shop_name}
          onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
          placeholder="Shop Name"
          className="w-full p-2 border rounded-lg"
          required
        />
        <select
          value={formData.shop_status}
          onChange={(e) => setFormData({ ...formData, shop_status: e.target.value === 'true' })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="true">Open</option>
          <option value="false">Closed</option>
        </select>
        <input
          type="number"
          step="0.000001"
          value={formData.location_latitude}
          onChange={(e) => setFormData({ ...formData, location_latitude: e.target.value })}
          placeholder="Latitude"
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="number"
          step="0.000001"
          value={formData.location_longitude}
          onChange={(e) => setFormData({ ...formData, location_longitude: e.target.value })}
          placeholder="Longitude"
          className="w-full p-2 border rounded-lg"
          required
        />
        <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}

export default SupplierForm;