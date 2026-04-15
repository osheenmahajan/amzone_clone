import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      navigate('/'); // Secure redirect back to portal
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please check credentials.');
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center pt-8">
      <Link to="/">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="w-[100px] mb-6" />
      </Link>
      
      <div className="w-[350px] border border-gray-300 rounded-lg p-6 shadow-sm">
        <h1 className="text-[28px] font-normal mb-4 text-gray-900 tracking-tight">Sign in</h1>
        
        {error && <div className="text-[#c40000] text-[13px] mb-4 font-bold flex items-center gap-2"><span>!</span> {error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[13px]">Email or mobile phone number</label>
            <input 
              type="email" 
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="border border-[#a6a6a6] rounded-[3px] px-2 py-1 outline-none focus:ring-1 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm text-sm"
              required 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[13px]">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="border border-[#a6a6a6] rounded-[3px] px-2 py-1 outline-none focus:ring-1 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm text-sm"
              required 
            />
          </div>
          <button type="submit" className="bg-[#f0c14b] border border-[#a88734] rounded-[3px] py-1 shadow-sm hover:bg-[#e3bb4d] mt-2 text-[13px] font-medium active:scale-[0.99] transition-transform">
            Continue
          </button>
        </form>

        <p className="text-[12px] mt-4 tracking-tight leading-snug">
          By continuing, you agree to Amazon's <span className="text-[#0066c0] hover:underline hover:text-amazon-orange cursor-pointer">Conditions of Use</span> and <span className="text-[#0066c0] hover:underline hover:text-amazon-orange cursor-pointer">Privacy Notice</span>.
        </p>

        <div className="mt-6 flex gap-1 group">
           <span className="text-[10px] text-gray-500 mt-[3px]">▶</span> <span className="text-[13px] text-[#0066c0] group-hover:underline group-hover:text-amazon-orange cursor-pointer">Need help?</span>
        </div>
      </div>

      <div className="w-[350px] mt-6 flex items-center justify-center">
        <div className="flex-1 h-[1px] bg-gray-300"></div>
        <span className="text-gray-500 text-[12px] px-2 bg-white relative -top-[1px]">New to Amazon?</span>
        <div className="flex-1 h-[1px] bg-gray-300"></div>
      </div>

      <Link to="/signup" className="w-[350px] mt-4 bg-gray-100 hover:bg-gray-200 border border-gray-400 rounded-[3px] py-[6px] shadow-sm text-[13px] font-medium text-center tracking-tight active:scale-[0.99] transition-transform">
        Create your Amazon account
      </Link>
    </div>
  );
};

export default LoginPage;
