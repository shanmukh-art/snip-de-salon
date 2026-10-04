import React, { useEffect, useState } from 'react';
import { Save, Building, Phone, Mail, Clock, Share2, Shield } from 'lucide-react';
import { SiteSettings } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    api.getSettings()
      .then((res) => {
        if (res.success && res.settings) setSettings(res.settings);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateSettings(settings);
      if (res.success) {
        success('Salon business settings updated successfully');
      }
    } catch (err: any) {
      error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-neutral-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <span className="text-xs text-salon-gold uppercase tracking-wider font-semibold">Central Configuration CMS</span>
        <h1 className="text-3xl font-serif text-white mt-1">Salon Identity & Business Rules</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Salon Basic Identity */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#121217] space-y-4">
          <h3 className="text-lg font-serif text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-salon-gold" /> Salon Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">Salon Legal Name</label>
              <input
                type="text"
                value={settings.salonName || ''}
                onChange={(e) => handleChange('salonName', e.target.value)}
                className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">Concierge Telephone</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">Official Email Desk</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
              />
            </div>
          </div>
        </div>

        {/* Address & Timings */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#121217] space-y-4">
          <h3 className="text-lg font-serif text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-salon-gold" /> Physical Coordinates & Working Hours
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">Street Address</label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">City</label>
              <input
                type="text"
                value={settings.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">Pincode</label>
              <input
                type="text"
                value={settings.postalCode || ''}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">Operating Hours Notice</label>
              <input
                type="text"
                value={settings.openingHours || ''}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
              />
            </div>
          </div>
        </div>

        {/* Business Policies */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#121217] space-y-4">
          <h3 className="text-lg font-serif text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-salon-gold" /> Salon Business Policies & Taxes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">Cancellation Notice Hours</label>
              <input
                type="number"
                value={settings.cancellationPolicyHours || 2}
                onChange={(e) => handleChange('cancellationPolicyHours', Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">GST / Tax Rate %</label>
              <input
                type="number"
                value={settings.taxRatePercent || 18}
                onChange={(e) => handleChange('taxRatePercent', Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">Booking Confirmation Notice</label>
              <input
                type="text"
                value={settings.bookingNotice || ''}
                onChange={(e) => handleChange('bookingNotice', e.target.value)}
                className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-salon-gold hover:bg-yellow-400 text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-luxury flex items-center gap-2 disabled:opacity-40"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings to CMS'}
        </button>
      </form>
    </div>
  );
}
