import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/authContext.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewArticle from './pages/NewArticle.jsx';
import Storefront from './pages/Storefront.jsx';
import ProductPage from './pages/ProductPage.jsx';
import ArtisanPage from './pages/ArtisanPage.jsx';
import Profile from './pages/Profile.jsx';
import './i18n/index.js';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-artify-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Root Route Decider: If authenticated, show artisan Dashboard; else show public Storefront
const HomeOrDashboard = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Dashboard /> : <Storefront />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans bg-amber-50/30 text-stone-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomeOrDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/store" element={<Storefront />} />
              <Route path="/p/:id" element={<ProductPage />} />
              <Route path="/artisan/:id" element={<ArtisanPage />} />

              {/* Protected Artisan Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wizard/:id"
                element={
                  <ProtectedRoute>
                    <NewArticle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
