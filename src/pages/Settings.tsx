import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { admin } = useAuth();
  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 text-sm mt-1">Informations de votre compte et configuration</p>
      </div>

      <div className="max-w-xl space-y-5">
        {/* Account */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Compte Administrateur</h2>
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
            <div className="w-14 h-14 rounded-xl bg-[#008E47] flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{admin?.name?.[0]?.toUpperCase() || 'A'}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{admin?.name || 'Administrateur'}</p>
              <p className="text-sm text-gray-500">{admin?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-[#008E47]/10 text-[#008E47] text-xs font-medium rounded-full capitalize">{admin?.role}</span>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Nom', value: admin?.name || '—' },
              { label: 'Email', value: admin?.email || '—' },
              { label: 'Rôle', value: admin?.role || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* API Connection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Connexion Backend</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">URL de l'API</p>
            <p className="text-sm font-mono text-gray-700 break-all">{apiUrl}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#008E47] rounded-full animate-pulse" />
            <p className="text-xs text-gray-500 font-medium">Backend connecté · Railway</p>
          </div>
        </div>

        {/* Brand Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Identité de marque</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Marque</span>
              <span className="text-sm font-medium text-gray-900">Haithem Fourniture</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Couleur principale</span>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-[#008E47] border border-gray-200" />
                <span className="text-sm font-mono text-gray-700">#008E47</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Marché</span>
              <span className="text-sm font-medium text-gray-900">Algérie (DZD)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Langues</span>
              <span className="text-sm font-medium text-gray-900">Français + Arabe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
