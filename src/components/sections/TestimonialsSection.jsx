import React from "react";
import { Container, Typography, Grid, Card, Rating, Box, Avatar, Paper, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { colors, testimonials } from "../../data/constants";
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FactoryIcon from '@mui/icons-material/Factory';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const TestimonialsSection = () => {
  return (
    <Box sx={{ 
      py: { xs: 8, sm: 10, md: 12 },
      background: "linear-gradient(135deg, #111111 0%, #0F172A 50%, #1A1A1A 100%)",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Industrial Background Elements */}
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        pointerEvents: "none"
      }}>
        <Box sx={{
          position: "absolute",
          top: "15%",
          left: "5%",
          animation: "rotate 50s linear infinite"
        }}>
          <EngineeringIcon sx={{ fontSize: 180 }} />
        </Box>
        <Box sx={{
          position: "absolute",
          bottom: "20%",
          right: "8%",
          animation: "rotateReverse 45s linear infinite"
        }}>
          <FactoryIcon sx={{ fontSize: 200 }} />
        </Box>
        <Box sx={{
          position: "absolute",
          top: "60%",
          left: "85%",
          animation: "rotate 40s linear infinite"
        }}>
          <PeopleIcon sx={{ fontSize: 150 }} />
        </Box>
        
        {/* Floating Particles */}
        {[...Array(40)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              background: `rgba(212,175,55,${Math.random() * 0.3 + 0.1})`,
              borderRadius: "50%",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </Box>

      {/* Animated Overlay Shine */}
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(90deg, transparent, rgba(245,245,245,0.03), transparent)",
        transform: "translateX(-100%)",
        animation: "gradientShift 12s infinite",
        pointerEvents: "none"
      }} />

      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 5, sm: 6, md: 8 } }}>
            <motion.div variants={fadeInUp}>
              <Chip
                icon={<TrendingUpIcon />}
                label="Client Testimonials"
                sx={{
                  bgcolor: "rgba(212,175,55,0.2)",
                  color: "#D4AF37",
                  mb: 2,
                  '& .MuiChip-icon': { color: "#D4AF37" }
                }}
              />

              <Typography 
                variant="h2" 
                fontWeight="800" 
                sx={{ 
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                  background: "linear-gradient(135deg, #F5F5F5, #D4AF37)",
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 2
                }}
              >
                What Our Clients Say
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  maxWidth: '600px',
                  mx: 'auto',
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  color: 'rgba(245,245,245,0.8)'
                }}
              >
                Trusted by thousands of industrial clients and service providers who've experienced excellence
              </Typography>
            </motion.div>
          </Box>

          {/* Testimonials Grid */}
          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div variants={fadeInUp}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      p: { xs: 3, md: 4 },
                      width: "100%",
                      minHeight: { xs: 260, md: 300 },
                      borderRadius: { xs: 4, md: 5 },
                      background: 'rgba(245,245,245,0.05)',
                      
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid rgba(212,175,55,0.2)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(212,175,55,0.2)',
                        borderColor: '#D4AF37',
                        background: 'rgba(245,245,245,0.08)'
                      }
                    }}
                  >
                    {/* Animated Glow Effect */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
                      transform: 'translateX(-100%)',
                      transition: 'transform 0.5s ease',
                      '&:hover': { transform: 'translateX(0)' }
                    }} />
                    
                    <FormatQuoteIcon 
                      sx={{ 
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        fontSize: 48,
                        color: 'rgba(212,175,55,0.2)',
                        transition: 'all 0.3s ease',
                        transform: 'rotate(180deg)'
                      }}
                    />

                    <Box sx={{ mb: 2.5 }}>
                      <Rating 
                        value={testimonial.rating} 
                        readOnly 
                        precision={0.5}
                        icon={<StarIcon fontSize="medium" />}
                        emptyIcon={<StarBorderIcon fontSize="medium" />}
                        sx={{ 
                          color: '#D4AF37',
                          '& .MuiRating-iconFilled': { color: '#D4AF37' }
                        }}
                      />
                    </Box>

                    <Typography sx={{ 
                      fontSize: { xs: '0.95rem', md: '1rem' },
                      lineHeight: 1.7,
                      color: 'rgba(245,245,245,0.9)',
                      mb: 3,
                      fontStyle: 'italic'
                    }}>
                      "{testimonial.text}"
                    </Typography>

                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      pt: 2,
                      borderTop: '1px solid rgba(212,175,55,0.2)'
                    }}>
                      <Avatar sx={{ 
                        width: { xs: 48, md: 56 }, 
                        height: { xs: 48, md: 56 },
                        background: 'linear-gradient(135deg, #D4AF37, #B88917)',
                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                        fontWeight: 'bold',
                        color: '#F5F5F5'
                      }}>
                        {testimonial.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight="700" sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, color: '#F5F5F5' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(245,245,245,0.6)', fontSize: { xs: '0.75rem', md: '0.8rem' } }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Stats Section with Industrial Design */}
          <motion.div variants={fadeInUp}>
            <Box sx={{ 
              mt: { xs: 6, md: 8 },
              pt: { xs: 4, md: 6 },
              borderTop: '1px solid rgba(212,175,55,0.2)',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: { xs: 3, md: 4 },
              textAlign: 'center'
            }}>
              {[
                { number: '500+', label: 'Happy Clients', icon: <PeopleIcon sx={{ fontSize: 32 }} /> },
                { number: '98%', label: 'Satisfaction Rate', icon: <TrendingUpIcon sx={{ fontSize: 32 }} /> },
                { number: '1000+', label: 'Projects Completed', icon: <EngineeringIcon sx={{ fontSize: 32 }} /> }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: '20px',
                      background: 'rgba(245,245,245,0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#D4AF37',
                        background: 'rgba(245,245,245,0.08)',
                        transform: 'translateY(-5px)'
                      }
                    }}
                  >
                    <Box sx={{ color: '#D4AF37', mb: 1.5 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h3" fontWeight="800" sx={{ 
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      background: 'linear-gradient(135deg, #F5F5F5, #D4AF37)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      mb: 0.5
                    }}>
                      {stat.number}
                    </Typography>
                    <Typography sx={{ color: 'rgba(245,245,245,0.7)' }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            variants={fadeInUp}
            style={{ marginTop: '48px', textAlign: 'center' }}
          >
            <Paper
              elevation={0}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                px: 3,
                py: 1.5,
                borderRadius: '50px',
                background: 'rgba(245,245,245,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(212,175,55,0.3)'
              }}
            >
              <EngineeringIcon sx={{ color: '#D4AF37' }} />
              <Typography variant="body2" sx={{ color: '#F5F5F5', fontWeight: 500 }}>
                Trusted by 10,000+ industrial businesses • 4.8/5 Rating
              </Typography>
              <FactoryIcon sx={{ color: '#D4AF37' }} />
            </Paper>
          </motion.div>
        </motion.div>
      </Container>

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
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        
        @keyframes gradientShift {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </Box>
  );
};

export default TestimonialsSection;
