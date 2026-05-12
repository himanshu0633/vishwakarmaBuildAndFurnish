import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Build as ServicesIcon,
  Category as CategoryIcon,
  Assignment as InquiriesIcon,
  Pending as PendingIcon,
  Description as TendersIcon,
  Assessment as StatsIcon
} from '@mui/icons-material';
import RecentInquiriesTable from './RecentInquiriesTable';
import api from '../../../utils/axiosConfig'; // Import your axios instance

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalServices: 0,
    totalCategories: 0,
    pendingInquiries: 0,
    totalInquiries: 0,
    totalTenders: 0,
    openTenders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all stats in parallel
      const [
        servicesRes,
        categoriesRes,
        inquiriesRes,
        tendersRes
      ] = await Promise.allSettled([
        // Fetch services
        api.get('/services'),
        
        // Fetch categories
        api.get('/categories'),
        
        // Fetch inquiries stats
        api.get('/inquiries/stats'),
        
        // Fetch tenders stats
        api.get('/tenders/stats')
      ]);

      // Process services data
      let totalServices = 0;
      if (servicesRes.status === 'fulfilled' && servicesRes.value.data) {
        const servicesData = servicesRes.value.data;
        totalServices = Array.isArray(servicesData) ? servicesData.length : servicesData.total || servicesData.count || 0;
      }

      // Process categories data
      let totalCategories = 0;
      if (categoriesRes.status === 'fulfilled' && categoriesRes.value.data) {
        const categoriesData = categoriesRes.value.data;
        totalCategories = Array.isArray(categoriesData) ? categoriesData.length : categoriesData.total || categoriesData.count || 0;
      }

      // Process inquiries stats
      let pendingInquiries = 0;
      let totalInquiries = 0;
      if (inquiriesRes.status === 'fulfilled' && inquiriesRes.value.data) {
        const inquiriesData = inquiriesRes.value.data;
        pendingInquiries = inquiriesData.pending || 0;
        totalInquiries = inquiriesData.total || 0;
      }

      // Process tenders stats
      let totalTenders = 0;
      let openTenders = 0;
      if (tendersRes.status === 'fulfilled' && tendersRes.value.data) {
        const tendersData = tendersRes.value.data;
        totalTenders = tendersData.total || tendersData.count || 0;
        openTenders = tendersData.open || tendersData.active || 0;
      }

      setStats({
        totalServices,
        totalCategories,
        pendingInquiries,
        totalInquiries,
        totalTenders,
        openTenders
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data. Please try again later.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Total Services', 
      value: stats.totalServices, 
      icon: <ServicesIcon sx={{ fontSize: 40 }} />, 
      color: '#3b82f6',
      endpoint: '/services'
    },
    { 
      title: 'Categories', 
      value: stats.totalCategories, 
      icon: <CategoryIcon sx={{ fontSize: 40 }} />, 
      color: '#10b981',
      endpoint: '/categories'
    },
    { 
      title: 'Pending Inquiries', 
      value: stats.pendingInquiries, 
      icon: <PendingIcon sx={{ fontSize: 40 }} />, 
      color: '#f59e0b',
      endpoint: '/inquiries?status=pending'
    },
    { 
      title: 'Total Inquiries', 
      value: stats.totalInquiries, 
      icon: <InquiriesIcon sx={{ fontSize: 40 }} />, 
      color: '#8b5cf6',
      endpoint: '/inquiries'
    },
    { 
      title: 'Total Tenders', 
      value: stats.totalTenders, 
      icon: <TendersIcon sx={{ fontSize: 40 }} />, 
      color: '#ef4444',
      endpoint: '/tenders'
    },
    { 
      title: 'Open Tenders', 
      value: stats.openTenders, 
      icon: <StatsIcon sx={{ fontSize: 40 }} />, 
      color: '#06b6d4',
      endpoint: '/tenders?status=open'
    }
  ];

  const handleCardClick = (endpoint) => {
    // Navigate to the respective page
    // You can use react-router-dom navigation here
    // Example: navigate(`/admin${endpoint}`);
    console.log(`Navigate to: ${endpoint}`);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card 
              sx={{ 
                background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}05 100%)`,
                borderLeft: `4px solid ${stat.color}`,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
              onClick={() => handleCardClick(stat.endpoint)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Inquiries */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Recent Inquiries
          </Typography>
          <RecentInquiriesTable limit={5} />
        </CardContent>
      </Card>

      {/* Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;