import React from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const CartItem = ({ item, onUpdate }) => {
  const { fetchCartCount } = useCart();

  const handleUpdate = async (newQuantity) => {
    try {
      await api.put(`/cart/${item.product_id}`, { quantity: parseInt(newQuantity) });
      fetchCartCount();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  const handleRemove = async () => {
    try {
      await api.delete(`/cart/${item.product_id}`);
      fetchCartCount();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-300 bg-white">
      {/* Dynamic Image mapping */}
      <div className="w-[150px] sm:w-[200px] shrink-0 p-2">
         <img src={item.image_url || "https://via.placeholder.com/200x200?text=Product"} className="object-contain w-full h-[150px]" alt="Product" />
      </div>

      <div className="flex flex-col flex-1 pl-2 text-gray-900">
        <div className="flex justify-between items-start">
           <Link to={`/product/${item.product_id}`} className="text-lg font-medium text-gray-900 hover:text-amazon-orange hover:underline max-w-[80%] leading-tight">
             {item.name}
           </Link>
           <span className="text-xl font-bold">${parseFloat(item.price).toFixed(2)}</span>
        </div>
        
        <p className="text-green-700 text-xs mb-1 mt-2">In Stock</p>
        <div className="text-xs text-gray-500 mb-2">Eligible for FREE Shipping & <span className="text-amazon-light_navy font-bold">FREE Returns</span></div>
        
        <div className="flex items-center gap-4 mt-auto pt-4 shadow-sm pb-1 w-fit">
          <div className="bg-[#F0F2F2] border border-[#D5D9D9] rounded-lg shadow-sm w-fit flex items-center overflow-hidden drop-shadow-sm">
             <span className="pl-3 pr-1 text-sm text-gray-800 bg-[#F0F2F2]">Qty:</span>
             <select 
               className="bg-[#F0F2F2] px-2 py-1 outline-none text-sm cursor-pointer"
               value={item.quantity}
               onChange={(e) => handleUpdate(e.target.value)}
             >
               {[...Array(10).keys()].map(x => (
                 <option key={x} value={x}>{x} {x===0 && '(Delete)'}</option>
               ))}
             </select>
          </div>
          <span className="text-gray-300">|</span>
          <button onClick={handleRemove} className="text-[13px] text-[#007185] hover:underline hover:text-amazon-orange">
            Delete
          </button>
          <span className="text-gray-300 hidden sm:block">|</span>
          <button className="text-[13px] text-[#007185] hover:underline hover:text-amazon-orange hidden sm:block">
            Save for later
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
