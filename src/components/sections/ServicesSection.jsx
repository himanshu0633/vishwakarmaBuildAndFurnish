import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Typography,
  Modal,
  IconButton,
  Paper,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Button,
  TextField,
  InputAdornment
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EngineeringIcon from "@mui/icons-material/Engineering";
import FactoryIcon from "@mui/icons-material/Factory";
import BuildIcon from "@mui/icons-material/Build";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MessageIcon from "@mui/icons-material/Message";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import { motion } from "framer-motion";

import axiosInstance, { logStaticAssetUrl } from "../../../utils/axiosConfig";
import {
  getCategoryEmoji,
  getCategoryName,
  getServiceDescription,
  getServiceFullDescription
} from "../../utils/catalogSchema";

/* ================= ANIMATION ================= */

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

/* ================= COMPONENT ================= */

const ServicesSection = () => {

  const theme = useTheme();
  const navigate = useNavigate();
  const fullScreen =
    useMediaQuery(theme.breakpoints.down("sm"));

  /* ================= STATES ================= */

  const [selectedCategory, setSelectedCategory] =
    useState(0);

  const [selectedService, setSelectedService] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [serviceCategories,
    setServiceCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [visibleServices,
    setVisibleServices] =
    useState(6);

  const [sliderTick, setSliderTick] =
    useState(0);

  const [submitting,
    setSubmitting] =
    useState(false);

  const [formErrors,
    setFormErrors] =
    useState({});

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      email: "",
      address: "",
      message: ""
    });

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSliderTick(prev => prev + 1);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const fetchServices = async () => {

    try {

      setLoading(true);

      const res =
        await axiosInstance.get("/categories");

      if (res.data.success) {

        const sorted =
          res.data.data.sort(
            (a, b) =>
              (a.order || 0) -
              (b.order || 0)
          );

        setServiceCategories(sorted);

        setSelectedCategory(0);

      } else {

        setError("Invalid categories data");

      }

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        "Server connection failed"
      );

    } finally {

      setLoading(false);

    }

  };

  /* ================= CATEGORY ================= */

  const activeCategory =
    serviceCategories?.[selectedCategory] || {};

  const servicesList =
    activeCategory?.services || [];

  /* ================= CLICK ================= */

  const handleServiceClick = (service) => {
    if (service.slug) {
      navigate(`/services/${service.slug}`);
      return;
    }

    setSelectedService(service);

    setShowModal(true);

    setFormErrors({});

    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      message: ""
    });

  };

  /* ================= FORM ================= */

  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };

  /* ================= VALIDATION ================= */

  const validateForm = () => {

    let errors = {};

    if (!formData.name.trim())
      errors.name = "Name required";

    if (!/^[0-9]{10}$/.test(formData.phone))
      errors.phone = "Valid phone required";

    if (!formData.email.includes("@"))
      errors.email = "Valid email required";

    if (!formData.address.trim())
      errors.address = "Address required";

    return errors;

  };

  /* ================= SUBMIT ================= */

  const handleSubmitInquiry = async () => {

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {

      setFormErrors(errors);

      return;

    }

    try {

      setSubmitting(true);

      await axiosInstance.post("/inquiries", {

        serviceId:
          selectedService._id,

        customerName:
          formData.name,

        phone:
          formData.phone,

        email:
          formData.email,

        address:
          formData.address,

        message:
          formData.message

      });

      /* WhatsApp */

      const msg =
        `Service: ${selectedService.name}
Name: ${formData.name}
Phone: ${formData.phone}`;

      window.open(
        `https://wa.me/8288081878?text=${encodeURIComponent(msg)}`,
        "_blank"
      );

      setShowModal(false);

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Submit failed"
      );

    } finally {

      setSubmitting(false);

    }

  };

  /* ================= LOAD MORE ================= */

  const displayedServices =
    servicesList.slice(0, visibleServices);

  const loadMoreServices =
    () =>
      setVisibleServices(prev =>
        prev + 6
      );

  const getServiceImages = (service) => [
    ...(service.images || []),
    ...(service.beforeImages || []),
    ...(service.afterImages || [])
  ];

  /* ================= LOADING ================= */

  if (loading) {

    return (

      <Box
        textAlign="center"
        py={10}
      >

        <CircularProgress />

        <Typography mt={2}>
          Loading Services...
        </Typography>

      </Box>

    );
  }

  /* ================= UI ================= */

  return (

    <>

      <Box
        sx={{
          py: { xs: 6, md: 10 },
          background:
            "linear-gradient(135deg,#111111,#0F172A,#1A1A1A)"
        }}
      >

        <Container maxWidth="lg">

          {/* HEADER */}

          <Box textAlign="center" mb={{ xs: 4, md: 6 }}>

            <Chip
              icon={<EngineeringIcon />}
              label="Industrial Services"
              sx={{
                bgcolor:
                  "rgba(212,175,55,0.2)",
                color: "#D4AF37",
                mb: 2
              }}
            />

            <Typography
              variant="h3"
              fontWeight="bold"
              color="#F5F5F5"
              sx={{
                fontSize: { xs: "2rem", sm: "2.4rem", md: "3rem" },
                lineHeight: 1.15
              }}
            >

              Our Services

            </Typography>

          </Box>

          {/* CATEGORY BUTTONS WITH ICONS */}

          <Box
            sx={{
              display: "flex",
              gap: 1,
              overflowX: "auto",
              mb: 4,
              pb: 1,
              px: { xs: 0.5, md: 0 },
              scrollSnapType: "x mandatory",
              "&::-webkit-scrollbar": {
                height: "6px"
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(245,245,245,0.1)",
                borderRadius: "10px"
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#D4AF37",
                borderRadius: "10px"
              }
            }}
          >

            {serviceCategories.map(
              (cat, i) => (

                <Button
                  key={cat._id}

                  onClick={() => {

                    setSelectedCategory(i);

                    setVisibleServices(6);

                  }}

                  sx={{

                    borderRadius: "30px",
                    px: 2,
                    py: 1,
                    minWidth: { xs: 150, md: "auto" },
                    whiteSpace: "nowrap",
                    scrollSnapAlign: "start",

                    background:

                      selectedCategory === i
                        ? "linear-gradient(135deg,#D4AF37,#B88917)"
                        : "rgba(245,245,245,0.1)",

                    color: "#F5F5F5",
                    
                    "&:hover": {
                      background: selectedCategory === i
                        ? "linear-gradient(135deg,#D4AF37,#B88917)"
                        : "rgba(245,245,245,0.2)",
                    }

                  }}

                >

                  <Box component="span" sx={{ mr: 1, fontSize: "1.2rem" }}>
                    {getCategoryEmoji(cat)}
                  </Box>

                  {getCategoryName(cat)}

                </Button>

              ))}

          </Box>

          {/* SERVICES GRID WITH SERVICE ICONS */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {

                xs: "1fr",

                sm: "1fr 1fr",

                md: "1fr 1fr 1fr 1fr"

              },

              gap: 3,
              alignItems: "stretch",
              gridAutoRows: "1fr"

            }}
          >

            {displayedServices.map(service => {
              const serviceImages =
                getServiceImages(service);

              const activeImage =
                serviceImages.length > 0
                  ? logStaticAssetUrl(
                      `services-card:${service.name}`,
                      serviceImages[
                        sliderTick %
                        serviceImages.length
                      ]
                    )
                  : "";

              return (

              <motion.div
                key={service._id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{ height: "100%" }}
              >

                <Paper
                  onClick={() =>
                    handleServiceClick(service)
                  }

                  sx={{

                    p: 3,
                    px: { xs: 2.25, md: 3 },

                    cursor: "pointer",

                    borderRadius: { xs: "14px", md: "20px" },

                    background: activeImage
                      ? `linear-gradient(180deg, rgba(17,17,17,0.55), rgba(15,23,42,0.9)), url("${activeImage}") center/cover no-repeat`
                      : "rgba(245,245,245,0.05)",

                    color: "#F5F5F5",

                    transition: "all 0.3s ease",
                    minHeight: { xs: 220, md: 240 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 1,
                    overflow: "hidden",
                    position: "relative",
                    border: activeImage
                      ? "1px solid rgba(212,175,55,0.24)"
                      : "1px solid transparent",

                    "&:hover": {

                      border:
                        "1px solid #D4AF37",
                      transform: "translateY(-5px)",
                      background: "rgba(245,245,245,0.1)"

                    }

                  }}
                >
                  <Box>

                  {/* Service Icon */}
                  <Box
                    sx={{
                      fontSize: "2.5rem",
                      mb: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {service.emoji || "🔧"}
                  </Box>

                  <Typography
                    fontWeight="bold"
                    variant="h6"
                    textAlign="center"
                    mb={1}
                  >

                    {service.name}

                  </Typography>

                  <Typography
                    fontSize="13px"
                    textAlign="center"
                    color="rgba(245,245,245,0.7)"
                    sx={{ lineHeight: 1.6, overflowWrap: "anywhere" }}
                  >

                    {getServiceDescription(service)}

                  </Typography>
                  </Box>

                  <Box>
                  {service.priceStarting && (
                    <Typography
                      fontSize="12px"
                      textAlign="center"
                      color="#D4AF37"
                      fontWeight="bold"
                      mt={1}
                    >
                      {service.priceStarting}
                    </Typography>
                  )}

                  {(service.popular || service.featured) && (
                    <Chip
                      label={service.featured ? "Featured" : "Popular"}
                      size="small"
                      sx={{
                        mt: 1.5,
                        bgcolor: "#D4AF37",
                        color: "#F5F5F5",
                        fontSize: "10px",
                        display: "block",
                        mx: "auto",
                        width: "fit-content"
                      }}
                    />
                  )}
                  </Box>

                </Paper>

              </motion.div>

              );
            })}

          </Box>

          {/* LOAD MORE */}

          {servicesList.length >
            visibleServices && (

            <Box
              textAlign="center"
              mt={4}
            >

              <Button
                onClick={loadMoreServices}
                variant="outlined"
                sx={{
                  borderColor: "#D4AF37",
                  color: "#D4AF37",
                  "&:hover": {
                    borderColor: "#D4AF37",
                    background: "rgba(212,175,55,0.1)"
                  }
                }}
              >

                Load More ({servicesList.length - visibleServices} remaining)

              </Button>

            </Box>

          )}

        </Container>

      </Box>

      {/* ================= MODAL ================= */}

      <Modal
        open={showModal}
        onClose={() =>
          setShowModal(false)
        }
      >

        <Box
          sx={{

            position: "absolute",

            top: "50%",

            left: "50%",

            transform:
              "translate(-50%, -50%)",

            width:
              fullScreen
                ? "95%"
                : 500,

            bgcolor: "#111111",

            p: 3,

            borderRadius: 4,

            maxHeight: "90vh",
            overflowY: "auto"

          }}
        >

          <IconButton
            onClick={() =>
              setShowModal(false)
            }
            sx={{
              position: "absolute",
              right: 10,
              top: 10,
              color: "#F5F5F5",
              zIndex: 1
            }}
          >

            <CloseIcon />

          </IconButton>

          {/* Selected Service Info */}
          {selectedService && (
            <Box textAlign="center" mb={3}>
              <Box sx={{ fontSize: "3rem", mb: 1 }}>
                {selectedService.emoji || "🔧"}
              </Box>
              <Typography
                variant="h5"
                color="#D4AF37"
                fontWeight="bold"
              >
                {selectedService.name}
              </Typography>
              <Typography color="rgba(245,245,245,0.7)" fontSize="14px">
                {getServiceFullDescription(selectedService)}
              </Typography>
            </Box>
          )}

          <Typography
            variant="h6"
            color="#F5F5F5"
            textAlign="center"
            mb={3}
          >

            Send Inquiry

          </Typography>

          <Box
            display="flex"
            flexDirection="column"
            gap={2}
          >

            {/* NAME */}

            <TextField
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              InputProps={{
                startAdornment: (

                  <InputAdornment position="start">

                    <PersonIcon />

                  </InputAdornment>

                )
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#F5F5F5",
                  "& fieldset": {
                    borderColor: "rgba(245,245,245,0.3)"
                  },
                  "&:hover fieldset": {
                    borderColor: "#D4AF37"
                  }
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(245,245,245,0.7)"
                }
              }}
            />

            {/* PHONE */}

            <TextField
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              InputProps={{
                startAdornment: (

                  <InputAdornment position="start">

                    <PhoneIcon />

                  </InputAdornment>

                )
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#F5F5F5",
                  "& fieldset": {
                    borderColor: "rgba(245,245,245,0.3)"
                  },
                  "&:hover fieldset": {
                    borderColor: "#D4AF37"
                  }
                }
              }}
            />

            {/* EMAIL */}

            <TextField
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              InputProps={{
                startAdornment: (

                  <InputAdornment position="start">

                    <EmailIcon />

                  </InputAdornment>

                )
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#F5F5F5",
                  "& fieldset": {
                    borderColor: "rgba(245,245,245,0.3)"
                  },
                  "&:hover fieldset": {
                    borderColor: "#D4AF37"
                  }
                }
              }}
            />

            {/* ADDRESS */}

            <TextField
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              error={!!formErrors.address}
              helperText={formErrors.address}
              InputProps={{
                startAdornment: (

                  <InputAdornment position="start">

                    <LocationOnIcon />

                  </InputAdornment>

                )
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#F5F5F5",
                  "& fieldset": {
                    borderColor: "rgba(245,245,245,0.3)"
                  },
                  "&:hover fieldset": {
                    borderColor: "#D4AF37"
                  }
                }
              }}
            />

            {/* MESSAGE */}

            <TextField
              name="message"
              placeholder="Message (Optional)"
              multiline
              rows={3}
              value={formData.message}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (

                  <InputAdornment position="start">

                    <MessageIcon />

                  </InputAdornment>

                )
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#F5F5F5",
                  "& fieldset": {
                    borderColor: "rgba(245,245,245,0.3)"
                  },
                  "&:hover fieldset": {
                    borderColor: "#D4AF37"
                  }
                }
              }}
            />

            <Button
              onClick={handleSubmitInquiry}
              disabled={submitting}
              startIcon={<WhatsAppIcon />}
              sx={{
                background:
                  "linear-gradient(135deg,#25D366,#128C7E)",
                color: "#F5F5F5",
                py: 1.5,
                "&:hover": {
                  background:
                    "linear-gradient(135deg,#128C7E,#075E54)"
                }
              }}
            >

              {submitting
                ? "Submitting..."
                : "Submit & Chat on WhatsApp"}

            </Button>

          </Box>

        </Box>

      </Modal>

    </>

  );

};

export default ServicesSection;
