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
  },
  {
    icon: "📝",
    title: "Written Agreement",
    desc: "Everything we promise is provided in writing. We offer a formal agreement signed according to terms and conditions."
  },
  {
    icon: "🛡️",
    title: "No Hidden Charges",
    desc: "Complete budget transparency. What we quote is what you pay—absolutely zero surprise fees or hidden costs."
  },
  {
    icon: "🛠️",
    title: "After-Sales Service",
    desc: "Our support continues even after handover. We provide reliable after-sales maintenance and service."
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
              variant="h2"
              component="h2"
              sx={{
                fontFamily: "Poppins, Montserrat, sans-serif",
                fontWeight: 900,
                fontSize: { xs: "2rem", md: "2.8rem" },
                color: "#F8FAFC",
                mb: 1.5
              }}
            >
              Why Choose Us for Your Dream Home in Haryana?
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

          {/* DESKTOP/TABLET GRID VIEW */}
          <Box
            sx={{
              display: { xs: "none", md: "grid" },
              gridTemplateColumns: { sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              gap: 3
            }}
          >
            {features.map((feature) => (
              <Box
                key={feature.title}
                component={motion.div}
                variants={fadeInUp}
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

          {/* MOBILE TIMELINE VIEW */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexDirection: "column",
              position: "relative",
              gap: 2.5,
              pl: 4,
              py: 1
            }}
          >
            {/* Timeline Vertical Line */}
            <Box
              sx={{
                position: "absolute",
                left: "12px",
                top: "16px",
                bottom: "16px",
                width: "2px",
                bgcolor: "rgba(212, 175, 55, 0.28)",
                zIndex: 0
              }}
            />

            {features.map((feature) => (
              <Box
                key={feature.title}
                component={motion.div}
                variants={fadeInUp}
                sx={{
                  position: "relative",
                  width: "100%"
                }}
              >
                {/* Horizontal Connector Line */}
                <Box
                  sx={{
                    position: "absolute",
                    left: "-20px",
                    top: "50%",
                    width: "20px",
                    height: "2px",
                    bgcolor: "rgba(212, 175, 55, 0.28)",
                    transform: "translateY(-50%)",
                    zIndex: 0
                  }}
                />

                {/* Timeline Dot Node */}
                <Box
                  sx={{
                    position: "absolute",
                    left: "-25px",
                    top: "50%",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    bgcolor: "#D4AF37",
                    border: "2px solid #0F172A",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    boxShadow: "0 0 8px #D4AF37"
                  }}
                />

                {/* Timeline Card */}
                <Paper
                  elevation={0}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2.25,
                    borderRadius: 3,
                    background: "#111827",
                    border: "1px solid rgba(212,175,55,0.22)",
                    color: "#F8FAFC"
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(212,175,55,0.08)",
                      border: "1px solid rgba(212,175,55,0.45)",
                      fontSize: "1.5rem",
                      lineHeight: 1,
                      flexShrink: 0
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.35 }}>
                    <Typography sx={{ fontWeight: 900, fontSize: "1.05rem", color: "#F8FAFC", lineHeight: 1.25 }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: "rgba(248,250,252,0.72)", fontSize: "0.85rem", lineHeight: 1.45 }}>
                      {feature.desc}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>

          {/* CALL TO ACTION */}
          <Box 
            component={motion.div} 
            variants={fadeInUp} 
            sx={{ 
              textAlign: "center", 
              mt: { xs: 4, md: 5 },
              width: "100%"
            }}
          >
            <Button
              href={consultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Get Free Consultation on WhatsApp"
              variant="contained"
              startIcon={<WhatsAppIcon />}
              sx={{
                bgcolor: "#D4AF37",
                color: "#0F172A",
                fontWeight: 900,
                px: 3.5,
                py: 1.25,
                borderRadius: 2.5,
                textTransform: "none",
                width: { xs: "100%", sm: "auto" },
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
