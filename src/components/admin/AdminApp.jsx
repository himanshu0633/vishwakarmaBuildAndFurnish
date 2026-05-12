import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import Login from './Login';
import Layout from './Layout';
import Dashboard from './Dashboard';
import CategoriesManagement from './CategoriesManagement';
import ServicesManagement from './ServicesManagement';
import InquiriesManagement from './InquiriesManagement';

const AdminRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="categories" element={<CategoriesManagement />} />
        <Route path="services" element={<ServicesManagement />} />
        <Route path="inquiries" element={<InquiriesManagement />} />
        <Route path="/" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

const AdminApp = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminApp;