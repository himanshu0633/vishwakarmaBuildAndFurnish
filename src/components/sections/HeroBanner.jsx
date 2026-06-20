import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroVideo from "../../assets/hero.mp4";
import SmartServiceSearch from "../common/SmartServiceSearch";

import EngineeringIcon from "@mui/icons-material/Engineering";
import FactoryIcon from "@mui/icons-material/Factory";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";

import HomeIcon from "@mui/icons-material/Home";
import BrushIcon from "@mui/icons-material/Brush";
import VerifiedIcon from "@mui/icons-material/Verified";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarsIcon from "@mui/icons-material/Stars";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const heroServices = [
  {
    icon: "🏠",
    text: "Complete House Construction",
    description: "Expert end-to-end home construction from foundation to final finishing.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop",
    slug: "complete-house-construction-charkhi-dadri"
  },
  {
    icon: "🪵",
    text: "Custom Furniture Manufacturing",
    description: "Bespoke wooden furniture, sofas, beds, wardrobes, and custom carvings.",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=600&auto=format&fit=crop",
    slug: "custom-wardrobe-charkhi-dadri"
  },
  {
    icon: "✨",
    text: "Modern Interior Solutions",
    description: "Transform your space with our modern interior designs and customized solutions.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop",
    slug: "modern-interior-solutions-charkhi-dadri"
  },
  {
    icon: "🛋️",
    text: "Sofa • Bed • Wardrobe • Modular Kitchen",
    description: "Premium modular kitchens, custom wardrobes, beds, and luxury sofa sets.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop",
    slug: "modular-kitchen-charkhi-dadri"
  },
  {
    icon: "👷",
    text: "Trusted Contractor Services",
    description: "Reliable civil contracting, structural engineering, and renovation solutions.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop",
    slug: "complete-house-construction-charkhi-dadri"
  }
];

