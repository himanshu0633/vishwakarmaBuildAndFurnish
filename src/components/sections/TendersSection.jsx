import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Modal, IconButton, Paper, CircularProgress, Chip } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { motion, useInView } from 'framer-motion';
import axiosInstance from "../../../utils/axiosConfig";
import EngineeringIcon from '@mui/icons-material/Engineering';
import FactoryIcon from '@mui/icons-material/Factory';
import GavelIcon from '@mui/icons-material/Gavel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

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

const TendersSection = () => {
  const [selectedTender, setSelectedTender] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    company: "",
    message: ""
  });
  const [hoveredCard, setHoveredCard] = useState(null);

  const WHATSAPP_CONFIG = {
    number: "8288081878",
    getUrl: (message) => `https://wa.me/8288081878?text=${message}`
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/tenders?status=open&limit=6");
      
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

  const openTenders = tenders.slice(0, 6);

  const handleTenderClick = (tender) => {
    setSelectedTender(tender);
    setShowModal(true);
    setShowInquiryForm(false);
    setShowFullDescription(false);
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

// Update the handleSubmitInquiry function
const handleSubmitInquiry = async () => {
  if (!selectedTender) return;
  
  const errors = validateForm();
  
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  setSubmitting(true);

  try {
    // Updated API call to use tenderId instead of serviceId
    const response = await axiosInstance.post("/inquiries", {
      tenderId: selectedTender._id,  // Changed from serviceId to tenderId
      customerName: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      message: `Tender Inquiry - ${selectedTender.title}\nCompany: ${formData.company.trim() || "Not specified"}\n\n${formData.message.trim()}`
    });

    if (response.data.success) {
      const message = `*TENDER INQUIRY DETAILS*%0A%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `*TENDER INFORMATION*%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `*Title:* ${selectedTender.title || "N/A"}%0A` +
        `*Category:* ${selectedTender.category || "N/A"}%0A` +
        `*Location:* ${selectedTender.location || "N/A"}%0A` +
        `*Budget:* ${selectedTender.budget || "N/A"}%0A` +
        `*Deadline:* ${new Date(selectedTender.deadline).toLocaleDateString() || "N/A"}%0A` +
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
      
      setShowModal(false);
      setShowInquiryForm(false);
      setSelectedTender(null);
      setFormData({
        name: "",
        email: "",
        address: "",
        phone: "",
        company: "",
        message: ""
      });
      setFormErrors({});
      
      // Show success message
      alert("Inquiry submitted successfully! You will be redirected to WhatsApp.");
    } else {
      throw new Error("Failed to submit inquiry");
    }
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
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <Box sx={{ 
        py: { xs: 8, sm: 10, md: 12 }, 
        background: "linear-gradient(135deg, #111111 0%, #0F172A 100%)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Industrial Background */}
        <Box sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          pointerEvents: "none"
        }}>
          <Box sx={{
            position: "absolute",
            top: "20%",
            left: "10%",
            animation: "rotate 40s linear infinite"
          }}>
            <EngineeringIcon sx={{ fontSize: 150 }} />
          </Box>
          <Box sx={{
            position: "absolute",
            bottom: "15%",
            right: "8%",
            animation: "rotateReverse 35s linear infinite"
          }}>
            <FactoryIcon sx={{ fontSize: 180 }} />
          </Box>
        </Box>

        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <GavelIcon sx={{ fontSize: 60, color: "#D4AF37", mb: 2 }} />
            </motion.div>
            <CircularProgress size={50} sx={{ color: '#D4AF37' }} />
            <Typography sx={{ mt: 2, color: 'rgba(245,245,245,0.8)' }}>Loading industrial tenders...</Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        py: { xs: 8, sm: 10, md: 12 }, 
        background: "linear-gradient(135deg, #111111 0%, #0F172A 100%)"
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ color: '#f44336' }}>Error: {error}</Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ 
        py: { xs: 8, sm: 10, md: 12 }, 
        background: "linear-gradient(135deg, #111111 0%, #0F172A 50%, #1A1A1A 100%)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Industrial Background Elements */}
        <Box sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          pointerEvents: "none"
        }}>
          <Box sx={{
            position: "absolute",
            top: "10%",
            left: "3%",
            animation: "rotate 45s linear infinite"
          }}>
            <EngineeringIcon sx={{ fontSize: 180 }} />
          </Box>
          <Box sx={{
            position: "absolute",
            bottom: "15%",
            right: "5%",
            animation: "rotateReverse 40s linear infinite"
          }}>
            <FactoryIcon sx={{ fontSize: 200 }} />
          </Box>
          <Box sx={{
            position: "absolute",
            top: "40%",
            left: "85%",
            animation: "rotate 35s linear infinite"
          }}>
            <GavelIcon sx={{ fontSize: 140 }} />
          </Box>
          
          {/* Floating Particles */}
          {[...Array(30)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                background: `rgba(212,175,55,${Math.random() * 0.3 + 0.1})`,
                borderRadius: "50%",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </Box>

        {/* Animated Overlay Shine */}
        <Box sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(90deg, transparent, rgba(245,245,245,0.03), transparent)",
          transform: "translateX(-100%)",
          animation: "gradientShift 12s infinite",
          pointerEvents: "none"
        }} />

        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            {/* Header Section */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 5,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <motion.div variants={fadeInUp}>
                <Chip
                  icon={<TrendingUpIcon />}
                  label="Live Tenders"
                  sx={{
                    bgcolor: "rgba(212,175,55,0.2)",
                    color: "#D4AF37",
                    mb: 1,
                    '& .MuiChip-icon': { color: "#D4AF37" }
                  }}
                />
                <Typography variant="h2" sx={{
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                  fontWeight: 'bold',
                  background: "linear-gradient(135deg, #F5F5F5, #D4AF37)",
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <span style={{ fontSize: '32px' }}>⚙️</span>
                  Active Tenders & Requirements
                </Typography>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/tenders'}
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
                  border: '1px solid rgba(212,175,55,0.5)',
                  color: '#D4AF37',
                  padding: '10px 28px',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #D4AF37, #B88917)';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))';
                  e.target.style.color = '#D4AF37';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                View All Tenders →
              </motion.button>
            </Box>

            {/* Tenders Grid */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3
            }}>
              {openTenders.length > 0 ? (
                openTenders.map((tender, idx) => (
                  <motion.div
                    key={tender._id}
                    variants={fadeInUp}
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => handleTenderClick(tender)}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: '24px',
                        background: 'rgba(245,245,245,0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(212,175,55,0.2)',
                        cursor: 'pointer',
                        height: '320px',

                        position: 'relative',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          borderColor: '#D4AF37',
                          boxShadow: '0 15px 35px rgba(212,175,55,0.2)'
                        }
                      }}
                    >
                      {/* Animated Glow Effect */}
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
                        transform: hoveredCard === idx ? 'translateX(0)' : 'translateX(-100%)',
                        transition: 'transform 0.5s ease'
                      }} />
                      
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
                          px: 1.2,
                          py: 0.6,
                          borderRadius: '20px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          zIndex: 1
                        }}>
                          <PictureAsPdfIcon sx={{ fontSize: 12 }} />
                          <span>PDF</span>
                        </Box>
                      )}
                      
                      <Typography sx={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold', 
                        color: '#F5F5F5',
                        mb: 1.5,
                        lineHeight: 1.4,
                        pr: 5
                      }}>
                        {truncateText(tender.title, 45)}
                      </Typography>
                      
                      <Typography sx={{
                        background: 'linear-gradient(135deg, #D4AF37, #B88917)',
                        color: '#F5F5F5',
                        fontSize: '11px',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '20px',
                        display: 'inline-block',
                        width: 'fit-content',
                        mb: 2
                      }}>
                        {tender.category}
                      </Typography>

                      <Typography sx={{
                        fontSize: '13px',
                        color: 'rgba(245,245,245,0.7)',
                        lineHeight: 1.6,
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {truncateText(tender.description, 80)}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Typography sx={{ fontSize: '16px' }}>📍</Typography>
                        <Typography sx={{ fontSize: '13px', color: 'rgba(245,245,245,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {truncateText(tender.location, 30)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Typography sx={{ fontSize: '16px' }}>💰</Typography>
                        <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: '#D4AF37' }}>
                          {tender.budget}
                        </Typography>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        pt: 1,
                        mb: 2,
                        flexWrap: 'wrap',
                        gap: 1
                      }}>
                        <Typography sx={{
                          fontSize: '11px',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '20px',
                          background: 'rgba(46,204,113,0.2)',
                          color: '#2ecc71',
                          fontWeight: 500
                        }}>
                          ● Open for Bids
                        </Typography>
                        <Typography sx={{ fontSize: '11px', color: 'rgba(245,245,245,0.6)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <span>⏰</span> {new Date(tender.deadline).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #D4AF37, #B88917)',
                          border: 'none',
                          color: '#F5F5F5',
                          padding: '12px',
                          borderRadius: '30px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 600,
                          transition: 'all 0.3s ease',
                          marginTop: '8px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 5px 15px rgba(212,175,55,0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        Submit Quote →
                      </motion.button>
                    </Paper>
                  </motion.div>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 8, gridColumn: '1/-1' }}>
                  <Typography sx={{ color: 'rgba(245,245,245,0.7)' }}>No open tenders available at the moment</Typography>
                </Box>
              )}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Modal - Industrial Theme */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '600px' },
          maxHeight: '90vh',
          overflowY: 'auto',
          outline: 'none'
        }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #0F172A, #111111)',
            borderRadius: '24px',
            p: { xs: 3, sm: 4 },
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            border: '1px solid rgba(212,175,55,0.3)'
          }}>
            <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 16, right: 16, color: '#F5F5F5' }}>
              <CloseIcon />
            </IconButton>
            
            {!showInquiryForm ? (
              <>
                {selectedTender?.pdf && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDownloadPDF(selectedTender._id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '30px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <PictureAsPdfIcon sx={{ fontSize: 16 }} />
                    Download Tender Document (PDF)
                  </motion.button>
                )}
                
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#D4AF37', mb: 1.5 }}>
                  {selectedTender?.title}
                </Typography>
                <Typography sx={{ 
                  fontSize: '12px', 
                  color: '#D4AF37', 
                  background: 'rgba(212,175,55,0.2)', 
                  display: 'inline-block', 
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: '20px', 
                  mb: 2.5 
                }}>
                  Category: {selectedTender?.category}
                </Typography>
                
                <Box sx={{ 
                  background: 'rgba(245,245,245,0.05)', 
                  p: 2.5, 
                  borderRadius: '16px', 
                  mb: 2.5,
                  border: '1px solid rgba(212,175,55,0.2)'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid rgba(245,245,245,0.1)' }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#D4AF37', fontSize: '13px' }}>📍 Location:</Typography>
                    <Typography sx={{ color: 'rgba(245,245,245,0.8)', fontSize: '13px' }}>{selectedTender?.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid rgba(245,245,245,0.1)' }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#D4AF37', fontSize: '13px' }}>💰 Budget:</Typography>
                    <Typography sx={{ color: '#D4AF37', fontSize: '13px', fontWeight: 'bold' }}>{selectedTender?.budget}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid rgba(245,245,245,0.1)' }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#D4AF37', fontSize: '13px' }}>⏰ Deadline:</Typography>
                    <Typography sx={{ color: 'rgba(245,245,245,0.8)', fontSize: '13px' }}>
                      {selectedTender?.deadline && new Date(selectedTender.deadline).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#D4AF37', fontSize: '13px' }}>📊 Status:</Typography>
                    <Box sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: 'rgba(46,204,113,0.2)',
                      color: '#2ecc71'
                    }}>
                      Open for Bids
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 2.5 }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#D4AF37', mb: 1, fontSize: '14px' }}>📄 Tender Description:</Typography>
                  <Box sx={{ background: 'rgba(245,245,245,0.03)', p: 2, borderRadius: '12px' }}>
                    {showFullDescription || !selectedTender?.description ? (
                      <Typography sx={{ fontSize: '13px', color: 'rgba(245,245,245,0.8)', lineHeight: 1.6 }}>
                        {selectedTender?.description || "No description available"}
                      </Typography>
                    ) : (
                      <Typography sx={{ fontSize: '13px', color: 'rgba(245,245,245,0.8)', lineHeight: 1.6 }}>
                        {truncateText(selectedTender?.description, 200)}
                        {selectedTender?.description?.length > 200 && (
                          <span 
                            onClick={() => setShowFullDescription(true)}
                            style={{ color: '#D4AF37', cursor: 'pointer', fontWeight: 500, marginLeft: '5px', display: 'inline-block' }}
                          >
                            Read more
                          </span>
                        )}
                      </Typography>
                    )}
                    {showFullDescription && selectedTender?.description?.length > 200 && (
                      <span 
                        onClick={() => setShowFullDescription(false)}
                        style={{ color: '#D4AF37', cursor: 'pointer', fontWeight: 500, marginTop: '8px', display: 'inline-block' }}
                      >
                        Show less
                      </span>
                    )}
                  </Box>
                </Box>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInquiryClick}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    color: 'white',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '30px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Send Inquiry on WhatsApp
                </motion.button>
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
                  <Box>
                    <input
                      type="text"
                      name="name"
                      aria-label="Full Name"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `1px solid ${formErrors.name ? '#f44336' : 'rgba(212,175,55,0.3)'}`,
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'rgba(245,245,245,0.1)',
                        color: '#F5F5F5'
                      }}
                    />
                    {formErrors.name && <Typography sx={{ color: '#f44336', fontSize: '11px', mt: 0.5 }}>{formErrors.name}</Typography>}
                  </Box>
                  
                  <Box>
                    <input
                      type="tel"
                      name="phone"
                      aria-label="Phone Number"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `1px solid ${formErrors.phone ? '#f44336' : 'rgba(212,175,55,0.3)'}`,
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'rgba(245,245,245,0.1)',
                        color: '#F5F5F5'
                      }}
                    />
                    {formErrors.phone && <Typography sx={{ color: '#f44336', fontSize: '11px', mt: 0.5 }}>{formErrors.phone}</Typography>}
                  </Box>
                  
                  <Box>
                    <input
                      type="email"
                      name="email"
                      aria-label="Email Address"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `1px solid ${formErrors.email ? '#f44336' : 'rgba(212,175,55,0.3)'}`,
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'rgba(245,245,245,0.1)',
                        color: '#F5F5F5'
                      }}
                    />
                    {formErrors.email && <Typography sx={{ color: '#f44336', fontSize: '11px', mt: 0.5 }}>{formErrors.email}</Typography>}
                  </Box>
                  
                  <Box>
                    <input
                      type="text"
                      name="address"
                      aria-label="Your Address"
                      placeholder="Your Address *"
                      value={formData.address}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `1px solid ${formErrors.address ? '#f44336' : 'rgba(212,175,55,0.3)'}`,
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'rgba(245,245,245,0.1)',
                        color: '#F5F5F5'
                      }}
                    />
                    {formErrors.address && <Typography sx={{ color: '#f44336', fontSize: '11px', mt: 0.5 }}>{formErrors.address}</Typography>}
                  </Box>
                  
                  <Box>
                    <input
                      type="text"
                      name="company"
                      aria-label="Company Name"
                      placeholder="Company Name (Optional)"
                      value={formData.company}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid rgba(212,175,55,0.3)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'rgba(245,245,245,0.1)',
                        color: '#F5F5F5'
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <textarea
                      name="message"
                      aria-label="Additional Message"
                      placeholder="Additional Message (Optional)"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid rgba(212,175,55,0.3)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        resize: 'vertical',
                        background: 'rgba(245,245,245,0.1)',
                        color: '#F5F5F5'
                      }}
                    />
                  </Box>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitInquiry}
                    disabled={submitting}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #25D366, #128C7E)',
                      color: 'white',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '30px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      opacity: submitting ? 0.7 : 1
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit & Send to WhatsApp'}
                  </motion.button>
                  <button 
                    onClick={() => setShowInquiryForm(false)}
                    style={{
                      width: '100%',
                      background: 'rgba(245,245,245,0.1)',
                      color: '#F5F5F5',
                      border: '1px solid rgba(212,175,55,0.3)',
                      padding: '12px',
                      borderRadius: '30px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      marginTop: '12px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(245,245,245,0.2)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(245,245,245,0.1)'}
                  >
                    Back to Tender Details
                  </button>
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
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        
        @keyframes gradientShift {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
};

export default TendersSection;