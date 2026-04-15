import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [address, setAddress] = useState('123 Amazon Way, Seattle, WA 98109');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();

  useEffect(() => {
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
    loadCart();
  }, []);

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const response = await api.post('/orders', {
        shipping_address: address,
        payment_mode: 'COD'
      });
      fetchCartCount(); // Resets cart counter to 0 upon successful order conversion
      navigate(`/confirmation/${response.data.order_id}`, { state: { email_preview_url: response.data.email_preview_url } });
    } catch (error) {
       console.error("Failed to place order:", error);
       alert("Failed to place order.");
    } finally {
       setPlacingOrder(false);
    }
  };

  if (loading) return <div className="p-10 font-bold text-center text-xl">Loading secure checkout...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="p-16 text-center bg-white min-h-[500px]">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="bg-[#ffd814] hover:bg-[#F7CA00] px-6 py-2 rounded-lg shadow-sm font-medium">
          Return to home
        </button>
      </div>
    );
  }

  const orderTotal = parseFloat(subtotal).toFixed(2);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Amazon simplifies styling aggressively on checkout pages */}
      <div className="bg-gradient-to-b from-[#fafafa] to-white border-b border-gray-300 py-4 px-6 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Amazon<span className="text-amazon-orange text-sm relative -top-2">.clone</span></h1>
        <h2 className="text-[28px] font-normal leading-none hidden sm:block">Checkout (<span className="text-[#007185] hover:underline cursor-pointer" onClick={()=>navigate('/cart')}>{totalItemsCount} items</span>)</h2>
        <span className="text-gray-400 font-bold">🔒</span>
      </div>

      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row gap-6 px-4">
        
        {/* Left Side: Information Flow */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Section 1: Address */}
          <div className="bg-white px-2 sm:px-6 py-4 flex gap-4 border-b border-gray-300 pb-6">
            <span className="font-bold w-6 text-lg">1</span>
            <div className="flex-1">
               <h3 className="font-bold mb-2 text-[17px]">Shipping address</h3>
               <textarea 
                 value={address}
                 onChange={(e) => setAddress(e.target.value)}
                 className="w-full sm:w-2/3 border border-gray-400 p-2 rounded text-sm focus:ring-1 focus:ring-amazon-orange focus:border-amazon-orange outline-none resize-none shadow-sm"
                 rows="3"
               />
            </div>
          </div>

          {/* Section 2: Payment */}
          <div className="bg-white px-2 sm:px-6 py-4 flex gap-4 border-b border-gray-300 pb-6">
            <span className="font-bold w-6 text-lg">2</span>
            <div className="flex-1">
               <h3 className="font-bold mb-1 text-[17px]">Payment method</h3>
               <p className="text-sm pb-1 text-gray-800"><strong>Cash on Delivery (COD)</strong> selected for demo functionality.</p>
            </div>
          </div>

          {/* Section 3: Final Review */}
          <div className="bg-white px-2 sm:px-6 py-4 flex gap-4 rounded-lg">
            <span className="font-bold w-6 text-xl">3</span>
            <div className="flex-1">
               <h3 className="font-bold mb-4 text-xl text-gray-900 tracking-tight">Review items and shipping</h3>
               <div className="border border-[#D5D9D9] p-4 rounded-lg flex flex-col gap-4">
                 <h4 className="font-bold text-[#007185] text-lg mb-1">Guaranteed delivery: Tomorrow</h4>
                 {cartItems.map(item => (
                   <div key={item.product_id} className="flex gap-4">
                     <img src={item.image_url || 'https://via.placeholder.com/100'} className="w-16 h-16 object-contain mix-blend-multiply" alt="" />
                     <div>
                       <p className="font-bold text-sm leading-tight mb-1 tracking-tight text-gray-900">{item.name}</p>
                       <p className="text-[#B12704] font-bold text-sm">${parseFloat(item.price).toFixed(2)}</p>
                       <p className="text-gray-600 text-[13px] mt-1 font-medium">Quantity: {item.quantity}</p>
                     </div>
                   </div>
                 ))}
               </div>
               
               <div className="mt-6 border border-[#D5D9D9] bg-[#F0F2F2] p-4 rounded-lg flex items-center justify-between">
                 <button 
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="bg-[#ffd814] hover:bg-[#F7CA00] w-[200px] py-[6px] rounded-[8px] font-medium shadow-sm text-[13px] border border-[#FCD200]"
                 >
                   {placingOrder ? 'Placing...' : 'Place your order'}
                 </button>
                 <div className="text-right flex flex-col items-end">
                   <p className="text-[#B12704] font-bold text-xl leading-tight">Order total: ${orderTotal}</p>
                   <p className="text-[11px] text-gray-600 leading-tight mt-1 max-w-[200px]">By placing your order, you agree to Amazon's privacy notice and conditions of use.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary Panel */}
        <div className="w-full md:w-[320px]">
           <div className="bg-white border border-[#D5D9D9] p-5 rounded-lg flex flex-col sticky top-32 drop-shadow-sm">
             <button 
               onClick={handlePlaceOrder}
               disabled={placingOrder}
               className="bg-[#ffd814] hover:bg-[#F7CA00] w-full py-[8px] rounded-[8px] font-medium shadow-sm text-sm border border-[#FCD200] mb-2"
             >
                {placingOrder ? 'Placing your order...' : 'Place your order'}
             </button>
             <p className="text-[11px] text-center text-gray-600 mb-5 px-4 tracking-tight leading-tight">By placing your order, you agree to Amazon's privacy notice and conditions of use.</p>
             
             <h3 className="font-bold text-[17px] border-b border-gray-300 pb-2 mb-2 text-gray-900">Order Summary</h3>
             <div className="text-[13px] flex flex-col gap-[2px] text-gray-800 border-b border-gray-300 pb-2 mb-2">
               <div className="flex justify-between"><span>Items:</span> <span>${orderTotal}</span></div>
               <div className="flex justify-between"><span>Shipping & handling:</span> <span>$0.00</span></div>
               <div className="flex justify-between"><span>Total before tax:</span> <span>${orderTotal}</span></div>
               <div className="flex justify-between"><span>Estimated tax to be collected:</span> <span>$0.00</span></div>
             </div>
             <div className="flex justify-between font-bold text-xl text-[#B12704] mt-2 pb-2 mb-2">
               <span>Order total:</span> <span>${orderTotal}</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
