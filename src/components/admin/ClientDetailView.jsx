import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  LinearProgress,
  InputAdornment,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  ReceiptLong as ReceiptIcon,
  Inventory2 as InventoryIcon,
  LocalShipping as ShippingIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CloudUpload as UploadIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalanceWallet as WalletIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  FormatListBulleted as ListIcon,
  VpnKey as KeyIcon,
  PhotoCamera as PhotoCameraIcon,
  Videocam as VideocamIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Engineering as EngineeringIcon,
  WhatsApp as WhatsAppIcon,
  CalendarMonth as CalendarMonthIcon,
  ArrowForward as ArrowForwardIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import axiosInstance, { getStaticAssetUrl } from '../../../utils/axiosConfig';
import PaymentSlipModal from './PaymentSlipModal';
import { UNITS, getUnitDisplay } from './MaterialsManagement';

export const LABOUR_ROLES = [
  { id: 'mistri', label: 'मिस्त्री (Mistri / Mason)', color: '#b45309', bg: '#fef3c7' },
  { id: 'mazdoor', label: 'मजदूर (Mazdoor / Labour)', color: '#0369a1', bg: '#e0f2fe' },
  { id: 'thekedar', label: 'ठेकेदार (Thekedar)', color: '#6d28d9', bg: '#f3e8ff' },
  { id: 'carpenter', label: 'बढ़ई (Carpenter)', color: '#9a3412', bg: '#ffedd5' },
  { id: 'plumber', label: 'प्लंबर (Plumber)', color: '#0f766e', bg: '#ccfbf1' },
  { id: 'electrician', label: 'इलेक्ट्रीशियन (Electrician)', color: '#854d0e', bg: '#fef9c3' },
  { id: 'painter', label: 'पेंटर (Painter)', color: '#be185d', bg: '#fce7f3' },
  { id: 'helper', label: 'हेल्पर (Helper)', color: '#374151', bg: '#f3f4f6' },
  { id: 'other', label: 'अन्य (Other)', color: '#1f2937', bg: '#f3f4f6' }
];

export const getRoleInfo = (roleId) => {
  return LABOUR_ROLES.find((r) => r.id === roleId) || { label: roleId || 'Worker', color: '#4b5563', bg: '#f3f4f6' };
};

export const SECTION_ID_TO_TAB = {
  milestones: 0,
  payments: 1,
  materials: 2,
  labour: 3,
  expenses: 4,
  pnl: 5,
  agreement: 6,
  media: 7
};

export const TAB_TO_SECTION_ID = {
  0: 'milestones',
  1: 'payments',
  2: 'materials',
  3: 'labour',
  4: 'expenses',
  5: 'pnl',
  6: 'agreement',
  7: 'media'
};

export const SECTION_CONFIG = [
  {
    id: 'milestones',
    tabIndex: 0,
    title: 'Work Milestones & Checklist',
    subtitle: 'Milestones & Checklist Points',
    shortTitle: 'Milestones',
    icon: <CheckCircleIcon sx={{ fontSize: 24 }} />,
    color: '#2563eb',
    bg: '#eff6ff',
    borderColor: '#bfdbfe',
    desc: 'Track construction stages, step-by-step checklists, and payment milestones'
  },
  {
    id: 'payments',
    tabIndex: 1,
    title: 'Payments & Slips',
    subtitle: 'Payment records & receipts',
    shortTitle: 'Payments',
    icon: <ReceiptIcon sx={{ fontSize: 24 }} />,
    color: '#059669',
    bg: '#ecfdf5',
    borderColor: '#a7f3d0',
    desc: 'Record client payments, generate official PDF receipts, and track dues'
  },
  {
    id: 'materials',
    tabIndex: 2,
    title: 'Materials & Deliveries',
    subtitle: 'Material Deliveries & Bills',
    shortTitle: 'Materials',
    icon: <InventoryIcon sx={{ fontSize: 24 }} />,
    color: '#d97706',
    bg: '#fffbeb',
    borderColor: '#fde68a',
    desc: 'Manage raw material deliveries, supplier invoices, and delivery vehicles'
  },
  {
    id: 'labour',
    tabIndex: 3,
    title: 'Labour & Attendance',
    subtitle: 'Worker ledger & attendance',
    shortTitle: 'Labour',
    icon: <EngineeringIcon sx={{ fontSize: 24 }} />,
    color: '#7c3aed',
    bg: '#f5f3ff',
    borderColor: '#ddd6fe',
    desc: 'Daily attendance tracker, worker roster, daily wages & payment ledger'
  },
  {
    id: 'expenses',
    tabIndex: 4,
    title: 'Other Site Expenses',
    subtitle: 'Site running & miscellaneous costs',
    shortTitle: 'Expenses',
    icon: <MoneyIcon sx={{ fontSize: 24 }} />,
    color: '#dc2626',
    bg: '#fef2f2',
    borderColor: '#fecaca',
    desc: 'Record miscellaneous site expenses including fuel, repairs, and vouchers'
  },
  {
    id: 'pnl',
    tabIndex: 5,
    title: 'Profit & Loss (P&L)',
    subtitle: 'Financial margins & cost analysis',
    shortTitle: 'P&L Analysis',
    icon: <AssessmentIcon sx={{ fontSize: 24 }} />,
    color: '#0891b2',
    bg: '#f0fdfa',
    borderColor: '#99f6e4',
    desc: 'Real-time project cost analysis, total spend vs contract budget'
  },
  {
    id: 'agreement',
    tabIndex: 6,
    title: 'Site Agreement & Docs',
    subtitle: 'Agreement & Documents',
    shortTitle: 'Agreement',
    icon: <DescriptionIcon sx={{ fontSize: 24 }} />,
    color: '#4f46e5',
    bg: '#eef2ff',
    borderColor: '#c7d2fe',
    desc: 'Signed contract copy, agreement documents, bank details, and terms'
  },
  {
    id: 'media',
    tabIndex: 7,
    title: 'Site Photos & Videos',
    subtitle: 'Photos & Videos',
    shortTitle: 'Photos & Videos',
    icon: <PhotoLibraryIcon sx={{ fontSize: 24 }} />,
    color: '#db2777',
    bg: '#fdf2f8',
    borderColor: '#fbcfe8',
    desc: 'Upload progress images and inspection videos visible to client'
  }
];

const ClientDetailView = () => {
  const { id, section } = useParams();
  const navigate = useNavigate();

  const isOverview = !section || section === 'overview' || SECTION_ID_TO_TAB[section] === undefined;
  const activeSectionConfig = SECTION_CONFIG.find((s) => s.id === section) || SECTION_CONFIG[0];

  const initialTab = (section && SECTION_ID_TO_TAB[section] !== undefined) ? SECTION_ID_TO_TAB[section] : 0;
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (section && SECTION_ID_TO_TAB[section] !== undefined) {
      setActiveTab(SECTION_ID_TO_TAB[section]);
    }
  }, [section]);

  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState(null);
  const [financials, setFinancials] = useState(null);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [materialsCatalog, setMaterialsCatalog] = useState([]);

  const [selectedMaterialFilter, setSelectedMaterialFilter] = useState('');

  // Payment Slip Modal state
  const [selectedPaymentForSlip, setSelectedPaymentForSlip] = useState(null);
  const [slipModalOpen, setSlipModalOpen] = useState(false);

  // Add Payment Modal
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash',
    transactionRef: '',
    stepId: '',
    notes: ''
  });

  // Add Material Expense Modal
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    materialId: '',
    materialName: '',
    category: 'Civil & Masonry',
    quantity: 1,
    unit: 'Truck',
    pricingMode: 'per_unit', // 'per_unit' or 'total'
    unitPrice: '',
    materialCost: '',
    transportIncluded: true,
    transportCost: '',
    supplier: '',
    vehicleNo: '',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash',
    note: ''
  });
  const [materialBillFile, setMaterialBillFile] = useState(null);

  // Add Other Expense Modal
  const [otherExpenseDialogOpen, setOtherExpenseDialogOpen] = useState(false);
  const [otherExpenseForm, setOtherExpenseForm] = useState({
    title: '',
    category: 'Labour / Mistri',
    totalAmount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash',
    note: ''
  });
  const [otherBillFile, setOtherBillFile] = useState(null);

  // Bill Image preview modal
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Site Media (Photos & Videos) state
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaForm, setMediaForm] = useState({
    mediaType: 'image',
    title: '',
    stepTitle: '',
    caption: '',
    mediaFile: null,
    url: ''
  });
  const [mediaFilter, setMediaFilter] = useState('all'); // 'all', 'image', 'video'

  // Edit Steps & Milestones Modal state
  const [stepsDialogOpen, setStepsDialogOpen] = useState(false);
  const [editableSteps, setEditableSteps] = useState([]);
  const [savingSteps, setSavingSteps] = useState(false);

  // Rapid double-click prevention states
  const [savingPayment, setSavingPayment] = useState(false);
  const [savingMaterialExpense, setSavingMaterialExpense] = useState(false);
  const [savingOtherExpense, setSavingOtherExpense] = useState(false);

  // Labour & Mistri States
  const [labourers, setLabourers] = useState([]);
  const [labourSummary, setLabourSummary] = useState(null);
  const [labourLoading, setLabourLoading] = useState(false);
  const [labourSubTab, setLabourSubTab] = useState(0); // 0: Daily Attendance, 1: Workers Ledger, 2: Payments
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [labourPayments, setLabourPayments] = useState([]);
  const [labourPaymentsLoading, setLabourPaymentsLoading] = useState(false);
  const [expandedWorkerPayments, setExpandedWorkerPayments] = useState({});

  const toggleWorkerPaymentsExpand = (workerId) => {
    setExpandedWorkerPayments((prev) => ({
      ...prev,
      [workerId]: !prev[workerId]
    }));
  };

  // Worker Modal
  const [workerDialogOpen, setWorkerDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [workerForm, setWorkerForm] = useState({
    name: '',
    phone: '',
    role: 'mazdoor',
    dailyWage: '',
    startDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [savingWorker, setSavingWorker] = useState(false);

  // Pay Labour Modal
  const [payLabourDialogOpen, setPayLabourDialogOpen] = useState(false);
  const [payLabourForm, setPayLabourForm] = useState({
    labourId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash',
    transactionRef: '',
    notes: '',
    sendWhatsApp: true
  });
  const [savingPayLabour, setSavingPayLabour] = useState(false);

  // Quick point input state per step: { [stepId]: 'point text' }
  const [quickPointTexts, setQuickPointTexts] = useState({});

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [resendingCredentials, setResendingCredentials] = useState(false);

  // Resend Login Credentials Email
  const handleResendCredentials = async () => {
    if (!clientData?.email) {
      setSnackbar({ open: true, message: 'Client has no email address. Please update client to add email.', severity: 'warning' });
      return;
    }
    setResendingCredentials(true);
    try {
      const res = await axiosInstance.post(`/clients/${id}/resend-credentials`);
      setSnackbar({
        open: true,
        message: res.data?.message || `Credentials sent successfully to ${clientData.email}`,
        severity: 'success'
      });
      fetchClientDetails(selectedMaterialFilter);
    } catch (err) {
      console.error('Error sending credentials:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to send credentials email',
        severity: 'error'
      });
    } finally {
      setResendingCredentials(false);
    }
  };

  // Fetch client details
  const fetchClientDetails = async (materialId = '') => {
    try {
      setLoading(true);
      const params = {};
      if (materialId) params.materialId = materialId;

      const res = await axiosInstance.get(`/clients/${id}`, { params });
      if (res.data && res.data.data) {
        setClientData(res.data.data.client);
        setFinancials(res.data.data.financials);
        setPayments(res.data.data.payments || []);
        setExpenses(res.data.data.expenses || []);
      }
    } catch (err) {
      console.error('Error loading client:', err);
      setSnackbar({ open: true, message: 'Failed to load client details', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch materials catalog for dropdown
  const fetchMaterialsCatalog = async () => {
    try {
      const res = await axiosInstance.get('/materials');
      if (res.data && res.data.data) {
        setMaterialsCatalog(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching materials:', err);
    }
  };

  // Fetch Labourers Roster & Summary
  const fetchLabourData = async () => {
    try {
      setLabourLoading(true);
      const res = await axiosInstance.get(`/clients/${id}/labour`);
      if (res.data) {
        const payload = res.data.data || res.data;
        const list = payload.labourers || payload.workers || (Array.isArray(payload) ? payload : []) || [];
        setLabourers(list);
        setLabourSummary(payload.summary || res.data.summary || null);
      }
    } catch (err) {
      console.warn('Error loading labourers:', err);
    } finally {
      setLabourLoading(false);
    }
  };

  // Fetch Attendance by Date
  const fetchLabourAttendance = async (targetDate) => {
    try {
      setAttendanceLoading(true);
      const res = await axiosInstance.get(`/clients/${id}/labour/attendance`, {
        params: { date: targetDate }
      });
      if (res.data) {
        const payload = res.data.data || res.data;
        const records = payload.records || (Array.isArray(payload) ? payload : res.data.records) || [];
        setAttendanceRecords(records);
      }
    } catch (err) {
      console.warn('Error loading attendance:', err);
    } finally {
      setAttendanceLoading(false);
    }
  };

  // Fetch Labour Payment History
  const fetchLabourPaymentsList = async () => {
    try {
      setLabourPaymentsLoading(true);
      const res = await axiosInstance.get(`/clients/${id}/labour/payments`);
      if (res.data) {
        const payload = res.data.data || res.data;
        const list = payload.payments || (Array.isArray(payload) ? payload : res.data.payments) || [];
        setLabourPayments(list);
      }
    } catch (err) {
      console.warn('Error loading labour payments:', err);
    } finally {
      setLabourPaymentsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetails();
    fetchMaterialsCatalog();
    fetchLabourData();
    fetchLabourPaymentsList();
  }, [id]);

  useEffect(() => {
    if (id && attendanceDate) {
      fetchLabourAttendance(attendanceDate);
    }
  }, [id, attendanceDate]);

  // Handle Attendance status update
  const handleSetAttendanceStatus = (labourId, newStatus) => {
    setAttendanceRecords((prev) =>
      prev.map((rec) => {
        if (rec.labourId === labourId) {
          const units = newStatus === 'present' ? 1.0 : newStatus === 'half_day' ? 0.5 : 0;
          return { ...rec, status: newStatus, units };
        }
        return rec;
      })
    );
  };

  // Handle Attendance field changes (OT hours, OT wage, note)
  const handleAttendanceFieldChange = (labourId, field, value) => {
    setAttendanceRecords((prev) =>
      prev.map((rec) => {
        if (rec.labourId === labourId) {
          return { ...rec, [field]: value };
        }
        return rec;
      })
    );
  };

  // Mark all workers with status
  const handleMarkAllAttendance = (status) => {
    const units = status === 'present' ? 1.0 : status === 'half_day' ? 0.5 : 0;
    setAttendanceRecords((prev) =>
      prev.map((rec) => ({
        ...rec,
        status,
        units
      }))
    );
  };

  // Save Daily Attendance
  const handleSaveDailyAttendance = async () => {
    if (savingAttendance) return;
    setSavingAttendance(true);
    try {
      const attendanceData = attendanceRecords.map((r) => ({
        labourId: r.labourId,
        status: r.status,
        overtimeHours: Number(r.overtimeHours) || 0,
        overtimeWage: Number(r.overtimeWage) || 0,
        note: r.note || ''
      }));
      const payload = {
        date: attendanceDate,
        records: attendanceData,
        attendance: attendanceData
      };
      await axiosInstance.post(`/clients/${id}/labour/attendance`, payload);
      setSnackbar({ open: true, message: `हाजिरी सफलतापूर्वक सेव की गई (${attendanceDate})`, severity: 'success' });
      await fetchLabourData();
      await fetchLabourAttendance(attendanceDate);
      fetchClientDetails();
    } catch (err) {
      console.error('Error saving attendance:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to save attendance', severity: 'error' });
    } finally {
      setSavingAttendance(false);
    }
  };

  // Date Navigation Helpers
  const clientStartDate = (clientData?.startDate || clientData?.createdAt || '').split('T')[0] || '2020-01-01';
  const todayDateStr = new Date().toISOString().split('T')[0];

  const handlePrevDay = () => {
    const d = new Date(attendanceDate);
    d.setDate(d.getDate() - 1);
    const newDateStr = d.toISOString().split('T')[0];
    if (newDateStr >= clientStartDate) {
      setAttendanceDate(newDateStr);
    } else {
      setSnackbar({ open: true, message: `प्रोजेक्ट शुरुआत (${clientStartDate}) से पहले की तारीख नहीं हो सकती`, severity: 'info' });
    }
  };

  const handleNextDay = () => {
    const d = new Date(attendanceDate);
    d.setDate(d.getDate() + 1);
    const newDateStr = d.toISOString().split('T')[0];
    if (newDateStr <= todayDateStr) {
      setAttendanceDate(newDateStr);
    } else {
      setSnackbar({ open: true, message: 'भविष्य (Future) की तारीख नहीं चुनी जा सकती', severity: 'info' });
    }
  };

  // Worker Add / Edit Handlers
  const handleOpenAddWorker = () => {
    setEditingWorker(null);
    setWorkerForm({
      name: '',
      phone: '',
      role: 'mazdoor',
      dailyWage: '',
      startDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setWorkerDialogOpen(true);
  };

  const handleOpenEditWorker = (worker) => {
    setEditingWorker(worker);
    setWorkerForm({
      name: worker.name || '',
      phone: worker.phone || '',
      role: worker.role || 'mazdoor',
      dailyWage: worker.dailyWage || '',
      startDate: (worker.startDate ? new Date(worker.startDate).toISOString().split('T')[0] : '') || new Date().toISOString().split('T')[0],
      notes: worker.notes || ''
    });
    setWorkerDialogOpen(true);
  };

  const handleSaveWorker = async () => {
    if (savingWorker) return;
    if (!workerForm.name.trim()) {
      setSnackbar({ open: true, message: 'कृपया मजदूर/मिस्त्री का नाम लिखें', severity: 'warning' });
      return;
    }
    if (!workerForm.dailyWage || Number(workerForm.dailyWage) <= 0) {
      setSnackbar({ open: true, message: 'कृपया सही दिहाड़ी (Daily Wage) दर्ज करें', severity: 'warning' });
      return;
    }
    setSavingWorker(true);
    try {
      if (editingWorker) {
        await axiosInstance.put(`/clients/${id}/labour/${editingWorker._id}`, workerForm);
        setSnackbar({ open: true, message: 'मजदूर का विवरण अपडेट हो गया', severity: 'success' });
      } else {
        await axiosInstance.post(`/clients/${id}/labour`, workerForm);
        setSnackbar({ open: true, message: 'नया मजदूर सफलतापूर्वक जोड़ा गया', severity: 'success' });
      }
      setWorkerDialogOpen(false);
      await fetchLabourData();
      await fetchLabourAttendance(attendanceDate);
    } catch (err) {
      console.error('Error saving worker:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'मजदूर सेव नहीं हो पाया', severity: 'error' });
    } finally {
      setSavingWorker(false);
    }
  };

  const handleDeleteWorker = async (workerId, workerName) => {
    if (!window.confirm(`क्या आप सचमुच ${workerName} को हटाना चाहते हैं?`)) return;
    try {
      await axiosInstance.delete(`/clients/${id}/labour/${workerId}`);
      setSnackbar({ open: true, message: `${workerName} हटा दिया गया`, severity: 'success' });
      await fetchLabourData();
      await fetchLabourAttendance(attendanceDate);
      fetchClientDetails();
    } catch (err) {
      console.error('Error deleting worker:', err);
      setSnackbar({ open: true, message: 'Worker delete nahi ho paya', severity: 'error' });
    }
  };

  // Pay Labour Handlers
  const handleOpenPayLabour = (worker = null) => {
    const bal = worker ? (worker.balanceDue ?? worker.financials?.balanceDue ?? 0) : 0;
    setPayLabourForm({
      labourId: worker ? worker._id : (labourers[0]?._id || ''),
      amount: bal > 0 ? bal : '',
      date: new Date().toISOString().split('T')[0],
      paymentMode: 'Cash',
      transactionRef: '',
      notes: '',
      sendWhatsApp: true
    });
    setPayLabourDialogOpen(true);
  };

  const handleSaveLabourPayment = async () => {
    if (savingPayLabour) return;
    if (!payLabourForm.labourId) {
      setSnackbar({ open: true, message: 'कृपया मजदूर/मिस्त्री चुनें', severity: 'warning' });
      return;
    }
    if (!payLabourForm.amount || Number(payLabourForm.amount) <= 0) {
      setSnackbar({ open: true, message: 'कृपया सही भुगतान राशि दर्ज करें', severity: 'warning' });
      return;
    }

    setSavingPayLabour(true);
    try {
      const res = await axiosInstance.post(`/clients/${id}/labour/payments`, {
        labourId: payLabourForm.labourId,
        amount: Number(payLabourForm.amount),
        date: payLabourForm.date,
        paymentMode: payLabourForm.paymentMode,
        transactionRef: payLabourForm.transactionRef,
        notes: payLabourForm.notes
      });

      setSnackbar({ open: true, message: 'मजदूरी भुगतान रिकॉर्ड हो गया!', severity: 'success' });
      setPayLabourDialogOpen(false);

      // Open WhatsApp receipt automatically if selected
      if (payLabourForm.sendWhatsApp && res.data?.whatsappReceipt?.url) {
        window.open(res.data.whatsappReceipt.url, '_blank');
      }

      fetchLabourData();
      fetchLabourPaymentsList();
      fetchClientDetails();
    } catch (err) {
      console.error('Error recording labour payment:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'भुगतान रिकॉर्ड नहीं हो पाया', severity: 'error' });
    } finally {
      setSavingPayLabour(false);
    }
  };

  const handleDeleteLabourPayment = async (payId) => {
    if (!window.confirm('क्या आप यह भुगतान रिकॉर्ड हटाना चाहते हैं?')) return;
    try {
      await axiosInstance.delete(`/clients/${id}/labour/payments/${payId}`);
      setSnackbar({ open: true, message: 'भुगतान रिकॉर्ड हटा दिया गया', severity: 'success' });
      fetchLabourData();
      fetchLabourPaymentsList();
      fetchClientDetails();
    } catch (err) {
      console.error('Error deleting labour payment:', err);
      setSnackbar({ open: true, message: 'भुगतान डिलीट नहीं हो पाया', severity: 'error' });
    }
  };

  const handleSendWorkerLedgerWhatsApp = (worker) => {
    if (!worker.phone) {
      setSnackbar({ open: true, message: `${worker.name} का मोबाइल नंबर दर्ज नहीं है`, severity: 'warning' });
      return;
    }
    const cleanPhone = worker.phone.replace(/[^0-9]/g, '');
    const clientName = clientData?.name || 'Project Site';
    const location = clientData?.location || '';
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const text = `🚩 *श्री विश्वकर्मा बिल्ड एंड फर्निश* 🚩
🏗️ *साइट / क्लाइंट:* ${clientName} (${location})
📅 *खाता विवरण दिनांक:* ${dateStr}

👷 *कारीगर / मजदूर:* ${worker.name} (${worker.role || 'Worker'})
📞 *मोबाइल:* ${worker.phone}
💰 *दैनिक दिहाड़ी:* ₹${Number(worker.dailyWage || 0).toLocaleString('en-IN')} / दिन

📊 *हाजिरी व भुगतान खाता विवरण (Statement):*
━━━━━━━━━━━━━━━━━━━━━
🗓️ *कुल हाजिरी दिन:* ${worker.totalDays || 0} दिन
💵 *कुल बनी मजदूरी:* ₹${Number(worker.totalWageEarned || 0).toLocaleString('en-IN')}
✅ *अब तक दिया गया भुगतान:* ₹${Number(worker.totalPaid || 0).toLocaleString('en-IN')}
🔴 *बाकी बकाया (Balance Due):* ₹${Number(worker.balanceDue || 0).toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━━
_श्री विश्वकर्मा बिल्ड एंड फर्निश द्वारा जारी_`;

    const url = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSendPaymentSlipWhatsApp = (pay) => {
    const workerPhone = pay.labourId?.phone || '';
    if (!workerPhone) {
      setSnackbar({ open: true, message: 'कारीगर का मोबाइल नंबर नहीं मिला', severity: 'warning' });
      return;
    }
    const cleanPhone = workerPhone.replace(/[^0-9]/g, '');
    const clientName = clientData?.name || 'Project Site';
    const location = clientData?.location || '';
    const d = new Date(pay.date || Date.now());
    const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const text = `🚩 *श्री विश्वकर्मा बिल्ड एंड फर्निश* 🚩
🏗️ *साइट / क्लाइंट:* ${clientName} (${location})
🧾 *मजदूरी भुगतान रसीद (Payment Receipt)*

👷 *कारीगर / मजदूर:* ${pay.labourId?.name || 'Worker'} (${pay.labourId?.role || ''})
💵 *प्राप्त राशि:* ₹${Number(pay.amount || 0).toLocaleString('en-IN')}
📅 *दिनांक व समय:* ${dateStr} at ${timeStr}
💳 *भुगतान माध्यम:* ${pay.paymentMode || 'Cash'}
${pay.notes ? `📝 *विवरण:* ${pay.notes}\n` : ''}
✅ *भुगतान दर्ज कर लिया गया है। धन्यवाद।*
━━━━━━━━━━━━━━━━━━━━━
_श्री विश्वकर्मा बिल्ड एंड फर्निश_`;

    const url = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Handle Material Filter change
  const handleMaterialFilterChange = (matId) => {
    setSelectedMaterialFilter(matId);
    fetchClientDetails(matId);
  };

  // Toggle milestone checklist point
  const handleTogglePoint = async (stepId, pointId, currentCompleted) => {
    try {
      const res = await axiosInstance.put(`/clients/${id}/milestones`, {
        togglePoint: {
          stepId,
          pointId,
          completed: !currentCompleted
        }
      });

      if (res.data && res.data.data) {
        setClientData((prev) => ({
          ...prev,
          steps: res.data.data,
          progressPercentage: res.data.progressPercentage
        }));
        setSnackbar({
          open: true,
          message: !currentCompleted ? 'Point marked as completed! Progress updated.' : 'Point unchecked.',
          severity: 'success'
        });
      }
    } catch (err) {
      console.error('Error toggling milestone point:', err);
      setSnackbar({ open: true, message: 'Failed to update milestone point', severity: 'error' });
    }
  };

  // Open steps editor dialog with current steps
  const handleOpenStepsDialog = () => {
    if (!clientData) return;
    const currentSteps = (clientData.steps && clientData.steps.length > 0)
      ? clientData.steps.map((s, idx) => ({
          title: s.title || `Step ${idx + 1}`,
          percentage: s.percentage !== undefined ? s.percentage : 0,
          amountExpected: s.amountExpected || 0,
          completed: !!s.completed,
          points: (s.points || []).map((pt) => ({
            _id: pt._id,
            title: typeof pt === 'string' ? pt : (pt.title || ''),
            completed: !!pt.completed
          }))
        }))
      : [];
    setEditableSteps(currentSteps);
    setStepsDialogOpen(true);
  };

  const handleAddStepInDialog = () => {
    setEditableSteps((prev) => [
      ...prev,
      {
        title: `Step ${prev.length + 1}`,
        percentage: 0,
        amountExpected: 0,
        completed: false,
        points: [{ title: 'New point / कार्य विवरण', completed: false }]
      }
    ]);
  };

  const handleDeleteStepInDialog = (stepIdx) => {
    setEditableSteps((prev) => prev.filter((_, idx) => idx !== stepIdx));
  };

  const handleUpdateStepInDialog = (stepIdx, field, value) => {
    const contractAmt = Number(clientData?.contractAmount) || 0;
    const updated = [...editableSteps];
    const target = { ...updated[stepIdx] };

    if (field === 'percentage') {
      const pct = Number(value) || 0;
      target.percentage = value;
      if (contractAmt > 0) {
        target.amountExpected = Math.round(contractAmt * (pct / 100));
      }
    } else if (field === 'amountExpected') {
      const amt = Number(value) || 0;
      target.amountExpected = value;
      if (contractAmt > 0) {
        target.percentage = Math.round((amt / contractAmt) * 100);
      }
    } else {
      target[field] = value;
    }

    updated[stepIdx] = target;
    setEditableSteps(updated);
  };

  const handleAddPointInDialog = (stepIdx) => {
    const updated = [...editableSteps];
    const target = { ...updated[stepIdx] };
    target.points = [...(target.points || []), { title: '', completed: false }];
    updated[stepIdx] = target;
    setEditableSteps(updated);
  };

  const handleUpdatePointInDialog = (stepIdx, pointIdx, value) => {
    const updated = [...editableSteps];
    const target = { ...updated[stepIdx] };
    const points = [...(target.points || [])];
    points[pointIdx] = {
      ...(typeof points[pointIdx] === 'string' ? { title: points[pointIdx], completed: false } : points[pointIdx]),
      title: value
    };
    target.points = points;
    updated[stepIdx] = target;
    setEditableSteps(updated);
  };

  const handleDeletePointInDialog = (stepIdx, pointIdx) => {
    const updated = [...editableSteps];
    const target = { ...updated[stepIdx] };
    target.points = target.points.filter((_, idx) => idx !== pointIdx);
    updated[stepIdx] = target;
    setEditableSteps(updated);
  };

  const handleSaveSteps = async () => {
    try {
      setSavingSteps(true);
      const cleanedSteps = editableSteps.map((s, idx) => ({
        title: s.title?.trim() || `Step ${idx + 1}`,
        percentage: Number(s.percentage) || 0,
        amountExpected: Number(s.amountExpected) || 0,
        completed: !!s.completed,
        points: (s.points || [])
          .filter((p) => (typeof p === 'string' ? p.trim() : p.title?.trim()))
          .map((p) => ({
            title: typeof p === 'string' ? p.trim() : p.title.trim(),
            completed: !!p.completed
          }))
      }));

      const res = await axiosInstance.put(`/clients/${id}/milestones`, {
        steps: cleanedSteps
      });

      if (res.data && res.data.data) {
        setClientData((prev) => ({
          ...prev,
          steps: res.data.data,
          progressPercentage: res.data.progressPercentage
        }));
        setStepsDialogOpen(false);
        setSnackbar({ open: true, message: 'Steps, Checkpoints & Payment % saved successfully!', severity: 'success' });
      }
    } catch (err) {
      console.error('Error saving steps:', err);
      setSnackbar({ open: true, message: 'Failed to save steps and payment schedule', severity: 'error' });
    } finally {
      setSavingSteps(false);
    }
  };

  // Quick add point on-site from live view
  const handleQuickAddPoint = async (stepId) => {
    const text = quickPointTexts[stepId]?.trim();
    if (!text) return;
    try {
      const res = await axiosInstance.put(`/clients/${id}/milestones`, {
        addPoint: { stepId, title: text }
      });
      if (res.data && res.data.data) {
        setClientData((prev) => ({
          ...prev,
          steps: res.data.data,
          progressPercentage: res.data.progressPercentage
        }));
        setQuickPointTexts((prev) => ({ ...prev, [stepId]: '' }));
        setSnackbar({ open: true, message: 'Checkpoint added successfully!', severity: 'success' });
      }
    } catch (err) {
      console.error('Error adding checkpoint:', err);
      setSnackbar({ open: true, message: 'Failed to add checkpoint', severity: 'error' });
    }
  };

  // Quick delete point from live view
  const handleQuickDeletePoint = async (stepId, pointId) => {
    if (!window.confirm('Are you sure you want to delete this checkpoint?')) return;
    try {
      const res = await axiosInstance.put(`/clients/${id}/milestones`, {
        deletePoint: { stepId, pointId }
      });
      if (res.data && res.data.data) {
        setClientData((prev) => ({
          ...prev,
          steps: res.data.data,
          progressPercentage: res.data.progressPercentage
        }));
        setSnackbar({ open: true, message: 'Checkpoint deleted', severity: 'info' });
      }
    } catch (err) {
      console.error('Error deleting checkpoint:', err);
      setSnackbar({ open: true, message: 'Failed to delete checkpoint', severity: 'error' });
    }
  };

  // Record Client Payment
  const handleAddPayment = async () => {
    if (savingPayment) return;
    if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
      setSnackbar({ open: true, message: 'Please enter a valid payment amount', severity: 'warning' });
      return;
    }

    setSavingPayment(true);
    try {
      const res = await axiosInstance.post(`/clients/${id}/payments`, paymentForm);
      setSnackbar({
        open: true,
        message: res.data?.data?.emailSent
          ? `Payment recorded! Slip emailed to ${clientData.email}`
          : 'Payment recorded successfully!',
        severity: 'success'
      });
      setPaymentDialogOpen(false);
      setPaymentForm({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMode: 'Cash',
        transactionRef: '',
        stepId: '',
        notes: ''
      });
      fetchClientDetails(selectedMaterialFilter);
    } catch (err) {
      console.error('Error adding payment:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to record payment', severity: 'error' });
    } finally {
      setSavingPayment(false);
    }
  };

  // Delete Payment (Soft delete)
  const handleDeletePayment = async (paymentId) => {
    if (!window.confirm('Are you sure you want to remove this payment record? It will be soft-deleted and safely archived.')) return;
    try {
      await axiosInstance.delete(`/clients/${id}/payments/${paymentId}`);
      setSnackbar({ open: true, message: 'Payment record soft-deleted (safely archived)', severity: 'success' });
      fetchClientDetails(selectedMaterialFilter);
    } catch (err) {
      console.error('Error deleting payment:', err);
      setSnackbar({ open: true, message: 'Failed to delete payment', severity: 'error' });
    }
  };

  // Select material from catalog inside material expense modal
  const handleSelectMaterialFromCatalog = (matId) => {
    const selected = materialsCatalog.find((m) => m._id === matId);
    if (selected) {
      const defaultRate = selected.defaultPrice || '';
      const qty = Number(materialForm.quantity) || 1;
      const totalMatCost = defaultRate !== '' ? Math.round(Number(defaultRate) * qty * 100) / 100 : '';
      setMaterialForm((prev) => ({
        ...prev,
        materialId: selected._id,
        materialName: selected.name,
        category: selected.category,
        unit: selected.unit,
        unitPrice: defaultRate,
        materialCost: totalMatCost,
        supplier: selected.defaultSupplier || prev.supplier
      }));
    } else {
      setMaterialForm((prev) => ({
        ...prev,
        materialId: '',
        materialName: ''
      }));
    }
  };

  // Bidirectional Quantity and Pricing Handlers
  const handleMaterialQuantityChange = (val) => {
    const qty = val;
    setMaterialForm((prev) => {
      const parsedQty = Number(qty) || 0;
      let newMatCost = prev.materialCost;
      let newUnitPrice = prev.unitPrice;

      if (prev.pricingMode === 'per_unit') {
        if (parsedQty > 0 && prev.unitPrice !== '') {
          newMatCost = Math.round(parsedQty * (Number(prev.unitPrice) || 0) * 100) / 100;
        } else if (parsedQty === 0) {
          newMatCost = 0;
        }
      } else {
        if (parsedQty > 0 && prev.materialCost !== '') {
          newUnitPrice = Math.round(((Number(prev.materialCost) || 0) / parsedQty) * 100) / 100;
        }
      }

      return {
        ...prev,
        quantity: qty,
        materialCost: newMatCost,
        unitPrice: newUnitPrice
      };
    });
  };

  const handleMaterialUnitPriceChange = (val) => {
    const rate = val;
    setMaterialForm((prev) => {
      const parsedRate = Number(rate) || 0;
      const parsedQty = Number(prev.quantity) || 0;
      const newCost = (parsedRate > 0 && parsedQty > 0) ? Math.round(parsedQty * parsedRate * 100) / 100 : '';
      return {
        ...prev,
        unitPrice: rate,
        materialCost: newCost
      };
    });
  };

  const handleMaterialTotalCostChange = (val) => {
    const totalCost = val;
    setMaterialForm((prev) => {
      const parsedCost = Number(totalCost) || 0;
      const parsedQty = Number(prev.quantity) || 0;
      const newRate = (parsedCost > 0 && parsedQty > 0) ? Math.round((parsedCost / parsedQty) * 100) / 100 : '';
      return {
        ...prev,
        materialCost: totalCost,
        unitPrice: newRate
      };
    });
  };

  const handlePricingModeToggle = (mode) => {
    setMaterialForm((prev) => {
      const parsedQty = Number(prev.quantity) || 1;
      let updatedUnitPrice = prev.unitPrice;
      let updatedMatCost = prev.materialCost;

      if (mode === 'per_unit') {
        if (prev.unitPrice && parsedQty > 0) {
          updatedMatCost = Math.round(parsedQty * Number(prev.unitPrice) * 100) / 100;
        } else if (prev.materialCost && parsedQty > 0) {
          updatedUnitPrice = Math.round((Number(prev.materialCost) / parsedQty) * 100) / 100;
        }
      } else {
        if (prev.materialCost && parsedQty > 0) {
          updatedUnitPrice = Math.round((Number(prev.materialCost) / parsedQty) * 100) / 100;
        } else if (prev.unitPrice && parsedQty > 0) {
          updatedMatCost = Math.round(parsedQty * Number(prev.unitPrice) * 100) / 100;
        }
      }

      return {
        ...prev,
        pricingMode: mode,
        unitPrice: updatedUnitPrice,
        materialCost: updatedMatCost
      };
    });
  };

  // Add Material Expense
  const handleAddMaterialExpense = async () => {
    if (savingMaterialExpense) return;
    if (!materialForm.materialName && !materialForm.materialId) {
      setSnackbar({ open: true, message: 'Please specify material name', severity: 'warning' });
      return;
    }
    if (!materialForm.quantity || Number(materialForm.quantity) <= 0) {
      setSnackbar({ open: true, message: 'Please enter a valid quantity (kitna aaya h)', severity: 'warning' });
      return;
    }
    if (!materialForm.unitPrice && !materialForm.materialCost) {
      setSnackbar({ open: true, message: 'Please enter unit rate or total material cost', severity: 'warning' });
      return;
    }

    setSavingMaterialExpense(true);
    try {
      const formData = new FormData();
      formData.append('expenseType', 'material');
      if (materialForm.materialId) formData.append('materialId', materialForm.materialId);
      formData.append('materialName', materialForm.materialName);
      formData.append('category', materialForm.category);
      formData.append('quantity', materialForm.quantity);
      formData.append('unit', materialForm.unit);
      formData.append('unitPrice', materialForm.unitPrice || 0);
      formData.append('materialCost', materialForm.materialCost || 0);
      formData.append('transportIncluded', materialForm.transportIncluded);
      formData.append('transportCost', materialForm.transportIncluded ? 0 : (materialForm.transportCost || 0));
      formData.append('supplier', materialForm.supplier);
      formData.append('vehicleNo', materialForm.vehicleNo);
      formData.append('date', materialForm.date);
      formData.append('paymentMode', materialForm.paymentMode);
      formData.append('note', materialForm.note);

      if (materialBillFile) {
        formData.append('billImage', materialBillFile);
      }

      await axiosInstance.post(`/clients/${id}/expenses`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSnackbar({ open: true, message: 'Material expense recorded successfully!', severity: 'success' });
      setMaterialDialogOpen(false);
      setMaterialBillFile(null);
      setMaterialForm({
        materialId: '',
        materialName: '',
        category: 'Civil & Masonry',
        quantity: 1,
        unit: 'Truck',
        pricingMode: 'per_unit',
        unitPrice: '',
        materialCost: '',
        transportIncluded: true,
        transportCost: '',
        supplier: '',
        vehicleNo: '',
        date: new Date().toISOString().split('T')[0],
        paymentMode: 'Cash',
        note: ''
      });
      fetchClientDetails(selectedMaterialFilter);
    } catch (err) {
      console.error('Error adding material expense:', err);
      setSnackbar({ open: true, message: 'Failed to record material expense', severity: 'error' });
    } finally {
      setSavingMaterialExpense(false);
    }
  };

  // Add Other Expense
  const handleAddOtherExpense = async () => {
    if (savingOtherExpense) return;
    if (!otherExpenseForm.totalAmount || Number(otherExpenseForm.totalAmount) <= 0) {
      setSnackbar({ open: true, message: 'Please enter expense amount', severity: 'warning' });
      return;
    }
    if (!otherExpenseForm.note.trim()) {
      setSnackbar({ open: true, message: 'Please write what this was spent on (ye isme lge)', severity: 'warning' });
      return;
    }

    setSavingOtherExpense(true);
    try {
      const formData = new FormData();
      formData.append('expenseType', 'other');
      formData.append('category', otherExpenseForm.category);
      formData.append('title', otherExpenseForm.title || otherExpenseForm.category);
      formData.append('totalAmount', otherExpenseForm.totalAmount);
      formData.append('date', otherExpenseForm.date);
      formData.append('paymentMode', otherExpenseForm.paymentMode);
      formData.append('note', otherExpenseForm.note);

      if (otherBillFile) {
        formData.append('billImage', otherBillFile);
      }

      await axiosInstance.post(`/clients/${id}/expenses`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSnackbar({ open: true, message: 'Site expense recorded successfully!', severity: 'success' });
      setOtherExpenseDialogOpen(false);
      setOtherBillFile(null);
      setOtherExpenseForm({
        title: '',
        category: 'Labour / Mistri',
        totalAmount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMode: 'Cash',
        note: ''
      });
      fetchClientDetails(selectedMaterialFilter);
    } catch (err) {
      console.error('Error adding other expense:', err);
      setSnackbar({ open: true, message: 'Failed to record site expense', severity: 'error' });
    } finally {
      setSavingOtherExpense(false);
    }
  };

  // Delete Expense (Soft delete)
  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to remove this expense entry? It will be soft-deleted and safely archived.')) return;
    try {
      await axiosInstance.delete(`/clients/${id}/expenses/${expenseId}`);
      setSnackbar({ open: true, message: 'Expense entry soft-deleted (safely archived)', severity: 'success' });
      fetchClientDetails(selectedMaterialFilter);
    } catch (err) {
      console.error('Error deleting expense:', err);
      setSnackbar({ open: true, message: 'Failed to delete expense', severity: 'error' });
    }
  };

  // --- SITE MEDIA HANDLERS ---
  const handleOpenMediaDialog = () => {
    setMediaForm({
      mediaType: 'image',
      title: '',
      stepTitle: '',
      caption: '',
      mediaFile: null,
      url: ''
    });
    setMediaDialogOpen(true);
  };

  const handleUploadMedia = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (uploadingMedia) return;
    if (!mediaForm.mediaFile && !mediaForm.url.trim()) {
      setSnackbar({ open: true, message: 'Please choose an image/video file or enter a media URL', severity: 'warning' });
      return;
    }
    setUploadingMedia(true);
    try {
      const formData = new FormData();
      if (mediaForm.mediaFile) {
        formData.append('mediaFile', mediaForm.mediaFile);
      }
      formData.append('mediaType', mediaForm.mediaType);
      formData.append('title', mediaForm.title);
      formData.append('stepTitle', mediaForm.stepTitle);
      formData.append('caption', mediaForm.caption);
      if (mediaForm.url.trim()) {
        formData.append('url', mediaForm.url.trim());
      }

      await axiosInstance.post(`/clients/${id}/media`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSnackbar({ open: true, message: 'Site media uploaded successfully!', severity: 'success' });
      setMediaDialogOpen(false);
      setMediaForm({ mediaType: 'image', title: '', stepTitle: '', caption: '', mediaFile: null, url: '' });
      fetchClientDetails(selectedMaterialFilter);
    } catch (err) {
      console.error('Error uploading site media:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to upload site media', severity: 'error' });
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm('Are you sure you want to delete this site photo/video? It will be removed for both admin and client.')) return;
    try {
      await axiosInstance.delete(`/clients/${id}/media/${mediaId}`);
      setSnackbar({ open: true, message: 'Site media deleted successfully', severity: 'success' });
      fetchClientDetails(selectedMaterialFilter);
    } catch (err) {
      console.error('Error deleting site media:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to delete site media', severity: 'error' });
    }
  };

  // View Slip Modal trigger
  const handleOpenSlip = (payment) => {
    setSelectedPaymentForSlip(payment);
    setSlipModalOpen(true);
  };

  if (loading && !clientData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#D4AF37' }} />
      </Box>
    );
  }

  if (!clientData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Client project not found</Typography>
        <Button onClick={() => navigate('/admin/clients')} sx={{ mt: 2 }}>Back to Clients</Button>
      </Box>
    );
  }

  const contractAmt = financials?.contractAmount || clientData.contractAmount || 0;
  const totalPaid = financials?.totalPaid || 0;
  const balanceDue = financials?.remainingBalance || 0;
  const totalExpenses = financials?.totalExpenses || 0;
  const netProfit = financials?.netProfit || 0;
  const progressPct = clientData.progressPercentage || 0;

  // Distinct materials from expenses for quick filter
  const materialExpensesList = expenses.filter((e) => e.expenseType === 'material');
  const otherExpensesList = expenses.filter((e) => e.expenseType === 'other');

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {isOverview ? (
        <>
          {/* Top Bar with Back Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/admin/clients')}
                sx={{ color: '#111', fontWeight: 700, bgcolor: '#f3f4f6', '&:hover': { bgcolor: '#e5e7eb' } }}
              >
                All Clients
              </Button>
              <Divider orientation="vertical" flexItem />
              <Typography variant="caption" sx={{ color: '#888' }}>
                Project ID: {clientData._id}
              </Typography>
            </Box>
            <Chip
              label="Project Hub"
              sx={{ bgcolor: '#D4AF37', color: '#111', fontWeight: 800 }}
            />
          </Box>

      {/* Main Client Profile Banner */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2, border: '1px solid #D4AF37', bgcolor: '#111', color: '#fff' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                {clientData.name}
              </Typography>
              <Chip
                label={clientData.status?.replace('_', ' ').toUpperCase() || 'IN PROGRESS'}
                size="small"
                sx={{ bgcolor: '#D4AF37', color: '#111', fontWeight: 800 }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1.5, color: '#bbb', fontSize: '0.9rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PhoneIcon sx={{ fontSize: 16, color: '#D4AF37' }} />
                <span>+91 {clientData.phone}</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationIcon sx={{ fontSize: 16, color: '#D4AF37' }} />
                <span>{clientData.location}</span>
              </Box>
              {clientData.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EmailIcon sx={{ fontSize: 16, color: '#D4AF37' }} />
                  <span>{clientData.email}</span>
                </Box>
              )}
              {clientData.aadharNo && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <BadgeIcon sx={{ fontSize: 16, color: '#D4AF37' }} />
                  <span>Aadhar: {clientData.aadharNo}</span>
                </Box>
              )}
            </Box>

            {/* Selected Categories */}
            {clientData.categories && clientData.categories.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 800 }}>
                  CATEGORIES:
                </Typography>
                {clientData.categories.map((c, idx) => (
                  <Chip
                    key={idx}
                    label={`${typeof c === 'object' ? (c.emoji || '📦') : ''} ${typeof c === 'object' ? c.name : 'Category'}`}
                    size="small"
                    sx={{
                      bgcolor: '#D4AF37',
                      color: '#111',
                      fontWeight: 800,
                      fontSize: '0.78rem'
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Selected Services */}
            {clientData.services && clientData.services.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 700 }}>
                  SERVICES:
                </Typography>
                {clientData.services.map((s, idx) => (
                  <Chip
                    key={idx}
                    label={typeof s === 'object' ? (s.name || s.title) : 'Service'}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#eee', fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            )}
          </Grid>

          {/* Progress Bar Widget */}
          <Grid item xs={12} md={5}>
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 2, borderRadius: 2, border: '1px solid rgba(212,175,55,0.3)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#D4AF37' }}>
                  CONSTRUCTION PROGRESS (प्रगति)
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff' }}>
                  {progressPct}% COMPLETED
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressPct}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': { bgcolor: '#D4AF37' }
                }}
              />
              <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mt: 0.5, textAlign: 'right' }}>
                Calculated dynamically from completed checklist points
              </Typography>
            </Box>

            {/* Client Portal Credentials Box */}
            <Box sx={{ mt: 2, bgcolor: 'rgba(212,175,55,0.06)', p: 1.8, borderRadius: 2, border: '1px dashed rgba(212,175,55,0.4)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#D4AF37', display: 'flex', alignItems: 'center', gap: 0.8, fontSize: '0.85rem' }}>
                  <KeyIcon sx={{ fontSize: 18 }} />
                  CLIENT PORTAL LOGIN
                </Typography>
                {clientData.email && (
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={resendingCredentials}
                    onClick={handleResendCredentials}
                    sx={{
                      color: '#D4AF37',
                      borderColor: '#D4AF37',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      py: 0.2,
                      px: 1,
                      '&:hover': { bgcolor: 'rgba(212,175,55,0.15)', borderColor: '#F3E5AB' }
                    }}
                  >
                    {resendingCredentials ? 'Sending...' : '🔑 Resend Credentials Email'}
                  </Button>
                )}
              </Box>
              <Typography variant="caption" sx={{ color: '#fff', display: 'block', fontSize: '0.78rem' }}>
                Portal: <strong style={{ color: '#38bdf8' }}>https://vishwakarmabuildandfurnish.in/loginuser</strong>
              </Typography>
              <Typography variant="caption" sx={{ color: '#fff', display: 'block', mt: 0.3, fontSize: '0.78rem' }}>
                User ID / Email: <strong>{clientData.email || 'No email provided'}</strong>
              </Typography>
              <Typography variant="caption" sx={{ color: '#FACC15', display: 'block', mt: 0.3, fontSize: '0.82rem', fontWeight: 700 }}>
                Password: <strong>{clientData.loginPassword || `${(clientData.name || 'Client').trim().split(/\s+/)[0]}@123`}</strong>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Financial Overview KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ border: '1px solid #D4AF37', borderRadius: 2, bgcolor: '#111', color: '#fff' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase' }}>
                Service Rate (तय दर)
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#D4AF37', mt: 0.5 }}>
                {Number(clientData.serviceRate) > 0 ? `₹ ${Number(clientData.serviceRate).toLocaleString('en-IN')}` : '—'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#aaa', display: 'block', fontSize: '0.7rem' }}>
                {clientData.serviceRateUnit || 'Per Sq.Ft'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Work Budget
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#111', mt: 0.5 }}>
                ₹ {Number(contractAmt).toLocaleString('en-IN')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#888', display: 'block', fontSize: '0.7rem' }}>
                कुल अपेक्षित बजट
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#f1f8e9' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Received
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2e7d32', mt: 0.5 }}>
                ₹ {Number(totalPaid).toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: balanceDue > 0 ? '#ffebee' : '#fafafa' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: balanceDue > 0 ? '#c62828' : '#2e7d32', fontWeight: 700, textTransform: 'uppercase' }}>
                Balance Due
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: balanceDue > 0 ? '#c62828' : '#2e7d32', mt: 0.5 }}>
                ₹ {Number(balanceDue).toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>
                Materials Spent
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#e65100', mt: 0.5 }}>
                ₹ {Number(financials?.materialExpensesTotal || 0).toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ border: '1px solid #fde68a', borderRadius: 2, bgcolor: '#fffbeb' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 700, textTransform: 'uppercase' }}>
                Labour Spent (लेबर)
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#b45309', mt: 0.5 }}>
                ₹ {Number(financials?.labourExpensesTotal || 0).toLocaleString('en-IN')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#888', display: 'block', fontSize: '0.7rem' }}>
                कुल लेबर मजदूरी
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Site Expense
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#b71c1c', mt: 0.5 }}>
                ₹ {Number(totalExpenses).toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ border: '2px solid #D4AF37', borderRadius: 2, bgcolor: '#111', color: '#fff' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 800, textTransform: 'uppercase' }}>
                Net Margin / Profit
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: netProfit >= 0 ? '#4caf50' : '#f44336', mt: 0.5 }}>
                ₹ {Number(netProfit).toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

          {/* ========================================================================= */}
          {/* PROJECT CONTROL CENTER / HUB: 8 MODULAR CARDS */}
          {/* ========================================================================= */}
          <Box sx={{ mt: 1, mb: 4 }}>
            <Box sx={{ mb: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DashboardIcon sx={{ color: '#D4AF37' }} />
                  Project Control Center — Dedicated Pages
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                  Each site module has its own dedicated page. Click any card to open and manage:
                </Typography>
              </Box>
              <Chip
                label="8 Dedicated Pages Available"
                variant="outlined"
                sx={{ borderColor: '#D4AF37', color: '#b8860b', fontWeight: 800, bgcolor: 'rgba(212,175,55,0.08)' }}
              />
            </Box>

            <Grid container spacing={2.5}>
              {SECTION_CONFIG.map((sec) => {
                let primaryStat = '';
                let secondaryStat = '';

                if (sec.id === 'milestones') {
                  const completedMilestones = (clientData.steps || []).filter((s) => s.completed).length;
                  primaryStat = `${completedMilestones} / ${(clientData.steps || []).length} steps done`;
                  secondaryStat = `${progressPct}% total progress`;
                } else if (sec.id === 'payments') {
                  primaryStat = `₹ ${Number(totalPaid).toLocaleString('en-IN')} Received`;
                  secondaryStat = `${payments.length} slips | Due: ₹ ${Number(balanceDue).toLocaleString('en-IN')}`;
                } else if (sec.id === 'materials') {
                  primaryStat = `₹ ${Number(financials?.materialExpensesTotal || 0).toLocaleString('en-IN')} spent`;
                  secondaryStat = `${materialExpensesList.length} deliveries & bills`;
                } else if (sec.id === 'labour') {
                  primaryStat = `${labourers.length} workers & masons`;
                  secondaryStat = `Total Wages: ₹ ${Number(financials?.labourExpensesTotal || 0).toLocaleString('en-IN')}`;
                } else if (sec.id === 'expenses') {
                  primaryStat = `₹ ${Number(financials?.otherExpensesTotal || 0).toLocaleString('en-IN')} spent`;
                  secondaryStat = `${otherExpensesList.length} expense vouchers`;
                } else if (sec.id === 'pnl') {
                  primaryStat = `₹ ${Number(netProfit).toLocaleString('en-IN')} net margin`;
                  secondaryStat = netProfit >= 0 ? 'Project in profit' : 'Project in deficit';
                } else if (sec.id === 'agreement') {
                  primaryStat = clientData.contractAgreement?.pdfUrl ? 'Signed Agreement Attached' : 'Draft Agreement';
                  secondaryStat = 'Contract terms, bank details & PDF';
                } else if (sec.id === 'media') {
                  primaryStat = `${(clientData.siteMedia || []).length} Photos & Videos`;
                  secondaryStat = 'Live site progress visual gallery';
                }

                return (
                  <Grid item xs={12} sm={6} md={3} key={sec.id}>
                    <Card
                      onClick={() => navigate(`/admin/clients/${id}/${sec.id}`)}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRadius: 2.5,
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                        transition: 'all 0.22s ease-in-out',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.09)',
                          borderColor: sec.color
                        }
                      }}
                    >
                      <Box sx={{ height: 4, bgcolor: sec.color }} />
                      <CardContent sx={{ p: 2.2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 2,
                              bgcolor: sec.bg,
                              color: sec.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {sec.icon}
                          </Box>
                          <Button
                            size="small"
                            variant="outlined"
                            endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
                            sx={{
                              borderColor: '#D4AF37',
                              color: '#111',
                              bgcolor: 'rgba(212,175,55,0.08)',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              textTransform: 'none',
                              py: 0.3,
                              px: 1,
                              borderRadius: 1.5,
                              '&:hover': { bgcolor: '#111', color: '#D4AF37', borderColor: '#111' }
                            }}
                          >
                            Open Page
                          </Button>
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#111', fontSize: '1.05rem', lineHeight: 1.3, mb: 0.3 }}>
                          {sec.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#888', fontWeight: 600, display: 'block', mb: 1 }}>
                          {sec.subtitle}
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem', mb: 2, flexGrow: 1, lineHeight: 1.4 }}>
                          {sec.desc}
                        </Typography>

                        <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: sec.bg, border: `1px solid ${sec.borderColor}` }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: sec.color, fontSize: '0.86rem' }}>
                            {primaryStat}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#555', fontSize: '0.72rem', display: 'block' }}>
                            {secondaryStat}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* SUB-PAGE NAVIGATION HEADER */}
          {/* ========================================================================= */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5 },
              mb: 3,
              borderRadius: 2.5,
              bgcolor: '#111',
              color: '#fff',
              border: '1px solid #D4AF37',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}
          >
            {/* Top Row: Back button, Client Name, and Financial Snapshot */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(`/admin/clients/${id}`)}
                  sx={{
                    bgcolor: '#D4AF37',
                    color: '#111',
                    fontWeight: 800,
                    textTransform: 'none',
                    px: 2,
                    py: 0.8,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(212,175,55,0.4)',
                    '&:hover': { bgcolor: '#b8860b', color: '#fff' }
                  }}
                >
                  ◀ Back to Project Hub
                </Button>

                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.2)', display: { xs: 'none', sm: 'block' } }} />

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                      Site: {clientData.name}
                    </Typography>
                    <Chip
                      label={`📞 +91 ${clientData.phone}`}
                      size="small"
                      sx={{ height: 20, fontSize: '0.72rem', bgcolor: 'rgba(255,255,255,0.1)', color: '#eee' }}
                    />
                    <Chip
                      label={`📍 ${clientData.location}`}
                      size="small"
                      sx={{ height: 20, fontSize: '0.72rem', bgcolor: 'rgba(255,255,255,0.1)', color: '#eee' }}
                    />
                    <Chip
                      label={clientData.status?.replace('_', ' ').toUpperCase() || 'IN PROGRESS'}
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#D4AF37', color: '#111', fontWeight: 800 }}
                    />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    {activeSectionConfig?.icon}
                    {activeSectionConfig?.title}
                  </Typography>
                </Box>
              </Box>

              {/* Financial Snapshot on Sub-page */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', bgcolor: 'rgba(255,255,255,0.06)', p: 1.2, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: '#aaa', display: 'block', fontSize: '0.7rem' }}>
                    Total Budget: <strong>₹ {Number(contractAmt).toLocaleString('en-IN')}</strong>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#4ade80', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>
                    Received: ₹ {Number(totalPaid).toLocaleString('en-IN')} | Due: ₹ {Number(balanceDue).toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                  <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 800, display: 'block', fontSize: '0.85rem' }}>
                    {progressPct}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#aaa', fontSize: '0.68rem' }}>
                    Progress
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Bottom Row: Quick Jump Section Switcher Pills */}
            <Box sx={{ pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto', pb: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 800, whiteSpace: 'nowrap', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                Switch Page:
              </Typography>
              {SECTION_CONFIG.map((sec) => {
                const isCurrent = sec.id === section;
                return (
                  <Chip
                    key={sec.id}
                    icon={React.cloneElement(sec.icon, { sx: { fontSize: '16px !important', color: isCurrent ? '#111 !important' : `${sec.color} !important` } })}
                    label={sec.shortTitle || sec.title}
                    onClick={() => navigate(`/admin/clients/${id}/${sec.id}`)}
                    size="small"
                    sx={{
                      cursor: 'pointer',
                      fontWeight: isCurrent ? 800 : 600,
                      fontSize: '0.78rem',
                      bgcolor: isCurrent ? '#D4AF37' : 'rgba(255,255,255,0.08)',
                      color: isCurrent ? '#111' : '#ddd',
                      border: isCurrent ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.12)',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        bgcolor: isCurrent ? '#D4AF37' : 'rgba(255,255,255,0.2)',
                        color: '#fff',
                        transform: 'scale(1.02)'
                      }
                    }}
                  />
                );
              })}
            </Box>
          </Paper>

          {/* ========================================================================= */}
          {/* TAB 0: Milestones & Progress Points */}
          {/* ========================================================================= */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1.5, mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#111' }}>
                Construction Steps & Checklist Tracking (निर्माण चरण एवं चेकपॉइंट)
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Tick off each sub-point as site work finishes. You can also edit, add or delete steps & payment milestones.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleOpenStepsDialog}
              sx={{
                bgcolor: '#111',
                color: '#D4AF37',
                fontWeight: 700,
                border: '1px solid #D4AF37',
                '&:hover': { bgcolor: '#222' }
              }}
            >
              Edit Steps & Payment Schedule (चरण एवं भुगतान संपादित करें)
            </Button>
          </Box>

          {clientData.steps && clientData.steps.length > 0 ? (
            clientData.steps.map((step, sIdx) => {
              const completedCount = (step.points || []).filter((p) => p.completed).length;
              const totalPoints = (step.points || []).length;
              const isStepDone = step.completed || (totalPoints > 0 && completedCount === totalPoints);

              return (
                <Accordion
                  key={step._id || sIdx}
                  defaultExpanded={sIdx === 0 || !isStepDone}
                  sx={{
                    mb: 2,
                    border: isStepDone ? '1px solid #c8e6c9' : '1px solid #e0e0e0',
                    borderRadius: '8px !important',
                    boxShadow: 'none',
                    bgcolor: isStepDone ? '#f9fdf9' : '#fff'
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {isStepDone ? (
                          <CheckCircleIcon sx={{ color: '#2e7d32' }} />
                        ) : (
                          <UncheckedIcon sx={{ color: '#D4AF37' }} />
                        )}
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: isStepDone ? '#2e7d32' : '#111' }}>
                          {step.title}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        {step.percentage !== undefined && (
                          <Chip
                            label={`${step.percentage || 0}% Payment`}
                            size="small"
                            sx={{
                              fontWeight: 800,
                              bgcolor: '#111',
                              color: '#D4AF37'
                            }}
                          />
                        )}
                        {step.amountExpected > 0 && (
                          <Chip
                            label={`₹ ${Number(step.amountExpected).toLocaleString('en-IN')}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 700, borderColor: '#D4AF37' }}
                          />
                        )}
                        <Chip
                          label={`${completedCount}/${totalPoints} Points Completed`}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            bgcolor: isStepDone ? '#e8f5e9' : '#f5f5f5',
                            color: isStepDone ? '#2e7d32' : '#666'
                          }}
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pb: 2, px: 3 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={1.5}>
                      {(step.points || []).map((point) => (
                        <Grid item xs={12} sm={6} key={point._id}>
                          <Paper
                            elevation={0}
                            onClick={() => handleTogglePoint(step._id, point._id, point.completed)}
                            sx={{
                              p: 1.5,
                              border: point.completed ? '1px solid #a5d6a7' : '1px solid #e0e0e0',
                              bgcolor: point.completed ? '#e8f5e9' : '#fafafa',
                              borderRadius: 2,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: point.completed ? '#c8e6c9' : '#f0f0f0'
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Checkbox
                                checked={point.completed}
                                sx={{
                                  p: 0,
                                  color: '#aaa',
                                  '&.Mui-checked': { color: '#2e7d32' }
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  color: point.completed ? '#1b5e20' : '#333',
                                  textDecoration: point.completed ? 'line-through' : 'none'
                                }}
                              >
                                {point.title}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {point.completedAt && (
                                <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                                  {new Date(point.completedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                </Typography>
                              )}
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickDeletePoint(step._id, point._id);
                                }}
                                sx={{ color: '#bbb', '&:hover': { color: '#d32f2f', bgcolor: '#ffebee' }, p: 0.5 }}
                                title="Delete Checkpoint"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Quick Add Checkpoint in this step */}
                    <Box sx={{ mt: 2.5, pt: 1.5, borderTop: '1px dashed #e0e0e0', display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        size="small"
                        placeholder={`+ Quick add checkpoint to "${step.title}" (e.g. Nim bharna, Tanki, RCC casting)...`}
                        value={quickPointTexts[step._id] || ''}
                        onChange={(e) => setQuickPointTexts({ ...quickPointTexts, [step._id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleQuickAddPoint(step._id);
                          }
                        }}
                        sx={{
                          flexGrow: 1,
                          bgcolor: '#fff',
                          '& .MuiInputBase-input': { fontSize: '0.875rem' }
                        }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleQuickAddPoint(step._id)}
                        disabled={!quickPointTexts[step._id]?.trim()}
                        startIcon={<AddIcon />}
                        sx={{
                          borderColor: '#D4AF37',
                          color: '#111',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          '&:hover': { borderColor: '#b8860b', bgcolor: '#fffdf5' }
                        }}
                      >
                        Add Point
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                No milestone steps defined yet.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenStepsDialog}
                sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 700 }}
              >
                Configure Milestones & Steps
              </Button>
            </Paper>
          )}
        </Box>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: Payments & Receipt Slips */}
      {/* ========================================================================= */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#111' }}>
                Payment Transactions & Official Slips
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Every payment recorded here generates a printable voucher slip and emails the client automatically.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setPaymentDialogOpen(true)}
              sx={{
                bgcolor: '#111',
                color: '#D4AF37',
                fontWeight: 700,
                border: '1px solid #D4AF37',
                '&:hover': { bgcolor: '#222' }
              }}
            >
              Record Payment
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#111' }}>
                <TableRow>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Receipt No</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Amount Paid (₹)</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Mode & Ref</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Milestone Linked</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Email Status</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Remarks</TableCell>
                  <TableCell align="right" sx={{ color: '#D4AF37', fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" sx={{ color: '#888', fontWeight: 600 }}>
                        No payments recorded for this client yet.
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setPaymentDialogOpen(true)}
                        sx={{ mt: 2, color: '#111', borderColor: '#D4AF37' }}
                      >
                        Record First Payment
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((p) => (
                    <TableRow key={p._id} hover>
                      <TableCell sx={{ fontWeight: 700, color: '#b8860b' }}>
                        {p.receiptNo || 'VBF-REC'}
                      </TableCell>
                      <TableCell sx={{ color: '#333' }}>
                        {p.date ? new Date(p.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#2e7d32', fontSize: '1rem' }}>
                        ₹ {Number(p.amount || 0).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <Chip label={p.paymentMode || 'Cash'} size="small" sx={{ fontWeight: 600, mr: 0.5 }} />
                        {p.transactionRef && (
                          <Typography variant="caption" sx={{ color: '#777', display: 'block' }}>
                            Ref: {p.transactionRef}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ color: '#555', fontSize: '0.85rem' }}>
                        {p.stepTitle || 'General Payment'}
                      </TableCell>
                      <TableCell>
                        {p.emailSent ? (
                          <Chip
                            icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                            label="Emailed to Client"
                            size="small"
                            sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700 }}
                          />
                        ) : clientData.email ? (
                          <Chip label="Email Pending" size="small" variant="outlined" />
                        ) : (
                          <Typography variant="caption" sx={{ color: '#999' }}>No email added</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ color: '#666', fontSize: '0.85rem' }}>
                        {p.notes || '—'}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PrintIcon />}
                          onClick={() => handleOpenSlip(p)}
                          sx={{
                            color: '#111',
                            borderColor: '#D4AF37',
                            fontWeight: 700,
                            mr: 1,
                            '&:hover': { bgcolor: 'rgba(212,175,55,0.1)' }
                          }}
                        >
                          View / Print Slip
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => handleDeletePayment(p._id)}
                          sx={{ color: '#d32f2f' }}
                          title="Delete Payment"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: Material Expenses */}
      {/* ========================================================================= */}
      {activeTab === 2 && (
        <Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#111' }}>
                Construction Materials Log & Supply Records
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Track cement, saria, bricks, sand, and other materials with separate transport costs and supplier details.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setMaterialDialogOpen(true)}
              sx={{
                bgcolor: '#111',
                color: '#D4AF37',
                fontWeight: 700,
                border: '1px solid #D4AF37',
                '&:hover': { bgcolor: '#222' }
              }}
            >
              Add Material Supply Entry
            </Button>
          </Box>

          {/* Deliveries & Quantities Summary Cards (Kitne Truck / Litre / Bag Aaye) */}
          {(() => {
            const truckDeliveries = materialExpensesList.filter((e) => (e.unit || '').toLowerCase().includes('truck')).reduce((s, e) => s + (Number(e.quantity) || 0), 0);
            const litreDeliveries = materialExpensesList.filter((e) => (e.unit || '').toLowerCase().includes('litre')).reduce((s, e) => s + (Number(e.quantity) || 0), 0);
            const bagDeliveries = materialExpensesList.filter((e) => (e.unit || '').toLowerCase().includes('bag')).reduce((s, e) => s + (Number(e.quantity) || 0), 0);
            const trolleyDeliveries = materialExpensesList.filter((e) => (e.unit || '').toLowerCase().includes('trolley')).reduce((s, e) => s + (Number(e.quantity) || 0), 0);
            const totalMatExpenses = materialExpensesList.reduce((s, e) => s + (Number(e.totalAmount) || 0), 0);

            return (
              <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item xs={6} sm={3} md={2.4}>
                  <Card sx={{ bgcolor: '#f0f7ff', border: '1px solid #bbdefb', borderRadius: 2 }}>
                    <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="caption" sx={{ color: '#0d47a1', fontWeight: 800, textTransform: 'uppercase' }}>
                        🚚 Trucks Delivered
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#1565c0', mt: 0.5 }}>
                        {truckDeliveries} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Trucks</span>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={3} md={2.4}>
                  <Card sx={{ bgcolor: '#f1f8e9', border: '1px solid #c5e1a5', borderRadius: 2 }}>
                    <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="caption" sx={{ color: '#33691e', fontWeight: 800, textTransform: 'uppercase' }}>
                        🛢️ Litres Received
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#2e7d32', mt: 0.5 }}>
                        {litreDeliveries} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Litres</span>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={3} md={2.4}>
                  <Card sx={{ bgcolor: '#fff8e1', border: '1px solid #ffe082', borderRadius: 2 }}>
                    <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="caption" sx={{ color: '#e65100', fontWeight: 800, textTransform: 'uppercase' }}>
                        🧱 Bags Delivered
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#f57f17', mt: 0.5 }}>
                        {bagDeliveries} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Bags</span>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={3} md={2.4}>
                  <Card sx={{ bgcolor: '#f3e5f5', border: '1px solid #e1bee7', borderRadius: 2 }}>
                    <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="caption" sx={{ color: '#4a148c', fontWeight: 800, textTransform: 'uppercase' }}>
                        🚜 Trolleys Delivered
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#6a1b9a', mt: 0.5 }}>
                        {trolleyDeliveries} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Trolleys</span>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={12} md={2.4}>
                  <Card sx={{ bgcolor: '#111', color: '#fff', border: '1px solid #D4AF37', borderRadius: 2 }}>
                    <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 800, textTransform: 'uppercase' }}>
                        💰 Total Materials Cost
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#D4AF37', mt: 0.5 }}>
                        ₹ {Number(totalMatExpenses).toLocaleString('en-IN')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            );
          })()}

          {/* Filter by Material Dropdown Bar */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #eee', bgcolor: '#fafafa' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Filter by Material (सामग्री चुनें)"
                  value={selectedMaterialFilter}
                  onChange={(e) => handleMaterialFilterChange(e.target.value)}
                >
                  <MenuItem value="">
                    <em>All Materials (सभी सामग्रियां)</em>
                  </MenuItem>
                  {materialsCatalog.map((m) => (
                    <MenuItem key={m._id} value={m._id}>
                      {m.name} ({m.category})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={8}>
                {selectedMaterialFilter ? (() => {
                  const selMat = materialsCatalog.find((m) => m._id === selectedMaterialFilter);
                  const filteredQty = materialExpensesList.reduce((s, e) => s + (Number(e.quantity) || 0), 0);
                  const filteredCost = materialExpensesList.reduce((s, e) => s + (Number(e.materialCost) || 0), 0);
                  const filteredTransport = materialExpensesList.reduce((s, e) => s + (e.transportIncluded ? 0 : (Number(e.transportCost) || 0)), 0);
                  const filteredTotal = materialExpensesList.reduce((s, e) => s + (Number(e.totalAmount) || 0), 0);
                  const avgRate = filteredQty > 0 ? Math.round(filteredCost / filteredQty) : 0;
                  return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: '#111', fontWeight: 800 }}>
                          Filtered: {selMat?.name} ({selMat?.category})
                        </Typography>
                        <Button size="small" onClick={() => handleMaterialFilterChange('')} sx={{ color: '#d32f2f', fontSize: '0.75rem', p: 0 }}>
                          Clear Filter (सब देखें)
                        </Button>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Chip
                          label={`📦 Total Delivered: ${filteredQty} ${selMat?.unit || 'Units'}`}
                          size="small"
                          sx={{ bgcolor: '#e3f2fd', color: '#0d47a1', fontWeight: 800 }}
                        />
                        <Chip
                          label={`Avg Rate: ₹${Number(avgRate).toLocaleString('en-IN')} / ${selMat?.unit || 'Unit'}`}
                          size="small"
                          sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700 }}
                        />
                        <Chip
                          label={`Material: ₹${Number(filteredCost).toLocaleString('en-IN')}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 700 }}
                        />
                        {filteredTransport > 0 && (
                          <Chip
                            label={`Transport: +₹${Number(filteredTransport).toLocaleString('en-IN')}`}
                            size="small"
                            sx={{ bgcolor: '#fff3e0', color: '#e65100', fontWeight: 700 }}
                          />
                        )}
                        <Chip
                          label={`Total: ₹${Number(filteredTotal).toLocaleString('en-IN')}`}
                          size="small"
                          sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 800 }}
                        />
                      </Box>
                    </Box>
                  );
                })() : (
                  <Typography variant="caption" sx={{ color: '#777' }}>
                    Showing all materials delivered to this client. Choose a material above to see its complete delivery logs and total trucks/litres.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Material Expenses Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#111' }}>
                <TableRow>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Material Name</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Quantity & Unit (कितना आया)</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Unit Rate (प्रति इकाई)</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Material Cost (सामग्री मूल्य)</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Transport (भाड़ा)</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Total Cost (कुल खर्च)</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Supplier / Vehicle</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Bill / Photo</TableCell>
                  <TableCell align="right" sx={{ color: '#D4AF37', fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materialExpensesList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" sx={{ color: '#888', fontWeight: 600 }}>
                        No material deliveries recorded for this client.
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setMaterialDialogOpen(true)}
                        sx={{ mt: 2, color: '#111', borderColor: '#D4AF37' }}
                      >
                        Add First Material Entry
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  materialExpensesList.map((exp) => {
                    const unitLower = (exp.unit || '').toLowerCase();
                    const isTruck = unitLower.includes('truck');
                    const isLitre = unitLower.includes('litre');
                    const isBag = unitLower.includes('bag');
                    const isTrolley = unitLower.includes('trolley');

                    const badgeColor = isTruck
                      ? { bg: '#e3f2fd', color: '#0d47a1', border: '#90caf9' }
                      : isLitre
                      ? { bg: '#e8f5e9', color: '#1b5e20', border: '#a5d6a7' }
                      : isBag
                      ? { bg: '#fff3e0', color: '#e65100', border: '#ffcc80' }
                      : isTrolley
                      ? { bg: '#f3e5f5', color: '#4a148c', border: '#ce93d8' }
                      : { bg: '#f5f5f5', color: '#333', border: '#e0e0e0' };

                    return (
                      <TableRow key={exp._id} hover>
                        <TableCell sx={{ color: '#333' }}>
                          {exp.date ? new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#111' }}>
                          {exp.materialName}
                        </TableCell>
                        <TableCell>
                          <Chip label={exp.category} size="small" sx={{ fontSize: '0.75rem' }} />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${exp.quantity} ${getUnitDisplay(exp.unit)}`}
                            size="small"
                            sx={{
                              fontWeight: 800,
                              bgcolor: badgeColor.bg,
                              color: badgeColor.color,
                              border: `1px solid ${badgeColor.border}`
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                          ₹ {Number(exp.unitPrice || 0).toLocaleString('en-IN')} <Typography component="span" variant="caption" sx={{ color: '#888' }}>/ {exp.unit || 'Unit'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#111' }}>
                            ₹ {Number(exp.materialCost || 0).toLocaleString('en-IN')}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#888', fontSize: '0.7rem' }}>
                            ({exp.quantity} × ₹{exp.unitPrice})
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {exp.transportIncluded ? (
                            <Chip label="Included" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }} />
                          ) : (
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#e65100' }}>
                              + ₹ {Number(exp.transportCost || 0).toLocaleString('en-IN')}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#b71c1c', fontSize: '0.95rem' }}>
                          ₹ {Number(exp.totalAmount || 0).toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell sx={{ color: '#555', fontSize: '0.85rem' }}>
                          {exp.supplier || '—'}
                          {exp.vehicleNo && <Typography variant="caption" sx={{ display: 'block', color: '#888' }}>Veh: {exp.vehicleNo}</Typography>}
                        </TableCell>
                        <TableCell>
                          {exp.billImage ? (
                            <Button
                              size="small"
                              onClick={() => {
                                setPreviewImageUrl(getStaticAssetUrl(exp.billImage));
                                setImageModalOpen(true);
                              }}
                              sx={{ color: '#0288d1', textTransform: 'none', fontSize: '0.75rem' }}
                            >
                              View Bill
                            </Button>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleDeleteExpense(exp._id)} sx={{ color: '#d32f2f' }}>
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
        </Box>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: Labour & Mistri Management (हाजिरी, लेजर व भुगतान) */}
      {/* ========================================================================= */}
      {activeTab === 3 && (
        <Box>
          {/* Header Bar */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#111' }}>
                Labour & Mistri Management (लेबर, मिस्त्री हाजिरी व मजदूरी)
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                मजदूर/मिस्त्री जोड़ें, प्रतिदिन हाजिरी भरें (पूरा दिन / आधा दिन / अनुपस्थित), कुल मजदूरी व भुगतान हिसाब रखें और WhatsApp रसीद भेजें।
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAddWorker}
                sx={{
                  bgcolor: '#111',
                  color: '#D4AF37',
                  fontWeight: 700,
                  border: '1px solid #D4AF37',
                  '&:hover': { bgcolor: '#222' }
                }}
              >
                नया मजदूर जोड़ें (Add Worker)
              </Button>
              <Button
                variant="contained"
                startIcon={<MoneyIcon />}
                onClick={() => handleOpenPayLabour()}
                disabled={labourers.length === 0}
                sx={{
                  bgcolor: '#2e7d32',
                  color: '#fff',
                  fontWeight: 700,
                  '&:hover': { bgcolor: '#1b5e20' }
                }}
              >
                मजदूरी भुगतान करें (Pay Wage)
              </Button>
            </Box>
          </Box>

          {/* KPI Ribbon */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={4} md={2.4}>
              <Card sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <CardContent sx={{ py: 1.5, px: 2 }}>
                  <Typography variant="caption" sx={{ color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>
                    कुल मजदूर (Workers)
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#111', mt: 0.5 }}>
                    {labourSummary?.totalLabourers || labourers.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={4} md={2.4}>
              <Card sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <CardContent sx={{ py: 1.5, px: 2 }}>
                  <Typography variant="caption" sx={{ color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>
                    कुल हाजिरी दिन (Days)
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0284c7', mt: 0.5 }}>
                    {Number(labourSummary?.totalDaysWorked || 0).toLocaleString('en-IN')} दिन
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={4} md={2.4}>
              <Card sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fefce8' }}>
                <CardContent sx={{ py: 1.5, px: 2 }}>
                  <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 700, textTransform: 'uppercase' }}>
                    कुल बनी मजदूरी (Earned)
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#b45309', mt: 0.5 }}>
                    ₹ {Number(labourSummary?.totalWageEarned || 0).toLocaleString('en-IN')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={4} md={2.4}>
              <Card sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#f1f8e9' }}>
                <CardContent sx={{ py: 1.5, px: 2 }}>
                  <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 700, textTransform: 'uppercase' }}>
                    कुल दिया गया भुगतान (Paid)
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#2e7d32', mt: 0.5 }}>
                    ₹ {Number(labourSummary?.totalPaid || 0).toLocaleString('en-IN')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={4} md={2.4}>
              <Card sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                bgcolor: (labourSummary?.totalBalanceDue || 0) > 0 ? '#ffebee' : '#fafafa'
              }}>
                <CardContent sx={{ py: 1.5, px: 2 }}>
                  <Typography variant="caption" sx={{
                    color: (labourSummary?.totalBalanceDue || 0) > 0 ? '#c62828' : '#2e7d32',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    बाकी बकाया (Balance Due)
                  </Typography>
                  <Typography variant="h6" sx={{
                    fontWeight: 800,
                    color: (labourSummary?.totalBalanceDue || 0) > 0 ? '#c62828' : '#2e7d32',
                    mt: 0.5
                  }}>
                    ₹ {Number(labourSummary?.totalBalanceDue || 0).toLocaleString('en-IN')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Sub-Tabs: Attendance Register, Workers Ledger, Payments */}
          <Paper sx={{ mb: 2.5, borderRadius: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Tabs
              value={labourSubTab}
              onChange={(e, v) => setLabourSubTab(v)}
              sx={{
                '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', minHeight: 44, fontSize: '0.9rem' },
                '& .Mui-selected': { color: '#b8860b !important' },
                '& .MuiTabs-indicator': { bgcolor: '#D4AF37', height: 2.5 }
              }}
            >
              <Tab icon={<CalendarMonthIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="📅 दैनिक हाजिरी रजिस्टर (Daily Attendance)" />
              <Tab icon={<EngineeringIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`👷 मजदूर रोस्टर व खाता (${labourers.length})`} />
              <Tab icon={<ReceiptIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`💵 मजदूरी भुगतान इतिहास (${labourPayments.length})`} />
            </Tabs>
          </Paper>

          {/* ------------------------------------------------------------------- */}
          {/* SUBTAB 0: DAILY HAZIRI REGISTER */}
          {/* ------------------------------------------------------------------- */}
          {labourSubTab === 0 && (
            <Box>
              {/* Date Navigation Bar */}
              <Paper sx={{ p: 2, mb: 2.5, borderRadius: 2, border: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handlePrevDay}
                      disabled={attendanceDate <= clientStartDate}
                      sx={{ borderColor: '#ccc', color: '#333' }}
                    >
                      ◀ पिछला दिन
                    </Button>
                    <TextField
                      type="date"
                      size="small"
                      label="हाजिरी दिनांक (Date)"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      inputProps={{ min: clientStartDate, max: todayDateStr }}
                      InputLabelProps={{ shrink: true }}
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleNextDay}
                      disabled={attendanceDate >= todayDateStr}
                      sx={{ borderColor: '#ccc', color: '#333' }}
                    >
                      अगला दिन ▶
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant={attendanceDate === todayDateStr ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setAttendanceDate(todayDateStr)}
                      sx={attendanceDate === todayDateStr ? { bgcolor: '#111', color: '#D4AF37' } : { borderColor: '#ccc', color: '#333' }}
                    >
                      आज (Today)
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleMarkAllAttendance('present')}
                      sx={{ borderColor: '#2e7d32', color: '#2e7d32', fontWeight: 600 }}
                    >
                      सबकी हाजिरी (All P)
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleMarkAllAttendance('absent')}
                      sx={{ borderColor: '#c62828', color: '#c62828' }}
                    >
                      All A
                    </Button>
                  </Grid>

                  <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                      प्रोजेक्ट शुरुआत: <strong>{clientStartDate}</strong> से आज (<strong>{todayDateStr}</strong>) तक हाजिरी दर्ज कर सकते हैं।
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Attendance Table */}
              {attendanceLoading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress size={32} sx={{ color: '#D4AF37' }} />
                  <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>लोड हो रहा है...</Typography>
                </Box>
              ) : attendanceRecords.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                    कोई मजदूर दर्ज नहीं है (No Workers Registered)
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>
                    हाजिरी भरने के लिए पहले साइट पर काम करने वाले मजदूर या मिस्त्री जोड़ें।
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddWorker}
                    sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 700 }}
                  >
                    नया मजदूर जोड़ें
                  </Button>
                </Paper>
              ) : (
                <Box>
                  <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', mb: 2 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#111' }}>
                        <TableRow>
                          <TableCell sx={{ color: '#D4AF37', fontWeight: 700, py: 1.5 }}>मजदूर / मिस्त्री का नाम</TableCell>
                          <TableCell sx={{ color: '#D4AF37', fontWeight: 700, py: 1.5 }}>पद / रोल</TableCell>
                          <TableCell sx={{ color: '#D4AF37', fontWeight: 700, py: 1.5 }}>दिहाड़ी (₹/दिन)</TableCell>
                          <TableCell sx={{ color: '#D4AF37', fontWeight: 700, py: 1.5, minWidth: 260 }}>
                            हाजिरी स्थिति (Attendance Status)
                          </TableCell>
                          <TableCell sx={{ color: '#D4AF37', fontWeight: 700, py: 1.5, minWidth: 150 }}>
                            ओवरटाइम (OT Hrs / ₹)
                          </TableCell>
                          <TableCell sx={{ color: '#D4AF37', fontWeight: 700, py: 1.5 }}>टिप्पणी (Note)</TableCell>
                          <TableCell align="right" sx={{ color: '#D4AF37', fontWeight: 700, py: 1.5 }}>आज की मजदूरी</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {attendanceRecords.map((rec) => {
                          const roleInfo = getRoleInfo(rec.role);
                          const dayWage = Number(rec.units || 0) * Number(rec.dailyWage || 0) + Number(rec.overtimeWage || 0);

                          return (
                            <TableRow
                              key={rec.labourId}
                              hover
                              sx={{
                                bgcolor: rec.status === 'present' ? '#f0fdf4' : rec.status === 'half_day' ? '#fffbeb' : '#fafafa'
                              }}
                            >
                              <TableCell sx={{ py: 1.2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#111' }}>
                                  {rec.name}
                                </Typography>
                                {rec.phone && (
                                  <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                    📞 {rec.phone}
                                  </Typography>
                                )}
                              </TableCell>

                              <TableCell sx={{ py: 1.2 }}>
                                <Chip
                                  size="small"
                                  label={roleInfo.label}
                                  sx={{ bgcolor: roleInfo.bg, color: roleInfo.color, fontWeight: 700, fontSize: '0.72rem' }}
                                />
                              </TableCell>

                              <TableCell sx={{ py: 1.2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#333' }}>
                                  ₹ {Number(rec.dailyWage || 0).toLocaleString('en-IN')}
                                </Typography>
                              </TableCell>

                              <TableCell sx={{ py: 1.2 }}>
                                <Box sx={{ display: 'inline-flex', borderRadius: 1, border: '1px solid #ccc', overflow: 'hidden' }}>
                                  <Button
                                    size="small"
                                    onClick={() => handleSetAttendanceStatus(rec.labourId, 'present')}
                                    sx={{
                                      minWidth: 70,
                                      py: 0.4,
                                      px: 1,
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      borderRadius: 0,
                                      bgcolor: rec.status === 'present' ? '#2e7d32' : 'transparent',
                                      color: rec.status === 'present' ? '#fff' : '#444',
                                      '&:hover': { bgcolor: rec.status === 'present' ? '#1b5e20' : '#e8f5e9' }
                                    }}
                                  >
                                    P (1 दिन)
                                  </Button>
                                  <Button
                                    size="small"
                                    onClick={() => handleSetAttendanceStatus(rec.labourId, 'half_day')}
                                    sx={{
                                      minWidth: 70,
                                      py: 0.4,
                                      px: 1,
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      borderRadius: 0,
                                      borderLeft: '1px solid #ccc',
                                      borderRight: '1px solid #ccc',
                                      bgcolor: rec.status === 'half_day' ? '#f59e0b' : 'transparent',
                                      color: rec.status === 'half_day' ? '#fff' : '#444',
                                      '&:hover': { bgcolor: rec.status === 'half_day' ? '#d97706' : '#fef3c7' }
                                    }}
                                  >
                                    HD (0.5 दिन)
                                  </Button>
                                  <Button
                                    size="small"
                                    onClick={() => handleSetAttendanceStatus(rec.labourId, 'absent')}
                                    sx={{
                                      minWidth: 70,
                                      py: 0.4,
                                      px: 1,
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      borderRadius: 0,
                                      bgcolor: rec.status === 'absent' ? '#dc2626' : 'transparent',
                                      color: rec.status === 'absent' ? '#fff' : '#444',
                                      '&:hover': { bgcolor: rec.status === 'absent' ? '#b91c1c' : '#fee2e2' }
                                    }}
                                  >
                                    A (छुट्टी)
                                  </Button>
                                </Box>
                              </TableCell>

                              <TableCell sx={{ py: 1.2 }}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                  <TextField
                                    size="small"
                                    type="number"
                                    placeholder="घंटे"
                                    value={rec.overtimeHours || ''}
                                    onChange={(e) => handleAttendanceFieldChange(rec.labourId, 'overtimeHours', e.target.value)}
                                    sx={{ width: 65, '& input': { py: 0.5, fontSize: '0.78rem' } }}
                                  />
                                  <TextField
                                    size="small"
                                    type="number"
                                    placeholder="₹ राशि"
                                    value={rec.overtimeWage || ''}
                                    onChange={(e) => handleAttendanceFieldChange(rec.labourId, 'overtimeWage', e.target.value)}
                                    sx={{ width: 75, '& input': { py: 0.5, fontSize: '0.78rem' } }}
                                  />
                                </Box>
                              </TableCell>

                              <TableCell sx={{ py: 1.2 }}>
                                <TextField
                                  size="small"
                                  placeholder="नोट (जैसे: छत ढलाई)"
                                  value={rec.note || ''}
                                  onChange={(e) => handleAttendanceFieldChange(rec.labourId, 'note', e.target.value)}
                                  sx={{ width: 140, '& input': { py: 0.5, fontSize: '0.78rem' } }}
                                />
                              </TableCell>

                              <TableCell align="right" sx={{ py: 1.2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: dayWage > 0 ? '#111' : '#999' }}>
                                  ₹ {Number(dayWage).toLocaleString('en-IN')}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Bottom Save Bar */}
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2, borderRadius: 2, bgcolor: '#111', color: '#fff' }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Typography variant="body2" sx={{ color: '#fff' }}>
                        तारीख: <strong style={{ color: '#D4AF37' }}>{attendanceDate}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4caf50' }}>
                        उपस्थित (P): <strong>{attendanceRecords.filter(r => r.status === 'present').length}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#f59e0b' }}>
                        आधा दिन (HD): <strong>{attendanceRecords.filter(r => r.status === 'half_day').length}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#f87171' }}>
                        अनुपस्थित (A): <strong>{attendanceRecords.filter(r => r.status === 'absent').length}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#D4AF37', fontWeight: 700 }}>
                        आज का कुल लेबर खर्च: ₹{' '}
                        {attendanceRecords.reduce((acc, r) => acc + (Number(r.units || 0) * Number(r.dailyWage || 0) + Number(r.overtimeWage || 0)), 0).toLocaleString('en-IN')}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      onClick={handleSaveDailyAttendance}
                      disabled={savingAttendance}
                      sx={{
                        bgcolor: '#D4AF37',
                        color: '#111',
                        fontWeight: 800,
                        px: 3,
                        py: 1,
                        '&:hover': { bgcolor: '#b8860b' }
                      }}
                    >
                      {savingAttendance ? <CircularProgress size={20} sx={{ color: '#111', mr: 1 }} /> : null}
                      💾 दैनिक हाजिरी सेव करें (Save Attendance)
                    </Button>
                  </Paper>
                </Box>
              )}
            </Box>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* SUBTAB 1: WORKERS LEDGER & ROSTER */}
          {/* ------------------------------------------------------------------- */}
          {labourSubTab === 1 && (
            <Box>
              {labourLoading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress size={32} sx={{ color: '#D4AF37' }} />
                </Box>
              ) : labourers.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>कोई मजदूर दर्ज नहीं है</Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddWorker} sx={{ mt: 1, bgcolor: '#111', color: '#D4AF37' }}>
                    नया मजदूर जोड़ें
                  </Button>
                </Paper>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <Table>
                    <TableHead sx={{ bgcolor: '#111' }}>
                      <TableRow>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>मजदूर / कारीगर</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>पद / ट्रेड</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>दैनिक दिहाड़ी</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>कुल हाजिरी दिन</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>कुल बनी मजदूरी (₹)</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 700, minWidth: 210 }}>दिया गया भुगतान (तारीख-वार)</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>बाकी बकाया (₹)</TableCell>
                        <TableCell align="right" sx={{ color: '#D4AF37', fontWeight: 700 }}>कार्य (Actions)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {labourers.map((w) => {
                        const roleInfo = getRoleInfo(w.role);
                        const workerPayments = labourPayments.filter((p) => {
                          const pLabId = p.labourId?._id ? p.labourId._id.toString() : p.labourId?.toString();
                          return pLabId === w._id.toString();
                        });
                        const isExpanded = !!expandedWorkerPayments[w._id];

                        return (
                          <React.Fragment key={w._id}>
                            <TableRow hover sx={{ bgcolor: isExpanded ? 'rgba(212, 175, 55, 0.04)' : 'inherit' }}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {workerPayments.length > 0 && (
                                    <IconButton
                                      size="small"
                                      onClick={() => toggleWorkerPaymentsExpand(w._id)}
                                      sx={{ p: 0.3, color: isExpanded ? '#D4AF37' : '#888' }}
                                      title={isExpanded ? 'भुगतान विवरण छिपाएं' : 'तारीख-वार भुगतान देखें'}
                                    >
                                      {isExpanded ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
                                    </IconButton>
                                  )}
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#111' }}>
                                      {w.name}
                                    </Typography>
                                    {w.phone && (
                                      <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                        📞 {w.phone}
                                      </Typography>
                                    )}
                                    {w.notes && (
                                      <Typography variant="caption" sx={{ color: '#888', display: 'block', fontStyle: 'italic' }}>
                                        {w.notes}
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              </TableCell>

                              <TableCell>
                                <Chip
                                  size="small"
                                  label={roleInfo.label}
                                  sx={{ bgcolor: roleInfo.bg, color: roleInfo.color, fontWeight: 700, fontSize: '0.75rem' }}
                                />
                              </TableCell>

                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#333' }}>
                                  ₹ {Number(w.dailyWage || 0).toLocaleString('en-IN')} / दिन
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0284c7' }}>
                                  {w.totalDays ?? w.financials?.totalDays ?? 0} दिन
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#b45309' }}>
                                  ₹ {Number(w.totalWageEarned ?? w.financials?.totalWageEarned ?? 0).toLocaleString('en-IN')}
                                </Typography>
                              </TableCell>

                              {/* दिया गया भुगतान (तारीख-वार) */}
                              <TableCell sx={{ minWidth: 210 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#2e7d32', fontSize: '0.95rem' }}>
                                    ₹ {Number(w.totalPaid ?? w.financials?.totalPaid ?? 0).toLocaleString('en-IN')}
                                  </Typography>
                                  {workerPayments.length > 0 && (
                                    <Button
                                      size="small"
                                      onClick={() => toggleWorkerPaymentsExpand(w._id)}
                                      endIcon={isExpanded ? <ExpandLessIcon sx={{ fontSize: 15 }} /> : <ExpandMoreIcon sx={{ fontSize: 15 }} />}
                                      sx={{
                                        py: 0.1,
                                        px: 0.8,
                                        fontSize: '0.68rem',
                                        bgcolor: isExpanded ? '#e8f5e9' : '#f5f5f5',
                                        color: isExpanded ? '#2e7d32' : '#555',
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        border: '1px solid',
                                        borderColor: isExpanded ? '#a5d6a7' : '#e0e0e0',
                                        borderRadius: 1,
                                        lineHeight: 1.4
                                      }}
                                    >
                                      {workerPayments.length} भुगतान
                                    </Button>
                                  )}
                                </Box>

                                {/* Date-wise list right below the amount */}
                                {workerPayments.length > 0 ? (
                                  <Box sx={{ mt: 0.6, display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                                    {workerPayments.slice(0, 3).map((p) => {
                                      const d = new Date(p.date || p.createdAt);
                                      const dateFormatted = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                                      return (
                                        <Box
                                          key={p._id}
                                          sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            bgcolor: '#f0fdf4',
                                            border: '1px solid #bbf7d0',
                                            borderRadius: 1,
                                            px: 0.7,
                                            py: 0.2,
                                            gap: 0.5,
                                            fontSize: '0.72rem',
                                            maxWidth: 'fit-content'
                                          }}
                                        >
                                          <span style={{ color: '#0369a1', fontWeight: 600 }}>📅 {dateFormatted}:</span>
                                          <strong style={{ color: '#15803d' }}>₹{Number(p.amount || 0).toLocaleString('en-IN')}</strong>
                                          <span style={{ color: '#666', fontSize: '0.65rem' }}>({p.paymentMode || 'Cash'})</span>
                                        </Box>
                                      );
                                    })}
                                    {workerPayments.length > 3 && !isExpanded && (
                                      <Typography
                                        variant="caption"
                                        onClick={() => toggleWorkerPaymentsExpand(w._id)}
                                        sx={{ color: '#0284c7', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline', mt: 0.2 }}
                                      >
                                        + {workerPayments.length - 3} और तारीखें देखें...
                                      </Typography>
                                    )}
                                  </Box>
                                ) : (
                                  <Typography variant="caption" sx={{ color: '#999', display: 'block', mt: 0.4, fontStyle: 'italic' }}>
                                    कोई भुगतान नहीं हुआ
                                  </Typography>
                                )}
                              </TableCell>

                              <TableCell>
                                <Typography variant="body2" sx={{
                                  fontWeight: 800,
                                  color: (w.balanceDue ?? w.financials?.balanceDue ?? 0) > 0 ? '#c62828' : '#2e7d32'
                                }}>
                                  ₹ {Number(w.balanceDue ?? w.financials?.balanceDue ?? 0).toLocaleString('en-IN')}
                                </Typography>
                              </TableCell>

                              <TableCell align="right">
                                <Box sx={{ display: 'inline-flex', gap: 0.8 }}>
                                  <Tooltip title="भुगतान करें (Pay Wage)">
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() => handleOpenPayLabour(w)}
                                      sx={{
                                        bgcolor: '#2e7d32',
                                        color: '#fff',
                                        fontSize: '0.72rem',
                                        py: 0.3,
                                        px: 1,
                                        fontWeight: 700,
                                        '&:hover': { bgcolor: '#1b5e20' }
                                      }}
                                    >
                                      पे (Pay)
                                    </Button>
                                  </Tooltip>

                                  {w.phone && (
                                    <Tooltip title="WhatsApp पर खाता विवरण भेजें">
                                      <IconButton
                                        size="small"
                                        onClick={() => handleSendWorkerLedgerWhatsApp(w)}
                                        sx={{ color: '#25D366', border: '1px solid #25D366', p: 0.5 }}
                                      >
                                        <WhatsAppIcon sx={{ fontSize: 17 }} />
                                      </IconButton>
                                    </Tooltip>
                                  )}

                                  <Tooltip title="एडिट करें (Edit)">
                                    <IconButton size="small" onClick={() => handleOpenEditWorker(w)} sx={{ color: '#1976d2' }}>
                                      <EditIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="डिलीट करें">
                                    <IconButton size="small" onClick={() => handleDeleteWorker(w._id, w.name)} sx={{ color: '#c62828' }}>
                                      <DeleteIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>

                            {/* Expandable Date-wise Payment Breakdown Row */}
                            {isExpanded && (
                              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                <TableCell colSpan={8} sx={{ py: 1.5, px: { xs: 1.5, sm: 3 }, borderBottom: '2px solid #cbd5e1' }}>
                                  <Paper elevation={0} sx={{ p: 2, bgcolor: '#ffffff', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                          <span>💰 {w.name} का तारीख-वार भुगतान खाता (Payment History)</span>
                                        </Typography>
                                        <Chip
                                          size="small"
                                          label={`${workerPayments.length} भुगतान • कुल: ₹ ${Number(w.totalPaid ?? w.financials?.totalPaid ?? 0).toLocaleString('en-IN')}`}
                                          sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 800, fontSize: '0.75rem' }}
                                        />
                                      </Box>
                                      <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                          size="small"
                                          variant="contained"
                                          startIcon={<AddIcon />}
                                          onClick={() => handleOpenPayLabour(w)}
                                          sx={{ bgcolor: '#2e7d32', color: '#fff', fontWeight: 700, fontSize: '0.72rem', py: 0.3 }}
                                        >
                                          + नया भुगतान करें
                                        </Button>
                                        {w.phone && (
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                                            onClick={() => handleSendWorkerLedgerWhatsApp(w)}
                                            sx={{ borderColor: '#25D366', color: '#25D366', fontWeight: 700, fontSize: '0.72rem', py: 0.3 }}
                                          >
                                            खाता भेजें
                                          </Button>
                                        )}
                                      </Box>
                                    </Box>

                                    {workerPayments.length === 0 ? (
                                      <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic', py: 1 }}>
                                        इस मजदूर को अभी तक कोई भुगतान रिकॉर्ड नहीं किया गया है।
                                      </Typography>
                                    ) : (
                                      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 1.5 }}>
                                        <Table size="small">
                                          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                            <TableRow>
                                              <TableCell sx={{ fontWeight: 700, py: 1, color: '#334155', fontSize: '0.75rem' }}>दिनांक व समय (Date & Time)</TableCell>
                                              <TableCell sx={{ fontWeight: 700, py: 1, color: '#334155', fontSize: '0.75rem' }}>भुगतान राशि (Amount)</TableCell>
                                              <TableCell sx={{ fontWeight: 700, py: 1, color: '#334155', fontSize: '0.75rem' }}>माध्यम (Payment Mode)</TableCell>
                                              <TableCell sx={{ fontWeight: 700, py: 1, color: '#334155', fontSize: '0.75rem' }}>संदर्भ / UTR / Cheque</TableCell>
                                              <TableCell sx={{ fontWeight: 700, py: 1, color: '#334155', fontSize: '0.75rem' }}>टिप्पणी / विवरण (Notes)</TableCell>
                                              <TableCell sx={{ fontWeight: 700, py: 1, color: '#334155', fontSize: '0.75rem' }}>WhatsApp रसीद</TableCell>
                                              <TableCell align="right" sx={{ fontWeight: 700, py: 1, color: '#334155', fontSize: '0.75rem' }}>डिलीट</TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {workerPayments.map((p) => {
                                              const d = new Date(p.date || p.createdAt);
                                              const dateFormatted = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                                              const timeFormatted = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

                                              return (
                                                <TableRow key={p._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                  <TableCell sx={{ py: 0.8 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8rem' }}>
                                                      📅 {dateFormatted}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                      ⏰ {timeFormatted}
                                                    </Typography>
                                                  </TableCell>

                                                  <TableCell sx={{ py: 0.8 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#16a34a', fontSize: '0.88rem' }}>
                                                      ₹ {Number(p.amount || 0).toLocaleString('en-IN')}
                                                    </Typography>
                                                  </TableCell>

                                                  <TableCell sx={{ py: 0.8 }}>
                                                    <Chip
                                                      size="small"
                                                      label={p.paymentMode || 'Cash'}
                                                      sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: '0.7rem', height: 20 }}
                                                    />
                                                  </TableCell>

                                                  <TableCell sx={{ py: 0.8 }}>
                                                    <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.78rem' }}>
                                                      {p.transactionRef || '—'}
                                                    </Typography>
                                                  </TableCell>

                                                  <TableCell sx={{ py: 0.8 }}>
                                                    <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.78rem' }}>
                                                      {p.notes || '—'}
                                                    </Typography>
                                                  </TableCell>

                                                  <TableCell sx={{ py: 0.8 }}>
                                                    {w.phone ? (
                                                      <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                                                        onClick={() => handleSendPaymentSlipWhatsApp(p)}
                                                        sx={{
                                                          borderColor: '#25D366',
                                                          color: '#25D366',
                                                          fontSize: '0.7rem',
                                                          py: 0.2,
                                                          px: 1,
                                                          textTransform: 'none',
                                                          fontWeight: 600
                                                        }}
                                                      >
                                                        रसीद भेजें
                                                      </Button>
                                                    ) : (
                                                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>नंबर नहीं है</Typography>
                                                    )}
                                                  </TableCell>

                                                  <TableCell align="right" sx={{ py: 0.8 }}>
                                                    <IconButton
                                                      size="small"
                                                      onClick={() => handleDeleteLabourPayment(p._id)}
                                                      sx={{ color: '#ef4444', p: 0.4 }}
                                                    >
                                                      <DeleteIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                  </TableCell>
                                                </TableRow>
                                              );
                                            })}
                                          </TableBody>
                                        </Table>
                                      </TableContainer>
                                    )}
                                  </Paper>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* SUBTAB 2: LABOUR PAYMENTS HISTORY */}
          {/* ------------------------------------------------------------------- */}
          {labourSubTab === 2 && (
            <Box>
              {labourPaymentsLoading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress size={32} sx={{ color: '#D4AF37' }} />
                </Box>
              ) : labourPayments.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>कोई मजदूरी भुगतान नहीं मिला</Typography>
                  <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>
                    कामगारों को भुगतान करने पर रिकॉर्ड यहाँ WhatsApp रसीद के साथ दिखाई देगा।
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<MoneyIcon />}
                    onClick={() => handleOpenPayLabour()}
                    disabled={labourers.length === 0}
                    sx={{ bgcolor: '#2e7d32', color: '#fff', fontWeight: 700 }}
                  >
                    भुगतान दर्ज करें
                  </Button>
                </Paper>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <Table>
                    <TableHead sx={{ bgcolor: '#111' }}>
                      <TableRow>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>दिनांक व समय</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>मजदूर / मिस्त्री</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>भुगतान राशि (₹)</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>माध्यम (Mode)</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>टिप्पणी / संदर्भ (Notes)</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>WhatsApp रसीद</TableCell>
                        <TableCell align="right" sx={{ color: '#D4AF37', fontWeight: 700 }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {labourPayments.map((p) => {
                        const d = new Date(p.date || Date.now());
                        const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                        const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

                        return (
                          <TableRow key={p._id} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#111' }}>
                                {dateStr}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#666' }}>
                                {timeStr}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#111' }}>
                                {p.labourId?.name || 'Worker'}
                              </Typography>
                              {p.labourId?.role && (
                                <Chip
                                  size="small"
                                  label={getRoleInfo(p.labourId.role).label}
                                  sx={{ mt: 0.3, fontSize: '0.68rem', height: 20 }}
                                />
                              )}
                            </TableCell>

                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: '#2e7d32' }}>
                                ₹ {Number(p.amount || 0).toLocaleString('en-IN')}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Chip
                                size="small"
                                label={p.paymentMode || 'Cash'}
                                sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700 }}
                              />
                            </TableCell>

                            <TableCell>
                              <Typography variant="body2" sx={{ color: '#555' }}>
                                {p.notes || p.transactionRef || '—'}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              {p.labourId?.phone ? (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                                  onClick={() => handleSendPaymentSlipWhatsApp(p)}
                                  sx={{
                                    borderColor: '#25D366',
                                    color: '#25D366',
                                    fontWeight: 700,
                                    fontSize: '0.72rem',
                                    py: 0.3
                                  }}
                                >
                                  WhatsApp रसीद
                                </Button>
                              ) : (
                                <Typography variant="caption" sx={{ color: '#999' }}>फ़ोन नंबर नहीं</Typography>
                              )}
                            </TableCell>

                            <TableCell align="right">
                              <IconButton size="small" onClick={() => handleDeleteLabourPayment(p._id)} sx={{ color: '#c62828' }}>
                                <DeleteIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </Box>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: Other Expenses */}
      {/* ========================================================================= */}
      {activeTab === 4 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#111' }}>
                Other Site Expenses (अन्य खर्चे)
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Track labor/mistri, fuel/diesel, machine hire, tea/snacks, and general expenses with specific notes (ye isme lge).
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOtherExpenseDialogOpen(true)}
              sx={{
                bgcolor: '#111',
                color: '#D4AF37',
                fontWeight: 700,
                border: '1px solid #D4AF37',
                '&:hover': { bgcolor: '#222' }
              }}
            >
              Add Site Expense
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#111' }}>
                <TableRow>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Amount (₹)</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Description (Ye Isme Lge)</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Payment Mode</TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 700 }}>Bill Photo</TableCell>
                  <TableCell align="right" sx={{ color: '#D4AF37', fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {otherExpensesList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" sx={{ color: '#888', fontWeight: 600 }}>
                        No miscellaneous expenses recorded.
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setOtherExpenseDialogOpen(true)}
                        sx={{ mt: 2, color: '#111', borderColor: '#D4AF37' }}
                      >
                        Add Expense
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  otherExpensesList.map((exp) => (
                    <TableRow key={exp._id} hover>
                      <TableCell sx={{ color: '#333' }}>
                        {exp.date ? new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                      </TableCell>
                      <TableCell>
                        <Chip label={exp.category} size="small" sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#b71c1c', fontSize: '0.95rem' }}>
                        ₹ {Number(exp.totalAmount || 0).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell sx={{ color: '#333', maxWidth: 300 }}>
                        {exp.note || exp.title || '—'}
                      </TableCell>
                      <TableCell sx={{ color: '#666' }}>
                        {exp.paymentMode || 'Cash'}
                      </TableCell>
                      <TableCell>
                        {exp.billImage ? (
                          <Button
                            size="small"
                            onClick={() => {
                              setPreviewImageUrl(getStaticAssetUrl(exp.billImage));
                              setImageModalOpen(true);
                            }}
                            sx={{ color: '#0288d1', textTransform: 'none', fontSize: '0.75rem' }}
                          >
                            View Receipt
                          </Button>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleDeleteExpense(exp._id)} sx={{ color: '#d32f2f' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: Profit & Loss Dashboard */}
      {/* ========================================================================= */}
      {activeTab === 5 && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111' }}>
              Project Financial Statement & Profit Analysis
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Complete financial breakdown comparing client receipts against on-site material and labor expenses.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Left side: Receipts vs Expenses Breakdown */}
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111', mb: 2 }}>
                  Financial Breakdown
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body1" sx={{ color: '#555' }}>Total Fixed Contract Value</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#111' }}>
                    ₹ {Number(contractAmt).toLocaleString('en-IN')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body1" sx={{ color: '#2e7d32', fontWeight: 600 }}>Total Payments Received (A)</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#2e7d32' }}>
                    + ₹ {Number(totalPaid).toLocaleString('en-IN')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body1" sx={{ color: '#c62828' }}>Remaining Client Balance Due</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#c62828' }}>
                    ₹ {Number(balanceDue).toLocaleString('en-IN')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #eee', pl: 2 }}>
                  <Typography variant="body2" sx={{ color: '#777' }}>• Material Purchases</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#555' }}>
                    ₹ {Number(financials?.materialExpensesTotal || 0).toLocaleString('en-IN')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #eee', pl: 2 }}>
                  <Typography variant="body2" sx={{ color: '#777' }}>• Separate Transport Expenses</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#555' }}>
                    ₹ {Number(financials?.transportExpensesTotal || 0).toLocaleString('en-IN')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #eee', pl: 2 }}>
                  <Typography variant="body2" sx={{ color: '#b45309', fontWeight: 600 }}>• Labour & Wages (लेबर व मजदूरी खर्च)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#b45309' }}>
                    ₹ {Number(financials?.labourExpensesTotal || 0).toLocaleString('en-IN')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #eee', pl: 2 }}>
                  <Typography variant="body2" sx={{ color: '#777' }}>• Other Site Expenses (Fuel, Tools, Misc)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#555' }}>
                    ₹ {Number(financials?.otherExpensesTotal || 0).toLocaleString('en-IN')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '2px solid #111', bgcolor: '#fffde7', px: 1, mt: 1 }}>
                  <Typography variant="body1" sx={{ color: '#b71c1c', fontWeight: 800 }}>Total Project Expenses (B)</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#b71c1c' }}>
                    - ₹ {Number(totalExpenses).toLocaleString('en-IN')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2, bgcolor: '#111', color: '#fff', px: 2, borderRadius: 2, mt: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#D4AF37' }}>
                    Net Current Profit (A - B)
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: netProfit >= 0 ? '#4caf50' : '#f44336' }}>
                    ₹ {Number(netProfit).toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Right side: Summary Health Card */}
            <Grid item xs={12} md={5}>
              <Card sx={{ bgcolor: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#b8860b', textTransform: 'uppercase', mb: 2 }}>
                    Project Profitability Insights
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={{ color: '#666' }}>Client Collection Ratio</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#111' }}>
                      {contractAmt > 0 ? Math.round((totalPaid / contractAmt) * 100) : 0}% Collected
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={{ color: '#666' }}>Expense to Contract Ratio</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#c62828' }}>
                      {contractAmt > 0 ? Math.round((totalExpenses / contractAmt) * 100) : 0}% Spent
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: '#666' }}>Projected Final Profit on Contract</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#2e7d32' }}>
                      ₹ {Number(contractAmt - totalExpenses).toLocaleString('en-IN')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#777', display: 'block', mt: 0.5 }}>
                      Assuming full contract realization and current expenses
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: Agreement & Documents */}
      {/* ========================================================================= */}
      {activeTab === 6 && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111' }}>
              Construction Agreement & Legal Documents
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Signed agreement papers, site demarcation files, and client identity documents.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111', mb: 2 }}>
                  Signed Agreement Document / Photo
                </Typography>
                {clientData.agreementImage ? (
                  <Box>
                    <Box
                      component="img"
                      src={getStaticAssetUrl(clientData.agreementImage)}
                      alt="Agreement"
                      sx={{
                        width: '100%',
                        maxHeight: 450,
                        objectFit: 'contain',
                        borderRadius: 2,
                        border: '1px solid #eee',
                        bgcolor: '#fafafa',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setPreviewImageUrl(getStaticAssetUrl(clientData.agreementImage));
                        setImageModalOpen(true);
                      }}
                    />
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        href={getStaticAssetUrl(clientData.agreementImage)}
                        target="_blank"
                        rel="noreferrer"
                        sx={{ color: '#111', borderColor: '#D4AF37' }}
                      >
                        Open Full Size in New Tab
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                      No agreement document uploaded yet.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111', mb: 2 }}>
                  Contract Profile Information
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                  <strong>Client Name:</strong> {clientData.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                  <strong>Site Location:</strong> {clientData.location}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                  <strong>Contact Phone:</strong> +91 {clientData.phone}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                  <strong>Email:</strong> {clientData.email || 'Not provided'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                  <strong>Aadhar Card Number:</strong> {clientData.aadharNo || 'Not provided'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                  <strong>Contract Value:</strong> ₹ {Number(contractAmt).toLocaleString('en-IN')}
                </Typography>
                {clientData.categories && clientData.categories.length > 0 && (
                  <Box sx={{ my: 1.5 }}>
                    <Typography variant="body2" sx={{ color: '#555', mb: 0.5 }}>
                      <strong>Work Categories:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {clientData.categories.map((c, idx) => (
                        <Chip
                          key={idx}
                          label={`${typeof c === 'object' ? (c.emoji || '📦') : ''} ${typeof c === 'object' ? c.name : 'Category'}`}
                          size="small"
                          sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 700 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                {clientData.services && clientData.services.length > 0 && (
                  <Box sx={{ my: 1.5 }}>
                    <Typography variant="body2" sx={{ color: '#555', mb: 0.5 }}>
                      <strong>Selected Services:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {clientData.services.map((s, idx) => (
                        <Chip
                          key={idx}
                          label={typeof s === 'object' ? (s.name || s.title) : 'Service'}
                          size="small"
                          sx={{ bgcolor: '#f0f0f0', color: '#333' }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                {clientData.notes && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#fffde7', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#b8860b', display: 'block' }}>
                      Contract Notes / Terms:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#333', mt: 0.5 }}>
                      {clientData.notes}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: Site Photos & Videos (फोटो व वीडियो) */}
      {/* ========================================================================= */}
      {activeTab === 7 && (
        <Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#111' }}>
                Site Construction Photos & Videos (साइट फोटो एवं वीडियो)
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Upload photos and videos of ongoing construction work. They will immediately show on the client's web portal and mobile app.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={handleOpenMediaDialog}
              sx={{
                bgcolor: '#D4AF37',
                color: '#111',
                fontWeight: 800,
                px: 2.5,
                py: 1,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(212,175,55,0.3)',
                '&:hover': { bgcolor: '#b8860b', color: '#fff' }
              }}
            >
              Upload Photo / Video (अपलोड करें)
            </Button>
          </Box>

          {/* Filter Bar */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Chip
              label={`All Media (${(clientData.siteMedia || []).length})`}
              onClick={() => setMediaFilter('all')}
              sx={{
                bgcolor: mediaFilter === 'all' ? '#111' : '#f0f0f0',
                color: mediaFilter === 'all' ? '#D4AF37' : '#555',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            />
            <Chip
              icon={<PhotoCameraIcon sx={{ fontSize: '16px !important', color: mediaFilter === 'image' ? '#D4AF37 !important' : '#555 !important' }} />}
              label={`Photos (${(clientData.siteMedia || []).filter(m => m.mediaType === 'image').length})`}
              onClick={() => setMediaFilter('image')}
              sx={{
                bgcolor: mediaFilter === 'image' ? '#111' : '#f0f0f0',
                color: mediaFilter === 'image' ? '#D4AF37' : '#555',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            />
            <Chip
              icon={<VideocamIcon sx={{ fontSize: '16px !important', color: mediaFilter === 'video' ? '#D4AF37 !important' : '#555 !important' }} />}
              label={`Videos (${(clientData.siteMedia || []).filter(m => m.mediaType === 'video').length})`}
              onClick={() => setMediaFilter('video')}
              sx={{
                bgcolor: mediaFilter === 'video' ? '#111' : '#f0f0f0',
                color: mediaFilter === 'video' ? '#D4AF37' : '#555',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            />
          </Box>

          {/* Media Grid */}
          {(!clientData.siteMedia || clientData.siteMedia.length === 0) ? (
            <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 3, border: '2px dashed #ddd' }}>
              <PhotoLibraryIcon sx={{ fontSize: 48, color: '#ccc', mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#666', mb: 0.5 }}>
                No Site Media Uploaded
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', maxWidth: 450, mx: 'auto', mb: 2 }}>
                Click "Upload Photo / Video" above to upload site inspection images or work progression videos for this client.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={handleOpenMediaDialog}
                sx={{ borderColor: '#D4AF37', color: '#111', fontWeight: 700 }}
              >
                Upload First Media
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={2.5}>
              {(clientData.siteMedia || [])
                .filter(m => mediaFilter === 'all' ? true : m.mediaType === mediaFilter)
                .map((media) => {
                  const isVideo = media.mediaType === 'video';
                  const mediaUrl = getStaticAssetUrl(media.url);

                  return (
                    <Grid item xs={12} sm={6} md={4} key={media._id}>
                      <Paper
                        sx={{
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '1px solid #e0e0e0',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        {/* Media Player or Thumbnail */}
                        {isVideo ? (
                          <Box sx={{ bgcolor: '#000', height: 210, position: 'relative' }}>
                            <video
                              controls
                              playsInline
                              preload="metadata"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              src={mediaUrl}
                            />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              height: 210,
                              bgcolor: '#f5f5f5',
                              cursor: 'pointer',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                            onClick={() => {
                              setPreviewImageUrl(mediaUrl);
                              setImageModalOpen(true);
                            }}
                          >
                            <Box
                              component="img"
                              src={mediaUrl}
                              alt={media.title || 'Site photo'}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                transition: 'transform 0.25s',
                                '&:hover': { transform: 'scale(1.04)' }
                              }}
                            />
                          </Box>
                        )}

                        {/* Details */}
                        <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Chip
                              label={isVideo ? 'VIDEO' : 'PHOTO'}
                              size="small"
                              sx={{
                                height: 22,
                                bgcolor: isVideo ? '#ffebee' : '#e3f2fd',
                                color: isVideo ? '#c62828' : '#1565c0',
                                fontWeight: 800,
                                fontSize: '0.68rem'
                              }}
                            />
                            <Typography variant="caption" sx={{ color: '#888' }}>
                              {media.createdAt ? new Date(media.createdAt).toLocaleDateString('en-IN') : ''}
                            </Typography>
                          </Box>

                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111', mb: 0.5 }}>
                            {media.title || (isVideo ? 'Site Video' : 'Site Photo')}
                          </Typography>

                          {media.stepTitle && (
                            <Chip
                              label={`Stage: ${media.stepTitle}`}
                              size="small"
                              sx={{ alignSelf: 'flex-start', bgcolor: '#fff8e1', color: '#b8860b', fontWeight: 700, fontSize: '0.72rem', mb: 1 }}
                            />
                          )}

                          {media.caption && (
                            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.82rem', mb: 1.5, flex: 1 }}>
                              {media.caption}
                            </Typography>
                          )}

                          <Divider sx={{ my: 1 }} />

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5 }}>
                            <Button
                              size="small"
                              href={mediaUrl}
                              target="_blank"
                              rel="noreferrer"
                              sx={{ color: '#555', textTransform: 'none', fontSize: '0.78rem' }}
                            >
                              Open Full
                            </Button>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteMedia(media._id)}
                              title="Delete media"
                            >
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
            </Grid>
          )}
        </Box>
      )}
        </>
      )}

      {/* ========================================================================= */}
      {/* DIALOG: Upload Site Photo / Video */}
      {/* ========================================================================= */}
      <Dialog open={mediaDialogOpen} onClose={() => !uploadingMedia && setMediaDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Upload Site Photo / Video (फोटो या वीडियो अपलोड करें)</span>
          <IconButton size="small" onClick={() => setMediaDialogOpen(false)} disabled={uploadingMedia} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleUploadMedia}>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2, mt: 1 }}>
              <Alert severity="info" sx={{ fontSize: '0.85rem' }}>
                Uploaded images and videos (up to 100MB) are instantly visible to the client on both their Web Portal and Mobile App.
              </Alert>

              {/* Media Type Selection */}
              <TextField
                select
                label="Media Type (प्रकार) *"
                value={mediaForm.mediaType}
                onChange={(e) => setMediaForm({ ...mediaForm, mediaType: e.target.value })}
                fullWidth
              >
                <MenuItem value="image">📷 Site Photo / Image (फोटो)</MenuItem>
                <MenuItem value="video">🎥 Site Video (वीडियो)</MenuItem>
              </TextField>

              {/* File Input */}
              <Box sx={{ p: 2, border: '2px dashed #D4AF37', borderRadius: 2, bgcolor: '#fafafa', textAlign: 'center' }}>
                <input
                  type="file"
                  id="site-media-file-input"
                  accept={mediaForm.mediaType === 'video' ? 'video/*' : 'image/*'}
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      const isVid = file.type.startsWith('video/');
                      setMediaForm((prev) => ({
                        ...prev,
                        mediaFile: file,
                        mediaType: isVid ? 'video' : prev.mediaType,
                        title: prev.title || file.name.replace(/\.[^/.]+$/, '')
                      }));
                    }
                  }}
                />
                <label htmlFor="site-media-file-input" style={{ cursor: 'pointer', display: 'block' }}>
                  <UploadIcon sx={{ fontSize: 40, color: '#D4AF37', mb: 0.5 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111' }}>
                    {mediaForm.mediaFile ? mediaForm.mediaFile.name : `Click here to choose ${mediaForm.mediaType === 'video' ? 'video' : 'photo'} file`}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                    {mediaForm.mediaFile ? `${(mediaForm.mediaFile.size / (1024 * 1024)).toFixed(2)} MB selected` : 'Supports JPG, PNG, WEBP, MP4, MOV up to 100MB'}
                  </Typography>
                </label>
              </Box>

              {/* Media Title */}
              <TextField
                label="Title / Heading (शीर्षक) *"
                required
                fullWidth
                placeholder="e.g. Foundation Excavation / Column Casting"
                value={mediaForm.title}
                onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
              />

              {/* Milestone Phase Dropdown */}
              <TextField
                select
                label="Related Construction Milestone (संबंधित चरण)"
                value={mediaForm.stepTitle}
                onChange={(e) => setMediaForm({ ...mediaForm, stepTitle: e.target.value })}
                fullWidth
                helperText="Optional: Link this media to a specific milestone checkpoint"
              >
                <MenuItem value="">-- None / General Site Update --</MenuItem>
                {(clientData.steps || []).map((step, sIdx) => (
                  <MenuItem key={step._id || sIdx} value={step.title}>
                    {step.title}
                  </MenuItem>
                ))}
              </TextField>

              {/* Caption / Note */}
              <TextField
                label="Caption / Details (विवरण)"
                multiline
                rows={2}
                fullWidth
                placeholder="Details about work executed, materials used or site status..."
                value={mediaForm.caption}
                onChange={(e) => setMediaForm({ ...mediaForm, caption: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, bgcolor: '#f5f5f5' }}>
            <Button onClick={() => setMediaDialogOpen(false)} disabled={uploadingMedia} sx={{ color: '#666' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={uploadingMedia || (!mediaForm.mediaFile && !mediaForm.url.trim())}
              startIcon={uploadingMedia ? <CircularProgress size={18} sx={{ color: '#111' }} /> : <UploadIcon />}
              sx={{ bgcolor: '#D4AF37', color: '#111', fontWeight: 800, '&:hover': { bgcolor: '#b8860b', color: '#fff' } }}
            >
              {uploadingMedia ? 'Uploading...' : 'Upload Media'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: Record Payment */}
      {/* ========================================================================= */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 800 }}>
          Record Client Payment (भुगतान दर्ज करें)
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {clientData.email && (
              <Alert severity="info" icon={<EmailIcon />}>
                Payment voucher will automatically be emailed to: <strong>{clientData.email}</strong>
              </Alert>
            )}

            <TextField
              label="Payment Amount Received (₹) *"
              type="number"
              fullWidth
              required
              placeholder="e.g. 200000"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Payment Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={paymentForm.date}
                  onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Payment Mode"
                  fullWidth
                  value={paymentForm.paymentMode}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}
                >
                  <MenuItem value="Cash">Cash (नकद)</MenuItem>
                  <MenuItem value="UPI">UPI / GPay / PhonePe</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer (NEFT/RTGS/IMPS)</MenuItem>
                  <MenuItem value="Cheque">Cheque</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <TextField
              label="Transaction Ref / Cheque No / UTR"
              fullWidth
              placeholder="e.g. UPI Ref 3829104829 or Cheque #004819"
              value={paymentForm.transactionRef}
              onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
            />

            <TextField
              select
              label="Link to Milestone Step (Optional)"
              fullWidth
              value={paymentForm.stepId}
              onChange={(e) => setPaymentForm({ ...paymentForm, stepId: e.target.value })}
            >
              <MenuItem value="">
                <em>None / General Advance Payment</em>
              </MenuItem>
              {(clientData.steps || []).map((st) => (
                <MenuItem key={st._id} value={st._id}>
                  {st.title}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Remarks / Note"
              fullWidth
              placeholder="e.g. 2nd installment for foundation work"
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={() => setPaymentDialogOpen(false)} disabled={savingPayment} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddPayment}
            variant="contained"
            disabled={savingPayment}
            sx={{
              bgcolor: '#111',
              color: '#D4AF37',
              fontWeight: 700,
              '&:hover': { bgcolor: '#222' },
              '&.Mui-disabled': { bgcolor: '#555', color: '#aaa' }
            }}
          >
            {savingPayment ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} sx={{ color: '#D4AF37' }} />
                <span>Saving & Generating Slip...</span>
              </Box>
            ) : (
              'Save & Generate Slip'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: Add Material Supply Expense */}
      {/* ========================================================================= */}
      <Dialog open={materialDialogOpen} onClose={() => setMaterialDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 800 }}>
          Record Material Supply Entry (सामग्री का खर्च)
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* Pick from Master Catalog */}
            <TextField
              select
              label="Select Material from Master Catalog (कैटलॉग से चुनें)"
              fullWidth
              value={materialForm.materialId}
              onChange={(e) => handleSelectMaterialFromCatalog(e.target.value)}
              helperText="Selecting a catalog material auto-populates category, unit, standard price, and supplier"
            >
              <MenuItem value="">
                <em>-- Custom Material (Other / नया सामान) --</em>
              </MenuItem>
              {materialsCatalog.map((m) => (
                <MenuItem key={m._id} value={m._id}>
                  {m.name} ({m.category}) - Ref: ₹{m.defaultPrice}/{m.unit}
                </MenuItem>
              ))}
            </TextField>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Material Name *"
                  fullWidth
                  placeholder="e.g. UltraTech Cement 50kg"
                  value={materialForm.materialName}
                  onChange={(e) => setMaterialForm({ ...materialForm, materialName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Category"
                  fullWidth
                  value={materialForm.category}
                  onChange={(e) => setMaterialForm({ ...materialForm, category: e.target.value })}
                >
                  <MenuItem value="Civil & Masonry">Civil & Masonry (सीमेंट, रोड़ी, ईंट)</MenuItem>
                  <MenuItem value="Steel & Iron">Steel & Iron (सरिया)</MenuItem>
                  <MenuItem value="Plumbing">Plumbing (पानी की टंकी, पाइप)</MenuItem>
                  <MenuItem value="Electrical">Electrical (तार, स्विच)</MenuItem>
                  <MenuItem value="Tiles & Stone">Tiles & Stone (टाइल, मार्बल)</MenuItem>
                  <MenuItem value="Paint & Putty">Paint & Putty (पुट्टी, पेंट)</MenuItem>
                  <MenuItem value="Wood & Ply">Wood & Ply (प्लाई, लकड़ी)</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Unit (माप की इकाई) *"
                  fullWidth
                  value={materialForm.unit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    setMaterialForm((prev) => ({ ...prev, unit: newUnit }));
                  }}
                  helperText="चुनें: Truck (ट्रक), Litre (लीटर), Bag (बोरी), Trolley (ट्रॉली), आदि"
                >
                  {UNITS.map((u) => (
                    <MenuItem key={u} value={u}>
                      {getUnitDisplay(u)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={`Kitne ${materialForm.unit || 'Unit'} Aaye (Quantity Received) *`}
                  type="number"
                  fullWidth
                  placeholder={`e.g. 2 ${materialForm.unit || 'Truck'}`}
                  value={materialForm.quantity}
                  onChange={(e) => handleMaterialQuantityChange(e.target.value)}
                  helperText={`Site par prapt kul ${materialForm.unit || 'Unit'} ki sankhya`}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{materialForm.unit || 'Unit'}</InputAdornment>
                  }}
                />
              </Grid>
            </Grid>

            {/* Pricing Selection Mode (Per Unit Rate vs Total Material Bill) */}
            <Box sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1, mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111' }}>
                  Pricing Method (मूल्य कैसे जोड़ना है?):
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant={materialForm.pricingMode === 'per_unit' ? 'contained' : 'outlined'}
                    onClick={() => handlePricingModeToggle('per_unit')}
                    sx={{
                      bgcolor: materialForm.pricingMode === 'per_unit' ? '#111' : 'transparent',
                      color: materialForm.pricingMode === 'per_unit' ? '#D4AF37' : '#555',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'none',
                      border: materialForm.pricingMode === 'per_unit' ? '1px solid #D4AF37' : '1px solid #ccc',
                      '&:hover': { bgcolor: materialForm.pricingMode === 'per_unit' ? '#222' : '#f0f0f0' }
                    }}
                  >
                    Per {materialForm.unit || 'Unit'} Rate (प्रति इकाई रेट)
                  </Button>
                  <Button
                    size="small"
                    variant={materialForm.pricingMode === 'total' ? 'contained' : 'outlined'}
                    onClick={() => handlePricingModeToggle('total')}
                    sx={{
                      bgcolor: materialForm.pricingMode === 'total' ? '#111' : 'transparent',
                      color: materialForm.pricingMode === 'total' ? '#D4AF37' : '#555',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'none',
                      border: materialForm.pricingMode === 'total' ? '1px solid #D4AF37' : '1px solid #ccc',
                      '&:hover': { bgcolor: materialForm.pricingMode === 'total' ? '#222' : '#f0f0f0' }
                    }}
                  >
                    Total Material Price (कुल सामान राशि)
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={`Rate per ${materialForm.unit || 'Unit'} (प्रति ${materialForm.unit || 'Unit'} रेट) *`}
                    type="number"
                    fullWidth
                    placeholder={`e.g. Rate for 1 ${materialForm.unit || 'Unit'}`}
                    value={materialForm.unitPrice}
                    onChange={(e) => handleMaterialUnitPriceChange(e.target.value)}
                    helperText={`1 ${materialForm.unit || 'Unit'} ka daam (₹)`}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      endAdornment: <InputAdornment position="end">/ {materialForm.unit || 'Unit'}</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Total Material Price (कुल सामग्री मूल्य ₹) *"
                    type="number"
                    fullWidth
                    placeholder="e.g. Kul kitne ka saman hua"
                    value={materialForm.materialCost}
                    onChange={(e) => handleMaterialTotalCostChange(e.target.value)}
                    helperText={`Kul ${materialForm.quantity || 1} ${materialForm.unit || 'Unit'} ka saman bill (bina kiraye)`}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>
                    }}
                  />
                </Grid>
              </Grid>

              {/* Live Math Calculation Breakdown */}
              <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#e8f5e9', borderRadius: 1.5, border: '1px solid #c8e6c9' }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#2e7d32' }}>
                  🧮 Live Calculation: {materialForm.quantity || 0} {materialForm.unit || 'Unit'} × ₹{Number(materialForm.unitPrice || 0).toLocaleString('en-IN')} = ₹{Number(materialForm.materialCost || 0).toLocaleString('en-IN')} (सामग्री मूल्य)
                </Typography>
                {!materialForm.transportIncluded && Number(materialForm.transportCost) > 0 && (
                  <Typography variant="caption" sx={{ color: '#e65100', fontWeight: 700, display: 'block', mt: 0.5 }}>
                    + ₹ {Number(materialForm.transportCost).toLocaleString('en-IN')} Transport (किराया) = ₹ {Number((Number(materialForm.materialCost || 0) + Number(materialForm.transportCost || 0))).toLocaleString('en-IN')} (अंतिम कुल खर्च)
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Transport Cost Option */}
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111', mb: 1 }}>
                Transport / Delivery Cost (किराया / भाड़ा)
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={!materialForm.transportIncluded}
                    onChange={(e) => setMaterialForm({ ...materialForm, transportIncluded: !e.target.checked })}
                    color="warning"
                  />
                }
                label="Transport is Separate (किराया अलग से है)"
              />

              {!materialForm.transportIncluded && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Separate Transport / Freight Cost (₹)"
                      type="number"
                      fullWidth
                      placeholder="e.g. 1200"
                      value={materialForm.transportCost}
                      onChange={(e) => setMaterialForm({ ...materialForm, transportCost: e.target.value })}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Driver / Vehicle Number"
                      fullWidth
                      placeholder="e.g. HR-19-AB-1234 / Sonu Driver"
                      value={materialForm.vehicleNo}
                      onChange={(e) => setMaterialForm({ ...materialForm, vehicleNo: e.target.value })}
                    />
                  </Grid>
                </Grid>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Supplier / Bhatta / Shop Name"
                  fullWidth
                  placeholder="e.g. Sharma Building Materials"
                  value={materialForm.supplier}
                  onChange={(e) => setMaterialForm({ ...materialForm, supplier: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Arrival Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={materialForm.date}
                  onChange={(e) => setMaterialForm({ ...materialForm, date: e.target.value })}
                />
              </Grid>
            </Grid>

            {/* Bill Photo Upload */}
            <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 2, textAlign: 'center' }}>
              <input
                type="file"
                accept="image/*,application/pdf"
                id="material-bill-upload"
                style={{ display: 'none' }}
                onChange={(e) => setMaterialBillFile(e.target.files[0])}
              />
              <label htmlFor="material-bill-upload">
                <Button variant="outlined" component="span" startIcon={<UploadIcon />} sx={{ color: '#111', borderColor: '#D4AF37' }}>
                  Upload Challan / Bill Photo
                </Button>
              </label>
              {materialBillFile && (
                <Typography variant="caption" sx={{ color: '#2e7d32', display: 'block', mt: 1, fontWeight: 700 }}>
                  Selected: {materialBillFile.name}
                </Typography>
              )}
            </Box>

            <TextField
              label="Note / Details"
              fullWidth
              placeholder="e.g. 53 grade OPC, delivered for foundation slab"
              value={materialForm.note}
              onChange={(e) => setMaterialForm({ ...materialForm, note: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={() => setMaterialDialogOpen(false)} disabled={savingMaterialExpense} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddMaterialExpense}
            variant="contained"
            disabled={savingMaterialExpense}
            sx={{
              bgcolor: '#111',
              color: '#D4AF37',
              fontWeight: 700,
              '&:hover': { bgcolor: '#222' },
              '&.Mui-disabled': { bgcolor: '#555', color: '#aaa' }
            }}
          >
            {savingMaterialExpense ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} sx={{ color: '#D4AF37' }} />
                <span>Saving Material Entry...</span>
              </Box>
            ) : (
              'Save Material Entry'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: Add Other Site Expense */}
      {/* ========================================================================= */}
      <Dialog open={otherExpenseDialogOpen} onClose={() => setOtherExpenseDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 800 }}>
          Record Site Expense (अन्य खर्चा)
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Expense Category"
                  fullWidth
                  value={otherExpenseForm.category}
                  onChange={(e) => setOtherExpenseForm({ ...otherExpenseForm, category: e.target.value })}
                >
                  <MenuItem value="Labour / Mistri">Labour / Mistri (मजदूरी)</MenuItem>
                  <MenuItem value="Fuel / Diesel">Fuel / Diesel (डीजल / जनरेटर)</MenuItem>
                  <MenuItem value="Machine / JCB Rent">Machine / JCB / Mixer Rent</MenuItem>
                  <MenuItem value="Food & Tea">Food & Tea (चाय पानी)</MenuItem>
                  <MenuItem value="Government / Permit">Government / Permit / Noc</MenuItem>
                  <MenuItem value="Miscellaneous">Miscellaneous (अन्य)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Expense Amount (₹) *"
                  type="number"
                  fullWidth
                  required
                  placeholder="e.g. 2500"
                  value={otherExpenseForm.totalAmount}
                  onChange={(e) => setOtherExpenseForm({ ...otherExpenseForm, totalAmount: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Description (Ye Isme Lge) *"
              multiline
              rows={2}
              fullWidth
              required
              placeholder="e.g. JCB khudaai 3 ghante nim ke liye, or 5 mistri daily wage"
              value={otherExpenseForm.note}
              onChange={(e) => setOtherExpenseForm({ ...otherExpenseForm, note: e.target.value })}
              helperText="Specify exact purpose so client and admin have clear records"
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={otherExpenseForm.date}
                  onChange={(e) => setOtherExpenseForm({ ...otherExpenseForm, date: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Payment Mode"
                  fullWidth
                  value={otherExpenseForm.paymentMode}
                  onChange={(e) => setOtherExpenseForm({ ...otherExpenseForm, paymentMode: e.target.value })}
                >
                  <MenuItem value="Cash">Cash (नकद)</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {/* Bill Photo Upload */}
            <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 2, textAlign: 'center' }}>
              <input
                type="file"
                accept="image/*,application/pdf"
                id="other-bill-upload"
                style={{ display: 'none' }}
                onChange={(e) => setOtherBillFile(e.target.files[0])}
              />
              <label htmlFor="other-bill-upload">
                <Button variant="outlined" component="span" startIcon={<UploadIcon />} sx={{ color: '#111', borderColor: '#D4AF37' }}>
                  Upload Bill / Receipt Slip Photo
                </Button>
              </label>
              {otherBillFile && (
                <Typography variant="caption" sx={{ color: '#2e7d32', display: 'block', mt: 1, fontWeight: 700 }}>
                  Selected: {otherBillFile.name}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={() => setOtherExpenseDialogOpen(false)} disabled={savingOtherExpense} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddOtherExpense}
            variant="contained"
            disabled={savingOtherExpense}
            sx={{
              bgcolor: '#111',
              color: '#D4AF37',
              fontWeight: 700,
              '&:hover': { bgcolor: '#222' },
              '&.Mui-disabled': { bgcolor: '#555', color: '#aaa' }
            }}
          >
            {savingOtherExpense ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} sx={{ color: '#D4AF37' }} />
                <span>Saving Site Expense...</span>
              </Box>
            ) : (
              'Save Site Expense'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* Bill / Document Image Preview Modal */}
      {/* ========================================================================= */}
      <Dialog open={imageModalOpen} onClose={() => setImageModalOpen(false)} maxWidth="md">
        <DialogContent sx={{ p: 1, textAlign: 'center' }}>
          <img src={previewImageUrl} alt="Bill Preview" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageModalOpen(false)}>Close</Button>
          <Button variant="outlined" href={previewImageUrl} target="_blank" rel="noreferrer">Open in New Tab</Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* Edit Steps, Checkpoints & Payment % Schedule Modal */}
      {/* ========================================================================= */}
      <Dialog
        open={stepsDialogOpen}
        onClose={() => setStepsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ bgcolor: '#111', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ListIcon sx={{ color: '#D4AF37' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
                Edit Steps & Payment Milestones (कदम, चेकपॉइंट एवं भुगतान)
              </Typography>
              <Typography variant="caption" sx={{ color: '#bbb' }}>
                Client: {clientData?.name} | Contract: ₹ {Number(clientData?.contractAmount || 0).toLocaleString('en-IN')}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setStepsDialogOpen(false)} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3, bgcolor: '#fbfbfb' }}>
          {/* Header row with Add Step button */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1, mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#555' }}>
              Add/modify project milestones, set expected payment percentage for each phase, and manage sub-checkpoints.
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddStepInDialog}
              sx={{
                bgcolor: '#111',
                color: '#D4AF37',
                fontWeight: 700,
                textTransform: 'none',
                border: '1px solid #D4AF37',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#222' }
              }}
            >
              + Add New Step
            </Button>
          </Box>

          {/* Allocation Status Banner */}
          {(() => {
            const totalPct = editableSteps.reduce((s, x) => s + (Number(x.percentage) || 0), 0);
            const totalAmt = editableSteps.reduce((s, x) => s + (Number(x.amountExpected) || 0), 0);
            return (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 1,
                  p: 1.5,
                  mb: 2.5,
                  bgcolor: totalPct === 100 ? '#e8f5e9' : '#fff8e1',
                  borderRadius: 1.5,
                  border: totalPct === 100 ? '1px solid #a5d6a7' : '1px solid #ffe082'
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: totalPct === 100 ? '#2e7d32' : '#f57f17' }}>
                    Total Payment Allocation: {totalPct}% of 100% {clientData?.contractAmount && `(₹ ${Number(totalAmt).toLocaleString('en-IN')})`}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    Entering step % auto-calculates payment due from the total contract amount.
                  </Typography>
                </Box>
                <Box>
                  {totalPct === 100 ? (
                    <Chip label="✓ Perfect 100% Allocated" size="small" sx={{ bgcolor: '#2e7d32', color: '#fff', fontWeight: 800 }} />
                  ) : totalPct < 100 ? (
                    <Chip label={`Remaining: ${100 - totalPct}%`} size="small" sx={{ bgcolor: '#f57f17', color: '#fff', fontWeight: 800 }} />
                  ) : (
                    <Chip label={`Exceeds 100% by ${totalPct - 100}%`} size="small" sx={{ bgcolor: '#d32f2f', color: '#fff', fontWeight: 800 }} />
                  )}
                </Box>
              </Box>
            );
          })()}

          {/* Steps list */}
          {editableSteps.map((step, sIdx) => (
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
                      onChange={(e) => handleUpdateStepInDialog(sIdx, 'title', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      label="Payment %"
                      type="number"
                      fullWidth
                      size="small"
                      value={step.percentage}
                      onChange={(e) => handleUpdateStepInDialog(sIdx, 'percentage', e.target.value)}
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
                      onChange={(e) => handleUpdateStepInDialog(sIdx, 'amountExpected', e.target.value)}
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
                      Checklist Points / Sub-tasks (जांच बिंदु):
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddPointInDialog(sIdx)}
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
                          onChange={(e) => handleUpdatePointInDialog(sIdx, pIdx, e.target.value)}
                          sx={{ bgcolor: '#fff', '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.8 } }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleDeletePointInDialog(sIdx, pIdx)}
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
                    onClick={() => handleDeleteStepInDialog(sIdx)}
                    disabled={editableSteps.length <= 1}
                    sx={{ textTransform: 'none', fontSize: '0.8rem' }}
                  >
                    Delete Step
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #e0e0e0', justifyContent: 'space-between' }}>
          <Button onClick={() => setStepsDialogOpen(false)} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveSteps}
            variant="contained"
            disabled={savingSteps}
            sx={{
              bgcolor: '#111',
              color: '#D4AF37',
              fontWeight: 700,
              minWidth: 140,
              '&:hover': { bgcolor: '#222' }
            }}
          >
            {savingSteps ? <CircularProgress size={22} sx={{ color: '#D4AF37' }} /> : 'Save Changes (सुरक्षित करें)'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: Add / Edit Labour Worker */}
      {/* ========================================================================= */}
      <Dialog open={workerDialogOpen} onClose={() => !savingWorker && setWorkerDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 800 }}>
          {editingWorker ? 'Edit Worker Details (मजदूर/मिस्त्री संपादन)' : 'Add New Labour / Mistri (नया मजदूर/मिस्त्री जोड़ें)'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="मजदूर / मिस्त्री का नाम (Full Name) *"
              fullWidth
              value={workerForm.name}
              onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
              placeholder="e.g. Ramesh Kumar"
            />

            <TextField
              label="मोबाइल नंबर (Phone Number - WhatsApp)"
              fullWidth
              value={workerForm.phone}
              onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value })}
              placeholder="e.g. 9876543210"
              helperText="इस नंबर पर हाजिरी व भुगतान की WhatsApp रसीद भेजी जा सकेगी"
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="पद / ट्रेड (Role) *"
                  fullWidth
                  value={workerForm.role}
                  onChange={(e) => setWorkerForm({ ...workerForm, role: e.target.value })}
                >
                  {LABOUR_ROLES.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="दैनिक दिहाड़ी (Daily Wage ₹) *"
                  type="number"
                  fullWidth
                  value={workerForm.dailyWage}
                  onChange={(e) => setWorkerForm({ ...workerForm, dailyWage: e.target.value })}
                  placeholder="e.g. 700"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              type="date"
              label="शुरुआत तारीख (Start Date)"
              fullWidth
              value={workerForm.startDate}
              onChange={(e) => setWorkerForm({ ...workerForm, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="टिप्पणी / पता (Notes / Address)"
              multiline
              rows={2}
              fullWidth
              value={workerForm.notes}
              onChange={(e) => setWorkerForm({ ...workerForm, notes: e.target.value })}
              placeholder="जैसे: गांव का नाम, आधार या विशेष हुनर"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={() => setWorkerDialogOpen(false)} disabled={savingWorker} sx={{ color: '#666' }}>
            रद्द करें (Cancel)
          </Button>
          <Button
            onClick={handleSaveWorker}
            variant="contained"
            disabled={savingWorker}
            sx={{
              bgcolor: '#111',
              color: '#D4AF37',
              fontWeight: 700,
              '&:hover': { bgcolor: '#222' }
            }}
          >
            {savingWorker ? <CircularProgress size={20} sx={{ color: '#D4AF37', mr: 1 }} /> : null}
            {editingWorker ? 'अपडेट करें (Update)' : 'सुरक्षित करें (Save Worker)'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: Pay Labour Wage & Send WhatsApp Receipt */}
      {/* ========================================================================= */}
      <Dialog open={payLabourDialogOpen} onClose={() => !savingPayLabour && setPayLabourDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#111', color: '#D4AF37', fontWeight: 800 }}>
          Record Labour Payment (मजदूरी भुगतान करें)
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              select
              label="मजदूर / मिस्त्री चुनें (Select Worker) *"
              fullWidth
              value={payLabourForm.labourId}
              onChange={(e) => {
                const selectedWorker = labourers.find((w) => w._id === e.target.value);
                setPayLabourForm({
                  ...payLabourForm,
                  labourId: e.target.value,
                  amount: selectedWorker && selectedWorker.balanceDue > 0 ? selectedWorker.balanceDue : payLabourForm.amount
                });
              }}
            >
              {labourers.map((w) => (
                <MenuItem key={w._id} value={w._id}>
                  {w.name} ({getRoleInfo(w.role).label}) — बकाया: ₹{Number(w.balanceDue || 0).toLocaleString('en-IN')}
                </MenuItem>
              ))}
            </TextField>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="भुगतान राशि (Amount ₹) *"
                  type="number"
                  fullWidth
                  value={payLabourForm.amount}
                  onChange={(e) => setPayLabourForm({ ...payLabourForm, amount: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  label="भुगतान दिनांक (Payment Date)"
                  fullWidth
                  value={payLabourForm.date}
                  onChange={(e) => setPayLabourForm({ ...payLabourForm, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="भुगतान माध्यम (Mode)"
                  fullWidth
                  value={payLabourForm.paymentMode}
                  onChange={(e) => setPayLabourForm({ ...payLabourForm, paymentMode: e.target.value })}
                >
                  <MenuItem value="Cash">Cash (नकद)</MenuItem>
                  <MenuItem value="UPI">UPI / Online</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer / NEFT</MenuItem>
                  <MenuItem value="Cheque">Cheque</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="संदर्भ / UTR No. (Ref)"
                  fullWidth
                  value={payLabourForm.transactionRef}
                  onChange={(e) => setPayLabourForm({ ...payLabourForm, transactionRef: e.target.value })}
                  placeholder="e.g. UPI Ref / Cheque No"
                />
              </Grid>
            </Grid>

            <TextField
              label="विवरण / टिप्पणी (Notes)"
              multiline
              rows={2}
              fullWidth
              value={payLabourForm.notes}
              onChange={(e) => setPayLabourForm({ ...payLabourForm, notes: e.target.value })}
              placeholder="e.g. साप्ताहिक खर्चा (Weekly Advance / Kharchi)"
            />

            <Paper sx={{ p: 1.5, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 1.5 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={payLabourForm.sendWhatsApp}
                    onChange={(e) => setPayLabourForm({ ...payLabourForm, sendWhatsApp: e.target.checked })}
                    color="success"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WhatsAppIcon sx={{ color: '#25D366', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#166534' }}>
                      भुगतान के बाद मजदूर को WhatsApp पर रसीद भेजें
                    </Typography>
                  </Box>
                }
              />
              <Typography variant="caption" sx={{ color: '#15803d', display: 'block', mt: 0.5, pl: 6 }}>
                सेव होते ही तारीख, समय, राशि व खाता बैलेंस के साथ WhatsApp मैसेज खुल जाएगा।
              </Typography>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={() => setPayLabourDialogOpen(false)} disabled={savingPayLabour} sx={{ color: '#666' }}>
            रद्द करें (Cancel)
          </Button>
          <Button
            onClick={handleSaveLabourPayment}
            variant="contained"
            disabled={savingPayLabour}
            sx={{
              bgcolor: '#2e7d32',
              color: '#fff',
              fontWeight: 700,
              '&:hover': { bgcolor: '#1b5e20' }
            }}
          >
            {savingPayLabour ? <CircularProgress size={20} sx={{ color: '#fff', mr: 1 }} /> : null}
            भुगतान दर्ज करें {payLabourForm.sendWhatsApp ? '& WhatsApp भेजें' : ''}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* Payment Slip Modal Component */}
      {/* ========================================================================= */}
      <PaymentSlipModal
        open={slipModalOpen}
        onClose={() => setSlipModalOpen(false)}
        payment={selectedPaymentForSlip}
        client={clientData}
        totalPaid={totalPaid}
        remainingBalance={balanceDue}
      />

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

export default ClientDetailView;
