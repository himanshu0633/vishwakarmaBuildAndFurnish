import React from "react";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const features = [
  {
    icon: "👷",
    title: "Experienced Team",
    desc: "Our skilled team brings years of experience in construction, interiors, and custom furniture manufacturing."
  },
  {
    icon: "⭐",
    title: "Premium Quality",
    desc: "We use high-quality materials and modern techniques to ensure durable and elegant results."
  },
  {
    icon: "✨",
    title: "Modern Designs",
    desc: "From luxury interiors to stylish furniture, we create modern spaces designed for comfort and beauty."
  },
  {
    icon: "⏳",
    title: "On-Time Delivery",
    desc: "We value your time and complete every project with proper planning and timely execution."
  },
  {
    icon: "💰",
    title: "Affordable Pricing",
    desc: "Premium services at competitive pricing with complete transparency and customer satisfaction."
  }
];

const consultationUrl =
  "https://wa.me/919416856468?text=Hello%20Vishwakarma%20Build%20%26%20Furnish%20CKD%2C%20I%20want%20a%20free%20consultation.";

const WhyChooseUs = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 11 },
        background: "#0F172A",
        color: "#F8FAFC"
      }}
    >
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={staggerContainer}
        >
          <Box component={motion.div} variants={fadeInUp} sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "Poppins, Montserrat, sans-serif",
                fontWeight: 900,
                fontSize: { xs: "2rem", md: "2.8rem" },
                color: "#F8FAFC",
                mb: 1.5
              }}
            >
              Why Choose Vishwakarma Build & Furnish?
            </Typography>
            <Typography
              sx={{
                maxWidth: 780,
                mx: "auto",
                color: "rgba(248,250,252,0.72)",
                fontSize: { xs: "0.98rem", md: "1.08rem" },
                lineHeight: 1.7
              }}
            >
              Delivering premium construction, interiors, and furniture solutions with quality craftsmanship and modern designs.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(6, 1fr)" },
              gap: 3
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={feature.title}
                component={motion.div}
                variants={fadeInUp}
                sx={{
                  gridColumn: {
                    xs: "auto",
                    sm: index === 4 ? "1 / -1" : "auto",
                    md: index < 3 ? "span 2" : index === 3 ? "2 / span 2" : "4 / span 2"
                  }
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    minHeight: 230,
                    p: { xs: 3, md: 3.5 },
                    borderRadius: 3,
                    background: "#111827",
                    border: "1px solid rgba(212,175,55,0.42)",
                    color: "#F8FAFC",
                    textAlign: "center",
                    transition: "transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease",
                    "&:hover": {
                      transform: "translateY(-7px)",
                      borderColor: "#D4AF37",
                      boxShadow: "0 18px 42px rgba(0,0,0,0.34)"
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      mx: "auto",
                      mb: 2,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(212,175,55,0.12)",
                      border: "1px solid rgba(212,175,55,0.45)",
                      color: "#D4AF37",
                      fontSize: "2rem",
                      lineHeight: 1
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography sx={{ fontWeight: 900, fontSize: "1.18rem", mb: 1, color: "#F8FAFC" }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(248,250,252,0.7)", fontSize: "0.94rem", lineHeight: 1.65 }}>
                    {feature.desc}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          <Box component={motion.div} variants={fadeInUp} sx={{ textAlign: "center", mt: { xs: 4, md: 5 } }}>
            <Button
              href={consultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<WhatsAppIcon />}
              sx={{
                bgcolor: "#D4AF37",
                color: "#0F172A",
                fontWeight: 900,
                px: 3.5,
                py: 1.25,
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "0 12px 30px rgba(212,175,55,0.24)",
                "&:hover": {
                  bgcolor: "#B88917",
                  boxShadow: "0 16px 36px rgba(212,175,55,0.32)"
                }
              }}
            >
              Get Free Consultation
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WhyChooseUs;
