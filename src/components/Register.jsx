import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Register({ setToken }) {
  const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem('registeredPhone') || '');
  const [otpCode, setOtpCode] = useState('');
  const [userType, setUserType] = useState('client');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!otpCode || otpCode !== '123456') {
      setError('OTP must be 123456.');
      setLoading(false);
      return;
    }
    try {
      console.log('Requesting OTP for:', { phone_number: phoneNumber, user_type: userType });
      await api.post('authentication/request-otp/', { phone_number: phoneNumber, user_type: userType });
      console.log('Verifying OTP for:', { phone_number: phoneNumber, otp_code: otpCode, user_type: userType });
      const response = await api.post('authentication/verify-otp/', { phone_number: phoneNumber, otp_code: otpCode, user_type: userType });
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      localStorage.setItem('registeredPhone', phoneNumber);
      setToken(token);
      navigate('/orders');
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message);
      setError(`Registration failed: ${err.response?.status} - ${err.response?.data?.detail || err.message}. Check console.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-4 text-center font-bold">Register</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter Phone Number (e.g., +998945082976)"
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="text"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          placeholder="Enter OTP Code (Must be 123456)"
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
        >
          <option value="client">Client</option>
          <option value="supplier">Supplier</option>
          <option value="driver">Driver</option>
          <option value="moderator">Moderator</option>
        </select>
        <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded-lg">
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-500 underline">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;