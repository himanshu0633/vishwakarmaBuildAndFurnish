import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  CircularProgress, 
  Typography, 
  Breadcrumbs, 
  Link, 
  Tabs, 
  Tab, 
  Modal, 
  IconButton,
  useTheme,
  useMediaQuery,
  Chip,
  Paper,
  Button,
  InputAdornment,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Grid
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FactoryIcon from '@mui/icons-material/Factory';
import GavelIcon from '@mui/icons-material/Gavel';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import MessageIcon from '@mui/icons-material/Message';
import axiosInstance from '../../utils/axiosConfig';
import { motion } from 'framer-motion';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const TendersPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTender, setSelectedTender] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    search: ""
  });
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    company: "",
    message: ""
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  const WHATSAPP_CONFIG = {
    number: "8288081878",
    getUrl: (message) => `https://wa.me/8288081878?text=${message}`
  };

  useEffect(() => {
    fetchAllTenders();
    window.scrollTo(0, 0);
    
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'completed') {
      setActiveTab(1);
    }
  }, [location]);

  const fetchAllTenders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get("/tenders?limit=100");
      
      if (response.data.success) {
        const allTenders = response.data.data;
        setTenders(allTenders);
        
        const uniqueCategories = [...new Set(allTenders.map(t => t.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } else {
        setError("Failed to fetch tenders");
      }
    } catch (err) {
      console.error("Error fetching tenders:", err);
      setError(err.response?.data?.message || "Failed to load tenders");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTenders = () => {
    let filtered = tenders;
    
    if (activeTab === 0) {
      filtered = filtered.filter(t => t.status === "open");
    } else if (activeTab === 1) {
      filtered = filtered.filter(t => t.status === "awarded" || t.status === "closed");
    }
    
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }
    
    if (filters.search) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredTenders = getFilteredTenders();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setFilters({ category: "", search: "" });
  };

  const handleTenderClick = (tender) => {
    setSelectedTender(tender);
    setShowModal(true);
    setShowInquiryForm(false);
    setShowFullDescription(false);
    setShowSuccess(false);
    setFormErrors({});
  };

  const handleInquiryClick = () => {
    setShowInquiryForm(true);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ""
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Full Name is required";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone Number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    } else if (formData.address.trim().length < 5) {
      errors.address = "Please enter a valid address (minimum 5 characters)";
    }
    
    return errors;
  };

  const handleDownloadPDF = async (tenderId) => {
    try {
      const response = await axiosInstance.get(`/tenders/${tenderId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tender-${tenderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const handleSubmitInquiry = async () => {
    if (!selectedTender) return;
    
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      await axiosInstance.post("/inquiries", {
        serviceId: selectedTender._id,
        customerName: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        message: `Tender Inquiry - ${selectedTender.title}\nCompany: ${formData.company.trim() || "Not specified"}\n\n${formData.message.trim()}`
      });

      const message = `*TENDER INQUIRY DETAILS*%0A%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `*TENDER INFORMATION*%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `*Title:* ${selectedTender.title || "N/A"}%0A` +
        `*Category:* ${selectedTender.category || "N/A"}%0A` +
        `*Location:* ${selectedTender.location || "N/A"}%0A` +
        `*Budget:* ${selectedTender.budget || "N/A"}%0A` +
        `*Deadline:* ${new Date(selectedTender.deadline).toLocaleDateString() || "N/A"}%0A` +
        `*Status:* ${selectedTender.status === "open" ? "Open" : "Completed"}%0A` +
        `*Description:* ${selectedTender.description || "N/A"}%0A%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `*INQUIRY DETAILS*%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `*Name:* ${formData.name.trim()}%0A` +
        `*Phone:* ${formData.phone.trim()}%0A` +
        `*Email:* ${formData.email.trim()}%0A` +
        `*Address:* ${formData.address.trim()}%0A` +
        `*Company:* ${formData.company.trim() || "Not specified"}%0A` +
        `*Message:* ${formData.message.trim() || "No additional message"}`;

      const whatsappUrl = WHATSAPP_CONFIG.getUrl(encodeURIComponent(message));
      window.open(whatsappUrl, "_blank");
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setShowInquiryForm(false);
        setSelectedTender(null);
        setShowSuccess(false);
      }, 1500);
      
      setFormData({
        name: "",
        email: "",
        address: "",
        phone: "",
        company: "",
        message: ""
      });
      setFormErrors({});
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      alert(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowInquiryForm(false);
    setSelectedTender(null);
    setShowFullDescription(false);
    setFormErrors({});
    setShowSuccess(false);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "open":
        return { bg: "rgba(46,204,113,0.2)", color: "#2ecc71", text: "Open" };
      case "awarded":
        return { bg: "rgba(52,152,219,0.2)", color: "#3498db", text: "Awarded" };
      case "closed":
        return { bg: "rgba(231,76,60,0.2)", color: "#e74c3c", text: "Closed" };
      default:
        return { bg: "rgba(149,165,166,0.2)", color: "#95a5a6", text: status };
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        sx={{
          background: "linear-gradient(135deg, #111111 0%, #0F172A 100%)"
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GavelIcon sx={{ fontSize: 60, color: '#D4AF37', mb: 2 }} />
          <CircularProgress size={60} thickness={4} sx={{ color: '#D4AF37' }} />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: 'hidden', background: "linear-gradient(135deg, #111111 0%, #0F172A 50%, #1A1A1A 100%)", minHeight: '100vh' }}>
      {/* Hero Section - Industrial Theme */}
      <Box 
        sx={{
          background: "linear-gradient(135deg, #111111 0%, #0F172A 50%, #1A1A1A 100%)",
          py: { xs: 8, sm: 10, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Industrial Background Elements */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          pointerEvents: 'none'
        }}>
          <Box sx={{
            position: 'absolute',
            top: '15%',
            left: '5%',
            animation: 'rotate 45s linear infinite'
          }}>
            <EngineeringIcon sx={{ fontSize: 180 }} />
          </Box>
          <Box sx={{
            position: 'absolute',
            bottom: '10%',
            right: '8%',
            animation: 'rotateReverse 40s linear infinite'
          }}>
            <FactoryIcon sx={{ fontSize: 200 }} />
          </Box>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '80%',
            animation: 'rotate 35s linear infinite'
          }}>
            <GavelIcon sx={{ fontSize: 150 }} />
          </Box>
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Chip
                icon={<GavelIcon />}
                label="Industrial Tenders"
                sx={{
                  bgcolor: "rgba(212,175,55,0.2)",
                  color: "#D4AF37",
                  mb: 2,
                  '& .MuiChip-icon': { color: "#D4AF37" }
                }}
              />
              <Typography 
                variant="h1" 
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                  fontWeight: 'bold',
                  background: "linear-gradient(135deg, #fff, #D4AF37)",
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 2
                }}
              >
                Tenders & Opportunities
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.125rem' },
                  color: 'rgba(245,245,245,0.8)',
                  maxWidth: '600px',
                  mx: 'auto',
                  mb: 4
                }}
              >
                Explore open industrial tenders and business opportunities. Submit your bids and grow your business.
              </Typography>
              
              <Breadcrumbs 
                aria-label="breadcrumb" 
                sx={{ 
                  justifyContent: 'center',
                  '& .MuiBreadcrumbs-ol': { justifyContent: 'center' }
                }}
              >
                <Link 
                  component={RouterLink} 
                  to="/" 
                  title="Home"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'rgba(245,245,245,0.7)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': { color: '#D4AF37' }
                  }}
                >
                  <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
                  Home
                </Link>
                <Typography sx={{ color: '#D4AF37', fontSize: '0.875rem' }}>
                  Tenders
                </Typography>
              </Breadcrumbs>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3, md: 4 } }}>
        
        {/* Tabs - Industrial Theme */}
        <Box sx={{ mb: 4, borderBottom: '2px solid rgba(212,175,55,0.3)' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: 500,
                color: 'rgba(245,245,245,0.7)'
              },
              '& .Mui-selected': { color: '#D4AF37' },
              '& .MuiTabs-indicator': { backgroundColor: '#D4AF37', height: 3 }
            }}
          >
            <Tab 
              icon={<ScheduleIcon />} 
              label="Active Tenders" 
              iconPosition="start"
            />
            <Tab 
              icon={<CheckCircleIcon />} 
              label="Completed Tenders" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Filters - Industrial Theme */}
        <Paper sx={{
          mb: 4,
          p: 2,
          background: 'rgba(245,245,245,0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          border: '1px solid rgba(212,175,55,0.2)'
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Box sx={{ flex: 2, minWidth: { xs: '100%', sm: '200px' } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by title, description or location..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#D4AF37' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                    '&:hover fieldset': { borderColor: '#D4AF37' },
                    '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                  }
                }}
              />
            </Box>
            
            <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'rgba(245,245,245,0.7)' }}>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  label="Category"
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212,175,55,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D4AF37' },
                    '& .MuiSvgIcon-root': { color: '#D4AF37' }
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {(filters.search || filters.category) && (
              <Button
                variant="outlined"
                onClick={() => setFilters({ category: "", search: "" })}
                sx={{
                  borderColor: '#D4AF37',
                  color: '#D4AF37',
                  '&:hover': { borderColor: '#B88917', background: 'rgba(212,175,55,0.1)' }
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </Paper>

        {/* Stats - Industrial Theme */}
        <Box sx={{ mb: 5 }}>
          <Paper sx={{
            background: 'linear-gradient(135deg, #D4AF37, #B88917)',
            borderRadius: 3,
            p: 3,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(245,245,245,0.1), transparent)',
              transform: 'translateX(-100%)',
              animation: 'gradientShift 4s ease-in-out infinite',
              pointerEvents: 'none'
            }} />
            <Typography sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, fontWeight: 'bold', color: 'white', mb: 1 }}>
              {filteredTenders.length}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'rgba(245,245,245,0.9)' }}>
              {activeTab === 0 ? "Active Industrial Tenders" : "Completed Tenders"}
            </Typography>
          </Paper>
        </Box>

        {/* Tenders Grid - Industrial Theme */}
        {filteredTenders.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <Grid container spacing={3}>
              {filteredTenders.map((tender, idx) => {
                const statusInfo = getStatusColor(tender.status);
                return (
                  <Grid item xs={12} sm={6} md={4} key={tender._id}>
                    <motion.div
                      variants={fadeInUp}
                      whileHover={{ y: -8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => handleTenderClick(tender)}
                    >
                      <Paper
                        elevation={0}
                        onMouseEnter={() => setHoveredCard(idx)}
                        onMouseLeave={() => setHoveredCard(null)}
                        sx={{
                          p: 3,
                          borderRadius: '20px',
                          transition: 'all 0.3s ease',
                          background: 'rgba(245,245,245,0.05)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(212,175,55,0.2)',
                          cursor: 'pointer',
                          height: '100%',
                          width: '500px',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            borderColor: '#D4AF37',
                            boxShadow: '0 10px 30px rgba(212,175,55,0.2)'
                          }
                        }}
                      >
                        {/* PDF Badge */}
                        {tender.pdf && (
                          <Box sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1,
                            py: 0.5,
                            borderRadius: '20px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            zIndex: 1
                          }}>
                            <PictureAsPdfIcon sx={{ fontSize: 14 }} />
                            <span>PDF</span>
                          </Box>
                        )}
                        
                        {/* Status Badge */}
                        <Box sx={{
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 500,
                          width: 'fit-content',
                          mb: 1.5,
                          background: statusInfo.bg,
                          color: statusInfo.color
                        }}>
                          {statusInfo.text}
                        </Box>
                        
                        {/* Title */}
                        <Typography sx={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: '#fff',
                          mb: 1,
                          lineHeight: 1.4,
                          pr: 5
                        }}>
                          {truncateText(tender.title, 60)}
                        </Typography>

                        {/* Category */}
                        <Typography sx={{
                          background: 'linear-gradient(135deg, #D4AF37, #B88917)',
                          color: '#fff',
                          fontSize: '11px',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '20px',
                          display: 'inline-block',
                          width: 'fit-content',
                          mb: 1.5
                        }}>
                          {tender.category}
                        </Typography>

                        {/* Description */}
                        <Typography sx={{
                          fontSize: '12px',
                          color: 'rgba(245,245,245,0.7)',
                          lineHeight: 1.5,
                          mb: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {truncateText(tender.description, 80)}
                        </Typography>

                        {/* Location */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <LocationOnIcon sx={{ fontSize: 14, color: '#D4AF37' }} />
                          <Typography sx={{ fontSize: '12px', color: 'rgba(245,245,245,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {truncateText(tender.location, 40)}
                          </Typography>
                        </Box>

                        {/* Budget */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <AttachMoneyIcon sx={{ fontSize: 14, color: '#D4AF37' }} />
                          <Typography sx={{ fontSize: '13px', fontWeight: 'bold', color: '#D4AF37' }}>
                            {tender.budget}
                          </Typography>
                        </Box>

                        {/* Deadline */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <CalendarTodayIcon sx={{ fontSize: 14, color: '#D4AF37' }} />
                          <Typography sx={{ fontSize: '12px', color: 'rgba(245,245,245,0.6)' }}>
                            Deadline: {new Date(tender.deadline).toLocaleDateString()}
                          </Typography>
                        </Box>

                        {/* Inquiry Button */}
                        {tender.status === "open" ? (
                          <Button
                            fullWidth
                            variant="contained"
                            sx={{
                              mt: 2,
                              background: 'linear-gradient(135deg, #D4AF37, #B88917)',
                              borderRadius: '30px',
                              textTransform: 'none',
                              fontWeight: 600,
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 5px 15px rgba(212,175,55,0.4)'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Submit Quote →
                          </Button>
                        ) : (
                          <Box sx={{
                            mt: 2,
                            p: 1,
                            background: 'rgba(245,245,245,0.05)',
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontSize: '11px',
                            color: 'rgba(245,245,245,0.5)'
                          }}>
                            This tender is no longer accepting bids
                          </Box>
                        )}
                      </Paper>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          </motion.div>
        ) : (
          <Box sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
            background: 'rgba(245,245,245,0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(212,175,55,0.2)'
          }}>
            <GavelIcon sx={{ fontSize: 64, color: '#D4AF37', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>No tenders found</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(245,245,245,0.6)' }}>
              {activeTab === 0 
                ? "There are no active tenders at the moment. Please check back later." 
                : "No completed tenders available."}
            </Typography>
          </Box>
        )}
      </Container>

      {/* Modal Popup - Industrial Theme */}
      <Modal
        open={showModal}
        onClose={handleCloseModal}
        sx={{ '& .MuiBackdrop-root': { backdropFilter: 'blur(4px)' } }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '90%', md: '550px' },
          maxWidth: '550px',
          maxHeight: '90vh',
          overflowY: 'auto',
          outline: 'none',
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'rgba(245,245,245,0.1)', borderRadius: '10px' },
          '&::-webkit-scrollbar-thumb': { background: '#D4AF37', borderRadius: '10px' }
        }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #0F172A, #111111)',
            borderRadius: '24px',
            p: { xs: 3, sm: 4 },
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '1px solid rgba(212,175,55,0.3)'
          }}>
            <IconButton 
              onClick={handleCloseModal}
              sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                color: '#fff', 
                background: 'rgba(0,0,0,0.3)', 
                '&:hover': { background: 'rgba(212,175,55,0.5)' } 
              }}
            >
              <CloseIcon />
            </IconButton>
            
            {showSuccess ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <Typography sx={{ fontSize: 40 }}>✓</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                  Inquiry Sent Successfully!
                </Typography>
                <Typography sx={{ color: 'rgba(245,245,245,0.7)' }}>
                  Redirecting to WhatsApp...
                </Typography>
              </Box>
            ) : !showInquiryForm ? (
              <>
                {selectedTender?.pdf && (
                  <Button
                    onClick={() => handleDownloadPDF(selectedTender._id)}
                    startIcon={<PictureAsPdfIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                      color: 'white',
                      mb: 2,
                      borderRadius: '30px',
                      textTransform: 'none',
                      '&:hover': { transform: 'scale(1.02)' },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Download Tender Document (PDF)
                  </Button>
                )}
                
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#D4AF37', mb: 1.5 }}>
                  {selectedTender?.title}
                </Typography>
                <Chip
                  label={`Category: ${selectedTender?.category}`}
                  sx={{
                    background: 'rgba(212,175,55,0.2)',
                    color: '#D4AF37',
                    mb: 2.5
                  }}
                />
                
                <Box sx={{ background: 'rgba(245,245,245,0.05)', p: 2, borderRadius: '12px', mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#D4AF37' }}>📍 Location:</Typography>
                    <Typography sx={{ color: '#fff' }}>{selectedTender?.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#D4AF37' }}>💰 Budget:</Typography>
                    <Typography sx={{ color: '#D4AF37', fontWeight: 'bold' }}>{selectedTender?.budget}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#D4AF37' }}>⏰ Deadline:</Typography>
                    <Typography sx={{ color: '#fff' }}>
                      {selectedTender?.deadline && new Date(selectedTender.deadline).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#D4AF37' }}>📊 Status:</Typography>
                    <Chip
                      label={selectedTender?.status === "open" ? "Open for Bids" : selectedTender?.status === "awarded" ? "Awarded" : "Closed"}
                      size="small"
                      sx={{
                        background: selectedTender?.status === "open" ? 'rgba(46,204,113,0.2)' : selectedTender?.status === "awarded" ? 'rgba(52,152,219,0.2)' : 'rgba(231,76,60,0.2)',
                        color: selectedTender?.status === "open" ? '#2ecc71' : selectedTender?.status === "awarded" ? '#3498db' : '#e74c3c'
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2.5 }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#D4AF37', mb: 1 }}>📄 Tender Description:</Typography>
                  <Box sx={{ background: 'rgba(245,245,245,0.03)', p: 2, borderRadius: '12px' }}>
                    <Typography sx={{ fontSize: '13px', color: 'rgba(245,245,245,0.8)', lineHeight: 1.6 }}>
                      {showFullDescription || !selectedTender?.description ? (
                        selectedTender?.description || "No description available"
                      ) : (
                        <>
                          {truncateText(selectedTender?.description, 200)}
                          {selectedTender?.description?.length > 200 && (
                            <Button
                              size="small"
                              onClick={() => setShowFullDescription(true)}
                              sx={{ color: '#D4AF37', ml: 1, textTransform: 'none' }}
                            >
                              Read more
                            </Button>
                          )}
                        </>
                      )}
                      {showFullDescription && selectedTender?.description?.length > 200 && (
                        <Button
                          size="small"
                          onClick={() => setShowFullDescription(false)}
                          sx={{ color: '#D4AF37', mt: 1, textTransform: 'none', display: 'block' }}
                        >
                          Show less
                        </Button>
                      )}
                    </Typography>
                  </Box>
                </Box>

                {selectedTender?.status === "open" && (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<WhatsAppIcon />}
                    onClick={handleInquiryClick}
                    sx={{
                      background: 'linear-gradient(135deg, #25D366, #128C7E)',
                      borderRadius: '30px',
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&:hover': { transform: 'scale(1.02)' },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Send Inquiry on WhatsApp
                  </Button>
                )}
              </>
            ) : (
              <>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#D4AF37', mb: 1 }}>
                  Submit Inquiry
                </Typography>
                <Typography sx={{ fontSize: '13px', color: 'rgba(245,245,245,0.7)', mb: 3 }}>
                  For Tender: {truncateText(selectedTender?.title, 50)}
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    name="name"
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#D4AF37' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                        '&:hover fieldset': { borderColor: '#D4AF37' },
                        '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                      }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={!!formErrors.phone}
                    helperText={formErrors.phone}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: '#D4AF37' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                        '&:hover fieldset': { borderColor: '#D4AF37' },
                        '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                      }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    name="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#D4AF37' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                        '&:hover fieldset': { borderColor: '#D4AF37' },
                        '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                      }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    name="address"
                    placeholder="Your Address *"
                    value={formData.address}
                    onChange={handleInputChange}
                    error={!!formErrors.address}
                    helperText={formErrors.address}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ color: '#D4AF37' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                        '&:hover fieldset': { borderColor: '#D4AF37' },
                        '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                      }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    name="company"
                    placeholder="Company Name (Optional)"
                    value={formData.company}
                    onChange={handleInputChange}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon sx={{ color: '#D4AF37' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                        '&:hover fieldset': { borderColor: '#D4AF37' },
                        '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                      }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    name="message"
                    placeholder="Additional Message (Optional)"
                    value={formData.message}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MessageIcon sx={{ color: '#D4AF37' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                        '&:hover fieldset': { borderColor: '#D4AF37' },
                        '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                      }
                    }}
                  />
                  
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmitInquiry}
                    disabled={submitting}
                    startIcon={<WhatsAppIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #25D366, #128C7E)',
                      borderRadius: '30px',
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&:hover': { transform: 'scale(1.02)' },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit & Send to WhatsApp'}
                  </Button>
                  
                  <Button
                    onClick={() => setShowInquiryForm(false)}
                    sx={{
                      color: '#fff',
                      border: '1px solid rgba(212,175,55,0.3)',
                      '&:hover': { background: 'rgba(245,245,245,0.1)' }
                    }}
                  >
                    Back to Tender Details
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Modal>

      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes rotateReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes gradientShift {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </Box>
  );
};

export default TendersPage;