import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, UserCheck, X } from 'lucide-react';
import { Staff } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export function AdminStaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roleTitle, setRoleTitle] = useState('Senior Hair Stylist');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [hoursStart, setHoursStart] = useState('09:00');
  const [hoursEnd, setHoursEnd] = useState('20:00');
  const [isSaving, setIsSaving] = useState(false);

  const loadStaff = () => {
    setLoading(true);
    api.getStaff()
      .then((res) => {
        if (res.success && res.staff) setStaffList(res.staff);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const openCreateModal = () => {
    setEditingStaff(null);
    setName('');
    setEmail('');
    setPhone('');
    setRoleTitle('Senior Hair Stylist');
    setBio('');
    setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    setHoursStart('09:00');
    setHoursEnd('20:00');
    setModalOpen(true);
  };

  const openEditModal = (st: Staff) => {
    setEditingStaff(st);
    setName(st.name);
    setEmail(st.email || '');
    setPhone(st.phone || '');
    setRoleTitle(st.roleTitle);
    setBio(st.bio || '');
    setAvatar(st.avatar || '');
    setHoursStart(st.workingHoursStart || '09:00');
    setHoursEnd(st.workingHoursEnd || '20:00');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !roleTitle) {
      error('Name and Role Title are required');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name,
        email,
        phone,
        roleTitle,
        bio,
        avatar,
        workingHoursStart: hoursStart,
        workingHoursEnd: hoursEnd,
      };

      if (editingStaff) {
        await api.updateStaff(editingStaff.id, payload);
        success('Staff profile updated');
      } else {
        await api.createStaff(payload);
        success('New staff member added');
      }

      setModalOpen(false);
      loadStaff();
    } catch (err: any) {
      error(err.message || 'Failed to save staff profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this staff member profile?')) return;
    try {
      await api.deleteStaff(id);
      success('Staff member removed');
      loadStaff();
    } catch (err: any) {
      error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-salon-gold uppercase tracking-wider font-semibold">Artistic Troupe</span>
          <h1 className="text-3xl font-serif text-white mt-1">Staff & Beauticians</h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-salon-gold text-black font-semibold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors flex items-center gap-1.5 shadow-luxury"
        >
          <Plus className="w-4 h-4" /> Add Specialist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-[#141418] animate-pulse border border-white/5" />
          ))
        ) : (
          staffList.map((st) => (
            <div
              key={st.id}
              className="p-6 rounded-2xl border border-white/10 bg-[#121217] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <img
                    src={st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={st.name}
                    className="w-14 h-14 rounded-full object-cover border border-salon-gold/40 shrink-0"
                  />
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-white leading-snug">{st.name}</h3>
                    <span className="text-xs text-salon-gold font-medium block">{st.roleTitle}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{st.bio}</p>

                <div className="text-[11px] text-neutral-400 space-y-0.5">
                  <p>Contact: {st.phone || 'No phone'} • {st.email || 'No email'}</p>
                  <p>Hours: {st.workingHoursStart} – {st.workingHoursEnd}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(st)}
                  className="p-1.5 rounded-lg border border-white/10 text-neutral-300 hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(st.id)}
                  className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
                {editingStaff ? 'Edit Specialist Profile' : 'Add New Salon Specialist'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Role Title *</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Creative Director & Master Colorist"
                  required
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Bio / Certifications</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
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
                  {isSaving ? 'Saving...' : 'Save Specialist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
