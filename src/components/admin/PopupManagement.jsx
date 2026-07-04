import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
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
  Campaign as CampaignIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  UploadFile as UploadFileIcon
} from '@mui/icons-material';
import axiosInstance, { getStaticAssetUrl } from '../../../utils/axiosConfig';

const pageOptions = [
  { label: 'All Pages', value: '*' },
  { label: 'Home', value: '/' },
  { label: 'Services Listing', value: '/services' },
  { label: 'All Service Pages', value: '/services/*' },
  { label: 'Gallery', value: '/gallery' },
  { label: 'About', value: '/about' },
  { label: 'Contact', value: '/contact' },
  { label: 'Blogs', value: '/blogs' },
  { label: 'Tenders', value: '/tenders' }
];

const emptyForm = {
  title: '',
  image: '',
  pages: ['*'],
  customPages: '',
  initialDelaySeconds: 2,
  showAgainAfterClose: false,
  closeDelaySeconds: 60,
  whatsappMessage: 'Hello Vishwakarma Build & Furnish, I am interested in your services.',
  phone: '9416856468',
  order: 0,
  isActive: true
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#F8FAFC',
    '& fieldset': { borderColor: 'rgba(212,175,55,0.28)' },
    '&:hover fieldset': { borderColor: '#D4AF37' },
    '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
  },
  '& .MuiInputLabel-root': { color: 'rgba(248,250,252,0.72)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' }
};

