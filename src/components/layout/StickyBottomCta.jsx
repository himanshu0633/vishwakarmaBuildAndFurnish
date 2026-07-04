import React from 'react';
import { Paper, Button } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const StickyBottomCta = () => {
  const phone = "9416856468";
  const message = "Hello Vishwakarma Build & Furnish, I want to inquire about your services.";
  
  return (
    <Paper
      elevation={10}
      sx={{
        position: "fixed",
        bottom: 12,
        left: "50%",
        transform: "translateX(-50%)",
        width: "92%",
        maxWidth: 480,
        bgcolor: "rgba(15,23,42,0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(212,175,55,0.35)",
        borderRadius: "50px",
        py: 1,
        px: 2,
        display: { xs: "flex", md: "none" }, // Only show on mobile
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        zIndex: 9999,
        boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
      }}
    >
      <Button
        variant="contained"
        startIcon={<PhoneIcon />}
        href={`tel:+91${phone}`}
        sx={{
          bgcolor: "#D4AF37",
          color: "#111827",
          fontWeight: 950,
          borderRadius: "50px",
          textTransform: "none",
          fontSize: "0.85rem",
          flex: 1,
          py: 1,
          "&:hover": { bgcolor: "#B88917" }
        }}
      >
        Call
      </Button>
      <Button
        variant="contained"
        startIcon={<WhatsAppIcon />}
        href={`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          bgcolor: "#25D366",
          color: "#FFFFFF",
          fontWeight: 950,
          borderRadius: "50px",
          textTransform: "none",
          fontSize: "0.85rem",
          flex: 1,
          py: 1,
          "&:hover": { bgcolor: "#20BA56" }
        }}
      >
        WhatsApp
      </Button>
    </Paper>
  );
};

export default StickyBottomCta;
