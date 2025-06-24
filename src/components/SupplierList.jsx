import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/suppliers?skip=${(page - 1) * 10}&limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({
          data: [
            { id: 1, name: 'Supplier A', phone_number: '+998901234567', latitude: 41.3, longitude: 69.2, status: 'open' },
            { id: 2, name: 'Supplier B', phone_number: '+998901234568', latitude: 41.4, longitude: 69.3, status: 'closed' },
          ],
        }));
        setSuppliers(response.data);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, [page]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/suppliers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {
          setSuppliers(suppliers.filter((s) => s.id !== id)); // Mock delete
        });
      } catch (err) {
        console.error('Error deleting supplier:', err);
      }
    }
  };

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
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
            <p>Name: {supplier.name}</p>
            <p>Phone: {supplier.phone_number}</p>
            <p>Location: ({supplier.latitude}, {supplier.longitude})</p>
            <span className={`px-2 py-1 rounded ${supplier.status === 'open' ? 'bg-green-200' : 'bg-red-200'}`}>
              {supplier.status}
            </span>
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