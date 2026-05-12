import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  EmojiEmotions as EmojiIcon,
  Sort as SortIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../../utils/axiosConfig';
import { getCategoryEmoji, getCategoryName, makeSlug } from '../../utils/catalogSchema';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const CategoriesManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '',
    slug: '',
    description: '',
    emoji: '📦',
    icon: '',
    image: '',
    seoTitle: '',
    seoDescription: '',
    isActive: true,
    order: 0
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    checkAdminAccess();
    fetchCategories();
  }, []);

  const checkAdminAccess = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('User from localStorage:', user);
        
        if (user && user.role === 'admin') {
          setIsAdmin(true);
          console.log('Admin access granted');
        } else {
          setIsAdmin(false);
          setSnackbar({ 
            open: true, 
            message: 'Access denied. Admin privileges required.', 
            severity: 'error' 
          });
        }
      } else {
        setIsAdmin(false);
        setSnackbar({ 
          open: true, 
          message: 'Please login as admin', 
          severity: 'error' 
        });
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
    }
  };

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token;
  };

  const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/categories');
      console.log("Categories API Response:", response.data);

      const data = response.data;
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data.success) {
        setCategories(data.data);
      } else if (data.categories) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Fetch Categories Error:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to fetch categories",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (!isAdmin) {
      setSnackbar({ 
        open: true, 
        message: 'Admin access required', 
        severity: 'error' 
      });
      return;
    }
    
    if (category) {
      setEditingCategory(category);
      const name = getCategoryName(category);
      setFormData({
        name,
        slug: category.slug || makeSlug(name),
        description: category.description || '',
        emoji: getCategoryEmoji(category),
        icon: category.icon || '',
        image: category.image || '',
        seoTitle: category.seoTitle || '',
        seoDescription: category.seoDescription || '',
        isActive: category.isActive !== false,
        order: category.order || 0
      });
    } else {
      setEditingCategory(null);
      setFormData({ 
        name: '',
        slug: '',
        description: '',
        emoji: '📦',
        icon: '',
        image: '',
        seoTitle: '',
        seoDescription: '',
        isActive: true,
        order: 0
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({ 
      name: '',
      slug: '',
      description: '',
      emoji: '📦',
      icon: '',
      image: '',
      seoTitle: '',
      seoDescription: '',
      isActive: true,
      order: 0
    });
  };

  const handleSubmit = async () => {
    if (!isAdmin) {
      setSnackbar({ 
        open: true, 
        message: 'Admin access required', 
        severity: 'error' 
      });
      return;
    }

    if (!formData.name.trim()) {
      setSnackbar({ 
        open: true, 
        message: 'Category name is required', 
        severity: 'error' 
      });
      return;
    }

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || makeSlug(formData.name),
        description: formData.description,
        emoji: formData.emoji,
        icon: formData.icon || formData.emoji,
        image: formData.image,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        isActive: formData.isActive,
        order: parseInt(formData.order) || 0
      };

      if (editingCategory) {
        await axiosInstance.put(`/categories/${editingCategory._id}`, payload, {
          headers: {
            'X-User-Email': getUser()?.email,
            'X-User-Role': getUser()?.role
          }
        });
        setSnackbar({ 
          open: true, 
          message: 'Category updated successfully', 
          severity: 'success' 
        });
      } else {
        await axiosInstance.post('/categories', payload, {
          headers: {
            'X-User-Email': getUser()?.email,
            'X-User-Role': getUser()?.role
          }
        });
        setSnackbar({ 
          open: true, 
          message: 'Category created successfully', 
          severity: 'success' 
        });
      }
      fetchCategories();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving category:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || error.message || 'Operation failed', 
        severity: 'error' 
      });
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      setSnackbar({ 
        open: true, 
        message: 'Admin access required', 
        severity: 'error' 
      });
      return;
    }

    if (window.confirm('Are you sure you want to delete this category? This will also affect services under this category.')) {
      try {
        await axiosInstance.delete(`/categories/${id}`, {
          headers: {
            'X-User-Email': getUser()?.email,
            'X-User-Role': getUser()?.role
          }
        });
        setSnackbar({ 
          open: true, 
          message: 'Category deleted successfully', 
          severity: 'success' 
        });
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        setSnackbar({ 
          open: true, 
          message: error.response?.data?.message || error.message || 'Delete failed', 
          severity: 'error' 
        });
      }
    }
  };

  if (!isAdmin && !loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{
          background: "linear-gradient(135deg, #111111 0%, #0F172A 100%)",
          borderRadius: 2,
          p: 4
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center', 
            maxWidth: 400,
            background: 'rgba(245,245,245,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: 3
          }}>
            <Typography variant="h5" sx={{ color: '#D4AF37', mb: 2, fontWeight: 'bold' }}>
              Access Denied
            </Typography>
            <Typography sx={{ color: 'rgba(245,245,245,0.8)' }}>
              You need admin privileges to access this page.
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, color: 'rgba(245,245,245,0.6)' }}>
              Current user: {JSON.parse(localStorage.getItem('user') || '{}')?.email || 'Not logged in'}
            </Typography>
          </Paper>
        </motion.div>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{
          background: "linear-gradient(135deg, #111111 0%, #0F172A 100%)",
          borderRadius: 2
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <CategoryIcon sx={{ fontSize: 60, color: "#D4AF37", mb: 2 }} />
        </motion.div>
        <CircularProgress size={50} sx={{ color: '#D4AF37', ml: 2 }} />
      </Box>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <Box sx={{
        background: "linear-gradient(135deg, #111111 0%, #0F172A 50%, #1A1A1A 100%)",
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        minHeight: '100%'
      }}>
        {/* Header */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={4}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}
        >
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                background: "linear-gradient(135deg, #fff, #D4AF37)",
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 1
              }}
            >
              Categories Management
            </Typography>
            <Typography sx={{ color: 'rgba(245,245,245,0.7)' }}>
              Manage your service categories and their order
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(135deg, #D4AF37, #B88917)',
              borderRadius: '30px',
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(212,175,55,0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Add Category
          </Button>
        </Box>

        {/* Table */}
        {isMobile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {categories.length === 0 ? (
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'rgba(245,245,245,0.05)',
                  border: '1px solid rgba(212,175,55,0.2)'
                }}
              >
                <Typography sx={{ color: 'rgba(245,245,245,0.7)' }}>
                  No categories found
                </Typography>
                <Button onClick={() => handleOpenDialog()} sx={{ mt: 2, color: '#D4AF37' }}>
                  Create your first category
                </Button>
              </Paper>
            ) : (
              categories.map((category, idx) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      background: 'rgba(245,245,245,0.05)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      borderRadius: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h5">{getCategoryEmoji(category)}</Typography>
                        <Typography fontWeight="bold" sx={{ color: '#fff', mt: 0.5 }}>
                          {getCategoryName(category)}
                        </Typography>
                        {category.description && (
                          <Typography variant="caption" sx={{ color: 'rgba(245,245,245,0.7)' }}>
                            {category.description}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small" onClick={() => handleOpenDialog(category)} sx={{ color: '#D4AF37' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(category._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip label={`Order: ${category.order || 0}`} size="small" sx={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37' }} />
                      <Chip label={`Services: ${category.services?.length || category.servicesCount || 0}`} size="small" sx={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37' }} />
                      <Chip
                        label={category.isActive !== false ? "Active" : "Inactive"}
                        size="small"
                        sx={{
                          background: category.isActive !== false ? 'rgba(46,204,113,0.2)' : 'rgba(149,165,166,0.2)',
                          color: category.isActive !== false ? '#2ecc71' : '#95a5a6'
                        }}
                      />
                    </Box>
                  </Paper>
                </motion.div>
              ))
            )}
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              background: 'rgba(245,245,245,0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              overflowX: 'auto',
              border: '1px solid rgba(212,175,55,0.2)'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{
                  background: 'rgba(212,175,55,0.1)',
                  '& th': {
                    color: '#D4AF37',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' }
                  }
                }}>
                  <TableCell>Icon</TableCell>
                  <TableCell>Category Name</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell>Services Count</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography sx={{ color: 'rgba(245,245,245,0.7)' }}>
                        No categories found
                      </Typography>
                      <Button
                        onClick={() => handleOpenDialog()}
                        sx={{ mt: 2, color: '#D4AF37' }}
                      >
                        Create your first category
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category, idx) => (
                    <motion.tr
                      key={category._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onMouseEnter={() => setHoveredRow(idx)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        background: hoveredRow === idx ? 'rgba(212,175,55,0.1)' : 'transparent',
                        transition: 'background 0.3s ease'
                      }}
                    >
                      <TableCell>
                        <Typography variant="h5" sx={{ fontSize: '2rem' }}>
                          {getCategoryEmoji(category)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="medium" sx={{ color: '#fff' }}>
                          {getCategoryName(category)}
                        </Typography>
                        {category.description && (
                          <Typography variant="caption" sx={{ color: 'rgba(245,245,245,0.6)', display: 'block' }}>
                            {category.description.substring(0, 50)}...
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={category.order || 0} size="small" sx={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37', fontWeight: 'bold' }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={category.services?.length || category.servicesCount || 0} size="small" sx={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37', fontWeight: 'bold' }} />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.isActive !== false ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            background: category.isActive !== false ? 'rgba(46,204,113,0.2)' : 'rgba(149,165,166,0.2)',
                            color: category.isActive !== false ? '#2ecc71' : '#95a5a6',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => handleOpenDialog(category)} sx={{ color: '#D4AF37', '&:hover': { background: 'rgba(212,175,55,0.2)' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(category._id)} sx={{ '&:hover': { background: 'rgba(244,67,54,0.2)' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Add/Edit Dialog - Industrial Theme */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #0F172A, #111111)',
              borderRadius: 3,
              border: '1px solid rgba(212,175,55,0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }
          }}
        >
          <DialogTitle sx={{ 
            color: '#D4AF37', 
            fontWeight: 'bold',
            borderBottom: '1px solid rgba(212,175,55,0.3)',
            pb: 2
          }}>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              label="Category Name"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData({
                  ...formData,
                  name,
                  slug: editingCategory ? formData.slug : makeSlug(name)
                });
              }}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon sx={{ color: '#D4AF37' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' }
              }}
            />
            <TextField
              fullWidth
              label="Slug"
              value={formData.slug}
              disabled
              onChange={(e) => setFormData({ ...formData, slug: makeSlug(e.target.value) })}
              margin="normal"
              helperText="SEO-friendly URL slug"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiFormHelperText-root': { color: 'rgba(245,245,245,0.5)' }
              }}
            />
            <TextField
              fullWidth
              label="Emoji/Icon"
              value={formData.emoji}
              onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
              margin="normal"
              placeholder="e.g., 🔧"
              helperText="You can use any emoji"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmojiIcon sx={{ color: '#D4AF37' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiFormHelperText-root': { color: 'rgba(245,245,245,0.5)' }
              }}
            />
            <TextField
              fullWidth
              label="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' }
              }}
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={2}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon sx={{ color: '#D4AF37' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' }
              }}
            />
            <TextField
              fullWidth
              label="SEO Title"
              value={formData.seoTitle}
              disabled
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' }
              }}
            />
            <TextField
              fullWidth
              label="SEO Description"
              value={formData.seoDescription}
              disabled
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              margin="normal"
              multiline
              rows={2}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' }
              }}
            />
            <TextField
              fullWidth
              label="Display Order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              margin="normal"
              helperText="Lower numbers appear first"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SortIcon sx={{ color: '#D4AF37' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiFormHelperText-root': { color: 'rgba(245,245,245,0.5)' }
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#D4AF37' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#D4AF37' }
                  }}
                />
              }
              label={<Typography sx={{ color: '#fff' }}>Active Category</Typography>}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(212,175,55,0.3)' }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{
                color: 'rgba(245,245,245,0.7)',
                '&:hover': { color: '#fff' }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #D4AF37, #B88917)',
                borderRadius: '30px',
                px: 3,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 5px 15px rgba(212,175,55,0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            severity={snackbar.severity} 
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{
              background: snackbar.severity === 'success' 
                ? 'linear-gradient(135deg, #0F172A, #111111)'
                : 'linear-gradient(135deg, #4a0e0e, #2a0a0a)',
              color: '#fff',
              border: `1px solid ${snackbar.severity === 'success' ? '#2ecc71' : '#e74c3c'}`,
              '& .MuiAlert-icon': {
                color: snackbar.severity === 'success' ? '#2ecc71' : '#e74c3c'
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </motion.div>
  );
};

export default CategoriesManagement;
