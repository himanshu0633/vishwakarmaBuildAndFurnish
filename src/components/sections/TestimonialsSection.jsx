import React from "react";
import { Avatar, Box, Card, Chip, Container, Grid, Paper, Rating, Typography } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HandshakeIcon from "@mui/icons-material/Handshake";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import VerifiedIcon from "@mui/icons-material/Verified";
import { motion } from "framer-motion";
import { testimonials } from "../../data/constants";

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const trustStats = [
  { value: "500+", label: "Happy Clients" },
  { value: "4.8/5", label: "Average Rating" },
  { value: "1000+", label: "Completed Works" }
];

const TestimonialsSection = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, sm: 10, md: 12 },
        background: "linear-gradient(180deg, #0F172A 0%, #111827 52%, #0B1120 100%)",
        color: "#F8FAFC",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.55) 1px, transparent 1px)",
          backgroundSize: "56px 56px"
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          variants={staggerContainer}
        >
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="end" sx={{ mb: { xs: 4, md: 6 } }}>
            <Grid item xs={12} md={7}>
              <Box component={motion.div} variants={fadeInUp}>
                <Chip
                  icon={<HandshakeIcon />}
                  label="Client Testimonials"
                  sx={{
                    bgcolor: "rgba(212,175,55,0.14)",
                    color: "#D4AF37",
                    mb: 2,
                    fontWeight: 800,
                    "& .MuiChip-icon": { color: "#D4AF37" }
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "Poppins, Montserrat, sans-serif",
                    fontWeight: 900,
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3.15rem" },
                    lineHeight: 1.1,
                    color: "#F8FAFC",
                    mb: 2
                  }}
                >
                  Trusted Work, Clean Finish, Happy Clients
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 680,
                    color: "rgba(248,250,252,0.72)",
                    fontSize: { xs: "0.98rem", md: "1.08rem" },
                    lineHeight: 1.75
                  }}
                >
                  Construction, renovation, modular kitchen, and furnishing services in Charkhi Dadri and nearby Haryana areas.
                  wardrobe aur interior finishing ke real project experiences.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box
                component={motion.div}
                variants={fadeInUp}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 1.5
                }}
              >
                {trustStats.map((stat) => (
                  <Paper
                    key={stat.label}
                    elevation={0}
                    sx={{
                      p: { xs: 1.8, sm: 2.2 },
                      minHeight: 104,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      borderRadius: 2,
                      bgcolor: "rgba(248,250,252,0.06)",
                      border: "1px solid rgba(212,175,55,0.24)",
                      textAlign: "center"
                    }}
                  >
                    <Typography sx={{ color: "#D4AF37", fontWeight: 900, fontSize: { xs: "1.35rem", md: "1.65rem" } }}>
                      {stat.value}
                    </Typography>
                    <Typography sx={{ color: "rgba(248,250,252,0.68)", fontSize: { xs: "0.72rem", md: "0.82rem" }, lineHeight: 1.35 }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} sm={6} key={testimonial.name}>
                <Box component={motion.div} variants={fadeInUp} sx={{ height: "100%" }}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      minHeight: { xs: 300, md: 320 },
                      p: { xs: 2.5, md: 3 },
                      borderRadius: 2,
                      bgcolor: index === 0 ? "rgba(212,175,55,0.12)" : "rgba(248,250,252,0.055)",
                      color: "#F8FAFC",
                      border: index === 0 ? "1px solid rgba(212,175,55,0.58)" : "1px solid rgba(212,175,55,0.22)",
                      position: "relative",
                      overflow: "hidden",
                      transition: "transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        borderColor: "#D4AF37",
                        boxShadow: "0 22px 48px rgba(0,0,0,0.32)"
                      }
                    }}
                  >
                    <FormatQuoteIcon
                      sx={{
                        position: "absolute",
                        top: 18,
                        right: 18,
                        color: "rgba(212,175,55,0.2)",
                        fontSize: { xs: 44, md: 56 },
                        transform: "rotate(180deg)"
                      }}
                    />

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 2.5 }}>
                      <Chip
                        icon={<HomeRepairServiceIcon />}
                        label={testimonial.service}
                        sx={{
                          bgcolor: "rgba(15,23,42,0.64)",
                          color: "#F8FAFC",
                          border: "1px solid rgba(212,175,55,0.28)",
                          fontWeight: 700,
                          "& .MuiChip-icon": { color: "#D4AF37" }
                        }}
                      />
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, color: "#D4AF37", flexShrink: 0 }}>
                        <VerifiedIcon sx={{ fontSize: 19 }} />
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 800 }}>Verified</Typography>
                      </Box>
                    </Box>

                    <Rating
                      value={testimonial.rating}
                      readOnly
                      precision={0.5}
                      icon={<StarIcon fontSize="small" />}
                      emptyIcon={<StarBorderIcon fontSize="small" />}
                      sx={{
                        color: "#D4AF37",
                        mb: 2,
                        "& .MuiRating-iconFilled": { color: "#D4AF37" }
                      }}
                    />

                    <Typography
                      sx={{
                        color: "rgba(248,250,252,0.9)",
                        fontSize: { xs: "0.98rem", md: "1.04rem" },
                        lineHeight: 1.75,
                        mb: 3
                      }}
                    >
                      "{testimonial.text}"
                    </Typography>

                    <Box
                      sx={{
                        mt: "auto",
                        pt: 2.5,
                        borderTop: "1px solid rgba(212,175,55,0.18)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.8
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 52,
                          height: 52,
                          bgcolor: "#D4AF37",
                          color: "#0F172A",
                          fontWeight: 900,
                          fontSize: "1.2rem"
                        }}
                      >
                        {testimonial.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ color: "#F8FAFC", fontWeight: 900, fontSize: "1rem" }}>
                          {testimonial.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.4 }}>
                          <LocationOnIcon sx={{ color: "#D4AF37", fontSize: 16 }} />
                          <Typography sx={{ color: "rgba(248,250,252,0.62)", fontSize: "0.82rem" }}>
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box component={motion.div} variants={fadeInUp} sx={{ textAlign: "center", mt: { xs: 4, md: 5 } }}>
            <Paper
              elevation={0}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.2,
                px: { xs: 2, sm: 3 },
                py: 1.4,
                borderRadius: 2,
                bgcolor: "rgba(248,250,252,0.06)",
                border: "1px solid rgba(212,175,55,0.3)",
                color: "#F8FAFC"
              }}
            >
              <StarIcon sx={{ color: "#D4AF37", fontSize: 21 }} />
              <Typography sx={{ fontWeight: 800, fontSize: { xs: "0.86rem", sm: "0.95rem" } }}>
                Quality material, clear estimate aur stage-wise work updates.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
