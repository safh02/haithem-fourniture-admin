import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, MessageSquare,
  Users, BarChart2, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Produits', icon: Package },
  { to: '/orders', label: 'Commandes', icon: ShoppingCart },
  { to: '/quotes', label: 'Devis', icon: MessageSquare },
  { to: '/b2b', label: 'Clients B2B', icon: Users },
  { to: '/analytics', label: 'Analytiques', icon: BarChart2 },
  { to: '/settings', label: 'Paramètres', icon: Settings },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { admin, logout } = useAuth();

  return (
    <div className="w-64 min-h-screen bg-[#0d0d0d] flex flex-col fixed left-0 top-0 bottom-0 z-30">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-white font-semibold text-lg tracking-wide">
          Haithem <span className="text-[#008E47]">Fourniture</span>
        </h1>
        <p className="text-gray-500 text-xs mt-1">Panel Administrateur</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? 'bg-[#008E47] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-[#008E47] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {admin?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{admin?.name || 'Admin'}</p>
            <p className="text-gray-500 text-xs truncate">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
