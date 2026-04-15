import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../services/api';

const ConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const receiptUrl = location.state?.email_preview_url;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
       try {
         const response = await api.get(`/orders/${id}`);
         setOrder(response.data);
       } catch (err) {
         console.error("Error fetching completed order:", err);
       } finally {
         setLoading(false);
       }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="p-10 font-bold text-center text-xl">Loading your confirmation...</div>;
  if (!order) return <div className="p-10 font-bold text-center text-xl">Order not found!</div>;

  return (
    <div className="bg-white min-h-screen py-10 px-4">
      <div className="max-w-[700px] mx-auto border-2 border-[#D5D9D9] rounded-lg shadow-sm">
        
        {/* Top Header green confirmation */}
        <div className="bg-[#F0F2F2] p-8 border-b-2 border-[#D5D9D9] rounded-t-lg">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full border-[3px] border-green-600 flex justify-center items-center shadow-sm">
               <span className="text-green-600 font-bold text-2xl relative top-[-1px]">✓</span>
             </div>
             <div>
               <h1 className="text-[26px] font-normal text-[#007600] leading-tight">Order placed, thank you!</h1>
               <p className="text-sm text-gray-800 tracking-tight mt-[1px]">Confirmation will be sent to your email.</p>
               {receiptUrl && (
                  <a href={receiptUrl} target="_blank" rel="noreferrer" className="text-[#007185] text-[14px] hover:underline hover:text-amazon-orange mt-2 block font-medium underline">
                     View Live Nodemailer Receipt (Test Network)
                  </a>
               )}
             </div>
           </div>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-end border-b border-gray-200 pb-2 mb-6">
             <h2 className="text-xl font-bold tracking-tight">Order Details</h2>
             <span className="text-[13px] font-bold text-gray-700">Order #114-{id.padStart(7, '0')}-983{id}</span>
          </div>

           <div className="flex flex-col gap-6">
              <div>
                 <p className="font-bold text-gray-900 text-[17px] mb-3">{order.status || 'Confirmed'}: Guaranteed Delivery by Tomorrow</p>
                 <div className="flex flex-col gap-3">
                   {order.items.map((item, idx) => (
                     <div key={idx} className="flex items-center gap-4 border-l-[3px] border-amazon-orange pl-4 py-1">
                       <div className="flex-1">
                         <p className="font-bold text-[15px] text-[#007185] leading-tight tracking-tight">{item.product}</p>
                         <p className="text-gray-600 text-[13px] mt-[2px]">Sold by: Amazon.clone • Qty: {item.quantity}</p>
                       </div>
                       <div className="font-bold text-[15px] text-[#B12704] pr-2">
                          ${parseFloat(item.price).toFixed(2)}
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
           </div>

           <div className="mt-8 pt-4 border-t border-gray-200">
             <div className="flex font-bold justify-between text-xl">
               <span>Total Paid:</span>
               <span className="text-[#B12704]">${parseFloat(order.total_amount).toFixed(2)}</span>
             </div>
           </div>

           <div className="mt-12 text-center">
             <Link to="/" className="bg-[#ffd814] hover:bg-[#F7CA00] px-10 py-2 rounded-lg font-medium shadow-sm text-sm border border-[#FCD200] inline-block tracking-wide">
               Continue Shopping
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
