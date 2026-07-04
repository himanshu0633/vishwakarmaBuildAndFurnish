import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import {
  Add as AddIcon,
  Collections as GalleryIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  Star as StarIcon,
  UploadFile as UploadFileIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import axiosInstance, { getStaticAssetUrl } from '../../../utils/axiosConfig';

const galleryCategories = [
  'Workshop',
  'Workers',
  'Construction Sites',
  'Furniture Manufacturing',
  'Completed Interiors'
];

const emptyForm = {
  title: '',
  category: 'Workshop',
  image: '',
  description: '',
  order: 0,
  featured: true,
  isActive: true
};

const GalleryManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredItems = useMemo(() => {
    if (categoryFilter === 'All') return items;
    return items.filter((item) => item.category === categoryFilter);
  }, [items, categoryFilter]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/gallery?includeInactive=true');
      setItems(response.data.success ? response.data.data || [] : []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setSnackbar({ open: true, message: 'Failed to fetch gallery', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title || '',
        category: item.category || 'Workshop',
        image: item.image || '',
        description: item.description || '',
        order: item.order || 0,
        featured: Boolean(item.featured),
        isActive: item.isActive !== false
      });
    } else {
      setEditingItem(null);
      setFormData(emptyForm);
    }

    setImageFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setImageFile(null);
    setFormData(emptyForm);
  };

  const buildSubmitData = () => {
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('category', formData.category);
    payload.append('image', formData.image);
    payload.append('description', formData.description);
    payload.append('order', formData.order);
    payload.append('featured', formData.featured);
    payload.append('isActive', formData.isActive);

    if (imageFile) {
      payload.append('imageFile', imageFile);
    }

    return payload;
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setSnackbar({ open: true, message: 'Title is required', severity: 'error' });
      return;
    }

    if (!imageFile && !formData.image.trim()) {
      setSnackbar({ open: true, message: 'Image file or image URL is required', severity: 'error' });
      return;
    }

    try {
      const payload = buildSubmitData();
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editingItem) {
        await axiosInstance.put(`/gallery/${editingItem._id}`, payload, config);
      } else {
        await axiosInstance.post('/gallery', payload, config);
      }

      setSnackbar({
        open: true,
        message: editingItem ? 'Gallery item updated successfully' : 'Gallery item added successfully',
        severity: 'success'
      });
      handleCloseDialog();
      fetchGallery();
    } catch (error) {
      console.error('Error saving gallery:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to save gallery item',
        severity: 'error'
      });
    }
  };

  const handleToggle = async (item, field) => {
    try {
      const payload = new FormData();
      payload.append('title', item.title);
      payload.append('category', item.category);
      payload.append('image', item.image);
      payload.append('description', item.description || '');
      payload.append('order', item.order || 0);
      payload.append('featured', field === 'featured' ? !item.featured : item.featured);
      payload.append('isActive', field === 'isActive' ? !item.isActive : item.isActive);

      await axiosInstance.put(`/gallery/${item._id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setItems((current) => current.map((row) => (row._id === item._id ? { ...row, [field]: !row[field] } : row)));
    } catch (error) {
      console.error('Error toggling gallery:', error);
      setSnackbar({ open: true, message: 'Failed to update gallery item', severity: 'error' });
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Deactivate "${item.title}"?`)) return;

    try {
      await axiosInstance.delete(`/gallery/${item._id}`);
      setItems((current) => current.map((row) => (row._id === item._id ? { ...row, isActive: false } : row)));
      setSnackbar({ open: true, message: 'Gallery item moved to inactive', severity: 'success' });
    } catch (error) {
      console.error('Error deleting gallery:', error);
      setSnackbar({ open: true, message: 'Failed to deactivate gallery item', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#111111', minHeight: '100vh', color: '#F8FAFC' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#D4AF37', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
            <GalleryIcon /> Gallery Management
          </Typography>
          <Typography sx={{ color: 'rgba(248,250,252,0.7)', mt: 0.5 }}>
            Upload photos by category; the same photos will appear on the About and Gallery pages.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#D4AF37', color: '#111111', fontWeight: 900, textTransform: 'none', '&:hover': { bgcolor: '#B88917' } }}
        >
          Add Photo
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {['All', ...galleryCategories].map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => setCategoryFilter(category)}
            sx={{
              bgcolor: categoryFilter === category ? '#D4AF37' : 'rgba(212,175,55,0.12)',
              color: categoryFilter === category ? '#111111' : '#F8FAFC',
              fontWeight: 800
            }}
          />
        ))}
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#111827', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#D4AF37' }} />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                {['Photo', 'Title', 'Category', 'Order', 'Status', 'Actions'].map((heading) => (
                  <TableCell key={heading} sx={{ color: '#D4AF37', fontWeight: 900, borderColor: 'rgba(212,175,55,0.18)' }}>
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item) => {
                const image = getStaticAssetUrl(item.image);

                return (
                  <TableRow key={item._id} hover sx={{ '&:hover': { bgcolor: 'rgba(212,175,55,0.06)' } }}>
                    <TableCell sx={{ borderColor: 'rgba(212,175,55,0.12)' }}>
                      <Box
                        sx={{
                          width: 96,
                          height: 64,
                          borderRadius: 1.5,
                          bgcolor: '#0F172A',
                          background: `url("${image}") center/cover no-repeat`,
                          border: '1px solid rgba(212,175,55,0.24)'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#F8FAFC', borderColor: 'rgba(212,175,55,0.12)' }}>
                      <Typography sx={{ fontWeight: 900 }}>{item.title}</Typography>
                      <Typography sx={{ color: 'rgba(248,250,252,0.62)', fontSize: '0.82rem' }}>{item.description}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#F8FAFC', borderColor: 'rgba(212,175,55,0.12)' }}>{item.category}</TableCell>
                    <TableCell sx={{ color: '#F8FAFC', borderColor: 'rgba(212,175,55,0.12)' }}>{item.order}</TableCell>
                    <TableCell sx={{ borderColor: 'rgba(212,175,55,0.12)' }}>
                      <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                        <Chip label={item.isActive ? 'Active' : 'Inactive'} size="small" color={item.isActive ? 'success' : 'default'} />
                        {item.featured && <Chip icon={<StarIcon />} label="Featured" size="small" sx={{ bgcolor: '#D4AF37', color: '#111827' }} />}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderColor: 'rgba(212,175,55,0.12)' }}>
                      <IconButton onClick={() => handleToggle(item, 'isActive')} sx={{ color: item.isActive ? '#2ecc71' : '#95a5a6' }}>
                        {item.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                      <IconButton onClick={() => handleToggle(item, 'featured')} sx={{ color: item.featured ? '#D4AF37' : '#95a5a6' }}>
                        <StarIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDialog(item)} sx={{ color: '#D4AF37' }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item)} sx={{ color: '#e74c3c' }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#111827', color: '#F8FAFC' } }}>
        <DialogTitle sx={{ color: '#D4AF37', fontWeight: 900 }}>
          {editingItem ? 'Edit Photo' : 'Add Photo'}
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <TextField label="Title" value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} fullWidth sx={inputSx} />
          <TextField label="Category" select SelectProps={{ native: true }} value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })} fullWidth sx={inputSx}>
            {galleryCategories.map((category) => <option key={category} value={category}>{category}</option>)}
          </TextField>
          <TextField label="Image URL (optional if uploading file)" value={formData.image} onChange={(event) => setFormData({ ...formData, image: event.target.value })} fullWidth sx={inputSx} />
          <Button component="label" startIcon={<UploadFileIcon />} variant="outlined" sx={{ borderColor: '#D4AF37', color: '#D4AF37', textTransform: 'none', minHeight: 52 }}>
            {imageFile ? imageFile.name : 'Upload Photo'}
            <input aria-label="Upload Gallery Image" hidden type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
          </Button>
          <TextField label="Description" value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} fullWidth multiline minRows={2} sx={inputSx} />
          <TextField label="Order" type="number" value={formData.order} onChange={(event) => setFormData({ ...formData, order: event.target.value })} fullWidth sx={inputSx} />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControlLabel control={<Switch checked={formData.featured} onChange={(event) => setFormData({ ...formData, featured: event.target.checked })} />} label="Featured on About" />
            <FormControlLabel control={<Switch checked={formData.isActive} onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })} />} label="Active" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialog} sx={{ color: 'rgba(248,250,252,0.72)', textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#D4AF37', color: '#111827', fontWeight: 900, textTransform: 'none', '&:hover': { bgcolor: '#B88917' } }}>
            {editingItem ? 'Update Photo' : 'Add Photo'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

const inputSx = {
  '& .MuiInputBase-root': {
    color: '#F8FAFC',
    bgcolor: '#0F172A'
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(248,250,252,0.68)'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(212,175,55,0.25)'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(212,175,55,0.5)'
  }
};

export default GalleryManagement;
