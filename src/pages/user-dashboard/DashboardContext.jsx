import { createContext, useContext } from 'react';

const DashboardContext = createContext(null);

export const DashboardProvider = DashboardContext.Provider;

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used inside UserDashboardLayout');
  }
  return context;
};

export const money = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

export const getErrorMessage = (error, fallback = 'Something went wrong. Please check the form and try again.') =>
  error?.response?.data?.message || error?.message || fallback;
