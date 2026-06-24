import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, toggleProductStatus } from '../api';
import { Product, Category } from '../types';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name_fr: '', name_ar: '', description_fr: '', description_ar: '',
    category_id: '', price: '', is_quote_only: false, status: 'draft'
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ search: search || undefined, status: statusFilter || undefined });
      setProducts(res.data.products);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [search, statusFilter]);
  useEffect(() => { getCategories().then((res) => setCategories(res.data)); }, []);

  const openAdd = () => {
    setEditProduct(null);
    setForm({ name_fr: '', name_ar: '', description_fr: '', description_ar: '', category_id: '', price: '', is_quote_only: false, status: 'draft' });
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name_fr: p.name_fr, name_ar: p.name_ar || '',
      description_fr: p.description_fr || '', description_ar: p.description_ar || '',
      category_id: String(p.category_id || ''), price: p.price ? String(p.price) : '',
      is_quote_only: p.is_quote_only, status: p.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (fileRef.current?.files) {
        Array.from(fileRef.current.files).forEach((f) => fd.append('images', f));
      }
      if (editProduct) {
        fd.append('existing_images', JSON.stringify(editProduct.images || []));
        await updateProduct(editProduct.id, fd);
      } else {
        await createProduct(fd);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      setDeleteConfirm(null);
      fetchProducts();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggle = async (id: number) => {
    await toggleProductStatus(id);
    fetchProducts();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-gray-500 text-sm mt-1">{total} produits au total</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#008E47] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#007a3d] transition-colors">
          <Plus size={16} /> Ajouter un produit
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#008E47] w-56" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#008E47]">
          <option value="">Tous les statuts</option>
          <option value="published">Publié</option>
          <option value="draft">Brouillon</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {['Produit', 'Catégorie', 'Prix', 'Statut', ''].map((h, i) => (
                <th key={i} className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide ${i === 4 ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={5} className="py-16 text-center text-gray-400 text-sm">Chargement...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="py-16 text-center text-gray-400 text-sm">Aucun produit trouvé</td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {p.images?.[0] ? (
                      <img src={p.images[0].url} alt={p.name_fr} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-medium">N/A</div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.name_fr}</p>
                      {p.name_ar && <p className="text-xs text-gray-400 mt-0.5" dir="rtl">{p.name_ar}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{p.category_name || '—'}</td>
                <td className="px-6 py-4 text-sm">
                  {p.is_quote_only
                    ? <span className="text-amber-600 font-medium">Sur devis</span>
                    : p.price ? <span className="text-gray-900 font-medium">{Number(p.price).toLocaleString()} DZD</span>
                    : <span className="text-gray-400">—</span>
                  }
                </td>
                <td className="px-6 py-4"><Badge status={p.status} /></td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleToggle(p.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title={p.status === 'published' ? 'Dépublier' : 'Publier'}>
                      {p.status === 'published' ? <EyeOff size={15} className="text-gray-400" /> : <Eye size={15} className="text-[#008E47]" />}
                    </button>
                    <button onClick={() => openEdit(p)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit2 size={15} className="text-gray-400" />
                    </button>
                    <button onClick={() => setDeleteConfirm(p.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={15} className="text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editProduct ? 'Modifier le produit' : 'Ajouter un produit'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Nom (Français) *</label>
              <input required value={form.name_fr} onChange={(e) => setForm({ ...form, name_fr: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008E47]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Nom (Arabe)</label>
              <input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} dir="rtl"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008E47]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description (FR)</label>
              <textarea value={form.description_fr} onChange={(e) => setForm({ ...form, description_fr: e.target.value })} rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008E47] resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description (AR)</label>
              <textarea value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} rows={3} dir="rtl"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008E47] resize-none" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Catégorie</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008E47]">
                <option value="">Choisir...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name_fr}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Prix (DZD)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                disabled={form.is_quote_only} placeholder={form.is_quote_only ? 'Sur devis' : '0'}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008E47] disabled:bg-gray-50 disabled:text-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Statut</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008E47]">
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.is_quote_only}
              onChange={(e) => setForm({ ...form, is_quote_only: e.target.checked, price: '' })}
              className="w-4 h-4 rounded border-gray-300 text-[#008E47] focus:ring-[#008E47]" />
            <span className="text-sm text-gray-700">Prix sur devis uniquement (canapés, tables)</span>
          </label>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Images</label>
            <input ref={fileRef} type="file" multiple accept="image/*"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#008E47] file:text-white file:text-xs file:font-medium" />
            {editProduct?.images && editProduct.images.length > 0 && (
              <div className="flex gap-2 mt-2">
                {editProduct.images.map((img, i) => (
                  <img key={i} src={img.url} alt="" className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={() => setShowModal(false)}
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={submitting}
              className="px-5 py-2.5 bg-[#008E47] text-white rounded-lg text-sm font-medium hover:bg-[#007a3d] disabled:opacity-60 transition-colors">
              {submitting ? 'Enregistrement...' : editProduct ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Supprimer le produit" size="sm">
        <p className="text-gray-600 text-sm mb-6">Cette action est irréversible. Le produit et ses images seront supprimés définitivement.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Annuler</button>
          <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">Supprimer</button>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
