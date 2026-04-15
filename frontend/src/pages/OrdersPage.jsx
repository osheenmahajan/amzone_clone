import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-10 font-bold text-center text-xl">Loading your orders...</div>;

  return (
    <div className="bg-white min-h-screen py-6 px-4">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Header section */}
        <div className="mb-6">
          <div className="flex gap-2 text-sm text-gray-500 mb-2">
            <Link to="/" className="hover:underline">Your Account</Link> › <span className="text-[#c45500]">Your Orders</span>
          </div>
          <div className="flex justify-between items-end border-b border-gray-300 pb-2">
            <h1 className="text-[28px] font-normal leading-none tracking-tight text-gray-900">Your Orders</h1>
            <div className="hidden sm:flex items-center gap-2">
               <input type="text" placeholder="Search all orders" className="border border-gray-400 rounded px-2 py-1 text-sm outline-none shadow-sm h-[32px] w-[200px]" />
               <button className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm font-medium h-[32px] hover:bg-gray-900 shadow-sm">Search Orders</button>
            </div>
          </div>
          <div className="flex gap-6 text-[15px] mt-2 font-medium border-b border-gray-200">
             <span className="text-[#007185] border-b-2 border-[#D5D9D9] hover:border-[#007185] hover:text-amazon-orange pb-2 cursor-pointer font-bold border-b-[#007185]">Orders</span>
             <span className="text-[#007185] hover:underline hover:text-amazon-orange pb-2 cursor-pointer">Buy Again</span>
             <span className="text-[#007185] hover:underline hover:text-amazon-orange pb-2 cursor-pointer">Not Yet Shipped</span>
             <span className="text-[#007185] hover:underline hover:text-amazon-orange pb-2 cursor-pointer">Cancelled Orders</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="py-10 text-center border border-[#D5D9D9] rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">You have not placed any orders.</h2>
            <Link to="/" className="bg-[#ffd814] hover:bg-[#F7CA00] px-6 py-2 rounded-lg shadow-sm font-medium border border-[#FCD200]">Start Shopping</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <p className="font-bold text-[15px]">{orders.length} orders placed</p>
            {orders.map(order => (
              <div key={order.order_id} className="border border-[#D5D9D9] rounded-lg shadow-sm overflow-hidden mb-2">
                {/* Order Meta Header */}
                <div className="bg-[#F0F2F2] px-4 md:px-6 py-3 flex flex-col md:flex-row justify-between text-sm text-gray-600 border-b border-[#D5D9D9]">
                  <div className="flex gap-8 mb-2 md:mb-0">
                    <div>
                      <p className="font-bold text-gray-800">ORDER PLACED</p>
                      <p>{new Date(order.created_at).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">TOTAL</p>
                      <p>${parseFloat(order.total_amount).toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">SHIP TO</p>
                        <p className="text-[#007185] hover:underline hover:text-amazon-orange cursor-pointer relative group">
                          Demo User 1
                          <span className="hidden group-hover:block absolute top-full left-0 bg-white border border-gray-300 p-2 rounded shadow text-black w-[200px] z-10 break-words">{order.shipping_address}</span>
                        </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 tracking-tight">ORDER # 114-{String(order.order_id).padStart(7, '0')}-983{order.order_id}</p>
                    <div className="flex gap-2 justify-end text-[#007185] mt-1">
                      <Link to={`/confirmation/${order.order_id}`} className="hover:underline hover:text-amazon-orange">View order details</Link>
                      <span className="text-gray-300">|</span>
                      <span className="hover:underline hover:text-amazon-orange cursor-pointer">Invoice</span>
                    </div>
                  </div>
                </div>

                {/* Order Items Body */}
                <div className="p-4 md:p-6 bg-white">
                  <h3 className="font-bold text-lg mb-4 leading-tight text-gray-900 tracking-tight">Delivered yesterday</h3>
                  <div className="flex flex-col gap-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-20 shrink-0">
                          {/* Generic Box Icon used for orders since specific image mapping is omitted here for simplicity */}
                          <img src="https://via.placeholder.com/150/ffffff/888888?text=Package" className="w-full object-contain shadow-sm border border-gray-200" alt="box"/>
                        </div>
                        <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium text-[15px] text-[#007185] hover:underline hover:text-amazon-orange cursor-pointer leading-tight mb-[2px]">{item.product}</p>
                            <p className="text-xs text-gray-600 mb-1">Return eligible through {(new Date(new Date(order.created_at).getTime() + 30*24*60*60*1000)).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                            <p className="text-sm font-bold text-[#B12704] mt-[2px]">${item.price.toFixed(2)} <span className="font-normal text-xs text-gray-600">x {item.quantity}</span></p>
                            <div className="mt-4 flex gap-2">
                               <button className="bg-[#ffd814] hover:bg-[#F7CA00] text-[13px] py-[6px] px-4 rounded-full border border-[#FCD200] shadow-sm font-medium">Buy it again</button>
                               <button className="bg-white hover:bg-gray-100 text-[13px] py-[6px] px-4 rounded-full border border-[#D5D9D9] shadow-sm font-medium">View your item</button>
                            </div>
                          </div>
                          <div className="sm:w-[220px] flex flex-col gap-[6px] shrink-0 border border-transparent sm:border-l sm:border-gray-200 sm:pl-5">
                             <button className="w-full bg-white hover:bg-gray-100 text-[13px] py-[5px] rounded-lg border border-[#D5D9D9] shadow-sm font-medium">Track package</button>
                             <button className="w-full bg-white hover:bg-gray-100 text-[13px] py-[5px] rounded-lg border border-[#D5D9D9] shadow-sm font-medium text-center leading-tight">Return or replace items</button>
                             <button className="w-full bg-white hover:bg-gray-100 text-[13px] py-[5px] rounded-lg border border-[#D5D9D9] shadow-sm font-medium">Share gift receipt</button>
                             <button className="w-full bg-white hover:bg-gray-100 text-[13px] py-[5px] rounded-lg border border-[#D5D9D9] shadow-sm font-medium">Write a product review</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
