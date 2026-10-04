import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, ShoppingBag, AlertTriangle, X } from 'lucide-react';
import { Product, ProductCategory } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(1500);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [stock, setStock] = useState(15);
  const [sku, setSku] = useState('');
  const [image, setImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getProducts(), api.getProductCategories()])
      .then(([prdRes, catRes]) => {
        if (prdRes.success && prdRes.products) setProducts(prdRes.products);
        if (catRes.success && catRes.categories) {
          setCategories(catRes.categories);
          if (!categoryId && catRes.categories[0]) setCategoryId(catRes.categories[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice(1800);
    setDiscountPercent(0);
    setStock(20);
    setSku(`SND-PRD-${Math.floor(100 + Math.random() * 900)}`);
    setImage('https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80');
    setIsFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.categoryId);
    setDescription(p.description);
    setPrice(p.price);
    setDiscountPercent(p.discountPercent);
    setStock(p.stock);
    setSku(p.sku);
    setImage(p.image || '');
    setIsFeatured(p.isFeatured);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId || !price) {
      error('Please complete required fields');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name,
        categoryId,
        description,
        price,
        discountPercent,
        stock,
        sku,
        image,
        isFeatured,
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        success('Product updated');
      } else {
        await api.createProduct(payload);
        success('Product added to catalogue');
      }

      setModalOpen(false);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product from catalogue?')) return;
    try {
      await api.deleteProduct(id);
      success('Product removed');
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-salon-gold uppercase tracking-wider font-semibold">Salon Inventory</span>
          <h1 className="text-3xl font-serif text-white mt-1">Retail Products Management</h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-salon-gold text-black font-semibold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors flex items-center gap-1.5 shadow-luxury"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#121217] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#16161e] border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">SKU / Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Inventory Stock</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    Loading inventory...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=100&q=80'}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-white block">{p.name}</span>
                          <span className="text-[10px] font-mono text-salon-gold">{p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">
                      {p.category?.name || 'Exclusive'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      ₹{p.price}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400">
                      {p.discountPercent > 0 ? `${p.discountPercent}%` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.stock <= 5 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold text-[10px]">
                          <AlertTriangle className="w-3 h-3" /> {p.stock} units left
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium">
                          {p.stock} in stock
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg border border-white/10 text-neutral-300 hover:text-white"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg my-8 p-6 rounded-2xl bg-[#141418] border border-salon-gold/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif text-white">
                {editingProduct ? 'Edit Product Item' : 'Add Retail Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Product Title *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Caviar & Keratin Repair Mask"
                  required
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Stock Count</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg bg-salon-gold text-black font-semibold text-xs uppercase tracking-wider"
                >
                  {isSaving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
