import React, { useState } from 'react';
import { User, Lock, Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export function ProfileSettingsPage() {
  const { user, updateUser } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await api.updateProfile({ name, phone, address });
      if (res.success) {
        updateUser({ name, phone, address });
        success('Personal details updated successfully');
      }
    } catch (err: any) {
      error(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setIsChangingPass(true);
    try {
      const res = await api.changePassword({ currentPassword, newPassword });
      if (res.success) {
        success('Password updated securely');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err: any) {
      error(err.message || 'Failed to change password. Verify your current password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-serif text-white">Account Settings & Profile</h1>
        <p className="text-xs text-neutral-400">
          Manage your personal information, contact numbers, and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#121217] space-y-6">
          <div className="flex items-center gap-2 text-salon-gold">
            <User className="w-5 h-5" />
            <h3 className="text-lg font-serif text-white">Personal Profile</h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#181820] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/5 rounded-xl text-neutral-400 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98480 12345"
                className="w-full px-3.5 py-2.5 bg-[#181820] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">Default Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="Street address in Visakhapatnam..."
                className="w-full px-3.5 py-2 bg-[#181820] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full py-2.5 rounded-xl bg-salon-gold text-black font-semibold uppercase tracking-wider text-xs hover:bg-yellow-400 transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Details
            </button>
          </form>
        </div>

        {/* Security & Password */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#121217] space-y-6">
          <div className="flex items-center gap-2 text-salon-gold">
            <Lock className="w-5 h-5" />
            <h3 className="text-lg font-serif text-white">Security & Password</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 bg-[#181820] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-neutral-400 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 bg-[#181820] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPass}
              className="w-full py-2.5 rounded-xl border border-salon-gold/50 text-salon-gold hover:bg-salon-gold hover:text-black font-semibold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" /> Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
