import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  Scissors,
  ShoppingBag,
  Package,
  Users,
  UserCheck,
  Tag,
  Star,
  MessageSquare,
  Settings,
  BarChart3,
  LogOut,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Appointment Calendar', path: '/admin/calendar', icon: Calendar },
    { label: 'All Appointments', path: '/admin/appointments', icon: CalendarCheck },
    { label: 'Services Catalogue', path: '/admin/services', icon: Scissors },
    { label: 'Product Inventory', path: '/admin/products', icon: ShoppingBag },
    { label: 'Product Orders', path: '/admin/orders', icon: Package },
    { label: 'Client Directory', path: '/admin/customers', icon: Users },
    { label: 'Staff & Specialists', path: '/admin/staff', icon: UserCheck },
    { label: 'Offers & Packages', path: '/admin/offers', icon: Tag },
    { label: 'Guest Reviews', path: '/admin/reviews', icon: Star },
    { label: 'Contact Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { label: 'Business Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Salon Settings CMS', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-200 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#111116] border-r border-white/10 shrink-0 flex flex-col justify-between p-4 md:min-h-screen">
        <div className="space-y-6">
          {/* Header */}
          <div className="px-2 py-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-salon-gold">
              <Shield className="w-5 h-5" />
              <span className="font-serif text-lg font-bold tracking-wider text-white">
                Snip De Salon
              </span>
            </div>
            <span className="text-[10px] text-salon-gold/80 tracking-widest uppercase block mt-0.5">
              Management Suite
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-salon-gold text-black font-semibold shadow-gold-glow'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-400 hover:text-salon-gold transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> View Public Atelier
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
