import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../../../utils/axiosConfig';

const RecentInquiriesTable = ({ limit = 5 }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, [limit]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/inquiries');
      
      // Handle different response structures
      let inquiriesData = [];
      if (Array.isArray(response.data)) {
        inquiriesData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        inquiriesData = response.data.data;
      } else if (response.data.inquiries && Array.isArray(response.data.inquiries)) {
        inquiriesData = response.data.inquiries;
      }
      
      // Limit the number of inquiries
      setInquiries(inquiriesData.slice(0, limit));
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setError(error.response?.data?.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'approved':
      case 'completed':
        return 'success';
      case 'rejected':
      case 'cancelled':
        return 'error';
      case 'in-progress':
      case 'processing':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleViewInquiry = (id) => {
    console.log('View inquiry:', id);
    // Navigate to inquiry details page
    // Example: navigate(`/admin/inquiries/${id}`);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdating(true);
      await api.put(`/inquiries/${id}/status`, { status: newStatus });
      
      // Refresh the list after successful update
      await fetchInquiries();
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error.response?.data?.message || 'Failed to update inquiry status');
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const handleRefresh = () => {
    fetchInquiries();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ m: 2 }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => setError(null)}
          >
            <RefreshIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {error}
      </Alert>
    );
  }

  if (inquiries.length === 0) {
    return (
      <Box textAlign="center" py={3}>
        <Typography variant="body2" color="textSecondary">
          No inquiries found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Tooltip title="Refresh">
          <IconButton onClick={handleRefresh} size="small" disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry.id || inquiry._id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="500">
                    {inquiry.customerName || inquiry.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {inquiry.serviceName || inquiry.service?.name || inquiry.serviceId}
                </TableCell>
                <TableCell>{inquiry.phone}</TableCell>
                <TableCell>{inquiry.email}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(inquiry.status)}
                    color={getStatusColor(inquiry.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(inquiry.createdAt || inquiry.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => handleViewInquiry(inquiry.id || inquiry._id)}
                      color="primary"
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  {(!inquiry.status || inquiry.status === 'pending') && (
                    <>
                      <Tooltip title="Approve">
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateStatus(inquiry.id || inquiry._id, 'approved')}
                          color="success"
                          disabled={updating}
                        >
                          <ApproveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateStatus(inquiry.id || inquiry._id, 'rejected')}
                          color="error"
                          disabled={updating}
                        >
                          <RejectIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RecentInquiriesTable;