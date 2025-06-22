import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import OrderList from './components/OrderList.jsx';
import SupplierForm from './components/SupplierForm.jsx';
import SupplierList from './components/SupplierList.jsx';
import './styles.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/orders');
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route path="/orders" element={token ? <OrderList /> : <Navigate to="/login" />} />
        <Route path="/suppliers/new" element={token ? <SupplierForm /> : <Navigate to="/login" />} />
        <Route path="/suppliers" element={token ? <SupplierList /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;