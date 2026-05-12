import React, { useState } from "react";
import { Box } from "@mui/material";
import HeroBanner from "../components/sections/HeroBanner";
import TrustStrip from "../components/sections/TrustStrip";
import FeaturedServices from "../components/sections/FeaturedServices";
import BlogSection from "../components/sections/BlogSection";
import ServicesSection from "../components/sections/ServicesSection";
import TendersSection from "../components/sections/TendersSection";
import HowItWorks from "../components/sections/HowItWorks";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import WhyChooseUs from "../components/sections/WhyChooseUs";


import { colors } from "../data/constants";

const HomePage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setOpenDialog(true);
  };

  return (
    <Box sx={{ overflowX: "hidden", bgcolor: colors.charcoal }}>
     
      <HeroBanner />

      
 
      <FeaturedServices />
      <ServicesSection onServiceClick={handleServiceClick} />
      <BlogSection />
      <HowItWorks />
      <WhyChooseUs />
      <TestimonialsSection />
      

      

    </Box>
  );
};

export default HomePage;
