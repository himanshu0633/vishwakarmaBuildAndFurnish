import React, { useEffect, useState } from "react";
import { Box, Button, Chip, CircularProgress, Container, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance, { getStaticAssetUrl, logStaticAssetUrl } from "../../utils/axiosConfig";
import { getCategoryName, getServiceFullDescription } from "../utils/catalogSchema";
import { buildServiceSeo, businessStructuredData, buildPageUrl, useSeo } from "../utils/seo";

const ServiceDetailPage = () => {
  const { categorySlug, serviceSlug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/services/slug/${serviceSlug}`);
        setService(res.data.data);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceSlug]);

  const serviceImage = getStaticAssetUrl(service?.heroImage || service?.images?.[0] || "");
  const categorySlugForSeo = service?.categoryId?.slug || categorySlug || "furniture";
  const categoryName = service?.categoryId?.name || getCategoryName(service?.categoryId);
  const serviceSeo = buildServiceSeo(service?.name || "Construction Service");

  useSeo({
    title: service?.seoTitle || (service?.name ? serviceSeo.title : "Construction, Furniture & Interior Service in Charkhi Dadri"),
    description:
      service?.seoDescription ||
      (service ? serviceSeo.description : undefined),
    path: serviceSlug ? `/services/${categorySlugForSeo}/${serviceSlug}` : "/services",
    image: serviceImage,
    keywords: [
      ...serviceSeo.keywords,
      ...(service?.tags || []),
      service?.name,
      `${service?.name || "furniture"} images`,
      `latest ${service?.name || "furniture"} design`,
      `best ${service?.name || "furniture"} in Charkhi Dadri`,
      "Haryana"
    ],
    structuredData: service
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          description: service.seoDescription || getServiceFullDescription(service),
          image: serviceImage,
          provider: businessStructuredData,
          areaServed: ["Charkhi Dadri", "Haryana"],
          category: categoryName,
          url: buildPageUrl(`/services/${categorySlugForSeo}/${service.slug}`),
          offers: service.priceStarting
            ? {
                "@type": "Offer",
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "INR",
                  description: service.priceStarting
                }
              }
            : undefined
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

  if (!service) {
    return <Box sx={{ minHeight: "60vh", bgcolor: "#111111", color: "#fff", p: 4 }}>Service not found</Box>;
  }

  const media = [...(service.images || []), ...(service.videos || [])];

  return (
    <Box sx={{ bgcolor: "#111111", color: "#F5F5F5", py: { xs: 6, md: 9 } }}>
      <Container>
        <Chip label={categoryName} sx={{ bgcolor: "rgba(212,175,55,0.18)", color: "#D4AF37", mb: 2 }} />
        <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: "2.4rem", md: "4rem" }, mb: 2 }}>
          {service.emoji || ""} {service.name}
        </Typography>
        <Typography sx={{ color: "rgba(245,245,245,0.72)", maxWidth: 850, fontSize: "1.1rem", mb: 3 }}>
          {getServiceFullDescription(service)}
        </Typography>
        {service.priceStarting && <Typography sx={{ color: "#D4AF37", fontWeight: 900, mb: 4 }}>{service.priceStarting}</Typography>}

        {media.length > 0 && (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2, mb: 5 }}>
            {media.map((item) => {
              const src = logStaticAssetUrl(`legacy-service-detail:${service.name}`, item);
              const isVideo = item.match(/\.(mp4|mov|webm|m4v)$/i);
              return (
                <Paper key={item} sx={{ overflow: "hidden", bgcolor: "#0F172A", border: "1px solid rgba(212,175,55,0.2)" }}>
                  {isVideo ? (
                    <Box component="video" src={src} controls sx={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover" }} />
                  ) : (
                  <Box
                    component="img"
                    src={src}
                    alt={`${service.name} images and latest design in Charkhi Dadri Haryana`}
                    onError={(event) => {
                      console.error("[media-url] legacy service detail image failed", {
                        service: service.name,
                        rawUrl: item,
                        renderedSrc: event.currentTarget.src
                      });
                    }}
                    sx={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover" }}
                  />
                  )}
                </Paper>
              );
            })}
          </Box>
        )}

        {service.faq?.length > 0 && (
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>FAQ</Typography>
            {service.faq.map((item, index) => (
              <Paper key={index} sx={{ p: 2, mb: 1.5, bgcolor: "rgba(245,245,245,0.05)", color: "#F5F5F5", border: "1px solid rgba(212,175,55,0.18)" }}>
                <Typography sx={{ fontWeight: 800, color: "#D4AF37" }}>{item.question}</Typography>
                <Typography sx={{ color: "rgba(245,245,245,0.72)" }}>{item.answer}</Typography>
              </Paper>
            ))}
          </Box>
        )}

        <Button onClick={() => navigate(`/services/${categorySlug}`)} sx={{ color: "#D4AF37" }}>Back to category</Button>
      </Container>
    </Box>
  );
};

export default ServiceDetailPage;
