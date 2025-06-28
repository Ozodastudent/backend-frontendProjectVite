import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const response = await api.get('suppliers/');
        setSuppliers(response.data || []); // Adjust based on response structure
      } catch (err) {
        console.error('Error fetching suppliers:', err);
        setSuppliers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, [page]); // Page change triggers refresh

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await api.delete(`suppliers/${id}/`);
        setSuppliers(suppliers.filter((s) => s.id !== id));
      } catch (err) {
        console.error('Error deleting supplier:', err);
      }
    }
  };

  const filteredSuppliers = suppliers.filter((s) =>
    s.shop_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4 font-bold">Suppliers</h2>
      <input
        type="text"
        placeholder="Search suppliers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg"
      />
      {loading && <p className="text-gray-500">Loading...</p>}
      <div className="space-y-4">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="p-4 bg-white rounded-lg shadow">
            <p>Name: {supplier.shop_name}</p>
            <p>Status: {supplier.shop_status ? 'Open' : 'Closed'}</p>
            <p>Location: ({supplier.location_latitude}, {supplier.location_longitude})</p>
            <button
              onClick={() => navigate(`/suppliers/edit/${supplier.id}`)}
              className="ml-2 p-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(supplier.id)}
              className="ml-2 p-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
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

export default SupplierList;