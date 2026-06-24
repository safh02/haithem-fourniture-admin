import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Quotes from './pages/Quotes';
import B2B from './pages/B2B';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

const protected_page = (Page: React.ComponentType) => (
  <ProtectedRoute>
    <Layout>
      <Page />
    </Layout>
  </ProtectedRoute>
);

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={protected_page(Dashboard)} />
        <Route path="/products" element={protected_page(Products)} />
        <Route path="/orders" element={protected_page(Orders)} />
        <Route path="/quotes" element={protected_page(Quotes)} />
        <Route path="/b2b" element={protected_page(B2B)} />
        <Route path="/analytics" element={protected_page(Analytics)} />
        <Route path="/settings" element={protected_page(Settings)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
