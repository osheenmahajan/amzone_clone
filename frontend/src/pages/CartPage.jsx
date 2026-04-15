import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import CartItem from '../components/CartItem';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const response = await api.get('/cart');
      setCartItems(response.data.items);
      setSubtotal(response.data.subtotal);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) return <div className="p-10 text-center font-bold text-xl">Loading your Amazon Cart...</div>;

  return (
    <div className="bg-[#eaeded] min-h-screen py-6 px-4">
      <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Main Cart Items Area */}
        <div className="bg-white p-6 w-full lg:w-3/4 shadow-sm border border-gray-100 min-h-[400px]">
          <div className="border-b border-gray-300 pb-2 mb-4 flex justify-between items-end">
            <h1 className="text-3xl font-normal text-gray-900 tracking-tight">Shopping Cart</h1>
            <span className="text-gray-600 text-sm hidden sm:block text-right">Price</span>
          </div>

          {cartItems.length === 0 ? (
            <div className="py-10">
              <h2 className="text-xl font-bold mb-4">Your Amazon Cart is empty.</h2>
              <p className="text-sm text-[#007185] hover:underline cursor-pointer" onClick={() => navigate('/')}>
                Click here to continue shopping on the Amazon.clone homepage.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {cartItems.map((item) => (
                <CartItem key={item.product_id} item={item} onUpdate={loadCart} />
              ))}
            </div>
          )}
          
          {cartItems.length > 0 && (
            <div className="text-right mt-6 pt-2 w-full flex justify-end">
              <span className="text-lg font-medium mr-1">Subtotal ({totalItemsCount} items): </span>
              <span className="font-bold text-lg leading-none mt-[2px]">${parseFloat(subtotal).toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Subtotal Checkout Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white p-6 shadow-sm border border-gray-200 flex flex-col items-start rounded relative top-0 lg:sticky lg:top-32">
            
            {/* Delivery Banner */}
            <div className="flex items-start gap-2 mb-6 text-green-700 text-[13px] leading-tight">
              <span className="bg-green-700 text-white rounded-full min-w-4 min-h-4 flex items-center justify-center font-bold text-[10px] mt-[2px]">✓</span>
              <span>Your order is eligible for <span className="font-bold">FREE Delivery.</span> Select this option at checkout.</span>
            </div>

            <h2 className="text-lg mb-4 flex items-center gap-1">
              <span className="font-medium">Subtotal ({totalItemsCount} items): </span>
              <span className="font-bold shrink-0">${parseFloat(subtotal).toFixed(2)}</span>
            </h2>
            
            <button 
              onClick={() => navigate('/checkout')} 
              disabled={cartItems.length === 0}
              className={`w-full py-2 rounded-full font-medium shadow-sm transition-transform active:scale-95 ${cartItems.length === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#ffd814] hover:bg-[#F7CA00]'}`}
            >
              Proceed to checkout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
