import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  CircularProgress, 
  Alert, 
  Snackbar, 
  Breadcrumbs, 
  Link, 
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Grid,
  Chip,
  Button
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import BuildIcon from '@mui/icons-material/Build';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FactoryIcon from '@mui/icons-material/Factory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { motion } from 'framer-motion';
import ServicesSection from '../components/sections/ServicesSection';
import axiosInstance from '../../utils/axiosConfig';
import {
  getCategoryEmoji,
  getCategoryName,
  getServiceDescription,
  getServiceFullDescription
} from '../utils/catalogSchema';
import { businessStructuredData, buildPageUrl, useSeo } from '../utils/seo';

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

const ServicesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    message: ""
  });
  const navigate = useNavigate();

  useSeo({
    title: "Construction, Furniture & Interior Services in Charkhi Dadri",
    description:
      "Explore Vishwakarma Build & Furnish services for house construction, modular kitchen, wardrobe, doors, windows, plumbing, electrical, paint, tiles, marble and renovation work in Charkhi Dadri, Haryana.",
    path: "/services",
    keywords: [
      "construction services Charkhi Dadri",
      "interior services Charkhi Dadri",
      "modular kitchen Charkhi Dadri",
      "wardrobe maker Charkhi Dadri",
      "home renovation Haryana"
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Vishwakarma Build & Furnish Services",
      url: buildPageUrl("/services"),
      about: businessStructuredData,
      mainEntity: services.flatMap((category) =>
        category.services.map((service) => ({
          "@type": "Service",
          name: service.name,
          description: service.fullDescription || service.desc,
          provider: businessStructuredData,
          areaServed: businessStructuredData.areaServed
        }))
      )
    }
  });

  const WHATSAPP_CONFIG = {
    number: "8288081878",
    getUrl: (message) => `https://wa.me/8288081878?text=${message}`
  };

  useEffect(() => {
    fetchServices();
    window.scrollTo(0, 0);
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get("/categories");
      
      if (response.data.success && Array.isArray(response.data.data)) {
        const formattedServices = response.data.data.map(category => ({
          _id: category._id,
          category: getCategoryName(category),
          icon: getCategoryEmoji(category) || getCategoryIcon(getCategoryName(category)),
          order: category.order || 0,
          services: category.services.map(service => ({
            _id: service._id,
            name: service.name,
            slug: service.slug,
            desc: getServiceDescription(service),
            fullDescription: getServiceFullDescription(service),
            emoji: service.emoji || getServiceIcon(service.name),
            popular: service.popular || false,
            featured: service.featured || false,
            price: service.priceStarting,
            priceStarting: service.priceStarting,
            duration: service.duration,
            features: service.features || [],
            tags: service.tags || [],
            faq: service.faq || []
          }))
        }));
        
        setServices(formattedServices);
      } else {
        setError('Failed to load services data');
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.response?.data?.message || 'Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Home Services': '🏠',
      'Plumbing': '🔧',
      'Electrical': '⚡',
      'Cleaning': '🧹',
      'Painting': '🎨',
      'Carpentry': '🪚',
      'AC Repair': '❄️',
      'Appliance Repair': '📺',
      'Pest Control': '🐜',
      'Event Management': '🎉',
      'default': '🔧'
    };
    return icons[category] || icons.default;
  };

  const getServiceIcon = (serviceName) => {
    const icons = {
      'AC Repair': '❄️',
      'AC Installation': '❄️',
      'AC Service': '❄️',
      'Plumbing': '🔧',
      'Electrical': '⚡',
      'Cleaning': '🧹',
      'Painting': '🎨',
      'Carpentry': '🪚',
      'default': '🔧'
    };
    return icons[serviceName] || icons.default;
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowModal(true);
    setShowInquiryForm(false);
    setShowSuccess(false);
    setFormErrors({});
    setFormData({
      name: "",
      email: "",
      address: "",
      phone: "",
      message: ""
    });
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

  const handleSubmitInquiry = async () => {
    if (!selectedService) return;
    
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      await axiosInstance.post("/inquiries", {
        serviceId: selectedService._id,
        customerName: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        message: `Service Inquiry - ${selectedService.name}\n\n${formData.message.trim()}`
      });

      const message = `*SERVICE INQUIRY DETAILS*%0A%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `*SERVICE INFORMATION*%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `*Service:* ${selectedService.name || "N/A"}%0A` +
        `*Description:* ${getServiceDescription(selectedService) || "N/A"}%0A` +
        `${selectedService.priceStarting ? `*Starting Price:* ${selectedService.priceStarting}%0A` : ''}` +
        `${selectedService.duration ? `*Duration:* ${selectedService.duration}%0A` : ''}` +
        `%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `*CUSTOMER DETAILS*%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `*Name:* ${formData.name.trim()}%0A` +
        `*Phone:* ${formData.phone.trim()}%0A` +
        `*Email:* ${formData.email.trim()}%0A` +
        `*Address:* ${formData.address.trim()}%0A` +
        `*Message:* ${formData.message.trim() || "No additional message"}%0A%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `*Inquiry Date:* ${new Date().toLocaleDateString()}%0A` +
        `*Inquiry Time:* ${new Date().toLocaleTimeString()}`;

      const whatsappUrl = WHATSAPP_CONFIG.getUrl(encodeURIComponent(message));
      window.open(whatsappUrl, "_blank");
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setShowInquiryForm(false);
        setSelectedService(null);
        setShowSuccess(false);
      }, 1500);
      
      setFormData({
        name: "",
        email: "",
        address: "",
        phone: "",
        message: ""
      });
      setFormErrors({});
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowInquiryForm(false);
    setSelectedService(null);
    setFormErrors({});
    setShowSuccess(false);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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
          <EngineeringIcon sx={{ fontSize: 60, color: '#D4AF37', mb: 2 }} />
          <CircularProgress size={60} thickness={4} sx={{ color: '#D4AF37' }} />
        </motion.div>
      </Box>
    );
  }

  if (error && services.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center">
          <Alert severity="error" sx={{ mb: 2, background: 'rgba(244,67,54,0.1)', color: '#e74c3c' }}>
            {error}
          </Alert>
          <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
            Please try refreshing the page or check your internet connection.
          </Typography>
          <button 
            onClick={fetchServices}
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #B88917)',
              color: 'white',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Try Again
          </button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ overflowX: 'clip' }}>
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
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Chip
                icon={<BuildIcon />}
                label="Industrial Services"
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
                Our Services
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
                Professional, reliable, and affordable industrial and commercial services for all your needs
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
                  Services
                </Typography>
              </Breadcrumbs>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Stats Section - Industrial Theme */}
      <Box sx={{ 
        background: "linear-gradient(135deg, #111111 0%, #0F172A 100%)", 
        py: 5, 
        borderBottom: '1px solid rgba(212,175,55,0.2)'
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
              gap: { xs: 2, sm: 3 },
              textAlign: 'center'
            }}>
              {[
                { number: '500+', label: 'Services Completed', icon: '🏭' },
                { number: '100+', label: 'Expert Professionals', icon: '👷' },
                { number: '98%', label: 'Customer Satisfaction', icon: '⭐' },
                { number: '24/7', label: 'Customer Support', icon: '🕒' }
              ].map((stat, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      background: 'rgba(245,245,245,0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      border: '1px solid rgba(212,175,55,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        borderColor: '#D4AF37',
                        boxShadow: '0 5px 20px rgba(212,175,55,0.2)'
                      }
                    }}
                  >
                    <Typography sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' }, mb: 1 }}>
                      {stat.icon}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }, 
                      fontWeight: 'bold', 
                      background: "linear-gradient(135deg, #fff, #D4AF37)",
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      mb: 0.5
                    }}>
                      {stat.number}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, color: 'rgba(245,245,245,0.7)' }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Main Services Section */}
      <ServicesSection 
        serviceCategories={services} 
        onServiceClick={handleServiceClick} 
      />

      {/* Why Choose Us Section - Industrial Theme */}
      <Box sx={{ 
        py: { xs: 8, sm: 10, md: 12 }, 
        background: "linear-gradient(135deg, #111111 0%, #0F172A 50%, #1A1A1A 100%)",
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Industrial Background Elements */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          pointerEvents: 'none'
        }}>
          <Box sx={{
            position: 'absolute',
            bottom: '5%',
            left: '10%',
            animation: 'rotate 35s linear infinite'
          }}>
            <EngineeringIcon sx={{ fontSize: 150 }} />
          </Box>
        </Box>

        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 5, sm: 6, md: 8 } }}>
              <motion.div variants={fadeInUp}>
                <Chip
                  icon={<TrendingUpIcon />}
                  label="Why Choose Us"
                  sx={{
                    bgcolor: "rgba(212,175,55,0.2)",
                    color: "#D4AF37",
                    mb: 2,
                    '& .MuiChip-icon': { color: "#D4AF37" }
                  }}
                />
                <Typography variant="h2" sx={{
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                  fontWeight: 'bold',
                  background: "linear-gradient(135deg, #fff, #D4AF37)",
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 2
                }}>
                  Why Choose Us?
                </Typography>
                <Typography sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  color: 'rgba(245,245,245,0.8)',
                  maxWidth: '600px',
                  mx: 'auto'
                }}>
                  We're committed to providing the best industrial service experience
                </Typography>
              </motion.div>
            </Box>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: { xs: 2, sm: 3 }
            }}>
              {[
                { icon: '⚡', title: 'Quick Response', desc: 'Get a response within 30 minutes of your inquiry', color: '#D4AF37' },
                { icon: '💰', title: 'Best Price Guarantee', desc: 'Competitive pricing with no hidden charges', color: '#2ecc71' },
                { icon: '🔧', title: 'Expert Professionals', desc: 'Verified and experienced service providers', color: '#3498db' },
                { icon: '⭐', title: 'Quality Assurance', desc: '100% satisfaction guaranteed on all services', color: '#9b59b6' }
              ].map((item, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Paper
                    elevation={0}
                    sx={{
                      textAlign: 'center',
                      p: { xs: 3, sm: 4 },
                      borderRadius: 3,
                      background: 'rgba(245,245,245,0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        borderColor: item.color,
                        boxShadow: `0 10px 30px ${item.color}20`
                      }
                    }}
                  >
                    <Typography sx={{ fontSize: { xs: 48, sm: 56 }, mb: 2 }}>
                      {item.icon}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }, 
                      fontWeight: 'bold', 
                      color: '#fff',
                      mb: 1
                    }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: 'rgba(245,245,245,0.7)', lineHeight: 1.6 }}>
                      {item.desc}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section - Industrial Theme */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >

          {/* Animated Overlay */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(245,245,245,0.1), transparent)',
            transform: 'translateX(-100%)',
            animation: 'gradientShift 6s infinite',
            pointerEvents: 'none'
          }} />
          
        {/* CTA Section - Industrial Theme */}
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
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
        top: '10%',
        left: '5%',
        animation: 'rotate 35s linear infinite'
      }}>
        <EngineeringIcon sx={{ fontSize: 150 }} />
      </Box>
      <Box sx={{
        position: 'absolute',
        bottom: '15%',
        right: '8%',
        animation: 'rotateReverse 30s linear infinite'
      }}>
        <FactoryIcon sx={{ fontSize: 180 }} />
      </Box>
    </Box>

    {/* Animated Gradient Overlay */}
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(90deg, transparent, rgba(245,245,245,0.03), transparent)',
      transform: 'translateX(-100%)',
      animation: 'gradientShift 6s infinite',
      pointerEvents: 'none'
    }} />

    {/* Floating Particles */}
    {[...Array(20)].map((_, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          background: `rgba(212,175,55,${Math.random() * 0.3 + 0.1})`,
          borderRadius: '50%',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 8 + 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
          pointerEvents: 'none'
        }}
      />
    ))}

    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
      <Box sx={{ textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Industrial Badge */}
          <Chip
            icon={<EngineeringIcon />}
            label="24/7 Industrial Support"
            sx={{
              bgcolor: "rgba(212,175,55,0.2)",
              color: "#D4AF37",
              mb: 3,
              '& .MuiChip-icon': { color: "#D4AF37" }
            }}
          />

          <Typography 
            variant="h2" 
            sx={{
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
              fontWeight: 'bold',
              background: "linear-gradient(135deg, #fff, #D4AF37)",
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 2
            }}
          >
            Need Help Finding the Right Service?
          </Typography>

          <Typography sx={{
            fontSize: { xs: '0.9rem', sm: '1rem' },
            color: 'rgba(245,245,245,0.8)',
            maxWidth: '600px',
            mx: 'auto',
            mb: 4,
            lineHeight: 1.6
          }}>
            Contact us today and let our industrial experts help you choose the perfect service for your needs
          </Typography>

          {/* Stats Badges */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2, 
            mb: 4,
            flexWrap: 'wrap'
          }}>
            {[
              { icon: '⚡', text: 'Quick Response', color: '#D4AF37' },
              { icon: '⭐', text: 'Expert Advice', color: '#D4AF37' },
              { icon: '🔧', text: 'Free Consultation', color: '#D4AF37' }
            ].map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    px: 2,
                    py: 0.75,
                    borderRadius: '30px',
                    background: 'rgba(212,175,55,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(212,175,55,0.3)'
                  }}
                >
                  <Typography sx={{ color: '#D4AF37', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <span>{badge.icon}</span> {badge.text}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>

          {/* CTA Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/contact')}
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #B88917)',
                color: 'white',
                border: 'none',
                padding: '14px 40px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(212,175,55,0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(212,175,55,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(212,175,55,0.3)';
              }}
            >
              Contact Us Now →
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/services')}
              style={{
                background: 'transparent',
                color: '#D4AF37',
                border: '2px solid #D4AF37',
                padding: '12px 32px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(212,175,55,0.1)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Browse Services
            </motion.button>
          </Box>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Box sx={{ 
              mt: 5, 
              pt: 3, 
              borderTop: '1px solid rgba(212,175,55,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 2, sm: 3 },
              flexWrap: 'wrap'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '1.2rem' }}>✓</Typography>
                <Typography sx={{ color: 'rgba(245,245,245,0.7)', fontSize: '0.85rem' }}>
                  Trusted by 10,000+ businesses
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '1.2rem', color: '#D4AF37' }}>⭐</Typography>
                <Typography sx={{ color: 'rgba(245,245,245,0.7)', fontSize: '0.85rem' }}>
                  4.8/5 Rating
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '1.2rem' }}>🏆</Typography>
                <Typography sx={{ color: 'rgba(245,245,245,0.7)', fontSize: '0.85rem' }}>
                  500+ Projects Completed
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Box>
    </Container>
  </Box>
</motion.div>
     
      </motion.div>

      {/* Service Modal - Industrial Theme */}
      {showModal && selectedService && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}
        onClick={handleCloseModal}>
          <Box sx={{
            background: 'linear-gradient(135deg, #0F172A, #111111)',
            borderRadius: '24px',
            p: { xs: 3, sm: 4 },
            maxWidth: '550px',
            width: '90%',
            maxHeight: '85vh',
            overflowY: 'auto',
            position: 'relative',
            animation: 'slideUp 0.3s ease',
            border: '1px solid rgba(212,175,55,0.3)',
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'rgba(245,245,245,0.1)', borderRadius: '10px' },
            '&::-webkit-scrollbar-thumb': { background: '#D4AF37', borderRadius: '10px' }
          }}
          onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '20px',
                background: 'rgba(0,0,0,0.3)',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(212,175,55,0.5)'; }}
              onMouseLeave={(e) => { e.target.style.background = 'rgba(0,0,0,0.3)'; }}
            >
              ×
            </button>
            
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
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Box sx={{ 
                    fontSize: '64px', 
                    display: 'inline-block',
                    background: 'rgba(212,175,55,0.2)',
                    borderRadius: '50%',
                    p: 2
                  }}>
                    {selectedService.emoji || "🔧"}
                  </Box>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#D4AF37', textAlign: 'center', mb: 1.5 }}>
                  {selectedService.name}
                </Typography>
                
                {selectedService.popular && (
                  <Box sx={{
                    background: 'linear-gradient(135deg, #D4AF37, #B88917)',
                    color: 'white',
                    textAlign: 'center',
                    px: 1.5,
                    py: 0.75,
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    width: 'fit-content',
                    mx: 'auto',
                    mb: 2.5
                  }}>
                    🔥 Popular Service
                  </Box>
                )}
                
                <Box sx={{ background: 'rgba(245,245,245,0.05)', p: 2, borderRadius: '12px', mb: 2.5 }}>
                  {selectedService.priceStarting && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                      <Typography sx={{ fontWeight: 'bold', color: '#D4AF37', fontSize: '14px' }}>💰 Starting:</Typography>
                      <Typography sx={{ color: '#fff', fontSize: '14px' }}>{selectedService.priceStarting}</Typography>
                    </Box>
                  )}
                  {selectedService.duration && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                      <Typography sx={{ fontWeight: 'bold', color: '#D4AF37', fontSize: '14px' }}>⏱️ Duration:</Typography>
                      <Typography sx={{ color: '#fff', fontSize: '14px' }}>{selectedService.duration}</Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ mb: 2.5 }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#D4AF37', mb: 1, fontSize: '14px' }}>📄 Service Description:</Typography>
                  <Typography sx={{ fontSize: '13px', color: 'rgba(245,245,245,0.8)', lineHeight: 1.6 }}>
                    {getServiceFullDescription(selectedService)}
                  </Typography>
                </Box>

                {selectedService.features && selectedService.features.length > 0 && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#D4AF37', mb: 1, fontSize: '14px' }}>✨ Key Features:</Typography>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {selectedService.features.map((feature, idx) => (
                        <li key={idx} style={{ fontSize: '13px', color: 'rgba(245,245,245,0.7)', marginBottom: '6px' }}>{feature}</li>
                      ))}
                    </ul>
                  </Box>
                )}

                <button 
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
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Send Inquiry on WhatsApp
                </button>
              </>
            ) : (
              <>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#D4AF37', textAlign: 'center', mb: 1 }}>
                  Submit Inquiry
                </Typography>
                <Typography sx={{ fontSize: '14px', color: 'rgba(245,245,245,0.7)', textAlign: 'center', mb: 3 }}>
                  For Service: {truncateText(selectedService.name, 50)}
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { name: "name", placeholder: "Full Name *", type: "text" },
                    { name: "phone", placeholder: "Phone Number *", type: "tel" },
                    { name: "email", placeholder: "Email Address *", type: "email" },
                    { name: "address", placeholder: "Your Address *", type: "text" }
                  ].map((field) => (
                    <Box key={field.name}>
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: `1px solid ${formErrors[field.name] ? '#f44336' : 'rgba(212,175,55,0.3)'}`,
                          borderRadius: '12px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'rgba(245,245,245,0.1)',
                          color: '#fff'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                        onBlur={(e) => !formErrors[field.name] && (e.target.style.borderColor = 'rgba(212,175,55,0.3)')}
                      />
                      {formErrors[field.name] && <Typography sx={{ color: '#f44336', fontSize: '11px', mt: 0.5 }}>{formErrors[field.name]}</Typography>}
                    </Box>
                  ))}
                  
                  <Box>
                    <textarea
                      name="message"
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
                        color: '#fff'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.3)'}
                    />
                  </Box>
                  
                  <button 
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
                      opacity: submitting ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit & Send to WhatsApp'}
                  </button>
                  <button 
                    onClick={() => setShowInquiryForm(false)}
                    style={{
                      width: '100%',
                      background: 'rgba(245,245,245,0.1)',
                      color: '#fff',
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
                    Back to Service Details
                  </button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{
            background: 'linear-gradient(135deg, #4a0e0e, #2a0a0a)',
            color: '#fff',
            border: '1px solid #e74c3c'
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
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

export default ServicesPage;
