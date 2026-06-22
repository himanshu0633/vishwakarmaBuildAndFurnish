import React from "react";
import { Box, Button, Chip, Container, Paper, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import StraightenIcon from "@mui/icons-material/Straighten";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import CarpenterIcon from "@mui/icons-material/Carpenter";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const steps = [
  {
    step: "01",
    icon: <WhatsAppIcon />,
    title: "Free Consultation",
    role: "Discuss Your Need",
    desc: "Tell us your requirement for construction, furniture, or interior work.",
    details: "Call or WhatsApp us to start your project planning."
  },
  {
    step: "02",
    icon: <StraightenIcon />,
    title: "Site Visit & Measurement",
    role: "Space Check",
    desc: "Our team visits your site, checks the space, and takes accurate measurements.",
    details: "Proper planning starts with proper site understanding."
  },
  {
    step: "03",
    icon: <DesignServicesIcon />,
    title: "Design & Written Estimate",
    role: "Clear Planning",
    desc: "We provide modern designs, material options, and transparent costing with zero hidden charges.",
    details: "Clear pricing transparency before starting."
  },
  {
    step: "04",
    icon: <CarpenterIcon />,
    title: "Agreement & Execution",
    role: "Written Contract",
    desc: "We sign a formal agreement detailing the exact timeline (number of days) and cost before execution.",
    details: "Everything promised is provided in writing."
  },
  {
    step: "05",
    icon: <TaskAltIcon />,
    title: "Handover & After-Sales",
    role: "Long-term Support",
    desc: "Meticulous finishing check for timely handover, backed by reliable after-sales service.",
    details: "We provide dedicated after-sales support."
  }
];

const services = [
  "Complete House Construction",
  "Custom Furniture Manufacturing",
  "Modern Interior Solutions",
  "Sofa, Bed, Wardrobe, Modular Kitchen",
  "Trusted Contractor Services"
];

const consultationUrl =
  "https://wa.me/919416856468?text=Hello%20Vishwakarma%20Build%20%26%20Furnish%20CKD%2C%20I%20want%20a%20free%20consultation.";

const HowItWorks = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 11 },
        background: "linear-gradient(135deg, #111111 0%, #0F172A 55%, #111827 100%)",
        color: "#F8FAFC",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          variants={staggerContainer}
        >
          <Box component={motion.div} variants={fadeInUp} sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            <Chip
              icon={<HomeWorkIcon />}
              label="Our Working Process"
              sx={{
                bgcolor: "rgba(212,175,55,0.16)",
                color: "#D4AF37",
                border: "1px solid rgba(212,175,55,0.28)",
                mb: 2,
                "& .MuiChip-icon": { color: "#D4AF37" }
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.1rem" },
                color: "#F8FAFC",
                mb: 1.5
              }}
            >
              From Foundation to Furniture
            </Typography>
            <Typography
              sx={{
                maxWidth: 760,
                mx: "auto",
                color: "rgba(248,250,252,0.72)",
                fontSize: { xs: "0.98rem", md: "1.08rem" },
                lineHeight: 1.7
              }}
            >
              A simple and transparent process for premium construction, interiors, and custom furniture work.
            </Typography>
          </Box>

          {/* DESKTOP/TABLET GRID VIEW */}
          <Box
            sx={{
              display: { xs: "none", md: "grid" },
              gridTemplateColumns: { sm: "repeat(2, 1fr)", lg: "repeat(5, 1fr)" },
              gap: 2.5
            }}
          >
            {steps.map((step) => (
              <Paper
                key={step.step}
                component={motion.div}
                variants={fadeInUp}
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  height: "100%",
                  minHeight: { xs: 340, md: 370 },
                  borderRadius: 3,
                  background: "#111827",
                  border: "1px solid rgba(212,175,55,0.36)",
                  color: "#F8FAFC",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease",
                  "&:hover": {
                    transform: "translateY(-7px)",
                    borderColor: "#D4AF37",
                    boxShadow: "0 18px 42px rgba(0,0,0,0.34)"
                  }
                }}
              >
                <Typography
                  sx={{
                    position: "absolute",
                    right: 14,
                    bottom: 8,
                    color: "rgba(212,175,55,0.1)",
                    fontWeight: 900,
                    fontSize: "3.3rem",
                    lineHeight: 1,
                    zIndex: 0
                  }}
                >
                  {step.step}
                </Typography>
                <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      mx: "auto",
                      mb: 2,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(212,175,55,0.12)",
                      border: "1px solid rgba(212,175,55,0.45)",
                      color: "#D4AF37",
                      "& svg": { fontSize: 34 }
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
                    <Chip
                      label={step.role}
                      size="small"
                      sx={{ bgcolor: "rgba(248,250,252,0.08)", color: "#F8FAFC", fontWeight: 800 }}
                    />
                    <Chip
                      label={`STEP ${step.step}`}
                      size="small"
                      sx={{ bgcolor: "#D4AF37", color: "#111827", fontWeight: 900 }}
                    />
                  </Box>
                  <Box sx={{ minHeight: 52, display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                    <Typography sx={{ color: "#F8FAFC", fontWeight: 900, fontSize: "1.08rem", lineHeight: 1.25 }}>
                      {step.title}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "rgba(248,250,252,0.72)", fontSize: "0.9rem", lineHeight: 1.55, mb: 2.5 }}>
                    {step.desc}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#D4AF37",
                      bgcolor: "rgba(212,175,55,0.08)",
                      border: "1px solid rgba(212,175,55,0.18)",
                      borderRadius: 2,
                      p: 1.2,
                      fontSize: "0.78rem",
                      lineHeight: 1.45,
                      mt: "auto"
                    }}
                  >
                    {step.details}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* MOBILE TIMELINE VIEW */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexDirection: "column",
              position: "relative",
              gap: 4,
              pl: 0.5,
              py: 1
            }}
          >
            {/* Timeline Vertical Line */}
            <Box
              sx={{
                position: "absolute",
                left: "24px",
                top: "24px",
                bottom: "24px",
                width: "2px",
                bgcolor: "rgba(212, 175, 55, 0.28)",
                zIndex: 0
              }}
            />

            {steps.map((step) => (
              <Box
                key={step.step}
                component={motion.div}
                variants={fadeInUp}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2.5,
                  position: "relative",
                  zIndex: 1
                }}
              >
                {/* Timeline Icon */}
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "#111827",
                    border: "2px solid #D4AF37",
                    color: "#D4AF37",
                    flexShrink: 0,
                    boxShadow: "0 0 12px rgba(212,175,55,0.2)",
                    "& svg": { fontSize: 24 }
                  }}
                >
                  {step.icon}
                </Box>

                {/* Timeline Content */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 0.5,
                    pt: 0.25
                  }}
                >
                  {/* Step Pill */}
                  <Box
                    sx={{
                      bgcolor: "#D4AF37",
                      color: "#111111",
                      px: 1.25,
                      py: 0.35,
                      borderRadius: "4px",
                      fontSize: "9px",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}
                  >
                    STEP {step.step}
                  </Box>

                  {/* Title */}
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.15rem",
                      color: "#F8FAFC",
                      lineHeight: 1.2
                    }}
                  >
                    {step.role}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{
                      color: "rgba(248, 250, 252, 0.72)",
                      fontSize: "0.9rem",
                      lineHeight: 1.55
                    }}
                  >
                    {step.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* DESKTOP CALL TO ACTION */}
          <Paper
            component={motion.div}
            variants={fadeInUp}
            elevation={0}
            sx={{
              display: { xs: "none", md: "block" },
              mt: { xs: 4, md: 5 },
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              background: "#111827",
              border: "1px solid rgba(212,175,55,0.36)",
              textAlign: "center"
            }}
          >
            <Typography sx={{ color: "#D4AF37", fontWeight: 900, fontSize: { xs: "1.2rem", md: "1.45rem" }, mb: 2 }}>
              Vishwakarma Build & Furnish
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 1.2, mb: 3 }}>
              {services.map((service) => (
                <Chip
                  key={service}
                  label={service}
                  sx={{
                    bgcolor: "rgba(212,175,55,0.12)",
                    border: "1px solid rgba(212,175,55,0.28)",
                    color: "#F8FAFC",
                    fontWeight: 700
                  }}
                />
              ))}
            </Box>
            <Button
              href={consultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Get Free Consultation on WhatsApp"
              variant="contained"
              startIcon={<WhatsAppIcon />}
              sx={{
                bgcolor: "#D4AF37",
                color: "#111827",
                fontWeight: 900,
                px: 3.5,
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": { bgcolor: "#B88917" }
              }}
            >
              Get Free Consultation
            </Button>
          </Paper>

          {/* MOBILE CALL TO ACTION */}
          <Paper
            component="a"
            href={consultationUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Get Free Consultation on WhatsApp"
            elevation={0}
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 2,
              p: 2.25,
              mt: 4,
              borderRadius: 3,
              bgcolor: "#111827",
              border: "1px solid rgba(212,175,55,0.36)",
              textDecoration: "none",
              transition: "border-color 0.28s ease, box-shadow 0.28s ease",
              "&:hover": {
                borderColor: "#D4AF37",
                boxShadow: "0 8px 24px rgba(212,175,55,0.15)"
              }
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(212,175,55,0.12)",
                border: "1px solid rgba(212,175,55,0.35)",
                color: "#D4AF37",
                flexShrink: 0
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
              <Typography
                sx={{
                  color: "#F8FAFC",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  lineHeight: 1.2
                }}
              >
                Ready to start your project?
              </Typography>
              <Typography
                sx={{
                  color: "#D4AF37",
                  fontSize: "0.92rem",
                  fontWeight: 900,
                  lineHeight: 1.2
                }}
              >
                Get a Free Consultation
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks;
