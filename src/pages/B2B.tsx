import { useState, useEffect } from 'react';
import { Plus, Edit2, ChevronDown, ChevronUp, Percent } from 'lucide-react';
import { getB2BClients, getB2BClient, createB2BClient, updateB2BClient } from '../api';
import { B2BClient } from '../types';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

const B2B = () => {
  const [clients, setClients] = useState<B2BClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState<B2BClient | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [expandedData, setExpandedData] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    company_name: '', contact_name: '', email: '', password: '',
    phone: '', address: '', status: 'active'
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await getB2BClients();
      setClients(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const openAdd = () => {
    setEditClient(null);
    setForm({ company_name: '', contact_name: '', email: '', password: '', phone: '', address: '', status: 'active' });
    setShowModal(true);
  };

  const openEdit = (c: B2BClient) => {
    setEditClient(c);
    setForm({ company_name: c.company_name, contact_name: c.contact_name || '', email: c.email, password: '', phone: c.phone || '', address: c.address || '', status: c.status });
    setShowModal(true);
  };

  const toggleExpand = async (id: number) => {
    if (expanded === id) { setExpanded(null); setExpandedData(null); return; }
    setExpanded(id);
    try {
      const res = await getB2BClient(id);
      setExpandedData(res.data);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editClient) {
        const { password, ...data } = form;
        await updateB2BClient(editClient.id, data);
      } else {
        await createB2BClient(form);
      }
      setShowModal(false);
      fetchClients();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients B2B</h1>
          <p className="text-gray-500 text-sm mt-1">{clients.length} clients professionnels</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#008E47] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#007a3d] transition-colors">
          <Plus size={16} /> Ajouter un client
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-100">Chargement...</div>
        ) : clients.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-100">
            <Users className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            Aucun client B2B pour le moment
          </div>
        ) : clients.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#008E47]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#008E47] font-bold text-base">{c.company_name[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{c.company_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {c.contact_name && `${c.contact_name} · `}{c.email}
                    {c.phone && ` · ${c.phone}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge status={c.status} />
                <button onClick={() => openEdit(c)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit2 size={14} className="text-gray-400" />
                </button>
                <button onClick={() => toggleExpand(c.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  {expanded === c.id ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                </button>
              </div>
            </div>

            {expanded === c.id && expandedData && (
              <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <Percent size={14} className="text-[#008E47]" />
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Remises Configurées</p>
                </div>
                {!expandedData.discounts?.length ? (
                  <p className="text-sm text-gray-400">Aucune remise configurée pour ce client</p>
                ) : (
                  <div className="space-y-2">
                    {expandedData.discounts.map((d: any) => (
                      <div key={d.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-gray-100">
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase">{d.type === 'category' ? 'Catégorie' : 'Produit'}</span>
                          <span className="text-sm text-gray-700 ml-2">#{d.reference_id}</span>
                        </div>
                        <span className="text-sm font-bold text-[#008E47]">-{d.discount_percent}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editClient ? 'Modifier le client' : 'Nouveau client B2B'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Nom de l'entreprise *</label>
            <input required value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008E47]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Contact</label>
              <input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008E47]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Téléphone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008E47]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email *</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={!!editClient}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008E47] disabled:bg-gray-50 disabled:text-gray-400" />
          </div>
          {!editClient && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Mot de passe *</label>
              <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008E47]" />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Adresse</label>
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008E47] resize-none" />
          </div>
          {editClient && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Statut</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008E47]">
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Annuler</button>
            <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-[#008E47] text-white rounded-lg text-sm font-medium hover:bg-[#007a3d] disabled:opacity-60">
              {submitting ? 'Enregistrement...' : editClient ? 'Modifier' : 'Créer le compte'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Needed for empty state icon
const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default B2B;
