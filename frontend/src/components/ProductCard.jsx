import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { fetchCartCount } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      await api.post('/cart', {
        product_id: product.id,
        quantity: 1
      });
      fetchCartCount(); 
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/login');
      } else {
        console.error('Failed to add to cart:', err);
      }
    }
  };

  return (
    <div className="bg-white z-10 flex flex-col p-4 w-full mx-auto relative hover:-translate-y-1 transition-transform duration-200 cursor-pointer shadow-sm">
      <Link to={`/product/${product.id}`} className="flex-1 flex flex-col">
        {/* Title */}
        <h3 className="line-clamp-2 text-[15px] hover:text-amazon-orange font-medium h-10 mb-1">
          {product.name}
        </h3>
        
        {/* Mock Rating */}
        <div className="flex text-amazon-orange text-sm mb-2 items-center">
          {'★'.repeat(4)}{'☆'.repeat(1)}
          <span className="text-[#007185] ml-2 text-xs hover:text-amazon-orange hover:underline">
            {Math.floor(Math.random() * 5000) + 100}
          </span>
        </div>
        
        {/* Image */}
        <div className="flex justify-center items-center h-48 mb-4">
          <img 
            src={product.image_url || 'https://via.placeholder.com/200x200?text=Product'} 
            alt={product.name} 
            className="object-contain h-full w-full mix-blend-multiply"
          />
        </div>

        {/* Price */}
        <div className="mb-5 flex items-start">
          <span className="text-[11px] align-top mt-1 font-semibold">$</span>
          <span className="text-[28px] font-semibold leading-none">{Math.floor(product.price)}</span>
          <span className="text-[11px] align-top mt-1 font-semibold">
            {((product.price % 1) * 100).toFixed(0).padStart(2, '0')}
          </span>
        </div>
        
        {/* Delivery Hook */}
        {product.stock > 0 ? (
           <p className="text-[13px] mb-1"><span className="font-bold text-amazon-light_navy">FREE Delivery</span> over $35</p>
        ) : (
           <p className="text-[13px] text-red-700 mb-1 font-medium pb-4">Currently unavailable.</p>
        )}
      </Link>

      {/* Add To Cart Button */}
      {product.stock > 0 && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart();
          }}
          className="bg-amazon-bright_yellow hover:bg-amazon-yellow text-sm py-2 rounded-full mt-auto shadow-sm w-full font-medium active:scale-95 transition-transform"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
