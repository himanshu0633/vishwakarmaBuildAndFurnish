import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  Message as MessageIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  ContactPhone as ContactPhoneIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axiosConfig';
import { getCategoryName } from '../../utils/catalogSchema';

const InquiriesManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      let url = '/inquiries';
      
      if (filter !== 'all') {
        url = `/inquiries?status=${filter}`;
      }
      
      const response = await axiosInstance.get(url);
      console.log("Inquiries API Response:", response.data);
      
      if (response.data.success && Array.isArray(response.data.data)) {
        setInquiries(response.data.data);
      } else {
        setInquiries([]);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await axiosInstance.put(`/inquiries/${id}/status`, { status });
      
      if (response.data.success) {
        fetchInquiries();
        setOpenDetails(false);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: 'rgba(212,175,55,0.2)', color: '#D4AF37', icon: <PendingIcon sx={{ fontSize: 14 }} /> };
      case 'contacted': return { bg: 'rgba(52,152,219,0.2)', color: '#3498db', icon: <ContactPhoneIcon sx={{ fontSize: 14 }} /> };
      case 'completed': return { bg: 'rgba(46,204,113,0.2)', color: '#2ecc71', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> };
      case 'cancelled': return { bg: 'rgba(231,76,60,0.2)', color: '#e74c3c', icon: <CancelIcon sx={{ fontSize: 14 }} /> };
      default: return { bg: 'rgba(149,165,166,0.2)', color: '#95a5a6', icon: null };
    }
  };

  const getStatusCount = (status) => {
    if (status === 'all') return inquiries.length;
    return inquiries.filter(i => i.status === status).length;
  };

  const statusTabs = [
    { label: 'All', value: 'all', icon: null },
    { label: 'Pending', value: 'pending', icon: <PendingIcon sx={{ fontSize: 16 }} /> },
    { label: 'Contacted', value: 'contacted', icon: <ContactPhoneIcon sx={{ fontSize: 16 }} /> },
    { label: 'Completed', value: 'completed', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
    { label: 'Cancelled', value: 'cancelled', icon: <CancelIcon sx={{ fontSize: 16 }} /> }
  ];

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
        <Box
          sx={{
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              from: { transform: 'rotate(0deg)' },
              to: { transform: 'rotate(360deg)' }
            }
          }}
        >
          <MessageIcon sx={{ fontSize: 60, color: "#D4AF37", mr: 2 }} />
        </Box>
        <CircularProgress size={50} sx={{ color: '#D4AF37' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{
        background: "linear-gradient(135deg, #111111 0%, #0F172A 50%, #1A1A1A 100%)",
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        minHeight: '100%'
      }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
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
            Inquiries Management
          </Typography>
          <Typography sx={{ color: 'rgba(245,245,245,0.7)' }}>
            Manage and track all customer inquiries
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={filter}
          onChange={(e, v) => setFilter(v)}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
          allowScrollButtonsMobile
          sx={{
            mb: 3,
            '& .MuiTabs-indicator': {
              backgroundColor: '#D4AF37'
            }
          }}
        >
          {statusTabs.map((tab) => (
            <Tab
              key={tab.value}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {tab.icon}
                  {tab.label}
                  <Chip
                    label={getStatusCount(tab.value)}
                    size="small"
                    sx={{
                      ml: 1,
                      background: filter === tab.value ? 'rgba(212,175,55,0.3)' : 'rgba(245,245,245,0.1)',
                      color: filter === tab.value ? '#D4AF37' : 'rgba(245,245,245,0.7)',
                      height: 20,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
              }
              value={tab.value}
              sx={{
                color: filter === tab.value ? '#D4AF37' : 'rgba(245,245,245,0.7)',
                '&.Mui-selected': {
                  color: '#D4AF37'
                }
              }}
            />
          ))}
        </Tabs>

        {/* Table */}
        {isMobile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {inquiries.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center', background: 'rgba(245,245,245,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <Typography sx={{ color: 'rgba(245,245,245,0.7)' }}>No inquiries found</Typography>
              </Paper>
            ) : (
              inquiries.map((inquiry, idx) => {
                const statusStyle = getStatusColor(inquiry.status);
                return (
                  <motion.div key={inquiry._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
                    <Paper sx={{ p: 2, background: 'rgba(245,245,245,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 1 }}>
                        <Typography fontWeight="bold" sx={{ color: '#fff' }}>{inquiry.customerName}</Typography>
                        <Chip icon={statusStyle.icon} label={inquiry.status.toUpperCase()} size="small" sx={{ background: statusStyle.bg, color: statusStyle.color }} />
                      </Box>
                      <Typography sx={{ color: 'rgba(245,245,245,0.75)', mt: 1, fontSize: '0.85rem' }}>
                        {new Date(inquiry.createdAt).toLocaleDateString()} • {inquiry.serviceName || inquiry.serviceId?.name || 'N/A'}
                      </Typography>
                      <Typography sx={{ color: 'rgba(245,245,245,0.85)', mt: 1, fontSize: '0.85rem' }}>
                        {inquiry.phone}
                      </Typography>
                      <Typography sx={{ color: 'rgba(245,245,245,0.7)', fontSize: '0.8rem', wordBreak: 'break-word' }}>
                        {inquiry.email}
                      </Typography>
                      <Button
                        fullWidth
                        size="small"
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setOpenDetails(true);
                        }}
                        sx={{ mt: 1.5, color: '#D4AF37', textTransform: 'none', border: '1px solid rgba(212,175,55,0.35)' }}
                      >
                        View Details
                      </Button>
                    </Paper>
                  </motion.div>
                );
              })
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
                  <TableCell>Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography sx={{ color: 'rgba(245,245,245,0.7)' }}>
                        No inquiries found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  inquiries.map((inquiry, idx) => {
                    const statusStyle = getStatusColor(inquiry.status);
                    return (
                      <motion.tr
                        key={inquiry._id}
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarIcon sx={{ fontSize: 14, color: 'rgba(245,245,245,0.5)' }} />
                            <Typography sx={{ color: 'rgba(245,245,245,0.8)', fontSize: '0.85rem' }}>
                              {new Date(inquiry.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ fontSize: 16, color: '#D4AF37' }} />
                            <Typography fontWeight="medium" sx={{ color: '#fff' }}>
                              {inquiry.customerName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: 'rgba(245,245,245,0.8)', fontSize: '0.85rem' }}>
                            {inquiry.serviceName || inquiry.serviceId?.name || 'N/A'}
                          </Typography>
                          {getCategoryName(inquiry.serviceId?.categoryId) && (
                            <Typography variant="caption" sx={{ color: 'rgba(245,245,245,0.5)' }}>
                              <CategoryIcon sx={{ fontSize: 10, mr: 0.5 }} />
                              {getCategoryName(inquiry.serviceId.categoryId)}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PhoneIcon sx={{ fontSize: 14, color: '#D4AF37' }} />
                              <Typography sx={{ color: 'rgba(245,245,245,0.8)', fontSize: '0.85rem' }}>
                                {inquiry.phone}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <EmailIcon sx={{ fontSize: 14, color: '#D4AF37' }} />
                              <Typography sx={{ color: 'rgba(245,245,245,0.7)', fontSize: '0.75rem' }}>
                                {inquiry.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={statusStyle.icon}
                            label={inquiry.status.toUpperCase()}
                            size="small"
                            sx={{
                              background: statusStyle.bg,
                              color: statusStyle.color,
                              fontWeight: 'bold',
                              '& .MuiChip-icon': {
                                color: statusStyle.color
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setOpenDetails(true);
                            }}
                            sx={{
                              color: '#D4AF37',
                              '&:hover': {
                                background: 'rgba(212,175,55,0.2)'
                              },
                              textTransform: 'none'
                            }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </motion.tr>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Inquiry Details Dialog - Industrial Theme */}
        <Dialog
          open={openDetails}
          onClose={() => setOpenDetails(false)}
          maxWidth="md"
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
          {selectedInquiry && (
            <>
              <DialogTitle sx={{
                color: '#D4AF37',
                fontWeight: 'bold',
                borderBottom: '1px solid rgba(212,175,55,0.3)',
                pb: 2
              }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MessageIcon sx={{ color: '#D4AF37' }} />
                    <Typography variant="h6">Inquiry Details</Typography>
                  </Box>
                  <IconButton onClick={() => setOpenDetails(false)} sx={{ color: '#fff' }}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent dividers sx={{ borderColor: 'rgba(212,175,55,0.2)' }}>
                <Grid container spacing={3}>
                  {/* Service Information */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ color: '#D4AF37', mb: 1, fontWeight: 'bold' }}>
                      Service Information
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        background: 'rgba(245,245,245,0.05)',
                        borderColor: 'rgba(212,175,55,0.2)',
                        borderRadius: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <BusinessIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                        <Typography sx={{ color: '#fff' }}>
                          <strong>Service:</strong> {selectedInquiry.serviceName || selectedInquiry.serviceId?.name || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CategoryIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                        <Typography sx={{ color: '#fff' }}>
                          <strong>Category:</strong> {selectedInquiry.categoryName || getCategoryName(selectedInquiry.serviceId?.categoryId) || 'N/A'}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Customer Details */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ color: '#D4AF37', mb: 1, fontWeight: 'bold' }}>
                      Customer Details
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        background: 'rgba(245,245,245,0.05)',
                        borderColor: 'rgba(212,175,55,0.2)',
                        borderRadius: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <PersonIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                        <Typography sx={{ color: '#fff' }}>
                          <strong>Name:</strong> {selectedInquiry.customerName}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <PhoneIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                        <Typography sx={{ color: '#fff' }}>
                          <strong>Phone:</strong> {selectedInquiry.phone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <EmailIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                        <Typography sx={{ color: '#fff' }}>
                          <strong>Email:</strong> {selectedInquiry.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                        <Typography sx={{ color: '#fff' }}>
                          <strong>Address:</strong> {selectedInquiry.address}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Additional Message */}
                  {selectedInquiry.message && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ color: '#D4AF37', mb: 1, fontWeight: 'bold' }}>
                        Additional Message
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          background: 'rgba(245,245,245,0.05)',
                          borderColor: 'rgba(212,175,55,0.2)',
                          borderRadius: 2
                        }}
                      >
                        <Typography sx={{ color: 'rgba(245,245,245,0.8)', fontStyle: 'italic' }}>
                          "{selectedInquiry.message}"
                        </Typography>
                      </Paper>
                    </Grid>
                  )}

                  {/* Update Status */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ color: '#D4AF37', mb: 1, fontWeight: 'bold' }}>
                      Update Status
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      {statusTabs.filter(tab => tab.value !== 'all').map((status) => {
                        const isActive = selectedInquiry.status === status.value;
                        const statusStyle = getStatusColor(status.value);
                        return (
                          <Button
                            key={status.value}
                            variant={isActive ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => handleStatusUpdate(selectedInquiry._id, status.value)}
                            startIcon={status.icon}
                            sx={{
                              background: isActive
                                ? `linear-gradient(135deg, ${statusStyle.color}, ${statusStyle.color}dd)`
                                : 'transparent',
                              borderColor: statusStyle.color,
                              color: isActive ? '#fff' : statusStyle.color,
                              textTransform: 'none',
                              '&:hover': {
                                background: isActive
                                  ? `linear-gradient(135deg, ${statusStyle.color}, ${statusStyle.color}dd)`
                                  : `${statusStyle.color}20`,
                                borderColor: statusStyle.color,
                                transform: 'translateY(-2px)'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {status.label}
                          </Button>
                        );
                      })}
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Box>
    </Box>
  );
};

export default InquiriesManagement;
