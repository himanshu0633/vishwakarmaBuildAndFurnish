import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CardContent,
  LinearProgress,
  Checkbox,
  Divider,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  CloudUpload as UploadIcon,
  Category as CategoryIcon,
  AccountBalanceWallet as WalletIcon,
  FormatListBulleted as ListIcon,
  VpnKey as KeyIcon
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axiosConfig';

const STATUS_OPTIONS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'planning', label: 'Planning & Prep' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' }
];

const getStatusBadge = (status) => {
  switch (status) {
    case 'in_progress':
      return { label: 'In Progress', bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' };
    case 'planning':
      return { label: 'Planning', bg: '#e3f2fd', text: '#1565c0', border: '#90caf9' };
    case 'completed':
      return { label: 'Completed', bg: '#fff8e1', text: '#f57f17', border: '#ffe082' };
    case 'on_hold':
      return { label: 'On Hold', bg: '#ffebee', text: '#c62828', border: '#ef9a9a' };
    default:
      return { label: status || 'Active', bg: '#f5f5f5', text: '#424242', border: '#e0e0e0' };
  }
};

const DEFAULT_STEPS = [
  {
    title: 'Step 1: Advance Booking & Site Prep',
    percentage: 20,
    amountExpected: '',
    points: [
      { title: 'Site Inspection & Demarcation' },
      { title: 'Architectural / 3D Layout Finalization' },
      { title: 'Excavation / Site Digging' }
    ]
  },
  {
    title: 'Step 2: Foundation & Plinth (Nim Bharna)',
    percentage: 25,
    amountExpected: '',
    points: [
      { title: 'Footing & Column Base Casting' },
      { title: 'Nim Bharna & Stone Masonry' },
      { title: 'Plinth Beam Casting & Anti-Termite Treatment' },
      { title: 'Soil Compaction & DPC Layer' }
    ]
  },
  {
    title: 'Step 3: Superstructure & RCC Slab Casting',
    percentage: 25,
    amountExpected: '',
    points: [
      { title: 'RCC Columns / Pillars Erection' },
      { title: 'Shuttering & Steel (Saria) Binding' },
      { title: 'Roof Slab RCC Casting & Curing' },
      { title: 'Staircase RCC Construction' }
    ]
  },
  {
    title: 'Step 4: Brickwork, Plumbing & Water Tank',
    percentage: 20,
    amountExpected: '',
    points: [
      { title: 'Exterior & Interior Brickwork Walls' },
      { title: 'Electrical Conduit & Pipe Fittings' },
      { title: 'Sanitary & Water Supply Pipeline Setup' },
      { title: 'Overhead Water Tank (Pani Ki Tanki) Installation' }
    ]
  },
  {
    title: 'Step 5: Plaster, Flooring & Final Finishing',
    percentage: 10,
    amountExpected: '',
    points: [
      { title: 'Internal & External Wall Plaster' },
      { title: 'Flooring Tiles & Marble Fitting' },
      { title: 'Doors, Windows & Woodwork Installation' },
      { title: 'Wall Putty, Primer & Final Paint Polish' }
    ]
  }
];

const ClientsManagement = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    aadharNo: '',
    serviceRate: '',
    serviceRateUnit: 'Per Sq.Ft',
    contractAmount: '',
    status: 'in_progress',
    startDate: '',
    expectedEndDate: '',
    categories: [],
    services: [],
    notes: ''
  });

  const [agreementFile, setAgreementFile] = useState(null);
  const [agreementPreview, setAgreementPreview] = useState('');
  const [customSteps, setCustomSteps] = useState(DEFAULT_STEPS);

  // Delete confirm state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  // Submission prevention states
  const [savingClient, setSavingClient] = useState(false);
  const [updatingClient, setUpdatingClient] = useState(false);
  const [deletingClient, setDeletingClient] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [resendingId, setResendingId] = useState(null);

  // Resend Login Credentials
  const handleResendCredentials = async (client) => {
    if (!client.email) {
      setSnackbar({ open: true, message: 'Client has no email address. Please edit client to add email.', severity: 'warning' });
      return;
    }
    setResendingId(client._id);
    try {
      const res = await axiosInstance.post(`/clients/${client._id}/resend-credentials`);
      setSnackbar({
        open: true,
        message: res.data?.message || `Credentials sent successfully to ${client.email}`,
        severity: 'success'
      });
      fetchClients();
    } catch (err) {
      console.error('Error sending credentials:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to send credentials email',
        severity: 'error'
      });
    } finally {
      setResendingId(null);
    }
  };

  // Fetch clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter && statusFilter !== 'All') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await axiosInstance.get('/clients', { params });
      if (res.data && res.data.data) {
        setClients(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
      setSnackbar({ open: true, message: 'Failed to load clients', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories & services from DB
  const fetchCategoriesAndServices = async () => {
    try {
      const [catRes, svcRes] = await Promise.all([
        axiosInstance.get('/categories'),
        axiosInstance.get('/services')
      ]);

      const catList = catRes.data?.data || (Array.isArray(catRes.data) ? catRes.data : []);
      const svcList = svcRes.data?.data || (Array.isArray(svcRes.data) ? svcRes.data : []);

      setAvailableCategories(catList);
      setAvailableServices(svcList);
    } catch (err) {
      console.warn('Could not fetch categories or services:', err);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchCategoriesAndServices();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchClients();
  };

  // Handle Contract Amount Change and Auto-Recalculate Step Amounts
  const handleContractAmountChange = (newAmount) => {
    setFormData((prev) => ({ ...prev, contractAmount: newAmount }));
    const parsedAmt = Number(newAmount) || 0;
    if (parsedAmt > 0) {
      setCustomSteps((prev) =>
        prev.map((st) => {
          const pct = Number(st.percentage) || 0;
          return {
            ...st,
            amountExpected: pct > 0 ? Math.round(parsedAmt * (pct / 100)) : (st.amountExpected || '')
          };
        })
      );
    }
  };

  // Steps & Checkpoints Management Handlers
  const handleAddStep = () => {
    const nextNum = customSteps.length + 1;
    setCustomSteps((prev) => [
      ...prev,
      {
        title: `Step ${nextNum}: New Milestone Stage`,
        percentage: 0,
        amountExpected: '',
        points: [{ title: 'First Task / Checklist Item', completed: false }]
      }
    ]);
  };

  const handleDeleteStep = (stepIndex) => {
    if (customSteps.length <= 1) {
      setSnackbar({ open: true, message: 'At least one step is required', severity: 'warning' });
      return;
    }
    setCustomSteps((prev) => prev.filter((_, idx) => idx !== stepIndex));
  };

  const handleUpdateStep = (stepIndex, field, value) => {
    setCustomSteps((prev) => {
      const updated = [...prev];
      const step = { ...updated[stepIndex] };
      const contractAmt = Number(formData.contractAmount) || 0;

      if (field === 'percentage') {
        const pct = Math.max(0, Math.min(100, Number(value) || 0));
        step.percentage = pct;
        if (contractAmt > 0) {
          step.amountExpected = Math.round(contractAmt * (pct / 100));
        }
      } else if (field === 'amountExpected') {
        const amt = Math.max(0, Number(value) || 0);
        step.amountExpected = amt;
        if (contractAmt > 0) {
          step.percentage = Math.round((amt / contractAmt) * 100);
        }
      } else {
        step[field] = value;
      }

      updated[stepIndex] = step;
      return updated;
    });
  };

  const handleAddPoint = (stepIndex) => {
    setCustomSteps((prev) => {
      const updated = [...prev];
      const step = { ...updated[stepIndex] };
      step.points = [...(step.points || []), { title: '', completed: false }];
      updated[stepIndex] = step;
      return updated;
    });
  };

  const handleUpdatePoint = (stepIndex, pointIndex, text) => {
    setCustomSteps((prev) => {
      const updated = [...prev];
      const step = { ...updated[stepIndex] };
      const points = [...(step.points || [])];
      points[pointIndex] = {
        ...(typeof points[pointIndex] === 'string' ? { completed: false } : points[pointIndex]),
        title: text
      };
      step.points = points;
      updated[stepIndex] = step;
      return updated;
    });
  };

  const handleDeletePoint = (stepIndex, pointIndex) => {
    setCustomSteps((prev) => {
      const updated = [...prev];
      const step = { ...updated[stepIndex] };
      step.points = (step.points || []).filter((_, idx) => idx !== pointIndex);
      updated[stepIndex] = step;
      return updated;
    });
  };

  // Category & Services helpers
  const handleToggleCategory = (catId) => {
    const categoryServices = availableServices.filter(
      (s) => (s.categoryId?._id || s.categoryId) === catId
    );
    const categorySvcIds = categoryServices.map((s) => s._id);
    const allSelected =
      categorySvcIds.length > 0 &&
      categorySvcIds.every((id) => formData.services.includes(id));

    if (allSelected) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c !== catId),
        services: prev.services.filter((sId) => !categorySvcIds.includes(sId))
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.includes(catId) ? prev.categories : [...prev.categories, catId],
        services: Array.from(new Set([...prev.services, ...categorySvcIds]))
      }));
    }
  };

  const handleSelectAllCategoryServices = (catId, selectAll) => {
    const categoryServices = availableServices.filter(
      (s) => (s.categoryId?._id || s.categoryId) === catId
    );
    const categorySvcIds = categoryServices.map((s) => s._id);

    if (selectAll) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.includes(catId) ? prev.categories : [...prev.categories, catId],
        services: Array.from(new Set([...prev.services, ...categorySvcIds]))
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c !== catId),
        services: prev.services.filter((sId) => !categorySvcIds.includes(sId))
      }));
    }
  };

  const handleToggleService = (svcId, catId) => {
    setFormData((prev) => {
      const isSelected = prev.services.includes(svcId);
      const newServices = isSelected
        ? prev.services.filter((id) => id !== svcId)
        : [...prev.services, svcId];

      const catServices = availableServices.filter(
        (s) => (s.categoryId?._id || s.categoryId) === catId
      );
      const hasAnySelected = catServices.some((s) => newServices.includes(s._id));

      let newCategories = prev.categories;
      if (hasAnySelected && !prev.categories.includes(catId)) {
        newCategories = [...prev.categories, catId];
      } else if (!hasAnySelected && prev.categories.includes(catId)) {
        newCategories = prev.categories.filter((c) => c !== catId);
      }

      return {
        ...prev,
        services: newServices,
        categories: newCategories
      };
    });
  };

  // Open Add Dialog
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      location: '',
      aadharNo: '',
      serviceRate: '',
      serviceRateUnit: 'Per Sq.Ft',
      contractAmount: '',
      status: 'in_progress',
      startDate: new Date().toISOString().split('T')[0],
      expectedEndDate: '',
      categories: [],
      services: [],
      notes: ''
    });
    setAgreementFile(null);
    setAgreementPreview('');
    setCustomSteps(DEFAULT_STEPS);
    setAddDialogOpen(true);
  };

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAgreementFile(file);
      if (file.type.startsWith('image/')) {
        setAgreementPreview(URL.createObjectURL(file));
      } else {
        setAgreementPreview('');
      }
    }
  };

  // Save new client
  const handleCreateClient = async () => {
    if (savingClient) return;
    if (!formData.name.trim() || !formData.phone.trim() || !formData.location.trim() || !formData.contractAmount) {
      setSnackbar({ open: true, message: 'Please fill all required fields (Name, Phone, Location, Total Expected Amount)', severity: 'warning' });
      return;
    }

    setSavingClient(true);
    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('phone', formData.phone.trim());
      data.append('email', formData.email.trim());
      data.append('location', formData.location.trim());
      data.append('aadharNo', formData.aadharNo.trim());
      data.append('serviceRate', formData.serviceRate || 0);
      data.append('serviceRateUnit', formData.serviceRateUnit || 'Per Sq.Ft');
      data.append('contractAmount', formData.contractAmount);
      data.append('status', formData.status);
      data.append('startDate', formData.startDate);
      data.append('expectedEndDate', formData.expectedEndDate);
      data.append('notes', formData.notes.trim());

      data.append('categories', JSON.stringify(formData.categories));
      data.append('services', JSON.stringify(formData.services));

      // Steps formatted with percentage and points
      const formattedSteps = customSteps.map((step) => {
        const pct = Number(step.percentage) || 0;
        const amt = step.amountExpected
          ? Number(step.amountExpected)
          : formData.contractAmount
          ? Math.round((Number(formData.contractAmount) || 0) * (pct / 100))
          : 0;

        return {
          title: step.title.trim(),
          percentage: pct,
          amountExpected: amt,
          isPaid: step.isPaid || false,
          completed: step.completed || false,
          points: (step.points || [])
            .map((p) => ({
              title: typeof p === 'string' ? p.trim() : (p.title || '').trim(),
              completed: p.completed || false
            }))
            .filter((p) => p.title)
        };
      });
      data.append('steps', JSON.stringify(formattedSteps));

      if (agreementFile) {
        data.append('agreementImage', agreementFile);
      }

      const res = await axiosInstance.post('/clients', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const creds = res.data?.credentials;
      let successMsg = 'Client created successfully with custom milestones & payment schedule!';
      if (creds?.email) {
        successMsg = `Client created! Portal Login: ${creds.email} | Password: ${creds.password}. ${creds.welcomeEmailSent ? 'Welcome email sent!' : ''}`;
      }

      setSnackbar({ open: true, message: successMsg, severity: 'success' });
      setAddDialogOpen(false);
      fetchClients();
    } catch (err) {
      console.error('Error creating client:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to create client', severity: 'error' });
    } finally {
      setSavingClient(false);
    }
  };

  // Open Edit Dialog
  const handleOpenEdit = (c) => {
    setEditingClient(c);
    const clientCategories = (c.categories || []).map((cat) => (typeof cat === 'object' ? cat._id : cat));
    const clientServices = (c.services || []).map((s) => (typeof s === 'object' ? s._id : s));

    setFormData({
      name: c.name || '',
      phone: c.phone || '',
      email: c.email || '',
      location: c.location || '',
      aadharNo: c.aadharNo || '',
      serviceRate: c.serviceRate !== undefined && c.serviceRate !== null ? c.serviceRate : '',
      serviceRateUnit: c.serviceRateUnit || 'Per Sq.Ft',
      contractAmount: c.contractAmount || '',
      status: c.status || 'in_progress',
      startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : '',
      expectedEndDate: c.expectedEndDate ? new Date(c.expectedEndDate).toISOString().split('T')[0] : '',
      categories: clientCategories,
      services: clientServices,
      notes: c.notes || ''
    });
    setAgreementFile(null);
    setAgreementPreview(c.agreementImage || '');
    setCustomSteps(c.steps && c.steps.length > 0 ? c.steps : DEFAULT_STEPS);
    setEditDialogOpen(true);
  };

  // Save Edit
  const handleUpdateClient = async () => {
    if (!editingClient || updatingClient) return;
    setUpdatingClient(true);
    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('phone', formData.phone.trim());
      data.append('email', formData.email.trim());
      data.append('location', formData.location.trim());
      data.append('aadharNo', formData.aadharNo.trim());
      data.append('serviceRate', formData.serviceRate || 0);
      data.append('serviceRateUnit', formData.serviceRateUnit || 'Per Sq.Ft');
      data.append('contractAmount', formData.contractAmount);
      data.append('status', formData.status);
      data.append('startDate', formData.startDate);
      data.append('expectedEndDate', formData.expectedEndDate);
      data.append('notes', formData.notes.trim());

      data.append('categories', JSON.stringify(formData.categories));
      data.append('services', JSON.stringify(formData.services));

      const formattedSteps = customSteps.map((step) => {
        const pct = Number(step.percentage) || 0;
        const amt = step.amountExpected
          ? Number(step.amountExpected)
          : formData.contractAmount
          ? Math.round((Number(formData.contractAmount) || 0) * (pct / 100))
          : 0;

        return {
          title: step.title.trim(),
          percentage: pct,
          amountExpected: amt,
          isPaid: step.isPaid || false,
          completed: step.completed || false,
          points: (step.points || [])
            .map((p) => ({
              title: typeof p === 'string' ? p.trim() : (p.title || '').trim(),
              completed: p.completed || false
            }))
            .filter((p) => p.title)
        };
      });
      data.append('steps', JSON.stringify(formattedSteps));

      if (agreementFile) {
        data.append('agreementImage', agreementFile);
      }

      await axiosInstance.put(`/clients/${editingClient._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSnackbar({ open: true, message: 'Client details, categories and milestones updated successfully', severity: 'success' });
      setEditDialogOpen(false);
      fetchClients();
    } catch (err) {
      console.error('Error updating client:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to update client', severity: 'error' });
    } finally {
      setUpdatingClient(false);
    }
  };

  // Delete Client
  const handleDeleteClient = async () => {
    if (!clientToDelete || deletingClient) return;
    setDeletingClient(true);
    try {
      await axiosInstance.delete(`/clients/${clientToDelete._id}`);
      setSnackbar({ open: true, message: 'Client project safely archived (soft deleted)', severity: 'success' });
      setDeleteConfirmOpen(false);
      setClientToDelete(null);
      fetchClients();
    } catch (err) {
      console.error('Error deleting client:', err);
      setSnackbar({ open: true, message: 'Failed to delete client', severity: 'error' });
    } finally {
      setDeletingClient(false);
    }
  };

  // Financial aggregates
  const totalContractVal = clients.reduce((sum, c) => sum + (Number(c.contractAmount) || 0), 0);
  const totalCollected = clients.reduce((sum, c) => sum + (Number(c.totalPaid) || 0), 0);
  const totalBalanceDue = Math.max(0, totalContractVal - totalCollected);
  const activeProjectsCount = clients.filter((c) => c.status === 'in_progress').length;

  // Percentage allocation calculations
  const totalAllocatedPct = customSteps.reduce((sum, s) => sum + (Number(s.percentage) || 0), 0);
  const totalAllocatedAmt = customSteps.reduce((sum, s) => sum + (Number(s.amountExpected) || 0), 0);

  // Component to render Category & Services Selector
  const renderCategoryAndServicesSection = () => (
    <Box sx={{ mt: 2, p: 2, bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CategoryIcon sx={{ color: '#D4AF37' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111' }}>
            Categories & Services
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#666', fontWeight: 700 }}>
          {formData.categories.length} Categories • {formData.services.length} Services Selected
        </Typography>
      </Box>

      {/* 1. Category Selection Cards */}
      <Typography variant="caption" sx={{ color: '#555', fontWeight: 700, display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        1. Select Category (e.g. Construction, Wooden Work, Interior):
      </Typography>

      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
        {availableCategories.map((cat) => {
          const categoryServices = availableServices.filter(
            (s) => (s.categoryId?._id || s.categoryId) === cat._id
          );
          const selectedCount = categoryServices.filter((s) => formData.services.includes(s._id)).length;
          const isCategorySelected =
            formData.categories.includes(cat._id) || selectedCount > 0;

          return (
            <Grid item xs={12} sm={6} md={4} key={cat._id}>
              <Paper
                onClick={() => handleToggleCategory(cat._id)}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  border: isCategorySelected ? '2px solid #D4AF37' : '1px solid #ddd',
                  bgcolor: isCategorySelected ? 'rgba(212,175,55,0.08)' : '#fff',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#b8860b',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                  }
                }}
              >
                <Typography variant="h5" sx={{ fontSize: '1.6rem' }}>
                  {cat.emoji || '📦'}
                </Typography>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cat.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: selectedCount > 0 ? '#2e7d32' : '#777', fontWeight: 600, display: 'block' }}>
                    {selectedCount > 0 ? `✓ ${selectedCount} services selected` : `${categoryServices.length} services available`}
                  </Typography>
                </Box>
                <Checkbox
                  checked={isCategorySelected}
                  sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#D4AF37' } }}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* 2. Grouped Services Under Each Category */}
      <Typography variant="caption" sx={{ color: '#555', fontWeight: 700, display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        2. Select Specific Services under each Category:
      </Typography>

      {availableCategories.map((cat) => {
        const categoryServices = availableServices.filter(
          (s) => (s.categoryId?._id || s.categoryId) === cat._id
        );
        if (categoryServices.length === 0) return null;

        const selectedCount = categoryServices.filter((s) => formData.services.includes(s._id)).length;
        const isAllSelected = categoryServices.length > 0 && selectedCount === categoryServices.length;

        return (
          <Accordion
            key={cat._id}
            defaultExpanded={selectedCount > 0 || formData.categories.includes(cat._id)}
            sx={{
              mb: 1.5,
              border: selectedCount > 0 ? '1px solid #D4AF37' : '1px solid #e0e0e0',
              borderRadius: '8px !important',
              boxShadow: 'none',
              bgcolor: selectedCount > 0 ? '#fff' : '#fafafa'
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111' }}>
                    {cat.emoji || '📦'} {cat.name}
                  </Typography>
                  <Chip
                    label={`${selectedCount}/${categoryServices.length} Selected`}
                    size="small"
                    sx={{
                      bgcolor: selectedCount > 0 ? '#111' : '#eee',
                      color: selectedCount > 0 ? '#D4AF37' : '#666',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAllCategoryServices(cat._id, !isAllSelected);
                  }}
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isAllSelected ? '#d32f2f' : '#b8860b',
                    textTransform: 'none',
                    minWidth: 'auto',
                    mr: 1
                  }}
                >
                  {isAllSelected ? 'Deselect All' : 'Select All in Category'}
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 2, px: 2 }}>
              <Divider sx={{ mb: 1.5 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {categoryServices.map((svc) => {
                  const isChecked = formData.services.includes(svc._id);
                  return (
                    <Chip
                      key={svc._id}
                      label={svc.name || svc.title}
                      clickable
                      onClick={() => handleToggleService(svc._id, cat._id)}
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        py: 2,
                        px: 1,
                        borderRadius: 2,
                        bgcolor: isChecked ? '#111' : '#fff',
                        color: isChecked ? '#D4AF37' : '#333',
                        border: isChecked ? '1.5px solid #D4AF37' : '1px solid #ccc',
                        '&:hover': {
                          bgcolor: isChecked ? '#222' : '#f0f0f0'
                        }
                      }}
                      icon={isChecked ? <CheckCircleIcon sx={{ color: '#D4AF37 !important', fontSize: 18 }} /> : undefined}
                    />
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {formData.services.length > 0 && (
        <Box sx={{ mt: 2, p: 1.5, bgcolor: '#fff', borderRadius: 1.5, border: '1px solid #e0e0e0' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#333', display: 'block', mb: 0.5 }}>
            Selected Services Preview ({formData.services.length}):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {formData.services.map((sId) => {
              const found = availableServices.find((s) => s._id === sId);
              return (
                <Chip
                  key={sId}
                  label={found ? (found.name || found.title) : sId}
                  size="small"
                  onDelete={() => {
                    const catId = found?.categoryId?._id || found?.categoryId;
                    handleToggleService(sId, catId);
                  }}
                  sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 600, fontSize: '0.75rem', '& .MuiChip-deleteIcon': { color: '#D4AF37' } }}
                />
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );

  // Component to render Interactive Steps, Checkpoints & Payment % Editor
  const renderStepsAndPointsEditor = () => (
    <Box sx={{ mt: 2, p: 2, bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1, mb: 1.5 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: 1 }}>
            <ListIcon sx={{ color: '#D4AF37' }} />
            4. Milestones, Checkpoints & Payment %
          </Typography>
          <Typography variant="caption" sx={{ color: '#666' }}>
            You can add, edit, or delete step names, payment percentage (%), amounts, and checklist points.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddStep}
          sx={{
            bgcolor: '#111',
            color: '#D4AF37',
            fontWeight: 700,
            textTransform: 'none',
            border: '1px solid #D4AF37',
            '&:hover': { bgcolor: '#222' }
          }}
        >
          + Add New Step
        </Button>
      </Box>

      {/* Payment % Allocation Status Banner */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 1,
          p: 1.5,
          mb: 2,
          bgcolor: totalAllocatedPct === 100 ? '#e8f5e9' : '#fff8e1',
          borderRadius: 1.5,
          border: totalAllocatedPct === 100 ? '1px solid #a5d6a7' : '1px solid #ffe082'
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800, color: totalAllocatedPct === 100 ? '#2e7d32' : '#f57f17' }}>
            Total Payment Allocation: {totalAllocatedPct}% of 100% {formData.contractAmount && `(₹ ${Number(totalAllocatedAmt).toLocaleString('en-IN')})`}
          </Typography>
          <Typography variant="caption" sx={{ color: '#666' }}>
            Har step ka % daalne par contract amount ke hisaab se paise auto-calculate hote hain
          </Typography>
        </Box>
        <Box>
          {totalAllocatedPct === 100 ? (
            <Chip label="✓ Perfect 100% Allocated" size="small" sx={{ bgcolor: '#2e7d32', color: '#fff', fontWeight: 800 }} />
          ) : totalAllocatedPct < 100 ? (
            <Chip label={`Remaining: ${100 - totalAllocatedPct}% to allocate`} size="small" sx={{ bgcolor: '#f57f17', color: '#fff', fontWeight: 800 }} />
          ) : (
            <Chip label={`Exceeds 100% by ${totalAllocatedPct - 100}%`} size="small" sx={{ bgcolor: '#d32f2f', color: '#fff', fontWeight: 800 }} />
          )}
        </Box>
      </Box>

      {/* Steps List */}
      {customSteps.map((step, sIdx) => (
        <Accordion
          key={sIdx}
          defaultExpanded
          sx={{
            mb: 2,
            border: '1px solid #ddd',
            borderRadius: '8px !important',
            boxShadow: 'none',
            bgcolor: '#fff',
            '&:before': { display: 'none' }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1, gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111' }}>
                {step.title || `Step ${sIdx + 1}`}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={`${step.percentage || 0}% Payment`}
                  size="small"
                  sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 800 }}
                />
                {step.amountExpected > 0 && (
                  <Chip
                    label={`₹ ${Number(step.amountExpected).toLocaleString('en-IN')}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                )}
                <Chip
                  label={`${(step.points || []).length} Points`}
                  size="small"
                  sx={{ bgcolor: '#f0f0f0', fontWeight: 600 }}
                />
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2, px: 2 }}>
            <Divider sx={{ mb: 2 }} />

            {/* Step Controls: Title, Percentage, and Amount */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={`Step ${sIdx + 1} Name / Title *`}
                  fullWidth
                  size="small"
                  value={step.title}
                  onChange={(e) => handleUpdateStep(sIdx, 'title', e.target.value)}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Payment %"
                  type="number"
                  fullWidth
                  size="small"
                  value={step.percentage}
                  onChange={(e) => handleUpdateStep(sIdx, 'percentage', e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Expected (₹)"
                  type="number"
                  fullWidth
                  size="small"
                  value={step.amountExpected}
                  onChange={(e) => handleUpdateStep(sIdx, 'amountExpected', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>
            </Grid>

            {/* Checkpoints / Points List */}
            <Box sx={{ bgcolor: '#f9f9f9', p: 1.5, borderRadius: 2, border: '1px solid #eee' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#b8860b', textTransform: 'uppercase' }}>
                  Checklist Points / Sub-tasks:
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddPoint(sIdx)}
                  sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#111', textTransform: 'none', border: '1px solid #ccc', bgcolor: '#fff' }}
                >
                  + Add Checkpoint
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(step.points || []).map((point, pIdx) => (
                  <Box key={pIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 800, minWidth: 20 }}>
                      {pIdx + 1}.
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Point description (e.g. Nim bharna, Pani ki tanki, RCC casting)..."
                      value={typeof point === 'string' ? point : (point.title || '')}
                      onChange={(e) => handleUpdatePoint(sIdx, pIdx, e.target.value)}
                      sx={{ bgcolor: '#fff', '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.8 } }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDeletePoint(sIdx, pIdx)}
                      sx={{ color: '#d32f2f', '&:hover': { bgcolor: '#ffebee' } }}
                      title="Delete Checkpoint"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Delete Step Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteStep(sIdx)}
                sx={{ fontSize: '0.75rem', textTransform: 'none', fontWeight: 700 }}
              >
                Delete This Entire Step
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E2C044 50%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              fontSize: { xs: '1.6rem', sm: '2.1rem' }
            }}
          >
            <PersonIcon sx={{ color: '#D4AF37', fontSize: 38 }} />
            Clients & Construction Projects
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 0.5, fontSize: '0.92rem' }}>
            Manage client profiles, construction categories & services, milestone progress points, payments, and site materials
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
            color: '#0a0a0a',
            fontWeight: 800,
            fontSize: '0.95rem',
            boxShadow: '0 4px 16px rgba(212, 175, 55, 0.4)',
            border: '1px solid #F3E5AB',
            '&:hover': {
              background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)',
              boxShadow: '0 6px 20px rgba(212, 175, 55, 0.6)'
            },
            px: 3,
            py: 1.2,
            borderRadius: 2
          }}
        >
          + Add New Client
        </Button>
      </Box>

      {/* KPI Overview Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 2 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Total Clients
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', mt: 0.5 }}>
                {clients.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 2 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" sx={{ color: '#4ade80', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Active On-Site
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#4ade80', mt: 0.5 }}>
                {activeProjectsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 2 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Total Contract Value
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF', mt: 0.5 }}>
                ₹ {totalContractVal.toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 2 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" sx={{ color: '#4ade80', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Total Received
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#4ade80', mt: 0.5 }}>
                ₹ {totalCollected.toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 2 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" sx={{ color: '#f87171', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Total Balance Due
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: totalBalanceDue > 0 ? '#f87171' : '#4ade80', mt: 0.5 }}>
                ₹ {totalBalanceDue.toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.2)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box component="form" onSubmit={handleSearchSubmit}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by client name, mobile, location, or Aadhar card..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    bgcolor: 'rgba(0,0,0,0.4)',
                    borderRadius: 1.5,
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: '#D4AF37' },
                    '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#D4AF37' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <Button size="small" type="submit" sx={{ minWidth: 'auto', color: '#D4AF37', fontWeight: 800 }}>
                      Search
                    </Button>
                  )
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 0.5, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              {STATUS_OPTIONS.map((st) => {
                const isSelected = statusFilter === st.value;
                return (
                  <Chip
                    key={st.value}
                    label={st.label}
                    clickable
                    onClick={() => setStatusFilter(st.value)}
                    sx={{
                      fontWeight: 700,
                      bgcolor: isSelected ? '#D4AF37' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#000' : 'rgba(255, 255, 255, 0.75)',
                      border: isSelected ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        bgcolor: isSelected ? '#e5c158' : 'rgba(255, 255, 255, 0.12)'
                      }
                    }}
                  />
                );
              })}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Clients Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, bgcolor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(212, 175, 55, 0.25)', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(0, 0, 0, 0.7)', borderBottom: '2px solid rgba(212, 175, 55, 0.3)' }}>
            <TableRow>
              <TableCell sx={{ color: '#D4AF37', fontWeight: 800, fontSize: '0.88rem' }}>Client & Credentials</TableCell>
              <TableCell sx={{ color: '#D4AF37', fontWeight: 800, fontSize: '0.88rem' }}>Aadhar No</TableCell>
              <TableCell sx={{ color: '#D4AF37', fontWeight: 800, fontSize: '0.88rem' }}>Categories & Services</TableCell>
              <TableCell sx={{ color: '#D4AF37', fontWeight: 800, fontSize: '0.88rem' }}>Rate & Budget (₹)</TableCell>
              <TableCell sx={{ color: '#D4AF37', fontWeight: 800, fontSize: '0.88rem' }}>Payment Status</TableCell>
              <TableCell sx={{ color: '#D4AF37', fontWeight: 800, fontSize: '0.88rem' }}>Progress</TableCell>
              <TableCell sx={{ color: '#D4AF37', fontWeight: 800, fontSize: '0.88rem' }}>Status</TableCell>
              <TableCell align="right" sx={{ color: '#D4AF37', fontWeight: 800, fontSize: '0.88rem' }}>Workspace & Login</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <CircularProgress sx={{ color: '#D4AF37' }} />
                  <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                    Loading clients...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                    No clients found.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAdd}
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                      color: '#000',
                      fontWeight: 800
                    }}
                  >
                    Create First Client
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              clients.map((c) => {
                const statusBadge = getStatusBadge(c.status);
                const contractAmt = Number(c.contractAmount || 0);
                const paidAmt = Number(c.totalPaid || 0);
                const balanceAmt = Number(c.remainingBalance || 0);
                const progressPct = c.progressPercentage || 0;
                const paidPct = contractAmt > 0 ? Math.min(100, Math.round((paidAmt / contractAmt) * 100)) : 0;
                const clientPass = c.loginPassword || `${(c.name || 'Client').trim().split(/\s+/)[0]}@123`;

                return (
                  <TableRow
                    key={c._id}
                    hover
                    sx={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      '&:hover': { bgcolor: 'rgba(212,175,55,0.08)' }
                    }}
                  >
                    {/* Client & Contact & Credentials */}
                    <TableCell sx={{ minWidth: 200 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.98rem' }}>
                        {c.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#E2C044', fontSize: '0.8rem', mt: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 14, color: '#D4AF37' }} />
                        <span>+91 {c.phone}</span>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', mt: 0.3 }}>
                        <LocationIcon sx={{ fontSize: 14, color: '#aaa' }} />
                        <span>{c.location}</span>
                      </Box>
                      {c.email && (
                        <Box sx={{ mt: 1, p: 0.8, bgcolor: 'rgba(212,175,55,0.08)', borderRadius: 1.5, border: '1px dashed rgba(212,175,55,0.35)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#38bdf8', fontSize: '0.74rem', fontWeight: 600 }}>
                            <EmailIcon sx={{ fontSize: 13 }} />
                            <span>{c.email}</span>
                          </Box>
                          <Typography variant="caption" sx={{ color: '#FACC15', fontWeight: 700, display: 'block', mt: 0.2, fontSize: '0.73rem' }}>
                            🔑 Pass: {clientPass}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>

                    {/* Aadhar */}
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600, fontSize: '0.85rem' }}>
                      {c.aadharNo ? (
                        <Chip
                          label={c.aadharNo}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            bgcolor: 'rgba(255, 255, 255, 0.08)',
                            color: '#FFFFFF',
                            border: '1px solid rgba(255, 255, 255, 0.15)'
                          }}
                        />
                      ) : (
                        '—'
                      )}
                    </TableCell>

                    {/* Categories & Services */}
                    <TableCell sx={{ maxWidth: 260 }}>
                      {c.categories && c.categories.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
                          {c.categories.map((cat, idx) => (
                            <Chip
                              key={idx}
                              label={`${typeof cat === 'object' ? (cat.emoji || '📦') : ''} ${typeof cat === 'object' ? cat.name : 'Category'}`}
                              size="small"
                              sx={{
                                fontSize: '0.72rem',
                                bgcolor: 'rgba(212,175,55,0.15)',
                                color: '#D4AF37',
                                fontWeight: 800,
                                border: '1px solid rgba(212,175,55,0.4)'
                              }}
                            />
                          ))}
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {c.services && c.services.length > 0 ? (
                          c.services.slice(0, 3).map((s, idx) => (
                            <Chip
                              key={idx}
                              label={typeof s === 'object' ? (s.name || s.title) : 'Service'}
                              size="small"
                              sx={{
                                fontSize: '0.7rem',
                                bgcolor: 'rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.9)',
                                border: '1px solid rgba(255,255,255,0.1)'
                              }}
                            />
                          ))
                        ) : (
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>None selected</Typography>
                        )}
                        {c.services && c.services.length > 3 && (
                          <Chip
                            label={`+${c.services.length - 3} more`}
                            size="small"
                            sx={{ fontSize: '0.7rem', bgcolor: 'rgba(255,255,255,0.06)', color: '#aaa' }}
                          />
                        )}
                      </Box>
                    </TableCell>

                    {/* Rate & Total Expected Work Budget */}
                    <TableCell sx={{ minWidth: 160 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.95rem' }}>
                        ₹ {contractAmt.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, display: 'block' }}>
                        Total Work Budget
                      </Typography>
                      {Number(c.serviceRate) > 0 ? (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'inline-block',
                            mt: 0.5,
                            bgcolor: 'rgba(212,175,55,0.15)',
                            color: '#FACC15',
                            fontWeight: 700,
                            px: 0.8,
                            py: 0.2,
                            borderRadius: 1,
                            border: '1px solid rgba(212,175,55,0.35)'
                          }}
                        >
                          Rate: ₹{Number(c.serviceRate).toLocaleString('en-IN')} ({c.serviceRateUnit || 'Sq.Ft'})
                        </Typography>
                      ) : null}
                    </TableCell>

                    {/* Payment Status & Balance */}
                    <TableCell sx={{ minWidth: 160 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#4ade80' }}>
                          ₹ {paidAmt.toLocaleString('en-IN')} Paid
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
                          {paidPct}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={paidPct}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': { bgcolor: '#4ade80' }
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: balanceAmt > 0 ? '#f87171' : '#4ade80',
                          fontWeight: 700,
                          display: 'block',
                          mt: 0.5
                        }}
                      >
                        Due: ₹ {balanceAmt.toLocaleString('en-IN')}
                      </Typography>
                    </TableCell>

                    {/* Progress % */}
                    <TableCell sx={{ minWidth: 120 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                              {progressPct}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={progressPct}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'rgba(255,255,255,0.1)',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #D4AF37 0%, #F59E0B 100%)'
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={statusBadge.label}
                        size="small"
                        sx={{
                          bgcolor: statusBadge.bg,
                          color: statusBadge.text,
                          border: `1px solid ${statusBadge.border}`,
                          fontWeight: 800,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>

                    {/* Project Workspace Actions */}
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => navigate(`/admin/clients/${c._id}`)}
                          sx={{
                            background: 'linear-gradient(135deg, #111111 0%, #1e293b 100%)',
                            color: '#D4AF37',
                            fontWeight: 800,
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            py: 0.5,
                            px: 1.5,
                            border: '1px solid #D4AF37',
                            '&:hover': { background: '#222', borderColor: '#F3E5AB' }
                          }}
                        >
                          Workspace
                        </Button>
                        {c.email && (
                          <Tooltip title="Send / Resend Client Login Credentials Email">
                            <IconButton
                              size="small"
                              disabled={resendingId === c._id}
                              onClick={() => handleResendCredentials(c)}
                              sx={{
                                color: '#D4AF37',
                                bgcolor: 'rgba(212,175,55,0.1)',
                                border: '1px solid rgba(212,175,55,0.3)',
                                '&:hover': { bgcolor: 'rgba(212,175,55,0.25)' }
                              }}
                            >
                              {resendingId === c._id ? (
                                <CircularProgress size={16} sx={{ color: '#D4AF37' }} />
                              ) : (
                                <KeyIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Edit Client, Categories & Steps">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(c)}
                            sx={{
                              color: '#38bdf8',
                              bgcolor: 'rgba(56,189,248,0.1)',
                              border: '1px solid rgba(56,189,248,0.3)',
                              '&:hover': { bgcolor: 'rgba(56,189,248,0.2)' }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Client">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setClientToDelete(c);
                              setDeleteConfirmOpen(true);
                            }}
                            sx={{
                              color: '#f87171',
                              bgcolor: 'rgba(248,113,113,0.1)',
                              border: '1px solid rgba(248,113,113,0.3)',
                              '&:hover': { bgcolor: 'rgba(248,113,113,0.2)' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Client Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 800 }}>
          Create New Client Construction Project
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            {/* Step 1: Client Personal Details */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#b8860b', mb: 1, textTransform: 'uppercase' }}>
                1. Client Contact & Site Info
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Client Name *"
                    fullWidth
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Mobile Number *"
                    fullWidth
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    placeholder="client@example.com (used for automated payment slips & login)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    helperText="Client login ID & receipts will be sent to this email"
                  />
                </Grid>
                {formData.email && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: '#166534', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <KeyIcon sx={{ fontSize: 20, color: '#15803d' }} />
                        Automated Client Login & Live Project Portal
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#14532d', mt: 0.8, fontSize: '0.88rem', lineHeight: 1.6 }}>
                        Client Login URL: <strong>https://vishwakarmabuildandfurnish.in/loginuser</strong><br />
                        User ID / Email: <strong>{formData.email.trim().toLowerCase()}</strong><br />
                        Auto-generated Password: <strong style={{ color: '#b45309', fontSize: '1rem', backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}>{formData.name.trim() ? `${formData.name.trim().split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, '') || 'Client'}@123` : '<FirstName>@123'}</strong>
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#166534', display: 'block', mt: 0.8, fontWeight: 600 }}>
                        📩 Login credentials and project portal link will be emailed automatically once saved.
                      </Typography>
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Site Location / Address *"
                    fullWidth
                    required
                    placeholder="e.g. Near Railway Station, Charkhi Dadri"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Aadhar Card Number"
                    fullWidth
                    placeholder="e.g. 1234-5678-9012"
                    value={formData.aadharNo}
                    onChange={(e) => setFormData({ ...formData, aadharNo: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Initial Project Status"
                    fullWidth
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {STATUS_OPTIONS.filter((s) => s.value !== 'All').map((s) => (
                      <MenuItem key={s.value} value={s.value}>
                        {s.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Step 2: Service Rate & Total Expected Work Amount */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#b8860b', mb: 1, textTransform: 'uppercase' }}>
                2. Service Rate & Total Expected Work Amount
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Agreed Service Rate (₹)"
                    type="number"
                    fullWidth
                    placeholder="e.g. 5342"
                    helperText="Agreed service rate for the contract"
                    value={formData.serviceRate}
                    onChange={(e) => setFormData({ ...formData, serviceRate: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Rate Unit"
                    select
                    fullWidth
                    value={formData.serviceRateUnit || 'Per Sq.Ft'}
                    onChange={(e) => setFormData({ ...formData, serviceRateUnit: e.target.value })}
                  >
                    <MenuItem value="Per Sq.Ft">Per Sq.Ft</MenuItem>
                    <MenuItem value="Fixed / Lump-sum">Fixed / Lump-sum</MenuItem>
                    <MenuItem value="Per Running Ft">Per Running Ft</MenuItem>
                    <MenuItem value="Per Day / Dihadi">Per Day</MenuItem>
                    <MenuItem value="Per Unit">Per Unit</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="Total Expected Work Amount (₹) *"
                    type="number"
                    fullWidth
                    required
                    placeholder="e.g. 1500000"
                    helperText="Total estimated project amount used to calculate milestone amounts"
                    value={formData.contractAmount}
                    onChange={(e) => handleContractAmountChange(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Project Start Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Expected Handover Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={formData.expectedEndDate}
                    onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Step 3: Categories and Services Section */}
            {renderCategoryAndServicesSection()}

            <Divider />

            {/* Step 4: Interactive Steps, Checkpoints & Payment % Editor */}
            {renderStepsAndPointsEditor()}

            <Divider />

            {/* Step 5: Agreement Document Upload */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#b8860b', mb: 1, textTransform: 'uppercase' }}>
                5. Agreement Document / Photo Upload
              </Typography>
              <Box sx={{ p: 2, border: '2px dashed #ccc', borderRadius: 2, textAlign: 'center', bgcolor: '#fafafa' }}>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  id="agreement-upload-input"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <label htmlFor="agreement-upload-input">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    sx={{ color: '#111', borderColor: '#D4AF37', fontWeight: 700 }}
                  >
                    Choose Agreement Image / PDF
                  </Button>
                </label>
                {agreementFile && (
                  <Typography variant="body2" sx={{ mt: 1, color: '#2e7d32', fontWeight: 600 }}>
                    Selected: {agreementFile.name}
                  </Typography>
                )}
                {agreementPreview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={agreementPreview}
                      alt="Agreement Preview"
                      style={{ maxHeight: 120, borderRadius: 6, border: '1px solid #ddd' }}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            <TextField
              label="Additional Notes / Remarks"
              multiline
              rows={2}
              fullWidth
              placeholder="Any special client instructions, payment terms, or material conditions..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={() => setAddDialogOpen(false)} disabled={savingClient} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateClient}
            variant="contained"
            disabled={savingClient}
            sx={{
              bgcolor: '#111',
              color: '#D4AF37',
              fontWeight: 700,
              '&:hover': { bgcolor: '#222' },
              '&.Mui-disabled': { bgcolor: '#555', color: '#aaa' }
            }}
          >
            {savingClient ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} sx={{ color: '#D4AF37' }} />
                <span>Creating Project...</span>
              </Box>
            ) : (
              'Create Client Project'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 800 }}>
          Edit Client Information, Categories, Services & Milestones
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Client Name *"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mobile Number *"
                  fullWidth
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  fullWidth
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Site Location / Address *"
                  fullWidth
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Aadhar Card Number"
                  fullWidth
                  value={formData.aadharNo}
                  onChange={(e) => setFormData({ ...formData, aadharNo: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Agreed Service Rate (₹)"
                  type="number"
                  fullWidth
                  placeholder="e.g. 5342"
                  helperText="Agreed service rate for the contract"
                  value={formData.serviceRate}
                  onChange={(e) => setFormData({ ...formData, serviceRate: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Rate Unit"
                  select
                  fullWidth
                  value={formData.serviceRateUnit || 'Per Sq.Ft'}
                  onChange={(e) => setFormData({ ...formData, serviceRateUnit: e.target.value })}
                >
                  <MenuItem value="Per Sq.Ft">Per Sq.Ft</MenuItem>
                  <MenuItem value="Fixed / Lump-sum">Fixed / Lump-sum</MenuItem>
                  <MenuItem value="Per Running Ft">Per Running Ft</MenuItem>
                  <MenuItem value="Per Day / Dihadi">Per Day</MenuItem>
                  <MenuItem value="Per Unit">Per Unit</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Total Expected Work Amount (₹) *"
                  type="number"
                  fullWidth
                  helperText="Total estimated project amount used to calculate milestone amounts"
                  value={formData.contractAmount}
                  onChange={(e) => handleContractAmountChange(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  select
                  label="Project Status"
                  fullWidth
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {STATUS_OPTIONS.filter((s) => s.value !== 'All').map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            {/* Categories & Services in Edit Dialog */}
            {renderCategoryAndServicesSection()}

            {/* Interactive Steps & Checkpoints Editor in Edit Dialog */}
            {renderStepsAndPointsEditor()}

            <TextField
              label="Notes"
              multiline
              rows={2}
              fullWidth
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={() => setEditDialogOpen(false)} disabled={updatingClient} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateClient}
            variant="contained"
            disabled={updatingClient}
            sx={{
              bgcolor: '#111',
              color: '#D4AF37',
              fontWeight: 700,
              '&:hover': { bgcolor: '#222' },
              '&.Mui-disabled': { bgcolor: '#555', color: '#aaa' }
            }}
          >
            {updatingClient ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} sx={{ color: '#D4AF37' }} />
                <span>Saving Changes...</span>
              </Box>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800, color: '#d32f2f' }}>Archive / Soft Delete Client Project</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to remove client <strong>{clientToDelete?.name}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
            Note: This project will be <strong>soft-deleted (safely archived)</strong>. All recorded payments, expenses, milestones, and receipts are preserved in the database and can be restored if needed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} disabled={deletingClient} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteClient}
            variant="contained"
            color="error"
            disabled={deletingClient}
            sx={{ fontWeight: 700 }}
          >
            {deletingClient ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} sx={{ color: '#fff' }} />
                <span>Archiving...</span>
              </Box>
            ) : (
              'Soft Delete (Archive)'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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

export default ClientsManagement;
