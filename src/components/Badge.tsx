const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
  published: 'bg-emerald-100 text-emerald-800',
  draft: 'bg-gray-100 text-gray-600',
  responded: 'bg-blue-100 text-blue-800',
  closed: 'bg-gray-100 text-gray-600',
  active: 'bg-emerald-100 text-emerald-800',
  suspended: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  processing: 'En cours',
  delivered: 'Livré',
  cancelled: 'Annulé',
  published: 'Publié',
  draft: 'Brouillon',
  responded: 'Répondu',
  closed: 'Fermé',
  active: 'Actif',
  suspended: 'Suspendu',
};

const Badge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-600'}`}>
    {statusLabels[status] || status}
  </span>
);

export default Badge;
