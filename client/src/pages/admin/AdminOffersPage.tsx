import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Tag, X } from 'lucide-react';
import { Offer } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState(25000);
  const [offerPrice, setOfferPrice] = useState(19999);
  const [badgeText, setBadgeText] = useState('Festive Exclusive');
  const [validUntil, setValidUntil] = useState('2026-12-31');
  const [terms, setTerms] = useState('Advance booking of at least 3 days required.');
  const [image, setImage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadOffers = () => {
    setLoading(true);
    api.getOffers()
      .then((res) => {
        if (res.success && res.offers) setOffers(res.offers);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const openCreateModal = () => {
    setEditingOffer(null);
    setTitle('');
    setDescription('');
    setOriginalPrice(25000);
    setOfferPrice(19999);
    setBadgeText('Bridal Special');
    setValidUntil('2026-12-31');
    setTerms('Prior booking required.');
    setImage('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80');
    setModalOpen(true);
  };

  const openEditModal = (o: Offer) => {
    setEditingOffer(o);
    setTitle(o.title);
    setDescription(o.description);
    setOriginalPrice(o.originalPrice);
    setOfferPrice(o.offerPrice);
    setBadgeText(o.badgeText || '');
    setValidUntil(o.validUntil || '');
    setTerms(o.terms || '');
    setImage(o.image || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !originalPrice || !offerPrice) {
      error('Title and Prices are required');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title,
        description,
        originalPrice,
        offerPrice,
        badgeText,
        validUntil,
        terms,
        image,
      };

      if (editingOffer) {
        await api.updateOffer(editingOffer.id, payload);
        success('Package offer updated');
      } else {
        await api.createOffer(payload);
        success('New package offer launched');
      }

      setModalOpen(false);
      loadOffers();
    } catch (err: any) {
      error(err.message || 'Failed to save offer');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this promotional package?')) return;
    try {
      await api.deleteOffer(id);
      success('Offer deleted');
      loadOffers();
    } catch (err: any) {
      error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-salon-gold uppercase tracking-wider font-semibold">Campaign Management</span>
          <h1 className="text-3xl font-serif text-white mt-1">Offers & Packages</h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-salon-gold text-black font-semibold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors flex items-center gap-1.5 shadow-luxury"
        >
          <Plus className="w-4 h-4" /> Create Offer Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-[#141418] animate-pulse border border-white/5" />
          ))
        ) : (
          offers.map((o) => (
            <div
              key={o.id}
              className="p-5 rounded-2xl border border-white/10 bg-[#121217] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-salon-gold/20 text-salon-gold uppercase">
                    {o.badgeText || 'Special Offer'}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">Until: {o.validUntil}</span>
                </div>
                <h3 className="text-lg font-serif font-semibold text-white leading-snug">{o.title}</h3>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{o.description}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xl font-serif font-bold text-salon-gold">₹{o.offerPrice}</span>
                  <span className="text-xs text-neutral-500 line-through ml-2">₹{o.originalPrice}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(o)}
                    className="p-1.5 rounded-lg border border-white/10 text-neutral-300 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(o.id)}
                    className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg my-8 p-6 rounded-2xl bg-[#141418] border border-salon-gold/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif text-white">
                {editingOffer ? 'Edit Package' : 'Create Package Offer'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Package Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Royal Bridal Symphony"
                  required
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Original Fee (₹) *</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Offer Price (₹) *</label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="e.g. Bridal Exclusive"
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Valid Until (YYYY-MM-DD)</label>
                  <input
                    type="text"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Package Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Terms & Conditions</label>
                <input
                  type="text"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
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
                  {isSaving ? 'Saving...' : 'Save Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
