import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axiosInstance from "../../utils/axiosConfig";

const phone = "9416856468";
const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.219096391534!2d76.28924219999999!3d28.593203299999992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391285dbfc386d4b%3A0xefc5900fb3ffdd3b!2sVishwakarma%20Build%20and%20Furnish!5e0!3m2!1sen!2sin!4v1778664056745!5m2!1sen!2sin";
const quickServices = ["Wooden Doors", "Plywood Doors", "Wooden Windows", "Sofa Set", "Wardrobe"];
const trustItems = ["Free Consultation", "Custom Designs", "Premium Quality", "Affordable Pricing"];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    serviceRequired: "",
    message: "",
    budget: "",
    location: ""
  });
  const [uploadName, setUploadName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (event) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !/^[0-9]{10}$/.test(formData.phoneNumber.trim()) || !formData.serviceRequired.trim()) {
      setSnackbar({ open: true, message: "Name, valid phone number, and service required are mandatory", severity: "error" });
      return;
    }

    const message = [
      formData.message,
      formData.budget ? `Budget: ${formData.budget}` : "",
      formData.location ? `Location: ${formData.location}` : "",
      uploadName ? `Uploaded image reference: ${uploadName}` : ""
    ].filter(Boolean).join("\n");

    try {
      setSubmitting(true);
      await axiosInstance.post("/inquiries", {
        customerName: formData.name.trim(),
        phone: formData.phoneNumber.trim(),
        serviceName: formData.serviceRequired.trim(),
        categoryName: "Contact",
        address: formData.location.trim() || "Not provided",
        message
      });

      const whatsappText = `Hello Vishwakarma Build & Furnish CKD,%0AName: ${encodeURIComponent(formData.name)}%0APhone: ${encodeURIComponent(formData.phoneNumber)}%0AService: ${encodeURIComponent(formData.serviceRequired)}%0AMessage: ${encodeURIComponent(message || "I want a free quote.")}`;
      window.open(`https://wa.me/91${phone}?text=${whatsappText}`, "_blank");
      setSnackbar({ open: true, message: "Quote request submitted successfully", severity: "success" });
      setFormData({ name: "", phoneNumber: "", serviceRequired: "", message: "", budget: "", location: "" });
      setUploadName("");
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || "Submission failed", severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#111111", color: "#F8FAFC" }}>
      <Box
        sx={{
          py: { xs: 8, md: 11 },
          background: "linear-gradient(90deg, rgba(17,17,17,0.94), rgba(15,23,42,0.78)), url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg') center/cover no-repeat",
          borderBottom: "1px solid rgba(212,175,55,0.28)"
        }}
      >
        <Container>
          <Chip label="Contact Us" sx={{ bgcolor: "rgba(212,175,55,0.18)", color: "#D4AF37", fontWeight: 900, mb: 2 }} />
          <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: "2.4rem", md: "4rem" }, mb: 1.5 }}>
            Contact Vishwakarma Build & Furnish
          </Typography>
          <Typography sx={{ color: "rgba(248,250,252,0.82)", fontSize: { xs: "1rem", md: "1.2rem" }, maxWidth: 720 }}>
            Let’s Build Your Dream Space Together
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 6, md: 9 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" }, gap: 2.5, mb: 5 }}>
          {[
            { icon: <PhoneIcon />, title: "Phone", text: `+91 ${phone}`, href: `tel:+91${phone}` },
            { icon: <WhatsAppIcon />, title: "WhatsApp", text: "Chat on WhatsApp", href: `https://wa.me/91${phone}` },
            { icon: <EmailIcon />, title: "Email", text: "info@vishwakarmabuildfurnish.com", href: "mailto:info@vishwakarmabuildfurnish.com" },
            { icon: <LocationOnIcon />, title: "Location", text: "Charkhi Dadri, Haryana", href: "https://www.google.com/maps/search/?api=1&query=Charkhi+Dadri+Haryana" }
          ].map(card => (
            <Paper
              key={card.title}
              component="a"
              href={card.href}
              target={card.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              sx={{ p: 2.5, minWidth: 0, textDecoration: "none", bgcolor: "#0F172A", color: "#F8FAFC", border: "1px solid rgba(212,175,55,0.28)", borderRadius: 3 }}
            >
              <Box sx={{ color: "#D4AF37", mb: 1 }}>{card.icon}</Box>
              <Typography sx={{ fontWeight: 900 }}>{card.title}</Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.72)", fontSize: "0.92rem", overflowWrap: "anywhere" }}>{card.text}</Typography>
            </Paper>
          ))}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" }, gap: 3, mb: 5 }}>
          <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: "#0F172A", color: "#F8FAFC", border: "1px solid rgba(212,175,55,0.28)", borderRadius: 3 }}>
            <Typography variant="h4" sx={{ color: "#D4AF37", fontWeight: 900, mb: 2 }}>Get Free Quote</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth sx={fieldSx} />
              <TextField name="phoneNumber" label="Phone Number" value={formData.phoneNumber} onChange={handleChange} fullWidth sx={fieldSx} />
              <TextField name="serviceRequired" label="Service Required" value={formData.serviceRequired} onChange={handleChange} fullWidth sx={fieldSx} />
              <TextField name="budget" label="Budget (Optional)" value={formData.budget} onChange={handleChange} fullWidth sx={fieldSx} />
              <TextField name="location" label="Location (Optional)" value={formData.location} onChange={handleChange} fullWidth sx={fieldSx} />
              <Button component="label" startIcon={<UploadFileIcon />} variant="outlined" sx={{ minHeight: 56, borderColor: "#D4AF37", color: "#D4AF37", textTransform: "none" }}>
                Upload Image
                <input hidden type="file" accept="image/*" onChange={(event) => setUploadName(event.target.files?.[0]?.name || "")} />
              </Button>
            </Box>
            {uploadName && <Typography sx={{ color: "rgba(248,250,252,0.68)", mt: 1 }}>{uploadName}</Typography>}
            <TextField name="message" label="Message" value={formData.message} onChange={handleChange} fullWidth multiline rows={4} sx={{ ...fieldSx, mt: 2 }} />
            <Button onClick={handleSubmit} disabled={submitting} variant="contained" sx={{ mt: 2.5, bgcolor: "#D4AF37", color: "#111827", fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#B88917" } }}>
              {submitting ? "Submitting..." : "Get Free Quote"}
            </Button>
          </Paper>

          <Paper sx={{ overflow: "hidden", minHeight: 430, bgcolor: "#0F172A", border: "1px solid rgba(212,175,55,0.28)", borderRadius: 3 }}>
            <Box
              component="iframe"
              title="Vishwakarma Build and Furnish Location"
              src={googleMapsEmbedUrl}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sx={{ width: "100%", height: "100%", minHeight: 430, border: 0 }}
            />
          </Paper>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 5 }}>
          <Paper sx={panelSx}>
            <Typography variant="h5" sx={panelTitleSx}>Services Quick Links</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {quickServices.map(service => <Chip key={service} label={service} component="a" href={`/services/${service.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-")}-charkhi-dadri`} clickable sx={chipSx} />)}
            </Box>
          </Paper>
          <Paper sx={panelSx}>
            <Typography variant="h5" sx={panelTitleSx}>Business Hours</Typography>
            <Typography sx={{ color: "rgba(248,250,252,0.78)" }}>Monday - Saturday</Typography>
            <Typography sx={{ color: "#D4AF37", fontWeight: 900, fontSize: "1.25rem" }}>9:00 AM - 7:00 PM</Typography>
          </Paper>
        </Box>

        <Paper sx={{ ...panelSx, textAlign: "center", mb: 5 }}>
          <Typography variant="h5" sx={panelTitleSx}>Why Contact Us</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1.2, flexWrap: "wrap" }}>
            {trustItems.map(item => <Chip key={item} label={`✅ ${item}`} sx={chipSx} />)}
          </Box>
        </Paper>

        <Paper sx={{ p: { xs: 3, md: 5 }, textAlign: "center", bgcolor: "#0F172A", border: "1px solid rgba(212,175,55,0.34)", borderRadius: 3 }}>
          <Typography variant="h3" sx={{ color: "#F8FAFC", fontWeight: 900, mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}>Ready To Start Your Project?</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
            <Button href={`tel:+91${phone}`} variant="contained" startIcon={<PhoneIcon />} sx={{ bgcolor: "#D4AF37", color: "#111827", fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#B88917" } }}>Call Now</Button>
            <Button href={`https://wa.me/91${phone}`} target="_blank" rel="noopener noreferrer" variant="outlined" startIcon={<WhatsAppIcon />} sx={{ borderColor: "#D4AF37", color: "#D4AF37", fontWeight: 900, textTransform: "none" }}>WhatsApp Us</Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
    '&:hover fieldset': { borderColor: '#D4AF37' },
    '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
  },
  '& .MuiInputLabel-root': { color: 'rgba(248,250,252,0.72)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' }
};

const panelSx = {
  p: 3,
  bgcolor: "#0F172A",
  color: "#F8FAFC",
  border: "1px solid rgba(212,175,55,0.28)",
  borderRadius: 3
};

const panelTitleSx = { color: "#D4AF37", fontWeight: 900, mb: 2 };

const chipSx = {
  bgcolor: "rgba(212,175,55,0.12)",
  border: "1px solid rgba(212,175,55,0.25)",
  color: "#F8FAFC",
  fontWeight: 700
};

export default ContactPage;
