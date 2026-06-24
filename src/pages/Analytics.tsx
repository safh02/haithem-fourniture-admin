import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getRevenueChart, getTopProducts, getCategoryBreakdown } from '../api';

const Analytics = () => {
  const [revenue, setRevenue] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getRevenueChart(), getTopProducts(), getCategoryBreakdown()])
      .then(([r, t, c]) => {
        setRevenue(r.data.map((d: any) => ({
          ...d,
          date: new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
          revenue: parseFloat(d.revenue),
          orders: parseInt(d.orders),
        })));
        setTopProducts(t.data);
        setCategories(c.data.map((d: any) => ({
          ...d,
          total_sold: parseInt(d.total_sold),
          product_count: parseInt(d.product_count),
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => `${n.toLocaleString()} DZD`;

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-[#008E47] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const totalRevenue = revenue.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = revenue.reduce((sum, d) => sum + d.orders, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytiques</h1>
        <p className="text-gray-500 text-sm mt-1">Performances des 30 derniers jours</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-5 mb-6">
        <div className="bg-[#008E47] rounded-xl p-6 text-white">
          <p className="text-green-100 text-sm font-medium">Revenue (30 jours)</p>
          <p className="text-3xl font-bold mt-1">{fmt(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Commandes (30 jours)</p>
          <p className="text-3xl font-bold mt-1 text-gray-900">{totalOrders}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-6">Evolution du Revenue</h2>
        {revenue.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
            Aucune donnée disponible — Les commandes apparaîtront ici
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenue} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val: any) => [fmt(val), 'Revenue']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#008E47" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Top 5 Produits</h2>
          {topProducts.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">Aucune vente enregistrée</div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#008E47]/10 text-[#008E47] text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name_fr}</p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                      <div className="bg-[#008E47] h-1.5 rounded-full" style={{ width: `${Math.min(100, (parseInt(p.total_sold) / (parseInt(topProducts[0]?.total_sold) || 1)) * 100)}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 flex-shrink-0">{p.total_sold} vendus</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Ventes par Catégorie</h2>
          {categories.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">Aucune donnée</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categories} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', fontSize: '12px' }} />
                <Bar dataKey="total_sold" fill="#008E47" radius={[4, 4, 0, 0]} name="Vendus" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
