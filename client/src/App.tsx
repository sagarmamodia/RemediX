import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import BookingPage from './pages/BookingPage';
import Room from './pages/Room';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const DashboardRouter = () => {
  const { userRole } = useAuth();
  
  if (userRole === 'Patient') {
    return <PatientDashboard />;
  }
  
  if (userRole === 'Doctor') {
    return <DoctorDashboard />;
  }
  
  return <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes wrapped in Layout */}
          <Route element={<Layout><Landing /></Layout>} path="/" />
          <Route element={<Layout><About /></Layout>} path="/about" />
          <Route element={<Layout><Contact /></Layout>} path="/contact" />
          <Route element={<Layout><Login /></Layout>} path="/login" />
          <Route element={<Layout><Register /></Layout>} path="/register" />
          
          {/* Protected Dashboard Route - No Main Layout (Dashboard has its own) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />

          {/* Booking Route */}
          <Route 
            path="/booking/:doctorId" 
            element={
              <ProtectedRoute allowedRoles={['Patient']}>
                <BookingPage />
              </ProtectedRoute>
            } 
          />

          {/* Video Consultation Room */}
          <Route 
            path="/room/:id" 
            element={
              <ProtectedRoute>
                <Room />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Layout><div className="p-8 text-center">404 - Not Found</div></Layout>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
