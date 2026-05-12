import React, { useEffect, useMemo, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import heroVideo from "../../assets/hero.mp4";
import SmartServiceSearch from "../common/SmartServiceSearch";

import EngineeringIcon from "@mui/icons-material/Engineering";
import FactoryIcon from "@mui/icons-material/Factory";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const heroServices = [
  { icon: "🏠", text: "Complete House Construction" },
  { icon: "🪵", text: "Custom Furniture Manufacturing" },
  { icon: "✨", text: "Modern Interior Solutions" },
  { icon: "🛋️", text: "Sofa • Bed • Wardrobe • Modular Kitchen" },
  { icon: "👷", text: "Trusted Contractor Services" }
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
        minHeight: { xs: "720px", sm: "740px", md: "760px", lg: "790px" },
        height: { xs: "auto", md: "760px", lg: "790px" },
        overflow: "hidden"
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
          alignItems: "center",
          py: { xs: 5, md: 0 }
        }}
      >
        <MotionBox
          textAlign="center"
          width="100%"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={scaleIn}>
            <Typography
              sx={{
                color: "#D4AF37",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                mb: 1.5,
                fontSize: { xs: "0.82rem", md: "1rem" }
              }}
            >
              Build • Furnish • Interiors
            </Typography>
          </motion.div>

          <MotionTypography
            variant="h1"
            variants={fadeInUp}
            sx={{
              color: "#fff",
              fontWeight: 900,
              fontSize: {
                xs: "1.95rem",
                sm: "3rem",
                md: "4.6rem",
                lg: "5.3rem"
              },
              lineHeight: 1.04,
              overflowWrap: "anywhere",
              maxWidth: "1000px",
              mx: "auto",
              mb: 2,
              textShadow: "0 12px 34px rgba(0,0,0,0.48)"
            }}
          >
            VISHWAKARMA BUILD & FURNISH CKD
          </MotionTypography>

          <MotionTypography
            variant="h4"
            variants={fadeInUp}
            sx={{
              color: "#D4AF37",
              fontWeight: 800,
              mb: { xs: 3, md: 4 },
              fontSize: { xs: "1.15rem", md: "2.15rem" },
              textShadow: "0 8px 24px rgba(0,0,0,0.45)"
            }}
          >
            From Foundation to Furniture
          </MotionTypography>

          <motion.div variants={fadeInUp}>
            <SmartServiceSearch />
          </motion.div>

          <MotionBox
            variants={fadeInUp}
            sx={{
              maxWidth: "820px",
              mx: "auto",
              overflow: "hidden"
            }}
          >
            <Box
              sx={{
                position: "relative",
                minHeight: { xs: 110, sm: 92, md: 104 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <AnimatePresence mode="wait">
                <MotionBox
                  key={activeService.text}
                  initial={{ opacity: 0, x: 90, scale: 0.94 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -90, scale: 0.94 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  sx={{
                    position: "absolute",
                    inset: "0 auto auto auto",
                    width: "100%",
                    minHeight: { xs: 100, sm: 82, md: 92 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: { xs: 1.4, md: 2 },
                    px: { xs: 2, md: 4 },
                    py: { xs: 1.5, md: 2 },
                    color: "#fff",
                    border: "1px solid rgba(245,245,245,0.26)",
                    background: "rgba(245,245,245,0.12)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "8px",
                    boxShadow: "0 18px 42px rgba(0,0,0,0.22)"
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: "#D4AF37",
                      fontSize: { xs: "1.8rem", md: "2.35rem" },
                      lineHeight: 1,
                      flex: "0 0 auto"
                    }}
                  >
                    {activeService.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: "1.05rem", sm: "1.25rem", md: "1.65rem" },
                      lineHeight: 1.25,
                      overflowWrap: "anywhere",
                      textShadow: "0 8px 20px rgba(0,0,0,0.36)"
                    }}
                  >
                    {activeService.text}
                  </Typography>
                </MotionBox>
              </AnimatePresence>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                mt: { xs: 1.4, md: 2 }
              }}
            >
              {heroServices.map((service, index) => (
              <MotionBox
                key={service.text}
                animate={{
                  width: index === serviceIndex ? 28 : 9,
                  opacity: index === serviceIndex ? 1 : 0.45
                }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                sx={{
                  height: 9,
                  borderRadius: "8px",
                  background: index === serviceIndex ? "#D4AF37" : "rgba(245,245,245,0.78)"
                }}
              />
            ))}
            </Box>
          </MotionBox>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Box
              sx={{
                width: { xs: 120, md: 180 },
                height: 4,
                background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
                mx: "auto",
                mt: { xs: 3, md: 4 },
                borderRadius: 4,
                animation: "shineLine 2.5s ease-in-out infinite"
              }}
            />
          </motion.div>
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
