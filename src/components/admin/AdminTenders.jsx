import React, { useState, useEffect } from "react";
import {
  Modal,
  IconButton,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  InputAdornment,
  OutlinedInput
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  Add as AddIcon,
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import axiosInstance from "../../../utils/axiosConfig";
import { getCategoryName } from "../../utils/catalogSchema";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const AdminTenders = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedTender, setSelectedTender] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    category: "",
    search: ""
  });
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    services: [], // Changed to array for multi-select
    description: "",
    location: "",
    budget: "",
    deadline: "",
    status: "open",
    pdf: null
  });

  useEffect(() => {
    fetchTenders();
    fetchCategories();
    fetchServices();
  }, []);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/tenders");
      
      if (response.data.success) {
        setTenders(response.data.data);
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

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      if (response.data.success && response.data.data) {
        const categoryNames = response.data.data.map(cat => getCategoryName(cat));
        setCategories(categoryNames);
        console.log("Categories loaded:", categoryNames);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      if (tenders.length > 0) {
        const uniqueCategories = [...new Set(tenders.map(t => t.category).filter(cat => cat))];
        setCategories(uniqueCategories);
      }
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get("/services");
      if (response.data.success && response.data.data) {
        setServices(response.data.data);
        console.log("Services loaded:", response.data.data);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  // Get services filtered by selected category
  const getServicesByCategory = () => {
    if (!formData.category) return [];
    return services.filter(service => 
      service.categoryId && service.categoryId.category === formData.category
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset services when category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        services: []
      }));
    }
  };

  const handleServicesChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      services: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData(prev => ({
        ...prev,
        pdf: file
      }));
    } else {
      setError("Please select a valid PDF file");
    }
  };

  const handleCreateClick = () => {
    setModalMode("create");
    setFormData({
      title: "",
      category: "",
      services: [],
      description: "",
      location: "",
      budget: "",
      deadline: "",
      status: "open",
      pdf: null
    });
    setSelectedTender(null);
    setOpenModal(true);
  };

 const handleEditClick = (tender) => {
  setModalMode("edit");
  setSelectedTender(tender);
  
  // Extract service IDs from populated services or direct array
  let serviceIds = [];
  if (tender.services && Array.isArray(tender.services)) {
    serviceIds = tender.services.map(s => {
      // If service is populated (has _id property)
      if (s._id) return s._id;
      // If service is just the ID string
      return s;
    });
  }
  
  console.log("Editing tender - services:", serviceIds);
  
  setFormData({
    title: tender.title,
    category: tender.category,
    services: serviceIds,
    description: tender.description,
    location: tender.location,
    budget: tender.budget,
    deadline: tender.deadline ? tender.deadline.split('T')[0] : "",
    status: tender.status,
    pdf: null
  });
  setOpenModal(true);
};

  const handleSubmit = async () => {
  if (!formData.title || !formData.category || !formData.description || 
      !formData.location || !formData.budget || !formData.deadline) {
    setError("Please fill in all required fields");
    return;
  }

  setSubmitting(true);
  setError(null);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("category", formData.category);
    
    // Send services as JSON string
    if (formData.services && formData.services.length > 0) {
      // Send as JSON string to avoid issues with FormData
      formDataToSend.append("services", JSON.stringify(formData.services));
    } else {
      formDataToSend.append("services", JSON.stringify([]));
    }
    
    formDataToSend.append("description", formData.description);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("budget", formData.budget);
    formDataToSend.append("deadline", formData.deadline);
    
    if (modalMode === "create") {
      formDataToSend.append("status", formData.status);
    }
    
    if (formData.pdf) {
      formDataToSend.append("pdf", formData.pdf);
    }

    // Log the services being sent for debugging
    console.log("Sending services:", formData.services);
    console.log("Services as JSON string:", JSON.stringify(formData.services));

    let response;
    if (modalMode === "create") {
      response = await axiosInstance.post("/tenders", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.data.success) {
        setSuccess("Tender created successfully!");
      }
    } else {
      response = await axiosInstance.put(`/tenders/${selectedTender._id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.data.success) {
        setSuccess("Tender updated successfully!");
      }
    }

    fetchTenders();
    setOpenModal(false);
  } catch (err) {
    console.error("Error submitting tender:", err);
    setError(err.response?.data?.message || "Failed to submit tender");
  } finally {
    setSubmitting(false);
  }
};

  const handleStatusUpdate = async (tenderId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/tenders/${tenderId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        setSuccess(`Tender status updated to ${newStatus}`);
        fetchTenders();
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (tenderId) => {
    if (window.confirm("Are you sure you want to delete this tender?")) {
      try {
        const response = await axiosInstance.delete(`/tenders/${tenderId}`);
        
        if (response.data.success) {
          setSuccess("Tender deleted successfully!");
          fetchTenders();
        }
      } catch (err) {
        console.error("Error deleting tender:", err);
        setError(err.response?.data?.message || "Failed to delete tender");
      }
    }
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
      setError("Failed to download PDF");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "open":
        return { bg: "rgba(46,204,113,0.2)", color: "#2ecc71", label: "Open" };
      case "awarded":
        return { bg: "rgba(52,152,219,0.2)", color: "#3498db", label: "Awarded" };
      case "closed":
        return { bg: "rgba(231,76,60,0.2)", color: "#e74c3c", label: "Closed" };
      default:
        return { bg: "rgba(149,165,166,0.2)", color: "#95a5a6", label: status };
    }
  };

  const filteredTenders = tenders.filter(tender => {
    let matches = true;
    if (filters.status !== "all" && tender.status !== filters.status) matches = false;
    if (filters.category && tender.category !== filters.category) matches = false;
    if (filters.search && !tender.title.toLowerCase().includes(filters.search.toLowerCase())) matches = false;
    return matches;
  });

  // Get service names by IDs
  const getServiceNames = (serviceIds) => {
    if (!serviceIds || !Array.isArray(serviceIds)) return [];
    return serviceIds.map(serviceId => {
      const service = services.find(s => s._id === serviceId);
      return service ? service.name : null;
    }).filter(name => name);
  };

  if (loading && tenders.length === 0) {
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
          <PdfIcon sx={{ fontSize: 60, color: "#D4AF37", mr: 2 }} />
        </motion.div>
        <CircularProgress size={50} sx={{ color: '#D4AF37' }} />
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{
              fontWeight: 'bold',
              background: "linear-gradient(135deg, #fff, #D4AF37)",
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 1
            }}>
              Tenders Management
            </Typography>
            <Typography sx={{ color: 'rgba(245,245,245,0.7)' }}>
              Create, manage and track all industrial tenders
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
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
            Create New Tender
          </Button>
        </Box>

        {/* Filters */}
        <Paper sx={{
          mb: 3,
          p: 2,
          background: 'rgba(245,245,245,0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          border: '1px solid rgba(212,175,55,0.2)'
        }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 2, minWidth: 200 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by title..."
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
            <Box sx={{ flex: 1, minWidth: 150 }}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'rgba(245,245,245,0.7)' }}>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  label="Status"
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212,175,55,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D4AF37' },
                    '& .MuiSvgIcon-root': { color: '#D4AF37' }
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="awarded">Awarded</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1, minWidth: 150 }}>
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
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button
              variant="outlined"
              onClick={() => setFilters({ status: "all", category: "", search: "" })}
              sx={{
                borderColor: '#D4AF37',
                color: '#D4AF37',
                '&:hover': { borderColor: '#B88917', background: 'rgba(212,175,55,0.1)' }
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Paper>

        {/* Tenders Table */}
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
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Services</TableCell>
                {!isMobile && <TableCell>Location</TableCell>}
                <TableCell>Budget</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>PDF</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTenders.length > 0 ? (
                filteredTenders.map((tender, idx) => {
                  const statusStyle = getStatusColor(tender.status);
                  const serviceNames = getServiceNames(tender.services);
                  return (
                    <motion.tr
                      key={tender._id}
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
                        <Typography sx={{ color: '#fff', fontWeight: 500, mb: 0.5 }}>
                          {tender.title}
                        </Typography>
                        {!isMobile && (
                          <Typography sx={{ color: 'rgba(245,245,245,0.6)', fontSize: '0.75rem' }}>
                            {tender.description?.substring(0, 60)}...
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tender.category}
                          size="small"
                          sx={{
                            background: 'rgba(212,175,55,0.2)',
                            color: '#D4AF37',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {serviceNames.map((name, i) => (
                            <Chip
                              key={i}
                              label={name}
                              size="small"
                              sx={{
                                background: 'rgba(52,152,219,0.2)',
                                color: '#3498db',
                                fontSize: '0.7rem'
                              }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationIcon sx={{ fontSize: 14, color: '#D4AF37' }} />
                            <Typography sx={{ color: 'rgba(245,245,245,0.8)' }}>{tender.location}</Typography>
                          </Box>
                        </TableCell>
                      )}
                      <TableCell>
                        <Typography sx={{ color: '#D4AF37', fontWeight: 'bold' }}>
                          {tender.budget}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarIcon sx={{ fontSize: 14, color: '#D4AF37' }} />
                          <Typography sx={{ color: 'rgba(245,245,245,0.8)', fontSize: '0.85rem' }}>
                            {new Date(tender.deadline).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" fullWidth>
                          <Select
                            value={tender.status}
                            onChange={(e) => handleStatusUpdate(tender._id, e.target.value)}
                            sx={{
                              background: statusStyle.bg,
                              color: statusStyle.color,
                              fontSize: '0.75rem',
                              height: 32,
                              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                              '& .MuiSvgIcon-root': { color: statusStyle.color }
                            }}
                          >
                            <MenuItem value="open">Open</MenuItem>
                            <MenuItem value="awarded">Awarded</MenuItem>
                            <MenuItem value="closed">Closed</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        {tender.pdf && (
                          <Button
                            size="small"
                            onClick={() => handleDownloadPDF(tender._id)}
                            sx={{
                              color: '#f44336',
                              '&:hover': { background: 'rgba(244,67,54,0.1)' }
                            }}
                          >
                            <PdfIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            PDF
                          </Button>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(tender)}
                          sx={{ color: '#D4AF37', '&:hover': { background: 'rgba(212,175,55,0.2)' } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(tender._id)}
                          sx={{ '&:hover': { background: 'rgba(244,67,54,0.2)' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </motion.tr>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ color: 'rgba(245,245,245,0.7)' }}>
                      No tenders found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Create/Edit Modal */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          sx={{ '& .MuiBackdrop-root': { backdropFilter: 'blur(4px)' } }}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: '700px' },
            maxWidth: '700px',
            maxHeight: '90vh',
            overflowY: 'auto',
            outline: 'none',
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'rgba(245,245,245,0.1)', borderRadius: '10px' },
            '&::-webkit-scrollbar-thumb': { background: '#D4AF37', borderRadius: '10px' }
          }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #0F172A, #111111)',
              borderRadius: 3,
              border: '1px solid rgba(212,175,55,0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2.5,
                borderBottom: '1px solid rgba(212,175,55,0.3)'
              }}>
                <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold' }}>
                  {modalMode === "create" ? "Create New Tender" : "Edit Tender"}
                </Typography>
                <IconButton onClick={() => setOpenModal(false)} sx={{ color: '#fff' }}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box sx={{ p: 3 }}>
                <TextField
                  fullWidth
                  label="Title *"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  margin="normal"
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

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel sx={{ color: 'rgba(245,245,245,0.7)' }}>Category *</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      label="Category *"
                      sx={{
                        color: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212,175,55,0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D4AF37' },
                        '& .MuiSvgIcon-root': { color: '#D4AF37' }
                      }}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal" disabled={!formData.category}>
                    <InputLabel sx={{ color: 'rgba(245,245,245,0.7)' }}>
                      Services {!formData.category && "(Select category first)"}
                    </InputLabel>
                    <Select
                      multiple
                      name="services"
                      value={formData.services}
                      onChange={handleServicesChange}
                      input={<OutlinedInput label="Services" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((serviceId) => {
                            const service = services.find(s => s._id === serviceId);
                            return service ? (
                              <Chip
                                key={serviceId}
                                label={service.name}
                                size="small"
                                sx={{
                                  background: 'rgba(212,175,55,0.2)',
                                  color: '#D4AF37'
                                }}
                              />
                            ) : null;
                          })}
                        </Box>
                      )}
                      sx={{
                        color: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212,175,55,0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D4AF37' },
                        '& .MuiSvgIcon-root': { color: '#D4AF37' }
                      }}
                    >
                      {getServicesByCategory().map((service) => (
                        <MenuItem key={service._id} value={service._id}>
                          {service.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Location *"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon sx={{ color: '#D4AF37' }} />
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
                    label="Budget *"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon sx={{ color: '#D4AF37' }} />
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
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Deadline *"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon sx={{ color: '#D4AF37' }} />
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

                  {modalMode === "create" && (
                    <FormControl fullWidth margin="normal">
                      <InputLabel sx={{ color: 'rgba(245,245,245,0.7)' }}>Status</InputLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        label="Status"
                        sx={{
                          color: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212,175,55,0.3)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D4AF37' },
                          '& .MuiSvgIcon-root': { color: '#D4AF37' }
                        }}
                      >
                        <MenuItem value="open">Open</MenuItem>
                        <MenuItem value="awarded">Awarded</MenuItem>
                        <MenuItem value="closed">Closed</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Box>

                <TextField
                  fullWidth
                  label="Description *"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  margin="normal"
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

                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ color: 'rgba(245,245,245,0.7)', mb: 1, fontSize: '14px' }}>
                    PDF Document {modalMode === "edit" && "(Optional - Leave empty to keep existing)"}
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    sx={{
                      borderColor: '#D4AF37',
                      color: '#D4AF37',
                      '&:hover': { borderColor: '#B88917', background: 'rgba(212,175,55,0.1)' }
                    }}
                  >
                    Choose PDF File
                    <input type="file" accept=".pdf" hidden onChange={handleFileChange} />
                  </Button>
                  {formData.pdf && (
                    <Typography sx={{ color: '#2ecc71', mt: 1, fontSize: '12px' }}>
                      Selected: {formData.pdf.name}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                p: 2.5,
                borderTop: '1px solid rgba(212,175,55,0.3)'
              }}>
                <Button
                  onClick={() => setOpenModal(false)}
                  sx={{ color: 'rgba(245,245,245,0.7)', '&:hover': { color: '#fff' } }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting}
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
                  {submitting ? <CircularProgress size={20} color="inherit" /> : (modalMode === "create" ? "Create Tender" : "Update Tender")}
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>

        {/* Snackbar */}
        <Snackbar
          open={!!success || !!error}
          autoHideDuration={6000}
          onClose={() => { setSuccess(null); setError(null); }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity={success ? "success" : "error"}
            onClose={() => { setSuccess(null); setError(null); }}
            sx={{
              background: success
                ? 'linear-gradient(135deg, #0F172A, #111111)'
                : 'linear-gradient(135deg, #4a0e0e, #2a0a0a)',
              color: '#fff',
              border: `1px solid ${success ? '#2ecc71' : '#e74c3c'}`,
              '& .MuiAlert-icon': {
                color: success ? '#2ecc71' : '#e74c3c'
              }
            }}
          >
            {success || error}
          </Alert>
        </Snackbar>
      </Box>
    </motion.div>
  );
};

export default AdminTenders;
