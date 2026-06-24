import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { getOrders, getOrder, updateOrderStatus } from '../api';
import { Order } from '../types';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'];
const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente', confirmed: 'Confirmé', processing: 'En cours', delivered: 'Livré', cancelled: 'Annulé'
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders({ status: filter || undefined });
      setOrders(res.data.orders);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const openDetail = async (id: number) => {
    const res = await getOrder(id);
    setSelected(res.data);
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    setUpdating(true);
    try {
      await updateOrderStatus(id, status);
      fetchOrders();
      if (selected?.id === id) setSelected((prev: any) => ({ ...prev, status }));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
        <p className="text-gray-500 text-sm mt-1">{total} commandes au total</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilter('')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === '' ? 'bg-[#008E47] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}>
          Toutes ({total})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-[#008E47] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}>
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {['#', 'Client', 'Total', 'Paiement', 'Statut', 'Date', ''].map((h, i) => (
                <th key={i} className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide ${i === 6 ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={7} className="py-16 text-center text-gray-400 text-sm">Chargement...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="py-16 text-center text-gray-400 text-sm">Aucune commande</td></tr>
            ) : orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">#{o.id}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{o.customer_name}</p>
                  <p className="text-xs text-gray-400">{o.phone || o.email || '—'}</p>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {o.total ? `${Number(o.total).toLocaleString()} DZD` : '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 capitalize">{o.payment_method || '—'}</td>
                <td className="px-6 py-4"><Badge status={o.status} /></td>
                <td className="px-6 py-4 text-sm text-gray-400">{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openDetail(o.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye size={15} className="text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Commande #${selected?.id}`} size="lg">
        {selected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Informations Client</p>
                <p className="text-sm font-semibold text-gray-900">{selected.customer_name}</p>
                {selected.email && <p className="text-sm text-gray-500 mt-0.5">{selected.email}</p>}
                {selected.phone && <p className="text-sm text-gray-500 mt-0.5">{selected.phone}</p>}
                {selected.wilaya && <p className="text-sm text-gray-500 mt-0.5">{selected.wilaya}</p>}
                {selected.address && <p className="text-sm text-gray-500 mt-0.5">{selected.address}</p>}
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Détails Commande</p>
                <p className="text-sm text-gray-700">Total: <span className="font-semibold text-gray-900">{Number(selected.total || 0).toLocaleString()} DZD</span></p>
                <p className="text-sm text-gray-700 mt-1">Paiement: <span className="font-medium capitalize">{selected.payment_method || '—'}</span></p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-700">Statut:</span>
                  <Badge status={selected.status} />
                </div>
                <p className="text-sm text-gray-400 mt-1">Le {new Date(selected.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            {selected.items?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Articles commandés</p>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  {selected.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-0 border-gray-50">
                      <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-500">x{item.quantity} · {Number(item.price).toLocaleString()} DZD</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selected.notes && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Notes</p>
                <p className="text-sm text-amber-800">{selected.notes}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Changer le statut</p>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.map((s) => (
                  <button key={s} disabled={updating || selected.status === s}
                    onClick={() => handleStatusUpdate(selected.id, s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selected.status === s
                        ? 'bg-[#008E47] text-white'
                        : 'border border-gray-200 text-gray-600 hover:border-[#008E47] hover:text-[#008E47] disabled:opacity-50'
                    }`}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
