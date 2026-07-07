import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with Navbar and Footer */}
        <Route path="/" element={
          <><Navbar /><EventsPage /><Footer /></>
        } />
        <Route path="/events/:id" element={
          <><Navbar /><EventDetailPage /><Footer /></>
        } />
        <Route path="/my-bookings" element={
          <><Navbar /><MyBookingsPage /><Footer /></>
        } />

        {/* Admin routes — no Navbar or Footer */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* 404 — catches all unknown routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;