const trustItems = [
  {
    icon: <BrushIcon sx={{ color: "#D4AF37", fontSize: { xs: 28, md: 34 } }} />,
    title: "Modern Interior Solutions",
    subtitle: "Stylish & Functional Designs"
  },
  {
    icon: <VerifiedIcon sx={{ color: "#D4AF37", fontSize: { xs: 28, md: 34 } }} />,
    title: "Quality Materials",
    subtitle: "Premium & Durable Finishes"
  },
  {
    icon: <GroupsIcon sx={{ color: "#D4AF37", fontSize: { xs: 28, md: 34 } }} />,
    title: "Expert Team",
    subtitle: "Skilled & Experienced Professionals"
  },
  {
    icon: <CalendarMonthIcon sx={{ color: "#D4AF37", fontSize: { xs: 28, md: 34 } }} />,
    title: "On-Time Delivery",
    subtitle: "Committed to Deadlines Always"
  },
  {
    icon: <StarsIcon sx={{ color: "#D4AF37", fontSize: { xs: 28, md: 34 } }} />,
    title: "100% Customer Satisfaction",
    subtitle: "Your Trust is Our Priority"
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.2
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

const HeroBanner = () => {
  const navigate = useNavigate();
  const [serviceIndex, setServiceIndex] = useState(0);

  // ✅ Stable particles (no re-render flicker)
  const particles = useMemo(() => {
    return [...Array(30)].map(() => ({
      width: Math.random() * 6 + 2,
      height: Math.random() * 6 + 2,
      opacity: Math.random() * 0.3 + 0.1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setServiceIndex(prev => (prev + 1) % heroServices.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const activeService = heroServices[serviceIndex];

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: "auto", md: "700px", lg: "760px" },
        height: "auto",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: { xs: 2.5, md: 3.5 }
      }}
    >
      {/* Background Gradient */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, #111111 0%, #0F172A 55%, #1A1A1A 100%)",
          zIndex: 0
        }}
      >
        {/* Rotating Icons */}
        <Box
          sx={{
            position: "absolute",
            top: "5%",
            left: "3%",
            opacity: 0.15,
            animation: "rotate 30s linear infinite"
          }}
        >
          <EngineeringIcon sx={{ fontSize: { xs: 100, md: 180 } }} />
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            opacity: 0.15,
            animation: "rotateReverse 25s linear infinite"
          }}
        >
          <FactoryIcon sx={{ fontSize: { xs: 120, md: 200 } }} />
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "80%",
            opacity: 0.1,
            animation: "rotate 20s linear infinite"
          }}
        >
          <PrecisionManufacturingIcon
            sx={{ fontSize: { xs: 80, md: 150 } }}
          />
        </Box>

        {/* ✅ Stable Floating Particles */}
        {particles.map((p, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: `${p.width}px`,
              height: `${p.height}px`,
              background: `rgba(212,175,55,${p.opacity})`,
              borderRadius: "50%",
              top: `${p.top}%`,
              left: `${p.left}%`,
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </Box>

      {/* Background Video */}
      <Box
        component="video"
        autoPlay
        muted
        loop
        playsInline
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1
        }}
      >
        <source src={heroVideo} type="video/mp4" />
      </Box>

      {/* Readability Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(17,17,17,0.88), rgba(15,23,42,0.74), rgba(26,26,26,0.78))",
          zIndex: 2
        }}
      />

      <MotionBox
        initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
        animate={{ opacity: 0.22, rotate: 0, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        sx={{
          position: "absolute",
          width: { xs: 180, md: 280 },
          height: { xs: 180, md: 280 },
          border: "2px solid rgba(212,175,55,0.55)",
          top: { xs: "12%", md: "14%" },
          right: { xs: "-70px", md: "8%" },
          zIndex: 2,
          animation: "slowPulse 5s ease-in-out infinite"
        }}
      />

      {/* Content */}
      <Container
        sx={{
          position: "relative",
          zIndex: 3,
          height: "100%",
          display: "flex",
          alignItems: "center"
        }}
      >
        <MotionBox
          textAlign="center"
          width="100%"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Centered Branding Badge */}
          <motion.div variants={scaleIn}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                px: 2.5,
                py: 0.8,
                borderRadius: "50px",
                border: "1.5px solid #D4AF37",
                bgcolor: "rgba(212, 175, 55, 0.08)",
                mb: 2
              }}
            >
              <HomeIcon sx={{ color: "#D4AF37", fontSize: 18 }} />
              <Typography
                sx={{
                  color: "#D4AF37",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontSize: { xs: "0.75rem", md: "0.85rem" }
                }}
              >
                Vishwakarma Build & Furnish
              </Typography>
            </Box>
          </motion.div>

          {/* Heading */}
          <MotionTypography
            variant="h1"
            variants={fadeInUp}
            sx={{
              color: "#fff",
              fontWeight: 900,
              fontSize: {
                xs: "1.75rem",
                sm: "2.5rem",
                md: "3.2rem",
                lg: "4rem"
              },
              lineHeight: 1.15,
              maxWidth: "1000px",
              mx: "auto",
              mb: 1.5,
              textShadow: "0 12px 34px rgba(0,0,0,0.48)"
            }}
          >
            Premium House{" "}
            <Box component="span" sx={{ color: "#D4AF37" }}>
              Construction & Modern
            </Box>{" "}
            Interior Services in{" "}
            <Box component="span" sx={{ color: "#D4AF37", display: "inline-block", whiteSpace: "nowrap" }}>
              Charkhi Dadri
            </Box>
          </MotionTypography>

          {/* Subtitle with Accent Lines */}
          <motion.div variants={fadeInUp}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              mb={{ xs: 2.5, md: 3 }}
            >
              <Box sx={{ width: { xs: 30, md: 60 }, height: "1px", bgcolor: "#D4AF37" }} />
              <Typography
                variant="h4"
                sx={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: { xs: "0.95rem", sm: "1.15rem", md: "1.5rem" },
                  textShadow: "0 8px 24px rgba(0,0,0,0.45)",
                  letterSpacing: "0.03em"
                }}
              >
                From Foundation to Furniture
              </Typography>
              <Box sx={{ width: { xs: 30, md: 60 }, height: "1px", bgcolor: "#D4AF37" }} />
            </Box>
          </motion.div>

          {/* Search Section */}
          <motion.div variants={fadeInUp}>
            <SmartServiceSearch />
          </motion.div>

          {/* 5-Column Trust Panel */}
          <motion.div variants={fadeInUp}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                width: "100%",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(12px)",
                borderRadius: "12px",
                py: { xs: 1.5, md: 2.5 },
                px: { xs: 0.5, md: 1 },
                mt: { xs: 2.5, md: 4 },
                mb: { xs: 2.5, md: 4 }
              }}
            >
              {trustItems.map((item, index) => (
                <Box
                  key={item.title}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    px: { xs: 0.2, sm: 1, md: 2 },
                    borderRight: index < trustItems.length - 1 ? "1px solid rgba(255, 255, 255, 0.12)" : "none"
                  }}
                >
                  <Box sx={{ mb: { xs: 0.8, md: 1.5 } }}>
                    {React.cloneElement(item.icon, {
                      sx: {
                        color: "#D4AF37",
                        fontSize: { xs: 18, sm: 24, md: 34 }
                      }
                    })}
                  </Box>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: { xs: "0.55rem", sm: "0.75rem", md: "0.95rem" },
                      mb: { xs: 0, md: 0.5 },
                      lineHeight: 1.2,
                      overflowWrap: "anywhere"
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontWeight: 500,
                      fontSize: { xs: "0.45rem", sm: "0.65rem", md: "0.72rem" },
                      lineHeight: 1.3,
                      display: { xs: "none", sm: "block" }
                    }}
                  >
                    {item.subtitle}
                  </Typography>
                </Box>
              ))}
            </Box>
          </motion.div>

          {/* Sliding Preview Card */}
          <MotionBox
            variants={fadeInUp}
            sx={{
              maxWidth: "960px",
              mx: "auto",
              position: "relative"
            }}
          >
            <AnimatePresence mode="wait">
              <MotionBox
                key={activeService.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: { xs: 1.5, sm: 2.5 },
                  p: { xs: 1, sm: 1.2 },
                  border: "1px solid rgba(212, 175, 55, 0.25)",
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(16px)",
                  borderRadius: "12px",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.25)"
                }}
              >
                {/* Image Thumbnail */}
                <Box
                  component="img"
                  src={activeService.image}
                  alt={activeService.text}
                  sx={{
                    width: { xs: "75px", sm: "120px", md: "150px" },
                    height: { xs: "55px", sm: "80px" },
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #D4AF37",
                    flexShrink: 0
                  }}
                />

                {/* Text Info */}
                <Box sx={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: { xs: "0.8rem", sm: "0.95rem", md: "1.15rem" },
                      mb: 0.2
                    }}
                  >
                    {activeService.text}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.8rem",
                      lineHeight: 1.35,
                      display: { xs: "none", sm: "block" }
                    }}
                  >
                    {activeService.description}
                  </Typography>
                </Box>

                {/* Explore Button */}
                <Button
                  variant="contained"
                  onClick={() => navigate(`/services/${activeService.slug}`)}
                  sx={{
                    bgcolor: "#D4AF37",
                    color: "#111827",
                    fontWeight: 900,
                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                    textTransform: "none",
                    borderRadius: "50px",
                    px: { xs: 1.5, sm: 2.5 },
                    py: { xs: 0.6, sm: 0.8 },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexShrink: 0,
                    boxShadow: "0 8px 24px rgba(212, 175, 55, 0.3)",
                    "&:hover": {
                      bgcolor: "#B88917"
                    }
                  }}
                >
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    Explore Services
                  </Box>
                  <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                    Explore
                  </Box>
                  <ArrowForwardIcon sx={{ fontSize: { xs: 14, sm: 18 } }} />
                </Button>
              </MotionBox>
            </AnimatePresence>

            {/* Carousel Pagination Dots */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1.2,
                mt: 2.5
              }}
            >
              {heroServices.map((service, index) => (
                <MotionBox
                  key={service.text}
                  onClick={() => setServiceIndex(index)}
                  animate={{
                    width: index === serviceIndex ? 30 : 10,
                    opacity: index === serviceIndex ? 1 : 0.45
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  sx={{
                    height: 10,
                    borderRadius: "10px",
                    cursor: "pointer",
                    background: index === serviceIndex ? "#D4AF37" : "rgba(255,255,255,0.7)"
                  }}
                />
              ))}
            </Box>
          </MotionBox>

        </MotionBox>
      </Container>

      {/* Animations */}
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
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(20px,-20px); }
        }

        @keyframes slowPulse {
          0%,100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.08) rotate(4deg); }
        }

        @keyframes shineLine {
          0%,100% { opacity: 0.45; transform: scaleX(0.65); }
          50% { opacity: 1; transform: scaleX(1); }
        }
      `}</style>
    </Box>
  );
};

export default HeroBanner;
