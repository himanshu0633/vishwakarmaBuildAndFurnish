import React, { useEffect, useState } from "react";
import { Box, Button, Chip, CircularProgress, Container, Paper, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance, { getStaticAssetUrl } from "../../../utils/axiosConfig";
import {
  getCategoryName,
  getServiceDescription
} from "../../utils/catalogSchema";

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09 }
  }
};

const fallbackFeatures = ["Premium Materials", "Modern Designs", "Custom Sizes"];

const FeaturedServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/services?featured=true");
        const list = response.data.success ? response.data.data || [] : [];
        setServices(list);
      } catch (error) {
        console.error("Error fetching featured services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedServices();
  }, []);

  const getHeroImage = (service) => {
    const image =
      service.heroImage ||
      service.images?.[0] ||
      service.beforeImages?.[0] ||
      service.afterImages?.[0] ||
      service.categoryId?.image ||
      "";

    return image ? getStaticAssetUrl(image) : "";
  };

  const handleQuote = (service) => {
    const message = `Hello Vishwakarma Build & Furnish CKD, I want a quote for ${service.name}.`;
    window.open(`https://wa.me/919416856468?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, bgcolor: "#0F172A", display: "grid", placeItems: "center" }}>
        <CircularProgress sx={{ color: "#D4AF37" }} />
      </Box>
    );
  }

  if (services.length === 0) return null;

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: "#0F172A", color: "#F8FAFC" }}>
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial="visible"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <Box component={motion.div} variants={fadeInUp} sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2rem", md: "3rem" },
                color: "#F8FAFC",
                mb: 1.5
              }}
            >
              Featured Services
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
              Explore our premium construction, interior, and furniture solutions crafted for modern living.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
              alignItems: "stretch"
            }}
          >
            {services.map((service) => {
              const heroImage = getHeroImage(service);
              const categoryName = getCategoryName(service.categoryId) || "Service";
              const features = service.features?.length ? service.features.slice(0, 3) : fallbackFeatures;

              return (
                <Paper
                  key={service._id}
                  component={motion.div}
                  variants={fadeInUp}
                  elevation={0}
                  sx={{
                    minHeight: { xs: 430, md: 460 },
                    borderRadius: 3,
                    overflow: "hidden",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    border: "1px solid rgba(212,175,55,0.35)",
                    background: heroImage
                      ? `linear-gradient(180deg, rgba(15,23,42,0.12) 0%, rgba(15,23,42,0.72) 48%, rgba(17,24,39,0.96) 100%), url("${heroImage}") center/cover no-repeat`
                      : "linear-gradient(180deg, #111827 0%, #0F172A 100%)",
                    color: "#F8FAFC",
                    transition: "transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      borderColor: "#D4AF37",
                      boxShadow: "0 22px 50px rgba(0,0,0,0.36)"
                    },
                    "&:hover .featured-card-media": {
                      transform: "scale(1.05)"
                    }
                  }}
                >
                  {heroImage && (
                    <Box
                      className="featured-card-media"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background: `url("${heroImage}") center/cover no-repeat`,
                        transform: "scale(1)",
                        transition: "transform 0.42s ease",
                        zIndex: 0
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0.72) 48%, rgba(17,24,39,0.98) 100%)",
                      zIndex: 1
                    }}
                  />
                  <Box sx={{ position: "relative", zIndex: 2, p: { xs: 2.25, md: 3 } }}>
                    <Chip
                      label={categoryName.replace(" Services", "")}
                      size="small"
                      sx={{
                        bgcolor: "rgba(212,175,55,0.92)",
                        color: "#111827",
                        fontWeight: 900,
                        mb: 1.5
                      }}
                    />
                    <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.35rem", md: "1.55rem" }, lineHeight: 1.2, mb: 1, overflowWrap: "anywhere" }}>
                      {service.name}
                    </Typography>
                    <Typography sx={{ color: "rgba(248,250,252,0.78)", fontSize: "0.94rem", lineHeight: 1.6, mb: 2 }}>
                      {getServiceDescription(service) || "Premium service with modern designs and quality finishing."}
                    </Typography>
                    <Box sx={{ display: "grid", gap: 0.6, mb: 2 }}>
                      {features.map((feature) => (
                        <Typography key={feature} sx={{ color: "rgba(248,250,252,0.84)", fontSize: "0.86rem" }}>
                          ✔ {feature}
                        </Typography>
                      ))}
                    </Box>
                    {service.priceStarting && (
                      <Typography sx={{ color: "#D4AF37", fontWeight: 900, mb: 2 }}>
                        {service.priceStarting.startsWith("Starting") ? service.priceStarting : `Starting From ${service.priceStarting}`}
                      </Typography>
                    )}
                    <Box sx={{ display: "flex", gap: 1.2, flexWrap: "wrap" }}>
                      <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate(`/services/${service.slug}`)}
                        sx={{
                          bgcolor: "#D4AF37",
                          color: "#111827",
                          fontWeight: 900,
                          textTransform: "none",
                          flex: { xs: "1 1 100%", sm: "0 0 auto" },
                          "&:hover": { bgcolor: "#B88917" }
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => handleQuote(service)}
                        sx={{
                          color: "#F8FAFC",
                          borderColor: "rgba(212,175,55,0.62)",
                          fontWeight: 800,
                          textTransform: "none",
                          flex: { xs: "1 1 100%", sm: "0 0 auto" },
                          "&:hover": {
                            borderColor: "#D4AF37",
                            bgcolor: "rgba(212,175,55,0.12)"
                          }
                        }}
                      >
                        Get Quote
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedServices;
