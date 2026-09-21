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
  Grid,
  MenuItem,
  InputAdornment,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Inventory2 as InventoryIcon,
  LocalShipping as ShippingIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axiosConfig';

const CATEGORIES = [
  'All',
  'Civil & Masonry',
  'Steel & Iron',
  'Wood & Ply',
  'Tiles & Stone',
  'Paint & Putty',
  'Plumbing',
  'Electrical',
  'Other'
];

export const UNITS = [
  'Truck',
  'Trolley',
  'Litre',
  'Bag',
  'Quintal',
  'Ton',
  'Kg',
  'Piece',
  'Sq.Ft',
  'Sq.Meter',
  'Box',
  'Bundle',
  'Meter',
  'Dumper',
  'Tanker'
];

export const getUnitDisplay = (unit) => {
  switch (unit) {
    case 'Truck': return 'Truck (ट्रक)';
    case 'Trolley': return 'Trolley (ट्रॉली)';
    case 'Litre': return 'Litre (लीटर)';
    case 'Bag': return 'Bag (बोरी / कट्टा)';
    case 'Quintal': return 'Quintal (क्विंटल)';
    case 'Ton': return 'Ton (टन)';
    case 'Kg': return 'Kg (किलो)';
    case 'Piece': return 'Piece (पीस / नग)';
    case 'Sq.Ft': return 'Sq.Ft (वर्ग फीट)';
    case 'Sq.Meter': return 'Sq.Meter (वर्ग मीटर)';
    case 'Dumper': return 'Dumper (डंपर)';
    case 'Tanker': return 'Tanker (टैंकर)';
    case 'Box': return 'Box (डिब्बा / बॉक्स)';
    case 'Bundle': return 'Bundle (बंडल)';
    case 'Meter': return 'Meter (मीटर)';
    default: return unit || 'Piece';
  }
};

const getCategoryColor = (cat) => {
  switch (cat) {
    case 'Civil & Masonry': return { bg: '#fff3e0', text: '#e65100', border: '#ffb74d' };
    case 'Steel & Iron': return { bg: '#eceff1', text: '#37474f', border: '#90a4ae' };
    case 'Wood & Ply': return { bg: '#efebe9', text: '#4e342e', border: '#bcaaa4' };
    case 'Tiles & Stone': return { bg: '#e0f7fa', text: '#006064', border: '#80deea' };
    case 'Paint & Putty': return { bg: '#f3e5f5', text: '#4a148c', border: '#ce93d8' };
    case 'Plumbing': return { bg: '#e1f5fe', text: '#01579b', border: '#81d4fa' };
    case 'Electrical': return { bg: '#fffde7', text: '#f57f17', border: '#fff59d' };
    default: return { bg: '#f5f5f5', text: '#424242', border: '#e0e0e0' };
  }
};

const MaterialsManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Civil & Masonry',
    unit: 'Piece',
    defaultPrice: '',
    defaultSupplier: '',
    notes: ''
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (search.trim()) params.search = search.trim();

      const res = await axiosInstance.get('/materials', { params });
      if (res.data && res.data.data) {
        setMaterials(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching materials:', err);
      setSnackbar({ open: true, message: 'Failed to load materials catalog', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMaterials();
  };

  const handleOpenAdd = () => {
    setEditingMaterial(null);
    setFormData({
      name: '',
      category: 'Civil & Masonry',
      unit: 'Piece',
      defaultPrice: '',
      defaultSupplier: '',
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingMaterial(item);
    setFormData({
      name: item.name || '',
      category: item.category || 'Civil & Masonry',
      unit: item.unit || 'Piece',
      defaultPrice: item.defaultPrice !== undefined ? item.defaultPrice : '',
      defaultSupplier: item.defaultSupplier || '',
      notes: item.notes || ''
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setSnackbar({ open: true, message: 'Material name is required', severity: 'warning' });
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        unit: formData.unit,
        defaultPrice: Number(formData.defaultPrice) || 0,
        defaultSupplier: formData.defaultSupplier.trim(),
        notes: formData.notes.trim()
      };

      if (editingMaterial) {
        await axiosInstance.put(`/materials/${editingMaterial._id}`, payload);
        setSnackbar({ open: true, message: 'Material updated successfully', severity: 'success' });
      } else {
        await axiosInstance.post('/materials', payload);
        setSnackbar({ open: true, message: 'Material added to catalog', severity: 'success' });
      }
      setDialogOpen(false);
      fetchMaterials();
    } catch (err) {
      console.error('Error saving material:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to save material', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!materialToDelete) return;
    try {
      await axiosInstance.delete(`/materials/${materialToDelete._id}`);
      setSnackbar({ open: true, message: 'Material deleted from catalog', severity: 'success' });
      setDeleteConfirmOpen(false);
      setMaterialToDelete(null);
      fetchMaterials();
    } catch (err) {
      console.error('Error deleting material:', err);
      setSnackbar({ open: true, message: 'Failed to delete material', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <InventoryIcon sx={{ color: '#D4AF37', fontSize: 36 }} />
            Materials Master Catalog
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
            Manage common construction & interior materials, standard unit rates, and preferred vendors
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{
            bgcolor: '#111',
            color: '#D4AF37',
            fontWeight: 700,
            border: '1px solid #D4AF37',
            '&:hover': { bgcolor: '#222', borderColor: '#b8860b' },
            px: 3,
            py: 1.2
          }}
        >
          Add Material
        </Button>
      </Box>

      {/* Summary KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#111', color: '#fff', border: '1px solid #D4AF37', borderRadius: 2 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 600, textTransform: 'uppercase' }}>
                Total Catalog Items
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mt: 0.5 }}>
                {materials.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>
                Active Category
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#111', mt: 0.5 }}>
                {selectedCategory}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>
                Categories Supported
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#111', mt: 0.5 }}>
                8 Specialized Divisions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Category Filter Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #eee' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <Box component="form" onSubmit={handleSearchSubmit}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search material by name (e.g. Saria, Cement, Bricks, Reti)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#888' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <Button size="small" type="submit" sx={{ minWidth: 'auto', color: '#b8860b' }}>
                      Search
                    </Button>
                  )
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 0.5 }}>
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  clickable
                  onClick={() => setSelectedCategory(cat)}
                  sx={{
                    fontWeight: 600,
                    bgcolor: selectedCategory === cat ? '#111' : '#f5f5f5',
                    color: selectedCategory === cat ? '#D4AF37' : '#555',
                    border: selectedCategory === cat ? '1px solid #D4AF37' : '1px solid transparent',
                    '&:hover': {
                      bgcolor: selectedCategory === cat ? '#222' : '#eee'
                    }
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Materials Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#111' }}>
            <TableRow>
              <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>#</TableCell>
              <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Material Name</TableCell>
              <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Category</TableCell>
              <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Unit</TableCell>
              <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Ref. Unit Rate (₹)</TableCell>
              <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Default Supplier</TableCell>
              <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Notes</TableCell>
              <TableCell align="right" sx={{ color: '#D4AF37', fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <CircularProgress sx={{ color: '#D4AF37' }} />
                  <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>Loading materials catalog...</Typography>
                </TableCell>
              </TableRow>
            ) : materials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" sx={{ color: '#777', fontWeight: 600 }}>
                    No materials found.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAdd}
                    sx={{ mt: 2, color: '#111', borderColor: '#D4AF37' }}
                  >
                    Add First Material
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              materials.map((mat, idx) => {
                const badgeStyle = getCategoryColor(mat.category);
                return (
                  <TableRow key={mat._id} hover sx={{ '&:hover': { bgcolor: 'rgba(212,175,55,0.05)' } }}>
                    <TableCell sx={{ color: '#888', fontWeight: 600 }}>{idx + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#111' }}>{mat.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={mat.category}
                        size="small"
                        sx={{
                          bgcolor: badgeStyle.bg,
                          color: badgeStyle.text,
                          border: `1px solid ${badgeStyle.border}`,
                          fontWeight: 700,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={getUnitDisplay(mat.unit)} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#2e7d32' }}>
                      ₹ {Number(mat.defaultPrice || 0).toLocaleString('en-IN')} <Typography component="span" variant="caption" sx={{ color: '#666', fontWeight: 600 }}>/ {mat.unit || 'Unit'}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#555' }}>
                      {mat.defaultSupplier || '—'}
                    </TableCell>
                    <TableCell sx={{ color: '#777', fontSize: '0.85rem', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {mat.notes || '—'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(mat)}
                        sx={{ color: '#0288d1', mr: 1, '&:hover': { bgcolor: '#e1f5fe' } }}
                        title="Edit Material"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setMaterialToDelete(mat);
                          setDeleteConfirmOpen(true);
                        }}
                        sx={{ color: '#d32f2f', '&:hover': { bgcolor: '#ffebee' } }}
                        title="Delete Material"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add / Edit Material Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 800 }}>
          {editingMaterial ? 'Edit Material Catalog Item' : 'Add New Material to Catalog'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Material Name *"
              placeholder="e.g. UltraTech Cement 50kg, Saria 12mm, Red Clay Bricks..."
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Category"
                  fullWidth
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Standard Unit (माप की इकाई) *"
                  fullWidth
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  helperText="चुनें: Truck, Litre, Bag, Trolley, Kg, Quintal, etc."
                >
                  {UNITS.map((u) => (
                    <MenuItem key={u} value={u}>
                      {getUnitDisplay(u)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={`Rate per ${formData.unit || 'Unit'} (प्रति ${formData.unit || 'Unit'} रेट) *`}
                  type="number"
                  fullWidth
                  placeholder={`e.g. Rate for 1 ${formData.unit || 'Unit'}`}
                  value={formData.defaultPrice}
                  onChange={(e) => setFormData({ ...formData, defaultPrice: e.target.value })}
                  helperText={`Har 1 ${formData.unit || 'Unit'} ka standard rate (₹)`}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/ {formData.unit || 'Unit'}</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Default Supplier / Vendor"
                  placeholder="e.g. Sharma Building Materials"
                  fullWidth
                  value={formData.defaultSupplier}
                  onChange={(e) => setFormData({ ...formData, defaultSupplier: e.target.value })}
                />
              </Grid>
            </Grid>

            <TextField
              label="Notes / Specifications"
              placeholder="e.g. A-grade quality, 53 grade cement, standard truck capacity..."
              multiline
              rows={2}
              fullWidth
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 700, '&:hover': { bgcolor: '#222' } }}
          >
            {editingMaterial ? 'Update Material' : 'Save Material'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800, color: '#d32f2f' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to remove <strong>{materialToDelete?.name}</strong> from the materials catalog?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ fontWeight: 700 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Toast */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MaterialsManagement;
