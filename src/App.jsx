import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import OrderList from './components/OrderList';
import OrderDetail from './components/OrderDetail';
import SupplierForm from './components/SupplierForm';
import SupplierList from './components/SupplierList';
import SupplierEdit from './components/SupplierEdit';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Memoize setToken to prevent re-renders
  const memoizedSetToken = useCallback((newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setToken={memoizedSetToken} />} />
          <Route path="/register" element={<Register setToken={memoizedSetToken} />} />
          <Route
            path="/orders"
            element={token ? <OrderList /> : <Navigate to="/login" />}
          />
          <Route
            path="/orders/:id"
            element={token ? <OrderDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/suppliers"
            element={token ? <SupplierList /> : <Navigate to="/login" />}
          />
          <Route
            path="/suppliers/edit/:id"
            element={token ? <SupplierEdit /> : <Navigate to="/login" />}
          />
          <Route
            path="/suppliers/create"
            element={token ? <SupplierForm /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;