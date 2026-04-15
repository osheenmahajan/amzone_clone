import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', { name, email, password });
      login(response.data.token, response.data.user);
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register account.');
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center pt-8 pb-10">
      <Link to="/">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="w-[100px] mb-6" />
      </Link>
      
      <div className="w-[350px] border border-gray-300 rounded-lg p-6 shadow-sm">
        <h1 className="text-[28px] font-normal mb-4 text-gray-900 tracking-tight">Create account</h1>
        
        {error && <div className="text-[#c40000] text-[13px] mb-4 font-bold flex items-center gap-2"><span>!</span> {error}</div>}

        <form onSubmit={handleSignup} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[13px]">Your name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="First and last name"
              className="border border-[#a6a6a6] rounded-[3px] px-2 py-1 outline-none focus:ring-1 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm text-sm"
              required 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[13px]">Email</label>
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
              placeholder="At least 6 characters"
              className="border border-[#a6a6a6] rounded-[3px] px-2 py-1 outline-none focus:ring-1 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm text-sm"
              required 
            />
            <div className="text-xs text-gray-700 flex items-center gap-1 mt-1">
              <span className="italic text-[#007185] font-bold">i</span> Passwords must be at least 6 characters.
            </div>
          </div>
          
          <button type="submit" className="bg-[#f0c14b] border border-[#a88734] rounded-[3px] py-[6px] shadow-sm hover:bg-[#e3bb4d] mt-2 text-[13px] font-medium active:scale-[0.99] transition-transform">
            Verify email
          </button>
        </form>

        <p className="text-[12px] mt-6 tracking-tight leading-snug">
          By creating an account, you agree to Amazon's <span className="text-[#0066c0] hover:underline hover:text-amazon-orange cursor-pointer">Conditions of Use</span> and <span className="text-[#0066c0] hover:underline hover:text-amazon-orange cursor-pointer">Privacy Notice</span>.
        </p>

        <div className="mt-8 border-t border-gray-200 pt-4 text-[13px]">
           Already have an account? <Link to="/login" className="text-[#0066c0] hover:underline hover:text-amazon-orange font-medium">Sign in ▸</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
