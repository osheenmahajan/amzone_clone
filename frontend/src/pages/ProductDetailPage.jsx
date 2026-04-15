import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await api.post('/cart', {
        product_id: product.id,
        quantity: parseInt(quantity)
      });
      fetchCartCount();
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/login');
      } else {
        console.error('Failed to add to cart:', err);
      }
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  if (loading) return <div className="p-10 text-center font-bold text-xl">Loading product details...</div>;
  if (!product) return <div className="p-10 text-center font-bold text-xl">Product not found.</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Image Area */}
        <div className="lg:w-2/5 flex justify-center items-start pt-4">
          <div className="w-full rounded-lg overflow-hidden sticky top-32 shadow-sm bg-white border border-gray-200">
            <img
              src={product.image_url || 'https://via.placeholder.com/400x400?text=Product'}
              alt={product.name}
              className="object-contain w-full h-[450px]"
            />
          </div>
        </div>

        {/* Center Column: Product Info */}
        <div className="lg:w-2/5 flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 leading-tight mb-2 tracking-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center text-amazon-orange text-sm mb-2 border-b border-gray-300 pb-2">
            {'★'.repeat(4)}{'☆'.repeat(1)}
            <span className="text-[#007185] ml-4 hover:underline cursor-pointer">4,129 ratings</span>
          </div>

          <div className="py-2">
            <div className="flex items-start">
              <span className="text-[13px] font-semibold mt-1">$</span>
              <span className="text-[32px] font-medium leading-none">{Math.floor(product.price)}</span>
              <span className="text-[13px] font-semibold mt-1">
                {((product.price % 1) * 100).toFixed(0).padStart(2, '0')}
              </span>
            </div>
            <p className="text-[13px] text-gray-500 mt-1">Suggested payments with 6 months special financing</p>
          </div>

          <div className="mt-4 border-t border-gray-300 pt-4">
             <span className="text-[#007185] font-bold text-sm">Brand:</span> <span className="text-sm">Amazon Clone Verified</span>
          </div>

          <div className="mt-4 border-t border-gray-300 pt-4">
            <h3 className="font-bold text-gray-900 mb-2 text-base">About this item</h3>
            <ul className="list-disc pl-5 text-sm text-gray-900 space-y-1">
              <li>{product.description || "High-quality product designed to meet all your needs. Durable, effective, and beautifully crafted to integrate seamlessly into your daily life."}</li>
              <li>Engineered for performance and ultimate reliability in all environments.</li>
              <li>Backed by our verified 1-year clone-store warranty.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Amazon Buy Box */}
        <div className="lg:w-1/5">
          <div className="border border-gray-300 rounded-lg p-4 flex flex-col sticky top-32 shadow-sm">
            <div className="flex items-start mb-2">
               <span className="text-[11px] font-semibold mt-[2px]">$</span>
               <span className="text-xl font-bold leading-none">{Math.floor(product.price)}</span>
               <span className="text-[11px] font-semibold mt-[2px]">
                 {((product.price % 1) * 100).toFixed(0).padStart(2, '0')}
               </span>
            </div>
            
            {product.stock > 0 ? (
              <p className="text-green-700 font-medium text-[15px] mb-4">In Stock.</p>
            ) : (
              <p className="text-red-700 font-medium text-[15px] mb-4">Currently unavailable.</p>
            )}

            <div className="mb-4">
              <label htmlFor="quantity" className="text-sm mr-2">Qty:</label>
              <select 
                id="quantity" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)}
                className="border border-gray-300 rounded-md bg-gray-100 px-2 py-1 outline-none focus:ring-1 focus:border-amazon-orange focus:ring-amazon-orange shadow-sm text-sm"
              >
                {[...Array(10).keys()].map(x => (
                  <option key={x+1} value={x+1}>{x+1}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || adding}
              className={`text-sm py-[9px] px-4 rounded-full w-full font-medium shadow-sm mb-3 transition-colors ${product.stock > 0 ? 'bg-amazon-bright_yellow hover:bg-amazon-yellow' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>

            <button 
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className={`text-sm py-[9px] px-4 rounded-full w-full font-medium shadow-sm transition-colors ${product.stock > 0 ? 'bg-[#ffa41c] hover:bg-[#fa8900]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Buy Now
            </button>

            <div className="mt-4 flex flex-col gap-[6px] text-xs text-gray-600">
              <div className="flex">
                <span className="w-16">Ships from</span>
                <span className="font-medium text-gray-900 truncate">Amazon.clone</span>
              </div>
              <div className="flex">
                <span className="w-16">Sold by</span>
                <span className="font-medium text-gray-900 truncate">Amazon.clone</span>
              </div>
              <div className="flex">
                <span className="w-16">Returns</span>
                <span className="text-[#007185] hover:underline cursor-pointer truncate">Eligible for Return, Refund or Replacement</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
