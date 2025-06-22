import React, { useState, useEffect } from 'react';

function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call for suppliers
    setLoading(true);
    try {
      const response = {
        data: [
          { id: 1, name: 'Supplier A', phone_number: '+998901234567', latitude: 41.3, longitude: 69.2, status: 'open' },
          { id: 2, name: 'Supplier B', phone_number: '+998901234568', latitude: 41.4, longitude: 69.3, status: 'closed' },
        ],
      };
      setSuppliers(response.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter((s) => s.id !== id));
    }
  };

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Suppliers</h2>
      <input
        type="text"
        placeholder="Search suppliers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      {loading && <p className="text-gray-500">Loading...</p>}
      <div className="space-y-4">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="p-4 bg-white rounded shadow">
            <p>Name: {supplier.name}</p>
            <p>Phone: {supplier.phone_number}</p>
            <p>Location: ({supplier.latitude}, {supplier.longitude})</p>
            <span className={`px-2 py-1 rounded ${supplier.status === 'open' ? 'bg-green-200' : 'bg-red-200'}`}>
              {supplier.status}
            </span>
            <button
              onClick={() => handleDelete(supplier.id)}
              className="ml-2 p-1 bg-red-500 text-white rounded"
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
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="p-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default SupplierList;