import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, MenuItem, IconButton, CircularProgress, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useQuoteModal } from '../../contexts/QuoteModalContext';
import axiosInstance from '../../../utils/axiosConfig';

const servicesOptions = [
  'Complete House Construction',
  'Modular Kitchen',
  'False Ceiling & POP Design',
  'Custom Wardrobe & Cabinets',
  'Wooden Doors & Windows',
  'Wooden Jali Doors',
  'PVC Wall Paneling',
  'Luxury Sofa Set & Beds',
  'Home Renovation & Painting',
  'Tiles & Marble Work',
  'Other / Custom Inquiry'
];

const QuoteModal = () => {
  const { isOpen, preselectedService, closeQuote } = useQuoteModal();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    address: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: preselectedService || '',
        address: '',
        message: ''
      });
      setErrors({});
      setSuccess(false);
    }
  }, [isOpen, preselectedService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.service) newErrors.service = 'Please select a service';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        message: formData.message,
        serviceName: formData.service,
        categoryName: 'General Quote'
      };

      await axiosInstance.post('/inquiries', payload);
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting quote request:', err);
      setErrors({ api: 'Failed to submit request. Please try again or call us directly.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={closeQuote}
      aria-labelledby="quote-modal-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 500,
          bgcolor: '#0F172A',
          color: '#F8FAFC',
          borderRadius: 3,
          border: '1px solid rgba(212, 175, 55, 0.4)',
          boxShadow: '0 24px 50px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          p: { xs: 3, md: 4 }
        }}
      >
        <IconButton
          onClick={closeQuote}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: 'rgba(248, 250, 252, 0.6)',
            '&:hover': { color: '#D4AF37' }
          }}
        >
          <CloseIcon />
        </IconButton>

        {success ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 72, color: '#D4AF37', mb: 2 }} />
            <Typography id="quote-modal-title" variant="h5" sx={{ fontWeight: 900, mb: 1.5 }}>
              Request Submitted!
            </Typography>
            <Typography sx={{ color: 'rgba(248, 250, 252, 0.72)', mb: 3.5, px: 2 }}>
              Thank you for choosing us. We have received your inquiry and will contact you within 24 hours.
            </Typography>
            <Button
              variant="contained"
              onClick={closeQuote}
              sx={{
                bgcolor: '#D4AF37',
                color: '#0F172A',
                fontWeight: 900,
                px: 4,
                py: 1.25,
                borderRadius: 2,
                '&:hover': { bgcolor: '#B88917' }
              }}
            >
              Close
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Typography id="quote-modal-title" variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#F8FAFC' }}>
              Request a Free Quote
            </Typography>
            <Typography sx={{ color: 'rgba(248, 250, 252, 0.68)', fontSize: '0.88rem', mb: 3 }}>
              Enter your details below. Our experts will get in touch with you.
            </Typography>

            {errors.api && (
              <Typography sx={{ color: '#EF4444', fontSize: '0.85rem', mb: 2, fontWeight: 700 }}>
                {errors.api}
              </Typography>
            )}

            <Box sx={{ display: 'grid', gap: 2.25 }}>
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                variant="outlined"
                sx={inputStyle}
              />

              <TextField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="10-digit mobile number"
                fullWidth
                variant="outlined"
                sx={inputStyle}
              />

              <TextField
                select
                label="Select Service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                error={!!errors.service}
                helperText={errors.service}
                fullWidth
                variant="outlined"
                sx={inputStyle}
              >
                {servicesOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Address / Site Location (Optional)"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. Charkhi Dadri, Haryana"
                fullWidth
                variant="outlined"
                sx={inputStyle}
              />

              <TextField
                label="Describe your requirements (Optional)"
                name="message"
                value={formData.message}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                sx={inputStyle}
              />

              <Button
                type="submit"
                disabled={loading}
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: '#D4AF37',
                  color: '#0F172A',
                  fontWeight: 900,
                  py: 1.5,
                  mt: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 12px 24px rgba(212, 175, 55, 0.25)',
                  '&:hover': {
                    bgcolor: '#B88917',
                    boxShadow: '0 16px 30px rgba(212, 175, 55, 0.32)'
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(212, 175, 55, 0.38)',
                    color: 'rgba(15, 23, 42, 0.6)'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#0F172A' }} /> : 'Submit Quote Request'}
              </Button>
            </Box>
          </form>
        )}
      </Box>
    </Modal>
  );
};

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    color: '#F8FAFC',
    bgcolor: 'rgba(255,255,255,0.03)',
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.12)'
    },
    '&:hover fieldset': {
      borderColor: 'rgba(212, 175, 55, 0.5)'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#D4AF37'
    }
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(248, 250, 252, 0.6)',
    '&.Mui-focused': {
      color: '#D4AF37'
    }
  },
  '& .MuiFormHelperText-root': {
    color: '#EF4444'
  }
};

export default QuoteModal;
