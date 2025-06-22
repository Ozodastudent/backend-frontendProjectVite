import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SupplierForm() {
  const [formData, setFormData] = useState({
    phone_number: '',
    name: '',
    latitude: '',
    longitude: '',
    password: '',
    status: 'open',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Mock API call (replace with real endpoint)
      if (formData.name && formData.phone_number && formData.latitude && formData.longitude) {
        console.log('Supplier created:', formData);
        navigate('/suppliers');
      } else {
        throw new Error('Please fill all required fields');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Create Supplier</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={formData.phone_number}
          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Supplier Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          step="0.000001"
          value={formData.latitude}
          onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
          placeholder="Latitude"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          step="0.000001"
          value={formData.longitude}
          onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
          placeholder="Longitude"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}

export default SupplierForm;