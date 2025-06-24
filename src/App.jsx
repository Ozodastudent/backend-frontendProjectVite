import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import OrderList from './components/OrderList.jsx';
import OrderDetail from './components/OrderDetail.jsx';
import SupplierForm from './components/SupplierForm.jsx';
import SupplierList from './components/SupplierList.jsx';
import SupplierEdit from './components/SupplierEdit.jsx';
import './styles.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {token && (
        <button
          onClick={handleLogout}
          className="fixed top-4 right-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      )}
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route path="/orders" element={token ? <OrderList /> : <Navigate to="/login" />} />
        <Route path="/orders/:id" element={token ? <OrderDetail /> : <Navigate to="/login" />} />
        <Route path="/suppliers/new" element={token ? <SupplierForm /> : <Navigate to="/login" />} />
        <Route path="/suppliers" element={token ? <SupplierList /> : <Navigate to="/login" />} />
        <Route path="/suppliers/edit/:id" element={token ? <SupplierEdit /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? '/orders' : '/login'} />} />
      </Routes>
    </div>
  );
}

export default App;