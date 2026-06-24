import { useState, useEffect } from 'react';
import { ShoppingCart, MessageSquare, Users, TrendingUp } from 'lucide-react';
import { getAnalyticsSummary } from '../api';
import { AnalyticsSummary } from '../types';
import Badge from '../components/Badge';

const Dashboard = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsSummary()
      .then((res) => setSummary(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => `${Number(n).toLocaleString('fr-DZ')} DZD`;

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-[#008E47] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { label: "Commandes aujourd'hui", value: summary?.today.orders || 0, sub: fmt(summary?.today.revenue || 0), icon: <ShoppingCart size={18} className="text-[#008E47]" />, bg: 'bg-green-50' },
          { label: 'Revenue ce mois', value: fmt(summary?.month.revenue || 0), sub: `${summary?.month.orders || 0} commandes`, icon: <TrendingUp size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Devis en attente', value: summary?.pending_quotes || 0, sub: 'Réponse requise', icon: <MessageSquare size={18} className="text-yellow-600" />, bg: 'bg-yellow-50' },
          { label: 'Nouveaux B2B', value: summary?.new_b2b || 0, sub: 'Ce mois-ci', icon: <Users size={18} className="text-purple-600" />, bg: 'bg-purple-50' },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <div className={`p-2 ${card.bg} rounded-lg`}>{card.icon}</div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Banner */}
      <div className="bg-[#008E47] rounded-xl p-6 mb-6 flex items-center justify-between">
        <div>
          <p className="text-green-100 text-sm font-medium">Revenue Total Cumulé</p>
          <p className="text-white text-4xl font-bold mt-1">{fmt(summary?.total_revenue || 0)}</p>
          <p className="text-green-200 text-sm mt-2">Toutes commandes (hors annulées)</p>
        </div>
        <TrendingUp size={64} className="text-green-200/40" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Activité Récente</h2>
        </div>
        {!summary?.recent_activity?.length ? (
          <div className="p-12 text-center text-gray-400 text-sm">Aucune activité pour le moment</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {summary.recent_activity.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.type === 'order' ? 'bg-[#008E47]' : 'bg-yellow-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-400">
                      {item.type === 'order' ? 'Commande' : 'Devis'} · {new Date(item.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.amount && <span className="text-sm font-medium text-gray-900">{fmt(item.amount)}</span>}
                  <Badge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
