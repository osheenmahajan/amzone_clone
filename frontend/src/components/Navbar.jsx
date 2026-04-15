import React, { useState } from 'react';
import { Search, ShoppingCart, MapPin, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleAuthClick = (e) => {
    if (user) {
      e.preventDefault();
      logout();
      navigate('/');
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (category && category !== 'All') params.append('category', category);
    
    navigate(`/?${params.toString()}`);
  };

  return (
    <header className="flex flex-col w-full fixed top-0 z-50 shadow-sm">
      {/* Top Nav */}
      <div className="bg-amazon-navy text-white px-2 sm:px-4 flex items-center h-[60px] gap-2 sm:gap-4">
        {/* Logo */}
        <Link to="/" className="flex flex-col justify-center border border-transparent hover:border-white p-1 rounded">
<img src="/src/assets/amazon-logo-white.svg" alt="Amazon" className="h-8 sm:h-10 w-auto" />
        </Link>
        
        {/* Search Bar (Functional) */}
        <form onSubmit={handleSearch} className="flex flex-1 h-10 rounded overflow-hidden bg-white focus-within:ring-2 focus-within:ring-amazon-orange mx-2 max-w-4xl">
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-100 text-black border-r border-gray-300 px-3 text-xs outline-none cursor-pointer hover:bg-gray-200 hidden sm:block"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Computers">Computers</option>
            <option value="Accessories">Accessories</option>
          </select>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 text-black text-[15px] outline-none" 
            placeholder="Search Amazon.in"
          />
          <button type="submit" className="bg-[#febd69] w-[45px] hover:bg-[#f3a847] flex justify-center items-center cursor-pointer transition-colors">
            <Search size={22} className="text-amazon-navy" />
          </button>
        </form>

        {/* Account & Lists */}
        <Link to={user ? "#" : "/login"} onClick={user ? handleAuthClick : undefined} className="hidden lg:flex flex-col border border-transparent hover:border-white p-1 rounded cursor-pointer leading-tight">
          <span className="text-[11px] text-white">Hello, {user ? user.name : 'sign in'}</span>
          <span className="text-[13px] font-bold flex items-center">{user ? 'Sign out' : 'Account & Lists'} <span className="text-[9px] ml-1 opacity-60">▼</span></span>
        </Link>

        {/* Orders */}
        <Link to="/orders" className="hidden lg:flex flex-col border border-transparent hover:border-white p-1 rounded cursor-pointer leading-tight">
          <span className="text-[11px] text-white">Returns</span>
          <span className="text-[13px] font-bold">& Orders</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="flex items-center border border-transparent hover:border-white p-1 rounded relative">
          <div className="relative flex items-end pb-1">
            <ShoppingCart size={34} strokeWidth={1.5} />
            <span className="absolute top-[-5px] left-3 w-5 text-center text-amazon-orange font-bold text-[14px]">
              {cartCount}
            </span>
            <span className="text-[13px] font-bold sm:block hidden translate-y-1">Cart</span>
          </div>
        </Link>
      </div>

      {/* Bottom Nav */}
      <div className="bg-amazon-light_navy text-white text-[13px] font-medium px-4 h-10 flex items-center gap-1 sm:gap-4 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-1 cursor-pointer border border-transparent hover:border-white px-1 sm:px-2 py-1 rounded">
          <Menu size={20} />
          <span className="font-bold">All</span>
        </div>
        <span className="cursor-pointer border border-transparent hover:border-white px-2 py-1 rounded whitespace-nowrap">Amazon miniTV</span>
        <span className="cursor-pointer border border-transparent hover:border-white px-2 py-1 rounded whitespace-nowrap">Sell</span>
        <span className="cursor-pointer border border-transparent hover:border-white px-2 py-1 rounded whitespace-nowrap">Best Sellers</span>
        <span className="cursor-pointer border border-transparent hover:border-white px-2 py-1 rounded whitespace-nowrap">Today's Deals</span>
        <span className="cursor-pointer border border-transparent hover:border-white px-2 py-1 rounded whitespace-nowrap">Mobiles</span>
        <span className="cursor-pointer border border-transparent hover:border-white px-2 py-1 rounded whitespace-nowrap">Customer Service</span>
      </div>
    </header>
  );
};

export default Navbar;
