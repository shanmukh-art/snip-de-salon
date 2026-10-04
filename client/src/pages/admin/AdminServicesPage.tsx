import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Scissors, Check, X, Clock, IndianRupee } from 'lucide-react';
import { Service, ServiceCategory } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  // Create / Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [benefits, setBenefits] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [price, setPrice] = useState(1500);
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [image, setImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getServices(), api.getServiceCategories()])
      .then(([srvRes, catRes]) => {
        if (srvRes.success && srvRes.services) setServices(srvRes.services);
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
    setEditingService(null);
    setName('');
    setDescription('');
    setBenefits('');
    setDurationMinutes(45);
    setPrice(1500);
    setOriginalPrice('');
    setImage('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80');
    setIsFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setName(s.name);
    setCategoryId(s.categoryId);
    setDescription(s.description);
    setBenefits(s.benefits || '');
    setDurationMinutes(s.durationMinutes);
    setPrice(s.price);
    setOriginalPrice(s.originalPrice || '');
    setImage(s.image || '');
    setIsFeatured(s.isFeatured);
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
        benefits,
        durationMinutes,
        price,
        originalPrice: originalPrice || null,
        image,
        isFeatured,
      };

      if (editingService) {
        await api.updateService(editingService.id, payload);
        success('Service updated successfully');
      } else {
        await api.createService(payload);
        success('New service created');
      }

      setModalOpen(false);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to save service');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this service from the salon menu?')) return;
    try {
      await api.deleteService(id);
      success('Service deleted');
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to delete service');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-salon-gold uppercase tracking-wider font-semibold">Salon Catalogue</span>
          <h1 className="text-3xl font-serif text-white mt-1">Service Management</h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-salon-gold text-black font-semibold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors flex items-center gap-1.5 shadow-luxury"
        >
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

      {/* Services Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-[#141418] animate-pulse border border-white/5" />
          ))
        ) : (
          services.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl border border-white/10 bg-[#121217] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-salon-gold/20 text-salon-gold uppercase">
                    {s.category?.name || 'Exclusive'}
                  </span>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {s.durationMinutes}m
                  </span>
                </div>

                <h3 className="text-base font-serif font-semibold text-white leading-snug">{s.name}</h3>
                <p className="text-xs text-neutral-400 line-clamp-2">{s.description}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-base font-serif font-bold text-salon-gold">
                  ₹{s.price.toLocaleString('en-IN')}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(s)}
                    className="p-1.5 rounded-lg border border-white/10 text-neutral-300 hover:text-white hover:border-white/30 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl my-8 p-6 rounded-2xl bg-[#141418] border border-salon-gold/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif text-white">
                {editingService ? 'Edit Salon Treatment' : 'Add New Salon Treatment'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Service Title *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Couture Balayage & French Gloss"
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
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    min="15"
                    step="15"
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Optional strikethrough price"
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  required
                  placeholder="Detailed ritual description..."
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Key Benefits (one per line)</label>
                <textarea
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  rows={2}
                  placeholder="Deep nourishment&#10;Luminous gloss finish"
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-salon-gold"
                />
                <label htmlFor="featured" className="text-neutral-300">Feature this ritual on the homepage</label>
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
                  {isSaving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
