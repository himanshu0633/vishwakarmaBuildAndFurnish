import React, { useEffect, useState } from "react";
import { Box, Button, Chip, CircularProgress, Container, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import { getCategoryEmoji, getCategoryName, getServiceDescription } from "../utils/catalogSchema";
import { businessStructuredData, buildPageUrl, useSeo } from "../utils/seo";

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/categories/slug/${categorySlug}`);
        setCategory(res.data.data);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categorySlug]);

  const categoryName = getCategoryName(category);

  useSeo({
    title: categoryName ? `${categoryName} Services in Charkhi Dadri` : "Services in Charkhi Dadri",
    description:
      category?.description ||
      `${categoryName || "Construction and interior"} services in Charkhi Dadri, Haryana by Vishwakarma Build & Furnish.`,
    path: categorySlug ? `/services/${categorySlug}` : "/services",
    keywords: [
      `${categoryName || "services"} Charkhi Dadri`,
      `${categoryName || "services"} Haryana`,
      "Vishwakarma Build & Furnish",
      "construction company Charkhi Dadri",
      "interior work Charkhi Dadri"
    ],
    structuredData: category
      ? {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${categoryName} Services`,
          description: category.description,
          url: buildPageUrl(`/services/${categorySlug}`),
          about: businessStructuredData,
          mainEntity: (category.services || []).map((service) => ({
            "@type": "Service",
            name: service.name,
            description: getServiceDescription(service),
            provider: businessStructuredData,
            areaServed: businessStructuredData.areaServed
          }))
        }
      : null
  });

  if (loading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center", bgcolor: "#111111" }}>
        <CircularProgress sx={{ color: "#D4AF37" }} />
      </Box>
    );
  }

  if (!category) {
    return <Box sx={{ minHeight: "60vh", bgcolor: "#111111", color: "#fff", p: 4 }}>Category not found</Box>;
  }

  return (
    <Box sx={{ bgcolor: "#111111", color: "#F5F5F5", py: { xs: 6, md: 9 } }}>
      <Container>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Chip label="Services" sx={{ bgcolor: "rgba(212,175,55,0.18)", color: "#D4AF37", mb: 2 }} />
          <Typography variant="h2" sx={{ fontWeight: 900, fontSize: { xs: "2.1rem", md: "3.5rem" } }}>
            {getCategoryEmoji(category)} {categoryName}
          </Typography>
          <Typography sx={{ color: "rgba(245,245,245,0.72)", maxWidth: 720, mx: "auto", mt: 2 }}>
            {category.description}
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3 }}>
          {(category.services || []).map(service => (
            <Paper
              key={service._id}
              onClick={() => navigate(`/services/${service.slug}`)}
              sx={{
                p: 3,
                cursor: "pointer",
                bgcolor: "rgba(245,245,245,0.05)",
                color: "#F5F5F5",
                border: "1px solid rgba(212,175,55,0.2)",
                borderRadius: 2,
                transition: "0.25s",
                "&:hover": { borderColor: "#D4AF37", transform: "translateY(-4px)" }
              }}
            >
              <Typography sx={{ fontSize: "2.4rem", mb: 1 }}>{service.emoji || "🔧"}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{service.name}</Typography>
              <Typography sx={{ color: "rgba(245,245,245,0.68)", mb: 2 }}>
                {getServiceDescription(service)}
              </Typography>
              {service.priceStarting && <Typography sx={{ color: "#D4AF37", fontWeight: 800 }}>{service.priceStarting}</Typography>}
            </Paper>
          ))}
        </Box>

        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Button onClick={() => navigate("/services")} sx={{ color: "#D4AF37" }}>Back to all services</Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CategoryPage;
