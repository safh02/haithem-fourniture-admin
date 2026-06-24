import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { getQuotes, respondToQuote } from '../api';
import { Quote } from '../types';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

const FILTERS = [
  { value: '', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'responded', label: 'Répondu' },
  { value: 'closed', label: 'Fermé' },
];

const Quotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<Quote | null>(null);
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await getQuotes({ status: filter || undefined });
      setQuotes(res.data.quotes);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuotes(); }, [filter]);

  const handleRespond = async () => {
    if (!selected || !response.trim()) return;
    setSubmitting(true);
    try {
      await respondToQuote(selected.id, response, 'responded');
      setSelected(null);
      setResponse('');
      fetchQuotes();
    } catch {
      alert('Erreur lors de l\'envoi de la réponse');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Demandes de Devis</h1>
        <p className="text-gray-500 text-sm mt-1">{total} demandes au total</p>
      </div>

      <div className="flex gap-2 mb-6">
        {FILTERS.map(({ value, label }) => (
          <button key={value} onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === value ? 'bg-[#008E47] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {['Client', 'Produit', 'Message', 'Statut', 'Date', ''].map((h, i) => (
                <th key={i} className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide ${i === 5 ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={6} className="py-16 text-center text-gray-400 text-sm">Chargement...</td></tr>
            ) : quotes.length === 0 ? (
              <tr><td colSpan={6} className="py-16 text-center text-gray-400 text-sm">Aucune demande de devis</td></tr>
            ) : quotes.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{q.customer_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{q.phone || q.email || '—'}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{q.product_name || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                  <p className="truncate">{q.message || '—'}</p>
                </td>
                <td className="px-6 py-4"><Badge status={q.status} /></td>
                <td className="px-6 py-4 text-sm text-gray-400">{new Date(q.created_at).toLocaleDateString('fr-FR')}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => { setSelected(q); setResponse(q.admin_response || ''); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#008E47] text-white rounded-lg text-xs font-medium hover:bg-[#007a3d] transition-colors">
                    <MessageSquare size={12} />
                    Répondre
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Response Modal */}
      <Modal isOpen={!!selected} onClose={() => { setSelected(null); setResponse(''); }} title="Répondre au devis" size="md">
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Client</p>
                <p className="font-medium text-gray-900">{selected.customer_name}</p>
                <p className="text-gray-500">{selected.phone || selected.email || '—'}</p>
              </div>
              {selected.product_name && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Produit</p>
                  <p className="font-medium text-gray-900">{selected.product_name}</p>
                </div>
              )}
            </div>

            {selected.message && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Message du client</p>
                <p className="text-sm text-blue-800">{selected.message}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Votre réponse</label>
              <textarea value={response} onChange={(e) => setResponse(e.target.value)} rows={5}
                placeholder="Bonjour, suite à votre demande de devis..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008E47] resize-none" />
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => { setSelected(null); setResponse(''); }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Annuler</button>
              <button onClick={handleRespond} disabled={submitting || !response.trim()}
                className="px-4 py-2 bg-[#008E47] text-white rounded-lg text-sm font-medium hover:bg-[#007a3d] disabled:opacity-60 transition-colors">
                {submitting ? 'Envoi...' : 'Envoyer la réponse'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Quotes;