const PopupManagement = () => {
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/popups/admin/list');
      setItems(response.data.success ? response.data.data || [] : []);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to fetch popups', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const splitPages = (pages = []) => {
    const known = pages.filter(page => pageOptions.some(option => option.value === page));
    const custom = pages.filter(page => !pageOptions.some(option => option.value === page));
    return { known: known.length ? known : ['*'], custom: custom.join('\n') };
  };

  const openForm = (item = null) => {
    if (item) {
      const pageParts = splitPages(item.pages || ['*']);
      setEditingItem(item);
      setFormData({
        title: item.title || '',
        image: item.image || '',
        pages: pageParts.known,
        customPages: pageParts.custom,
        initialDelaySeconds: item.initialDelaySeconds ?? 2,
        showAgainAfterClose: Boolean(item.showAgainAfterClose),
        closeDelaySeconds: item.closeDelaySeconds ?? 60,
        whatsappMessage: item.whatsappMessage || emptyForm.whatsappMessage,
        phone: item.phone || '9416856468',
        order: item.order || 0,
        isActive: item.isActive !== false
      });
    } else {
      setEditingItem(null);
      setFormData(emptyForm);
    }

    setImageFile(null);
    setOpenDialog(true);
  };

  const closeForm = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setImageFile(null);
    setFormData(emptyForm);
  };

  const togglePage = (value) => {
    setFormData((current) => {
      if (value === '*') return { ...current, pages: ['*'] };
      const withoutAll = current.pages.filter(page => page !== '*');
      const pages = withoutAll.includes(value)
        ? withoutAll.filter(page => page !== value)
        : [...withoutAll, value];
      return { ...current, pages: pages.length ? pages : ['*'] };
    });
  };

  const buildPages = () => {
    const customPages = formData.customPages
      .split(/\n|,/)
      .map(page => page.trim())
      .filter(Boolean);

    return [...new Set([...formData.pages, ...customPages])];
  };

  const submit = async () => {
    if (!imageFile && !formData.image) {
      setSnackbar({ open: true, message: 'Popup image is required', severity: 'error' });
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('image', formData.image);
    payload.append('pages', JSON.stringify(buildPages()));
    payload.append('initialDelaySeconds', formData.initialDelaySeconds);
    payload.append('showAgainAfterClose', formData.showAgainAfterClose);
    payload.append('closeDelaySeconds', formData.closeDelaySeconds);
    payload.append('whatsappMessage', formData.whatsappMessage);
    payload.append('phone', formData.phone);
    payload.append('order', formData.order);
    payload.append('isActive', formData.isActive);

    if (imageFile) payload.append('imageFile', imageFile);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (editingItem) {
        await axiosInstance.put(`/popups/${editingItem._id}`, payload, config);
      } else {
        await axiosInstance.post('/popups', payload, config);
      }

      setSnackbar({ open: true, message: editingItem ? 'Popup updated' : 'Popup created', severity: 'success' });
      closeForm();
      fetchPopups();
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to save popup', severity: 'error' });
    }
  };

  const deactivate = async (item) => {
    if (!window.confirm(`Deactivate "${item.title || 'popup'}"?`)) return;
    await axiosInstance.delete(`/popups/${item._id}`);
    fetchPopups();
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#111111', minHeight: '100vh', color: '#F8FAFC' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#D4AF37', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CampaignIcon /> Website Popups
          </Typography>
          <Typography sx={{ color: 'rgba(248,250,252,0.7)', mt: 0.5 }}>
            Upload popup images, select pages, timings, and track call/WhatsApp taps.
          </Typography>
        </Box>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => openForm()} sx={{ bgcolor: '#D4AF37', color: '#111111', fontWeight: 900 }}>
          Add Popup
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#111827', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Image', 'Title / Pages', 'Timing', 'Counts', 'Status', 'Actions'].map((heading) => (
                <TableCell key={heading} sx={{ color: '#D4AF37', fontWeight: 900, borderColor: 'rgba(212,175,55,0.18)' }}>{heading}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && items.map((item) => (
              <TableRow key={item._id}>
                <TableCell sx={{ borderColor: 'rgba(212,175,55,0.12)' }}>
                  <Box component="img" src={getStaticAssetUrl(item.image)} alt={item.title} sx={{ width: 90, height: 62, objectFit: 'cover', borderRadius: 1 }} />
                </TableCell>
                <TableCell sx={{ color: '#F8FAFC', borderColor: 'rgba(212,175,55,0.12)' }}>
                  <Typography fontWeight={900}>{item.title || 'Untitled popup'}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                    {(item.pages || []).map(page => <Chip key={page} label={page} size="small" sx={{ bgcolor: 'rgba(212,175,55,0.14)', color: '#D4AF37' }} />)}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'rgba(248,250,252,0.78)', borderColor: 'rgba(212,175,55,0.12)' }}>
                  Order: {item.order || 0}<br />
                  Show after: {item.initialDelaySeconds || 0}s<br />
                  Close repeat: {item.showAgainAfterClose ? `${item.closeDelaySeconds || 0}s` : 'No'}
                </TableCell>
                <TableCell sx={{ color: '#F8FAFC', borderColor: 'rgba(212,175,55,0.12)' }}>
                  Views: {item.views || 0}<br />
                  Call: {item.callClicks || 0}<br />
                  WhatsApp: {item.whatsappClicks || 0}<br />
                  Close: {item.closeClicks || 0}
                </TableCell>
                <TableCell sx={{ borderColor: 'rgba(212,175,55,0.12)' }}>
                  <Chip label={item.isActive !== false ? 'Active' : 'Inactive'} color={item.isActive !== false ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell sx={{ borderColor: 'rgba(212,175,55,0.12)' }}>
                  <IconButton onClick={() => openForm(item)} sx={{ color: '#D4AF37' }}><EditIcon /></IconButton>
                  <IconButton onClick={() => deactivate(item)} sx={{ color: '#EF4444' }}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={closeForm} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#111827', color: '#F8FAFC' } }}>
        <DialogTitle sx={{ color: '#D4AF37', fontWeight: 900 }}>{editingItem ? 'Edit Popup' : 'Add Popup'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: '12px !important' }}>
          <TextField label="Title" value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} sx={inputSx} />
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button component="label" startIcon={<UploadFileIcon />} variant="outlined" sx={{ borderColor: '#D4AF37', color: '#D4AF37' }}>
              Upload Image
              <input aria-label="Upload Popup Image" hidden type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
            </Button>
            <Chip icon={<ImageIcon />} label={imageFile?.name || formData.image || 'No image selected'} sx={{ color: '#F8FAFC', bgcolor: 'rgba(245,245,245,0.08)' }} />
          </Box>
          <Typography sx={{ color: '#D4AF37', fontWeight: 900 }}>Show On Pages</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 0.5 }}>
            {pageOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={<Checkbox checked={formData.pages.includes(option.value)} onChange={() => togglePage(option.value)} sx={{ color: '#D4AF37', '&.Mui-checked': { color: '#D4AF37' } }} />}
                label={option.label}
              />
            ))}
          </Box>
          <TextField label="Custom pages, one per line" multiline minRows={2} value={formData.customPages} onChange={(event) => setFormData({ ...formData, customPages: event.target.value })} placeholder="/services/wooden-doors-charkhi-dadri" sx={inputSx} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
            <TextField label="Order" type="number" value={formData.order} onChange={(event) => setFormData({ ...formData, order: event.target.value })} sx={inputSx} />
            <TextField label="Show after seconds" type="number" value={formData.initialDelaySeconds} onChange={(event) => setFormData({ ...formData, initialDelaySeconds: event.target.value })} sx={inputSx} />
            <TextField label="Close repeat delay seconds" type="number" value={formData.closeDelaySeconds} onChange={(event) => setFormData({ ...formData, closeDelaySeconds: event.target.value })} disabled={!formData.showAgainAfterClose} sx={inputSx} />
          </Box>
          <TextField label="Phone" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} sx={inputSx} />
          <TextField label="WhatsApp Message" multiline minRows={3} value={formData.whatsappMessage} onChange={(event) => setFormData({ ...formData, whatsappMessage: event.target.value })} sx={inputSx} />
          <FormControlLabel control={<Switch checked={formData.showAgainAfterClose} onChange={(event) => setFormData({ ...formData, showAgainAfterClose: event.target.checked })} />} label="After close, show again after delay" />
          <FormControlLabel control={<Switch checked={formData.isActive} onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })} />} label="Active" />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm} sx={{ color: '#F8FAFC' }}>Cancel</Button>
          <Button onClick={submit} variant="contained" sx={{ bgcolor: '#D4AF37', color: '#111111', fontWeight: 900 }}>Save Popup</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PopupManagement;
