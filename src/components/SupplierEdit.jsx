import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function SupplierEdit() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSupplier = async () => {
      setLoading(true);
      try {
        const response = await api.get(`suppliers/${id}/`);
        setSupplier(response.data);
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
      await api.put(`suppliers/${id}/`, supplier);
      navigate('/suppliers');
    } catch (err) {
      console.error('Error updating supplier:', err);
      setError('Failed to update supplier.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-4 text-gray-500">Loading...</p>;
  if (!supplier) return <p className="p-4 text-red-500">Supplier not found</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4 font-bold">Edit Supplier #{id}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={supplier.shop_name}
          onChange={(e) => setSupplier({ ...supplier, shop_name: e.target.value })}
          placeholder="Shop Name"
          className="w-full p-2 border rounded-lg"
          required
        />
        <select
          value={supplier.shop_status}
          onChange={(e) => setSupplier({ ...supplier, shop_status: e.target.value === 'true' })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="true">Open</option>
          <option value="false">Closed</option>
        </select>
        <input
          type="number"
          step="0.000001"
          value={supplier.location_latitude || ''}
          onChange={(e) => setSupplier({ ...supplier, location_latitude: e.target.value })}
          placeholder="Latitude"
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="number"
          step="0.000001"
          value={supplier.location_longitude || ''}
          onChange={(e) => setSupplier({ ...supplier, location_longitude: e.target.value })}
          placeholder="Longitude"
          className="w-full p-2 border rounded-lg"
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
    </div>
  );
}

export default SupplierEdit;