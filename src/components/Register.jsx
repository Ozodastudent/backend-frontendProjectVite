import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Mock registration (replace with POST /register)
      if (username && password) {
        const token = 'fake-token-123';
        localStorage.setItem('token', token);
        setToken(token);
        navigate('/orders');
      } else {
        throw new Error('Please fill all fields');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-4 text-center font-bold">Register</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded-lg">
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="mt-4 text-center">
          Already have an account? <a href="/login" className="text-blue-500">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Register;