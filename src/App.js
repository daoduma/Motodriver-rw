// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import DriversPage from './pages/DriversPage';
import DriverDetailPage from './pages/DriverDetailPage';
import DriverProfilePage from './pages/DriverProfilePage';
import ProfilePage from './pages/ProfilePage';

function AppShell() {
  // Register PWA service worker
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => console.log('SW registered'))
        .catch(console.error);
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/drivers/:id" element={<DriverDetailPage />} />
          <Route path="/driver-profile" element={<DriverProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* 404 */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2>404 — Page not found</h2>
              <a href="/" style={{ color: 'var(--green-mid)', marginTop: 16, display: 'inline-block' }}>
                Go home
              </a>
            </div>
          } />
        </Routes>
      </main>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
            borderRadius: '10px',
            maxWidth: '340px',
          },
          success: { iconTheme: { primary: '#2d8a5e', secondary: 'white' } },
        }}
      />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
