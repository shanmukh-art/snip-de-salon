import React, { useEffect, useState } from 'react';
import { Mail, Phone, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const loadInquiries = () => {
    setLoading(true);
    api.getInquiries()
      .then((res) => {
        if (res.success && res.inquiries) setInquiries(res.inquiries);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.updateInquiryStatus(id, status);
      success(`Inquiry status set to ${status}`);
      loadInquiries();
    } catch (err: any) {
      error(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs text-salon-gold uppercase tracking-wider font-semibold">Concierge Inbox</span>
        <h1 className="text-3xl font-serif text-white mt-1">Contact Inquiries & Notes</h1>
      </div>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#141418] animate-pulse border border-white/5" />
          ))
        ) : inquiries.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl p-6 text-neutral-400">
            No inquiries received yet.
          </div>
        ) : (
          inquiries.map((inq) => (
            <div
              key={inq.id}
              className="p-6 rounded-2xl border border-white/10 bg-[#121217] space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white">{inq.name}</h3>
                  <span className="text-xs text-neutral-400">
                    {inq.email} • {inq.phone || 'No phone'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 font-mono">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </span>
                  <select
                    value={inq.status}
                    onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                    className="px-2.5 py-1 bg-[#181820] border border-white/10 rounded-lg text-xs text-salon-gold font-medium focus:outline-none"
                  >
                    <option value="NEW">NEW</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
                <span className="text-salon-gold font-semibold uppercase text-[10px] block">
                  Subject: {inq.subject || 'General Inquiry'}
                </span>
                <p className="text-neutral-300 leading-relaxed font-light">{inq.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
