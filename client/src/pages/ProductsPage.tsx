import React, { useEffect, useState } from 'react';
import { Sparkles, Search, ShoppingBag, Star, Check, X } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [loading, setLoading] = useState(true);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    Promise.all([api.getProductCategories(), api.getProducts()])
      .then(([catRes, prdRes]) => {
        if (catRes.success && catRes.categories) setCategories(catRes.categories);
        if (prdRes.success && prdRes.products) setProducts(prdRes.products);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products
    .filter((p) => {
      const matchesCat =
        selectedCategory === 'all' ||
        p.categoryId === selectedCategory ||
        p.category?.slug === selectedCategory;

      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') {
        const pA = a.price * (1 - a.discountPercent / 100);
        const pB = b.price * (1 - b.discountPercent / 100);
        return pA - pB;
      }
      if (sortBy === 'price-high') {
        const pA = a.price * (1 - a.discountPercent / 100);
        const pB = b.price * (1 - b.discountPercent / 100);
        return pB - pA;
      }
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-salon-gold text-xs uppercase tracking-[0.2em] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Beauty Apothecary</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight">
          Salon-Grade Retail Products
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
          Elevate your daily home ritual with the exact same professional bonding serums, caviar hair masks, and botanical scrubs used by our master stylists in Sujatha Nagar.
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#121217] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title, ingredients, or SKU..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#181820] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-salon-gold"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-salon-gold"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all whitespace-nowrap border ${
              selectedCategory === 'all'
                ? 'border-salon-gold bg-salon-gold text-black font-semibold shadow-gold-glow'
                : 'border-white/10 bg-[#16161c] text-neutral-300 hover:border-white/30'
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all whitespace-nowrap border ${
                selectedCategory === c.id
                  ? 'border-salon-gold bg-salon-gold text-black font-semibold shadow-gold-glow'
                  : 'border-white/10 bg-[#16161c] text-neutral-300 hover:border-white/30'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-[#141418] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl space-y-3">
          <h3 className="text-xl font-serif text-white">No products found</h3>
          <p className="text-xs text-neutral-400">Try changing your search terms or category selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const effPrice = product.price * (1 - product.discountPercent / 100);
            return (
              <div
                key={product.id}
                className="group rounded-2xl border border-white/10 bg-[#131317] overflow-hidden flex flex-col justify-between luxury-card-hover"
              >
                <div
                  onClick={() => setDetailProduct(product)}
                  className="relative h-60 bg-[#1a1a20] overflow-hidden cursor-pointer"
                >
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
                  {product.stock <= 5 && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-rose-500/80 text-white text-[10px] font-semibold">
                      Only {product.stock} Left
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
                    <h3
                      onClick={() => setDetailProduct(product)}
                      className="text-sm font-semibold text-white group-hover:text-salon-gold transition-colors leading-snug cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-base font-serif font-bold text-salon-gold">
                        ₹{effPrice.toLocaleString('en-IN')}
                      </span>
                      {product.discountPercent > 0 && (
                        <span className="text-xs text-neutral-500 line-through ml-1.5">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      className="px-3 py-2 rounded-lg bg-salon-gold hover:bg-yellow-400 text-black font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 disabled:opacity-40"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{product.stock <= 0 ? 'Out of Stock' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Quick View Modal */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#141418] border border-salon-gold/30 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="relative h-64 overflow-hidden bg-[#1a1a20]">
              <img
                src={detailProduct.image || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80'}
                alt={detailProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setDetailProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-salon-gold font-semibold uppercase tracking-wider">
                  {detailProduct.category?.name || 'Exclusive Care'}
                </span>
                <span className="text-xs text-neutral-400 font-mono">SKU: {detailProduct.sku}</span>
              </div>

              <h2 className="text-xl font-serif text-white">{detailProduct.name}</h2>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">{detailProduct.description}</p>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 uppercase block">Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-serif font-bold text-salon-gold">
                      ₹{(detailProduct.price * (1 - detailProduct.discountPercent / 100)).toLocaleString('en-IN')}
                    </span>
                    {detailProduct.discountPercent > 0 && (
                      <span className="text-xs text-neutral-500 line-through">
                        ₹{detailProduct.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart(detailProduct);
                    setDetailProduct(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-salon-gold text-black font-semibold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
