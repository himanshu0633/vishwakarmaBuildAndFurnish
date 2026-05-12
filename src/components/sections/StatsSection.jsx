import React from "react";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import { colors, stats } from "../../data/constants";

const StatsSection = () => {
  return (
    <Container 
      sx={{ 
        py: { xs: 4, sm: 5, md: 6 }, 
        mt: { xs: -2, sm: -3, md: -4 }, 
        position: "relative", 
        zIndex: 3 
      }}
    >
      <Grid 
        container 
        spacing={{ xs: 2, sm: 2.5, md: 3 }} 
        justifyContent="center"
      >
        {stats.map((stat, i) => (
          <Grid 
            item        
            xs={6}  
            sm={6}  
            md={3}  
            lg={3}  
            key={i}
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 2, sm: 2.5, md: 3 }, 
                textAlign: "center", 
                borderRadius: { xs: 3, sm: 3.5, md: 4 }, 
                borderBottom: `3px solid ${colors.secondary}`,
                width: "100%",
                maxWidth: { xs: "100%", sm: "250px", md: "280px" },
                minHeight: { xs: "140px", sm: "160px", md: "180px" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
                }
              }}
            >
              {/* Emoji */}
              <Typography 
                sx={{ 
                  fontSize: { xs: "32px", sm: "36px", md: "40px", lg: "48px" },
                  mb: { xs: 1, sm: 1.5, md: 2 },
                  lineHeight: 1
                }}
              >
                {stat.emoji}
              </Typography>
              
              {/* Number */}
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                color={colors.primary}
                sx={{ 
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem", lg: "2.25rem" },
                  mb: { xs: 0.5, sm: 0.75, md: 1 },
                  lineHeight: 1.2
                }}
              >
                {stat.number}
              </Typography>
              
              {/* Label */}
              <Typography 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" },
                  fontWeight: 500,
                  lineHeight: 1.3,
                  px: { xs: 1, sm: 0 }
                }}
              >
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StatsSection;