import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useParams
} from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Avatar,
  Tabs,
  Tab,
  InputAdornment
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Build as ServicesIcon,
  Assignment as InquiriesIcon,
  People as UsersIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon,
  TrendingUp as TrendingUpIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from './AuthContext';

// API configuration
const API_URL = 'http://localhost:5000/api';

// Auth Context
const AuthContext = React.createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      axios.get(`${API_URL}/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        setUser(response.data.user);
      }).catch(() => {
        localStorage.removeItem('token');
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Login Component
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            Admin Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalServices: 0,
    totalCategories: 0,
    pendingInquiries: 0,
    totalInquiries: 0
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [servicesRes, categoriesRes, inquiriesRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats/services`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/admin/stats/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/admin/stats/inquiries`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats({
        totalServices: servicesRes.data.total,
        totalCategories: categoriesRes.data.total,
        pendingInquiries: inquiriesRes.data.pending,
        totalInquiries: inquiriesRes.data.total
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Services', value: stats.totalServices, icon: <ServicesIcon sx={{ fontSize: 40 }} />, color: '#3b82f6' },
    { title: 'Categories', value: stats.totalCategories, icon: <CategoryIcon sx={{ fontSize: 40 }} />, color: '#10b981' },
    { title: 'Pending Inquiries', value: stats.pendingInquiries, icon: <PendingIcon sx={{ fontSize: 40 }} />, color: '#f59e0b' },
    { title: 'Total Inquiries', value: stats.totalInquiries, icon: <InquiriesIcon sx={{ fontSize: 40 }} />, color: '#8b5cf6' }
  ];

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
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}05 100%)`,
              borderLeft: `4px solid ${stat.color}`
            }}>
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
    </Box>
  );
};

