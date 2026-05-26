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
import FAQSection from "../components/sections/FAQSection";


import { colors } from "../data/constants";
import { businessStructuredData, useSeo } from "../utils/seo";

const HomePage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useSeo({
    title: "Construction & Interior Services in Charkhi Dadri",
    description:
      "Vishwakarma Build & Furnish offers construction, modular kitchen, plywood door, wooden door, furniture, paint, tiles and marble work in Charkhi Dadri.",
    path: "/",
    keywords: [
      "construction company in Charkhi Dadri",
      "interior designer in Charkhi Dadri",
      "modular kitchen Charkhi Dadri",
      "wardrobe maker Charkhi Dadri",
      "house construction Haryana"
    ],
    structuredData: businessStructuredData
  });

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
      <FAQSection />
      <TestimonialsSection />
      

      

    </Box>
  );
};

export default HomePage;
