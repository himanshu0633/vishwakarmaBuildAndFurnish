import React from "react";
import { Box, Button, Chip, Container, Paper, Typography } from "@mui/material";
import { Link as RouterLink, Navigate, useParams } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { getServiceAreaBySlug, localSeoServices, serviceAreas } from "../data/localSeo";
import { buildPageUrl, simpleBusinessStructuredData, useSeo } from "../utils/seo";

const phone = "9416856468";

const LocationPage = () => {
  const { citySlug } = useParams();
  const area = getServiceAreaBySlug(citySlug);

  if (!area) {
    return <Navigate to="/services" replace />;
  }

  const cityKeywords = localSeoServices.flatMap((service) => [
    `${service.name} ${area.name}`,
    ...service.searches.map((search) => `${search} ${area.name}`)
  ]);

  useSeo({
    title: `${area.name} Construction, Furniture & Interior Services`,
    description: `Vishwakarma Build & Furnish provides house construction, wooden doors, custom furniture, modular kitchen, POP, paint, electrical and interior work in ${area.name}, Haryana.`,
    path: `/locations/${area.slug}`,
    keywords: [
      `construction company in ${area.name}`,
      `furniture banane wala ${area.name}`,
      `lakdi ka darwaza ${area.name}`,
      `ghar banane wala ${area.name}`,
      `interior designer ${area.name}`,
      ...cityKeywords
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "@id": `${buildPageUrl(`/locations/${area.slug}`)}#local-services`,
          name: `Construction, Furniture and Interior Services in ${area.name}`,
          provider: simpleBusinessStructuredData,
          areaServed: {
            "@type": "Place",
            name: area.name
          },
          serviceType: localSeoServices.map((service) => service.name),
          url: buildPageUrl(`/locations/${area.slug}`)
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${buildPageUrl(`/locations/${area.slug}`)}#breadcrumbs`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: buildPageUrl("/") },
            { "@type": "ListItem", position: 2, name: area.name, item: buildPageUrl(`/locations/${area.slug}`) }
          ]
        }
      ]
    }
  });

  return (
    <Box sx={{ bgcolor: "#111111", color: "#F8FAFC", minHeight: "100%" }}>
      <Box
        sx={{
          py: { xs: 7, md: 10 },
          borderBottom: "1px solid rgba(212,175,55,0.24)",
          background: "linear-gradient(135deg, #111111 0%, #0F172A 62%, #1F2937 100%)"
        }}
      >
        <Container>
          <Chip icon={<LocationOnIcon />} label={`${area.name}, Haryana`} sx={{ bgcolor: "rgba(212,175,55,0.14)", color: "#D4AF37", fontWeight: 900, mb: 2 }} />
          <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: "2.2rem", md: "4.2rem" }, lineHeight: 1.08, maxWidth: 920, mb: 2 }}>
            Construction, Furniture & Interior Services in {area.name}
          </Typography>
          <Typography sx={{ color: "rgba(248,250,252,0.78)", fontSize: { xs: "1rem", md: "1.16rem" }, lineHeight: 1.8, maxWidth: 850, mb: 3 }}>
            {area.intro} Vishwakarma Build & Furnish helps with ghar banane wala work, lakdi ka darwaza, sofa banane wala, modular kitchen, POP ka kaam, paint ka kaam, bijli ka kaam, and complete finishing services.
          </Typography>
          <Button
            href={`https://wa.me/91${phone}?text=${encodeURIComponent(`Hello Vishwakarma Build & Furnish, I need service in ${area.name}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<WhatsAppIcon />}
            variant="contained"
            sx={{ bgcolor: "#D4AF37", color: "#111111", fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#B88917" } }}
          >
            Discuss Project
          </Button>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 5, md: 8 } }}>
        <Typography variant="h2" sx={{ color: "#D4AF37", fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.7rem" }, mb: 3 }}>
          Popular Services in {area.name}
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2.5 }}>
          {localSeoServices.map((service) => (
            <Paper key={service.name} sx={{ p: { xs: 2.5, md: 3 }, bgcolor: "#0F172A", color: "#F8FAFC", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 2 }}>
              <Typography component={RouterLink} to={service.path} sx={{ color: "#D4AF37", fontWeight: 900, fontSize: "1.18rem", textDecoration: "none", "&:hover": { color: "#F8FAFC" } }}>
                {service.name} in {area.name}
              </Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.74)", lineHeight: 1.75, mt: 1.2, mb: 1.6 }}>
                Customers also search this service as {service.searches.map((search) => `${search} ${area.name}`).join(", ")}.
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {service.searches.map((search) => (
                  <Chip key={search} label={`${search} ${area.name}`} sx={{ bgcolor: "rgba(212,175,55,0.1)", color: "rgba(248,250,252,0.88)", border: "1px solid rgba(212,175,55,0.18)" }} />
                ))}
              </Box>
            </Paper>
          ))}
        </Box>

        <Box sx={{ mt: { xs: 5, md: 7 } }}>
          <Typography variant="h3" sx={{ color: "#D4AF37", fontWeight: 900, fontSize: { xs: "1.55rem", md: "2.2rem" }, mb: 2 }}>
            Nearby Service Areas
          </Typography>
          <Box sx={{ display: "flex", gap: 1.2, flexWrap: "wrap" }}>
            {serviceAreas.map((serviceArea) => (
              <Button
                key={serviceArea.slug}
                component={RouterLink}
                to={`/locations/${serviceArea.slug}`}
                variant={serviceArea.slug === area.slug ? "contained" : "outlined"}
                sx={{
                  bgcolor: serviceArea.slug === area.slug ? "#D4AF37" : "transparent",
                  color: serviceArea.slug === area.slug ? "#111111" : "#D4AF37",
                  borderColor: "#D4AF37",
                  fontWeight: 900,
                  textTransform: "none",
                  "&:hover": { borderColor: "#D4AF37", bgcolor: "rgba(212,175,55,0.12)" }
                }}
              >
                {serviceArea.name}
              </Button>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LocationPage;