// Categories Management
const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ category: '', icon: '', order: 0 });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        category: category.category,
        icon: category.icon,
        order: category.order || 0
      });
    } else {
      setEditingCategory(null);
      setFormData({ category: '', icon: '📦', order: 0 });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({ category: '', icon: '📦', order: 0 });
  };

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        await axios.put(`${API_URL}/admin/categories/${editingCategory._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({ open: true, message: 'Category updated successfully', severity: 'success' });
      } else {
        await axios.post(`${API_URL}/admin/categories`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({ open: true, message: 'Category created successfully', severity: 'success' });
      }
      fetchCategories();
      handleCloseDialog();
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Operation failed', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${API_URL}/admin/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({ open: true, message: 'Category deleted successfully', severity: 'success' });
        fetchCategories();
      } catch (error) {
        setSnackbar({ open: true, message: error.response?.data?.message || 'Delete failed', severity: 'error' });
      }
    }
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Categories Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Icon</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Services Count</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>
                  <Typography variant="h5">{category.icon}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="medium">{category.category}</Typography>
                </TableCell>
                <TableCell>{category.order}</TableCell>
                <TableCell>{category.servicesCount || 0}</TableCell>
                <TableCell>
                  <Chip
                    label={category.isActive ? 'Active' : 'Inactive'}
                    color={category.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(category)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(category._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Icon (Emoji)"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            margin="normal"
            placeholder="e.g., 🔧"
          />
          <TextField
            fullWidth
            label="Display Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Services Management
const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    emoji: '🔧',
    popular: false,
    categoryId: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/admin/services`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/admin/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setServices(servicesRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        desc: service.desc,
        emoji: service.emoji,
        popular: service.popular,
        categoryId: service.categoryId?._id || service.categoryId
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        desc: '',
        emoji: '🔧',
        popular: false,
        categoryId: ''
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.categoryId) {
      setSnackbar({ open: true, message: 'Please select a category', severity: 'error' });
      return;
    }

    try {
      if (editingService) {
        await axios.put(`${API_URL}/admin/services/${editingService._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({ open: true, message: 'Service updated successfully', severity: 'success' });
      } else {
        await axios.post(`${API_URL}/admin/services`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({ open: true, message: 'Service created successfully', severity: 'success' });
      }
      fetchData();
      handleCloseDialog();
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Operation failed', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`${API_URL}/admin/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({ open: true, message: 'Service deleted successfully', severity: 'success' });
        fetchData();
      } catch (error) {
        setSnackbar({ open: true, message: error.response?.data?.message || 'Delete failed', severity: 'error' });
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingService(null);
    setFormData({
      name: '',
      desc: '',
      emoji: '🔧',
      popular: false,
      categoryId: ''
    });
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Services Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          Add Service
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Icon</TableCell>
              <TableCell>Service Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Popular</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell>
                  <Typography variant="h5">{service.emoji}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="medium">{service.name}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={service.categoryId?.category || 'N/A'} size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 300 }}>
                    {service.desc.length > 50 ? `${service.desc.substring(0, 50)}...` : service.desc}
                  </Typography>
                </TableCell>
                <TableCell>
                  {service.popular && <Chip label="Popular" color="warning" size="small" />}
                </TableCell>
                <TableCell>
                  <Chip
                    label={service.isActive ? 'Active' : 'Inactive'}
                    color={service.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(service)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(service._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingService ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Category"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            margin="normal"
            required
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.icon} {category.category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Service Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <TextField
            fullWidth
            label="Icon (Emoji)"
            value={formData.emoji}
            onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
            margin="normal"
            placeholder="e.g., 🔧"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
              />
            }
            label="Mark as Popular"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingService ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Inquiries Management
const InquiriesManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const fetchInquiries = async () => {
    try {
      const url = filter === 'all' 
        ? `${API_URL}/admin/inquiries`
        : `${API_URL}/admin/inquiries?status=${filter}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(response.data.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${API_URL}/admin/inquiries/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInquiries();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'contacted': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
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
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Inquiries Management
      </Typography>

      <Tabs value={filter} onChange={(e, v) => setFilter(v)} sx={{ mb: 3 }}>
        <Tab label="All" value="all" />
        <Tab label="Pending" value="pending" />
        <Tab label="Contacted" value="contacted" />
        <Tab label="Completed" value="completed" />
        <Tab label="Cancelled" value="cancelled" />
      </Tabs>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry._id}>
                <TableCell>
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Typography fontWeight="medium">{inquiry.customerName}</Typography>
                </TableCell>
                <TableCell>{inquiry.serviceName}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{inquiry.phone}</Typography>
                    <Typography variant="body2" color="textSecondary">{inquiry.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={inquiry.status.toUpperCase()}
                    color={getStatusColor(inquiry.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => {
                      setSelectedInquiry(inquiry);
                      setOpenDetails(true);
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Inquiry Details Dialog */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="md" fullWidth>
        {selectedInquiry && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Inquiry Details</Typography>
                <IconButton onClick={() => setOpenDetails(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Service Information</Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: '#f9f9f9' }}>
                    <Typography><strong>Service:</strong> {selectedInquiry.serviceName}</Typography>
                    <Typography><strong>Category:</strong> {selectedInquiry.categoryName}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Customer Details</Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, color: '#666' }} />
                      <Typography>{selectedInquiry.phone}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <EmailIcon fontSize="small" sx={{ mr: 1, color: '#666' }} />
                      <Typography>{selectedInquiry.email}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <LocationIcon fontSize="small" sx={{ mr: 1, color: '#666' }} />
                      <Typography>{selectedInquiry.address}</Typography>
                    </Box>
                  </Paper>
                </Grid>
                {selectedInquiry.message && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Additional Message</Typography>
                    <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                      <Typography>{selectedInquiry.message}</Typography>
                    </Paper>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Update Status</Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    {['pending', 'contacted', 'completed', 'cancelled'].map((status) => (
                      <Button
                        key={status}
                        variant={selectedInquiry.status === status ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => {
                          handleStatusUpdate(selectedInquiry._id, status);
                          setOpenDetails(false);
                        }}
                      >
                        {status.toUpperCase()}
                      </Button>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

// Recent Inquiries Table Component
const RecentInquiriesTable = ({ limit }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRecentInquiries();
  }, []);

  const fetchRecentInquiries = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/inquiries?limit=${limit || 5}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(response.data.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Customer</TableCell>
          <TableCell>Service</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {inquiries.map((inquiry) => (
          <TableRow key={inquiry._id}>
            <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>{inquiry.customerName}</TableCell>
            <TableCell>{inquiry.serviceName}</TableCell>
            <TableCell>
              <Chip
                label={inquiry.status}
                size="small"
                color={
                  inquiry.status === 'pending' ? 'warning' :
                  inquiry.status === 'contacted' ? 'info' :
                  inquiry.status === 'completed' ? 'success' : 'default'
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Main Layout Component
const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [drawerOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: 'dashboard' },
    { text: 'Categories', icon: <CategoryIcon />, path: 'categories' },
    { text: 'Services', icon: <ServicesIcon />, path: 'services' },
    { text: 'Inquiries', icon: <InquiriesIcon />, path: 'inquiries' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const drawerWidth = 280;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Vishwakarma Build & Furnish
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">
              {user?.name || user?.email}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            mt: 8,
            borderRight: '1px solid #e0e0e0'
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                setCurrentPage(item.path);
                navigate(`/admin/${item.path}`);
              }}
              sx={{
                mx: 1,
                borderRadius: 2,
                mb: 0.5,
                backgroundColor: currentPage === item.path ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.05)'
                }
              }}
            >
              <ListItemIcon sx={{ color: currentPage === item.path ? '#667eea' : '#666' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiTypography-root': { 
                    fontWeight: currentPage === item.path ? 'bold' : 'normal',
                    color: currentPage === item.path ? '#667eea' : '#333'
                  } 
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

// Main Admin Router
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

// Main Admin App Component
const AdminApp = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminRouter />} />
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AdminApp;