import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Extract URL queries pushed by the Navbar
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search');
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get('/products', {
          params: {
            search: searchTerm || undefined,
            category: categoryFilter || undefined
          }
        });
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchTerm, categoryFilter]); // Rerun fetch whenever URL changes

  return (
    <div className="max-w-[1500px] mx-auto relative bg-amazon-bg min-h-screen">
      {/* Banner / Carousel (Hidden when searching so user sees results instantly) */}
      {!searchTerm && !categoryFilter && (
        <div className="relative">
          <div className="absolute w-full h-[50%] bg-gradient-to-t from-[#eaeded] to-transparent bottom-0 z-10 pointer-events-none" />
          <Carousel
            autoPlay
            infiniteLoop
            showStatus={false}
            showIndicators={false}
            showThumbs={false}
            interval={5000}
          >
            <div>
              <img loading="lazy" src="https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg" alt="Banner 1" />
            </div>
            <div>
              <img loading="lazy" src="https://m.media-amazon.com/images/I/71Ie3JXGfVL._SX3000_.jpg" alt="Banner 2" />
            </div>
            <div>
              <img loading="lazy" src="https://m.media-amazon.com/images/I/71U-Q+N7PXL._SX3000_.jpg" alt="Banner 3" />
            </div>
          </Carousel>
        </div>
      )}

      {/* Product Grid Layout */}
      {/* Remove heavy negative margin if searching so cards don't overlap nothing */}
      <div className={`grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-5 relative z-20 pb-10 ${(!searchTerm && !categoryFilter) ? '-mt-10 sm:-mt-20 lg:-mt-48 xl:-mt-72' : 'pt-6'}`}>
        
        {loading ? (
           <div className="col-span-full flex justify-center py-20 text-xl font-bold bg-white/50 rounded shadow-sm">
             Loading products...
           </div>
        ) : products.length > 0 ? (
          products.map(product => (
             <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-lg bg-white shadow-sm font-medium text-gray-500 rounded">
             {searchTerm || categoryFilter 
               ? "No products found matching your search. Try a different keyword." 
               : "No products found in the database."}
          </div>
        )}

      </div>
    </div>
  );
};

export default HomePage;
