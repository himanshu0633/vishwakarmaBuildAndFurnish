import React from "react";
import { Box, Button, Chip, Container, Paper, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CodeIcon from "@mui/icons-material/Code";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LanguageIcon from "@mui/icons-material/Language";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const phone = "9416856468";

const websiteServices = [
  "Business Website",
  "Service Website",
  "Landing Page",
  "Portfolio Website",
  "Real Estate Website",
  "Clinic / Hospital Website",
  "Academy / Institute Website",
  "Restaurant Website",
  "E-commerce Website",
  "Admin Panel & Dashboard"
];

const highlights = [
  { icon: <LanguageIcon />, title: "Modern Website", text: "Mobile-friendly pages that clearly show your services and contact options." },
  { icon: <WhatsAppIcon />, title: "Lead Enquiry Setup", text: "Call, WhatsApp, and contact form actions for faster customer enquiries." },
  { icon: <DashboardIcon />, title: "Admin Features", text: "Optional dashboard for services, blogs, gallery, enquiries, and business updates." }
];

const WebsiteInfo = () => {
  const whatsappText = encodeURIComponent(
    "Hello, I want a website like Vishwakarma Build & Furnish."
  );

  return (
    <Box sx={{ bgcolor: "#111111", color: "#F8FAFC", minHeight: "100%" }}>
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 11 },
          background:
            "linear-gradient(90deg, rgba(17,17,17,0.96), rgba(15,23,42,0.84)), url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg') center/cover no-repeat",
          borderBottom: "1px solid rgba(212,175,55,0.28)"
        }}
      >
        <Container maxWidth="lg">
          <Chip
            icon={<CodeIcon />}
            label="Website Design & Development"
            sx={{
              bgcolor: "rgba(212,175,55,0.18)",
              color: "#D4AF37",
              fontWeight: 900,
              mb: 2,
              "& .MuiChip-icon": { color: "#D4AF37" }
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2.35rem", md: "4rem" },
              lineHeight: 1.08,
              mb: 2,
              maxWidth: 820
            }}
          >
            Want a Website Like This?
          </Typography>
          <Typography
            sx={{
              color: "rgba(248,250,252,0.82)",
              fontSize: { xs: "1rem", md: "1.18rem" },
              lineHeight: 1.75,
              maxWidth: 820,
              mb: 3
            }}
          >
            This website is designed to help businesses showcase their services, build trust with customers,
            and generate enquiries through calls, WhatsApp, and contact forms.
          </Typography>
          <Button
            href={`https://wa.me/91${phone}?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            title="Get Your Business Website"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: "#D4AF37",
              color: "#111827",
              fontWeight: 900,
              textTransform: "none",
              px: 3,
              py: 1.2,
              borderRadius: 2,
              "&:hover": { bgcolor: "#B88917" }
            }}
          >
            Contact on WhatsApp
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 4 }}>
          <Paper sx={panelSx}>
            <Typography variant="h4" sx={titleSx}>
              Professional Websites for Local Businesses
            </Typography>
            <Typography sx={textSx}>
              If you also want a professional website for your business, shop, service, clinic, academy,
              construction work, real estate, restaurant, or local brand, you can contact us for website
              design and development.
            </Typography>
          </Paper>

          <Paper sx={panelSx}>
            <Typography variant="h4" sx={titleSx}>
              What We Can Build
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.2 }}>
              {websiteServices.map((service) => (
                <Box key={service} sx={{ display: "flex", alignItems: "center", gap: 1, color: "rgba(248,250,252,0.82)" }}>
                  <CheckCircleIcon sx={{ color: "#D4AF37", fontSize: 19, flexShrink: 0 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: "0.94rem" }}>{service}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2.5, mb: 4 }}>
          {highlights.map((item) => (
            <Paper key={item.title} sx={{ ...panelSx, minHeight: 210 }}>
              <Box sx={{ color: "#D4AF37", mb: 1.5, "& svg": { fontSize: 34 } }}>{item.icon}</Box>
              <Typography sx={{ color: "#F8FAFC", fontWeight: 900, fontSize: "1.18rem", mb: 1 }}>
                {item.title}
              </Typography>
              <Typography sx={textSx}>{item.text}</Typography>
            </Paper>
          ))}
        </Box>

        <Paper
          sx={{
            p: { xs: 3, md: 5 },
            bgcolor: "#0F172A",
            color: "#F8FAFC",
            border: "1px solid rgba(212,175,55,0.34)",
            borderRadius: 3,
            textAlign: "center"
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 900, fontSize: { xs: "2rem", md: "3rem" }, mb: 1.5 }}>
            Ready to Build Your Business Website?
          </Typography>
          <Typography sx={{ ...textSx, maxWidth: 720, mx: "auto", mb: 3 }}>
            Share your business type, pages required, features, and reference website. We can discuss the best plan on WhatsApp.
          </Typography>
          <Button
            href={`https://wa.me/91${phone}?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            title="Chat on WhatsApp"
            variant="contained"
            startIcon={<WhatsAppIcon />}
            sx={{
              bgcolor: "#D4AF37",
              color: "#111827",
              fontWeight: 900,
              textTransform: "none",
              px: 3,
              py: 1.2,
              borderRadius: 2,
              "&:hover": { bgcolor: "#B88917" }
            }}
          >
            Contact on WhatsApp
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

const panelSx = {
  p: { xs: 3, md: 4 },
  bgcolor: "#0F172A",
  color: "#F8FAFC",
  border: "1px solid rgba(212,175,55,0.28)",
  borderRadius: 3
};

const titleSx = {
  color: "#D4AF37",
  fontWeight: 900,
  fontSize: { xs: "1.55rem", md: "2rem" },
  mb: 2
};

const textSx = {
  color: "rgba(248,250,252,0.76)",
  lineHeight: 1.75
};

export default WebsiteInfo;
