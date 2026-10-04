import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';

export function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    api.getProducts({ isFeatured: 'true' })
      .then((res) => {
        if (res.success && res.products) {
          setProducts(res.products.slice(0, 4));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="flex items-center gap-2 text-salon-gold text-xs uppercase tracking-[0.2em] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Salon Apothecary</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
            Curated Beauty & Hair Formulations
          </h2>
          <p className="text-neutral-400 text-sm font-light mt-2 max-w-xl">
            Maintain your salon-revitalized texture and luminosity at home with our professional-grade hair elixirs, active serums, and body soaks.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-salon-gold hover:text-white transition-colors group font-medium"
        >
          <span>View All Products</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-[#141418] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const discountedPrice = product.price * (1 - product.discountPercent / 100);
            return (
              <div
                key={product.id}
                className="group rounded-2xl border border-white/10 bg-[#131317] overflow-hidden flex flex-col justify-between luxury-card-hover"
              >
                <div className="relative h-56 bg-[#1a1a20] overflow-hidden">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {product.discountPercent > 0 && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-salon-gold text-black text-[10px] font-bold uppercase">
                      {product.discountPercent}% Off
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1 text-salon-gold text-xs mb-1">
                      <Star className="w-3.5 h-3.5 fill-salon-gold" />
                      <span className="font-semibold text-white">{product.rating}</span>
                      <span className="text-neutral-500 font-mono text-[10px]">({product.sku})</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-salon-gold transition-colors leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-base font-serif font-bold text-salon-gold">
                        ₹{discountedPrice.toLocaleString('en-IN')}
                      </span>
                      {product.discountPercent > 0 && (
                        <span className="text-xs text-neutral-500 line-through ml-1.5">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="p-2.5 rounded-lg bg-salon-gold/15 hover:bg-salon-gold text-salon-gold hover:text-black transition-colors"
                      title="Add to Shopping Bag"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
