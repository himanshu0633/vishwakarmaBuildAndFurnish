import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Chip, CircularProgress, Container, IconButton, Modal, Paper, Typography, useMediaQuery, useTheme, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import DescriptionIcon from "@mui/icons-material/Description";
import FoundationIcon from "@mui/icons-material/Foundation";
import GridOnIcon from "@mui/icons-material/GridOn";
import BuildIcon from "@mui/icons-material/Build";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import ShowerIcon from "@mui/icons-material/Shower";
import WeekendIcon from "@mui/icons-material/Weekend";
import KeyIcon from "@mui/icons-material/Key";
import CountUp from "react-countup";
const CountUpComponent = typeof CountUp === "function" ? CountUp : (CountUp.default || CountUp);
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useQuoteModal } from "../contexts/QuoteModalContext";
import axiosInstance, { getStaticAssetUrl, logStaticAssetUrl } from "../../utils/axiosConfig";
import {
  getCategoryEmoji,
  getCategoryName,
  getServiceDescription,
  getServiceFullDescription
} from "../utils/catalogSchema";
import { buildPageUrl, buildServiceSeo, simpleBusinessStructuredData, useSeo, getImageAlt } from "../utils/seo";

const CATEGORY_CONTENT = {
  "construction-services": {
    badge: "★ Complete Home Building Guide",
    titlePrefix: "Complete House Construction",
    titleSuffix: "In Charkhi Dadri",
    subtitle: "From Foundation to Furniture. We design and build high-density structural homes with end-to-end accountability.",
    quoteType: "Complete House Construction",
    ctaTitle1: "READY TO BUILD",
    ctaTitle2: "YOUR DREAM HOME?",
    ctaSubtitle: "Let's discuss your project today!",
    timelineSteps: [
      { label: "Planning & Design", icon: <AssignmentIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Foundation Work", icon: <FoundationIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Structure Work", icon: <GridOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Brick Work", icon: <GridOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Plaster Work", icon: <BuildIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Electrical Work", icon: <FlashOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Plumbing Work", icon: <ShowerIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Flooring & Tiling", icon: <GridOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Finishing & Handover", icon: <KeyIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> }
    ],
    whyChooseList: [
      "Premium Quality Brand Materials Only",
      "Expert Civil Engineering & Structural Supervision",
      "Daily Progress Site Photo Updates on WhatsApp",
      "100% Transparent Item-Wise Pricing Estimates",
      "Post-Handover Quality Support Warranty",
      "Assured On-Time Structure Delivery Timelines",
      "Free Consultation & Site Layout Audit Visits"
    ],
    faqs: [
      {
        q: "How much does house construction cost?",
        a: "The cost of house construction starts from custom quotes depending upon materials, structure design, layout, quality tier, and custom interior requirements."
      },
      {
        q: "How much time does it take?",
        a: "A standard house construction project takes about 6 to 9 months depending upon size, design complexity, weather conditions, and materials curation."
      },
      {
        q: "Do you provide material?",
        a: "Yes, we provide end-to-end construction services including material procurement, civil work, structural engineering, plumbing, electrical, and woodwork."
      },
      {
        q: "Do you provide warranty?",
        a: "Yes, we provide complete post-handover support and a structural reliability warranty for construction quality tier options."
      }
    ],
    aiSummary: "Vishwakarma Build & Furnish provides complete house construction services in Charkhi Dadri including foundation work, RCC structure, brick work, electrical, plumbing, interior, woodwork, modular kitchen and furniture."
  },
  "wooden-work-services": {
    badge: "★ Premium Wooden Furniture Guide",
    titlePrefix: "Premium Woodwork & Furniture",
    titleSuffix: "In Charkhi Dadri",
    subtitle: "Custom wardrobes, designer beds, luxury sofas, and modern modular kitchens crafted to perfection by local master artisans.",
    quoteType: "Custom Furniture and Modular Kitchen",
    ctaTitle1: "READY TO UPGRADE",
    ctaTitle2: "YOUR FURNITURE?",
    ctaSubtitle: "Let's manufacture your custom pieces today!",
    timelineSteps: [
      { label: "Consultation", icon: <AssignmentIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Blueprint", icon: <ArchitectureIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Material pick", icon: <DescriptionIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Wood Seasoning", icon: <FoundationIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Cutting/Shape", icon: <GridOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Joint Assembly", icon: <GridOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Carvings", icon: <BuildIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Sanding", icon: <FlashOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Fitting check", icon: <ShowerIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Polishing", icon: <GridOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Hardware fit", icon: <WeekendIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Quality Audit", icon: <WeekendIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Installation", icon: <KeyIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> }
    ],
    whyChooseList: [
      "Seasoned Premium Teak, Sheesham & Hardwood Only",
      "Highly Skilled Traditional & Modern Artisans",
      "Personalized Wardrobe & Modular Kitchen Layouts",
      "Premium Brand Soft-Close Hardware Integration",
      "Termite & Moisture Resistant Wood Curation",
      "Seamless Installation & On-Time Delivery Guarantees",
      "Free Curation Consultations & Casing Audits"
    ],
    faqs: [
      {
        q: "What wood types do you use?",
        a: "We use seasoned Teak wood, Sheesham wood, premium plywood, and MDF depending on your custom requirements."
      },
      {
        q: "Do you customize modular kitchens?",
        a: "Yes, we specialize in customize modular kitchens with soft-close drawers, pull-outs, tall units, and chimney integration."
      },
      {
        q: "Do you offer anti-termite treatment?",
        a: "Yes, all our wood and plywood undergo thorough anti-termite and moisture-resistance treatment."
      },
      {
        q: "How can I estimate furniture cost?",
        a: "You can get a customized item-wise estimate by contacting us with your dimensions and design preferences."
      }
    ],
    aiSummary: "Vishwakarma Build & Furnish provides premium custom woodwork, modular kitchens, wardrobes, designer beds, sofa sets, wooden jali doors, and carving furniture services in Charkhi Dadri Haryana."
  },
  "interior-services": {
    badge: "★ Modern Interior Solutions Guide",
    titlePrefix: "Modern Interior Solutions",
    titleSuffix: "In Charkhi Dadri",
    subtitle: "Transforming spaces with modular ceilings, luxury lighting, premium flooring, and customized modern layout themes.",
    quoteType: "Modern Interior Solutions",
    ctaTitle1: "READY TO DESIGN",
    ctaTitle2: "YOUR INTERIORS?",
    ctaSubtitle: "Let's curate your living spaces today!",
    timelineSteps: [
      { label: "Site Audit", icon: <AssignmentIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "3D Visualize", icon: <ArchitectureIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Material pick", icon: <DescriptionIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Budget Layout", icon: <FoundationIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Ceiling frame", icon: <GridOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Plaster board", icon: <GridOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Wiring fit", icon: <BuildIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Light check", icon: <FlashOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Wall texture", icon: <ShowerIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Flooring fit", icon: <GridOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Modular fit", icon: <WeekendIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Styling check", icon: <WeekendIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
      { label: "Final handover", icon: <KeyIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> }
    ],
    whyChooseList: [
      "End-to-End Modern 3D Design Visualizations",
      "Dedicated Interior Designers & Site Supervisors",
      "Direct Factory Pricing on Modular Components",
      "Premium Paints, False Ceiling, and Lighting Curations",
      "Customized Space-Saving Layout Designs",
      "Guaranteed Project Completion Timelines",
      "Free Site Measurement & Concept Consultations"
    ],
    faqs: [
      {
        q: "What are the charges of interior design?",
        a: "We provide transparent item-wise pricing based on materials selected, false ceiling area, and custom furniture requirements."
      },
      {
        q: "Do you provide 3D designs beforehand?",
        a: "Yes, we provide complete 3D color renders and spatial layouts before starting any on-site work."
      },
      {
        q: "How long does interior work take?",
        a: "A standard home interior project takes about 30 to 45 days after layout finalization."
      },
      {
        q: "Do you renovate old apartments?",
        a: "Yes, we provide full renovation services including wall demolition, false ceiling, plumbing, tiling, and repaint."
      }
    ],
    aiSummary: "Vishwakarma Build & Furnish provides complete modern interior design, false ceilings, lighting design, wall styling, customized modular kitchens, and premium home renovation services in Charkhi Dadri."
  }
};

const ConstructionCategoryPage = ({ item, slug, navigate, openQuote }) => {
  const isMobile = window.innerWidth < 600;
  const trustSectionRef = useRef(null);
  const content = CATEGORY_CONTENT[slug] || CATEGORY_CONTENT["construction-services"];

  const [reviewIndex, setReviewIndex] = useState(0);
  const reviews = [
    {
      author: "Amit Sharma",
      rating: 5,
      text: "Excellent construction work. The team is highly professional and delivered the project on time."
    },
    {
      author: "Vikram Jangra",
      rating: 5,
      text: "Extremely professional team. High quality construction work and transparent pricing."
    },
    {
      author: "Rajesh Kumar",
      rating: 5,
      text: "Delivered our dream home on time. Transparent pricing and premium materials used."
    },
    {
      author: "Deepak Saini",
      rating: 5,
      text: "Highly recommended for construction and interior work in Charkhi Dadri."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const projectImages = (item.services || [])
    .flatMap((service) => {
      const hasImages = service.images && service.images.length > 0;
      const imagesList = hasImages ? service.images : (service.heroImage ? [service.heroImage] : []);
      return imagesList.map((img) => ({
        url: getStaticAssetUrl(img),
        rawUrl: img,
        serviceName: service.name
      }));
    })
    .filter((value, index, self) => self.findIndex((v) => v.url === value.url) === index);

  const [selectedProj, setSelectedProj] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const openProjLightbox = (imgObj, index) => {
    setSelectedProj({ ...imgObj, index });
  };
  const prevProj = () => {
    if (!projectImages.length || selectedProj === null) return;
    const newIdx = (selectedProj.index - 1 + projectImages.length) % projectImages.length;
    setSelectedProj({ ...projectImages[newIdx], index: newIdx });
  };
  const nextProj = () => {
    if (!projectImages.length || selectedProj === null) return;
    const newIdx = (selectedProj.index + 1) % projectImages.length;
    setSelectedProj({ ...projectImages[newIdx], index: newIdx });
  };

  const scrollDown = () => {
    if (trustSectionRef.current) {
      trustSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const categoryImage = item.image ? getStaticAssetUrl(item.image) : "";

  const seoTitle = slug === "construction-services"
    ? "Best House Construction Services in Charkhi Dadri | Vishwakarma Build & Furnish"
    : slug === "wooden-work-services"
    ? "Best Custom Furniture & Wooden Work in Charkhi Dadri | Vishwakarma Build & Furnish"
    : "Best Modern Interior Designers in Charkhi Dadri | Vishwakarma Build & Furnish";

  useSeo({
    title: seoTitle,
    description: content.subtitle,
    path: `/services/${slug}`,
    image: categoryImage,
    keywords: [slug.replace("-", " "), "Vishwakarma build and furnish"],
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "@id": `https://vishwakarmabuildandfurnish.in/services/${slug}#service`,
          "name": content.titlePrefix,
          "description": content.subtitle,
          "provider": {
            "@type": "LocalBusiness",
            "name": "Vishwakarma Build & Furnish",
            "image": "https://vishwakarmabuildandfurnish.in/assets/logo-pe2UVQrp.png",
            "telePhone": "+919416856468",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Main Road",
              "addressLocality": "Charkhi Dadri",
              "addressRegion": "Haryana",
              "postalCode": "127306",
              "addressCountry": "IN"
            }
          }
        },
        {
          "@type": "FAQPage",
          "@id": `https://vishwakarmabuildandfurnish.in/services/${slug}#faq`,
          "mainEntity": content.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        }
      ]
    }
  });

  return (
    <Box sx={{ bgcolor: "#0B0F19", color: "#F8FAFC", minHeight: "100vh", pb: 12 }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: { xs: "auto", md: "90vh" },
          display: "flex",
          alignItems: "center",
          position: "relative",
          background: categoryImage
            ? `linear-gradient(180deg, rgba(11, 15, 25, 0.76) 0%, rgba(11, 15, 25, 0.96) 100%), url("${categoryImage}") center/cover no-repeat`
            : "linear-gradient(135deg, #0B0F19 0%, #0F172A 100%)",
          borderBottom: "1px solid rgba(212,175,55,0.22)"
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 10, md: 8 }, zIndex: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Chip
              label={content.badge}
              sx={{
                bgcolor: "rgba(212,175,55,0.12)",
                color: "#D4AF37",
                border: "1px solid rgba(212,175,55,0.32)",
                fontWeight: 900,
                alignSelf: "flex-start",
                px: 1.5,
                py: 2,
                borderRadius: "50px",
                fontSize: "0.95rem"
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontWeight: 950,
                fontSize: { xs: "2.1rem", sm: "3rem", md: "3.6rem" },
                lineHeight: 1.1,
                maxWidth: 820,
                textTransform: "uppercase"
              }}
            >
              {content.titlePrefix} <br />
              <span style={{ color: "#D4AF37" }}>{content.titleSuffix}</span>
            </Typography>
            <Typography sx={{ color: "rgba(248, 250, 252, 0.84)", fontSize: { xs: "0.95rem", md: "1.12rem" }, maxWidth: 660, lineHeight: 1.65 }}>
              {content.subtitle}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography sx={{ color: "#D4AF37", fontWeight: 900, fontSize: "1rem" }}>★★★★★</Typography>
              <Typography sx={{ color: "#F8FAFC", fontWeight: 700, fontSize: "0.9rem" }}>4.9 Google Rating (Trusted Provider)</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 0.5, flexDirection: { xs: "column", sm: "row" } }}>
              <Button
                variant="contained"
                onClick={() => openQuote(content.quoteType)}
                sx={{
                  bgcolor: "#D4AF37",
                  color: "#0B0F19",
                  fontWeight: 950,
                  px: 3.5,
                  py: 1.3,
                  fontSize: "0.95rem",
                  borderRadius: "50px",
                  textTransform: "none",
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": { bgcolor: "#B88917" }
                }}
              >
                Get Free Estimate
              </Button>
              <Button
                variant="outlined"
                href={`https://wa.me/919416856468?text=Hello%20Vishwakarma%20Build%20%26%20Furnish%2C%20I%20want%20to%20get%20a%20free%20estimate%20for%20${encodeURIComponent(content.quoteType)}.`}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<WhatsAppIcon />}
                sx={{
                  borderColor: "rgba(212,175,55,0.45)",
                  color: "#D4AF37",
                  fontWeight: 900,
                  px: 3.5,
                  py: 1.3,
                  fontSize: "0.95rem",
                  borderRadius: "50px",
                  textTransform: "none",
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": { borderColor: "#D4AF37", bgcolor: "rgba(212,175,55,0.06)" }
                }}
              >
                WhatsApp
              </Button>
            </Box>
          </Box>
        </Container>
        <Box
          onClick={scrollDown}
          sx={{
            position: "absolute",
            bottom: 25,
            left: "50%",
            transform: "translateX(-50%)",
            cursor: "pointer",
            textAlign: "center",
            zIndex: 3,
            animation: "bounce 2s infinite"
          }}
        >
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 900, letterSpacing: 2, color: "rgba(248, 250, 252, 0.55)" }}>SCROLL DOWN</Typography>
          <Typography sx={{ color: "#D4AF37", fontSize: "1.25rem", mt: 0.2 }}>↓</Typography>
        </Box>
      </Box>

      {/* Trust Section */}
      <Box ref={trustSectionRef} sx={{ py: 5, bgcolor: "#0F172A", borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 4, textAlign: "center" }}>
            <Box>
              <Typography sx={{ fontWeight: 950, color: "#D4AF37", fontSize: { xs: "2rem", md: "2.6rem" }, mb: 0.5 }}>
                <CountUpComponent end={10} enableScrollSpy />+
              </Typography>
              <Typography sx={{ color: "rgba(248, 250, 252, 0.72)", fontWeight: 700, fontSize: "0.9rem" }}>🏆 Years Experience</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 950, color: "#D4AF37", fontSize: { xs: "2rem", md: "2.6rem" }, mb: 0.5 }}>
                <CountUpComponent end={250} enableScrollSpy />+
              </Typography>
              <Typography sx={{ color: "rgba(248, 250, 252, 0.72)", fontWeight: 700, fontSize: "0.9rem" }}>🏠 Projects Completed</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 950, color: "#D4AF37", fontSize: { xs: "2rem", md: "2.6rem" }, mb: 0.5 }}>
                <CountUpComponent end={500} enableScrollSpy />+
              </Typography>
              <Typography sx={{ color: "rgba(248, 250, 252, 0.72)", fontWeight: 700, fontSize: "0.9rem" }}>😊 Happy Clients</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 950, color: "#D4AF37", fontSize: { xs: "2rem", md: "2.6rem" }, mb: 0.5 }}>
                <CountUpComponent end={4} decimals={1} enableScrollSpy />.9
              </Typography>
              <Typography sx={{ color: "rgba(248, 250, 252, 0.72)", fontWeight: 700, fontSize: "0.9rem" }}>⭐ Google Rating</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Timeline Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, overflow: "hidden" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 1 }}>
              <Box sx={{ width: 40, height: "2px", bgcolor: "#D4AF37" }} />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 950,
                  fontSize: { xs: "1.35rem", md: "2.1rem" },
                  color: "#F8FAFC",
                  textTransform: "uppercase",
                  letterSpacing: 1
                }}
              >
                {slug === "wooden-work-services"
                  ? "OUR FURNITURE PROCESS"
                  : slug === "interior-services"
                  ? "OUR INTERIOR PROCESS"
                  : "OUR CONSTRUCTION PROCESS"}
              </Typography>
              <Box sx={{ width: 40, height: "2px", bgcolor: "#D4AF37" }} />
            </Box>
            <Box
              sx={{
                width: 6,
                height: 6,
                bgcolor: "#D4AF37",
                transform: "rotate(45deg)",
                mx: "auto",
                mt: 1.5
              }}
            />
          </Box>

          <Box
            sx={{
              position: "relative",
              width: "100%",
              mt: 6,
              overflowX: { xs: "auto", lg: "visible" },
              pb: { xs: 3, lg: 0 },
              "&::-webkit-scrollbar": { height: "6px" },
              "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(212,175,55,0.38)", borderRadius: "10px" }
            }}
          >
            <Box
              sx={{
                minWidth: { xs: content.timelineSteps.length * 105, lg: "100%" },
                position: "relative"
              }}
            >
              {/* Dashed Connector Line */}
              <Box
                sx={{
                  position: "absolute",
                  top: { xs: "23px", lg: "28px" },
                  left: "30px",
                  right: "30px",
                  height: "2px",
                  borderTop: "2px dashed rgba(212,175,55,0.4)",
                  zIndex: 1
                }}
              />

              {/* Steps Row */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  position: "relative",
                  zIndex: 2
                }}
              >
                {content.timelineSteps.map((step) => (
                  <Box
                    key={step.label}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      width: { xs: "105px", lg: "auto" },
                      flex: { xs: "0 0 auto", lg: 1 },
                      flexShrink: 0
                    }}
                  >
                  {/* Circle */}
                  <Box
                    sx={{
                      width: { xs: 46, md: 56 },
                      height: { xs: 46, md: 56 },
                      borderRadius: "50%",
                      bgcolor: "#0B0F19",
                      border: "2px solid #D4AF37",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#D4AF37",
                      mb: 1.5,
                      transition: "all 0.3s ease",
                      boxShadow: "0 0 10px rgba(212,175,55,0.15)",
                      "&:hover": {
                        transform: "scale(1.15)",
                        boxShadow: "0 0 18px rgba(212,175,55,0.45)",
                        bgcolor: "#D4AF37",
                        color: "#0B0F19"
                      }
                    }}
                  >
                    {step.icon}
                  </Box>
                  {/* Label */}
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "0.72rem", md: "0.82rem" },
                      color: "#F8FAFC",
                      lineHeight: 1.25
                    }}
                  >
                    {step.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          </Box>
        </Container>
      </Box>

      {/* Services Grid Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#0F172A", borderTop: "1px solid rgba(212,175,55,0.12)", borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Chip label="🔥 Our Construction Services" sx={{ bgcolor: "rgba(212,175,55,0.12)", color: "#D4AF37", fontWeight: 900, mb: 1.5 }} />
            <Typography variant="h3" sx={{ fontWeight: 950, fontSize: { xs: "1.7rem", md: "2.2rem" }, mb: 2 }}>High-Density Structural Works</Typography>
            <Typography sx={{ color: "rgba(248, 250, 252, 0.72)", maxWidth: 540, mx: "auto", fontSize: "0.92rem" }}>We render robust residential and commercial structural frameworks in Charkhi Dadri.</Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2.5 }}>
            {(item.services || []).map((service) => {
              const activeImage = service.heroImage ? getStaticAssetUrl(service.heroImage) : "";

              return (
                <Paper
                  key={service._id}
                  onClick={() => navigate(`/services/${item.slug}/${service.slug}`)}
                  sx={{
                    p: 2.8,
                    cursor: "pointer",
                    minHeight: 240,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 3.5,
                    overflow: "hidden",
                    position: "relative",
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(14px)",
                    border: "1px solid rgba(212,175,55,0.15)",
                    color: "#F8FAFC",
                    background: activeImage
                      ? `linear-gradient(180deg, rgba(17,17,17,0.4) 0%, rgba(15,23,42,0.92) 100%), url("${activeImage}") center/cover no-repeat`
                      : "rgba(255, 255, 255, 0.03)",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: "#D4AF37",
                      boxShadow: "0 15px 30px rgba(0,0,0,0.6), 0 0 15px rgba(212,175,55,0.2)",
                      "& .explore-btn-arrow": { transform: "translateX(6px)" }
                    }
                  }}
                >
                  <Box sx={{ zIndex: 2 }}>
                    <Typography sx={{ fontSize: "2.2rem", mb: 1 }}>{service.emoji || "🧱"}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, fontSize: "1.2rem", lineHeight: 1.35 }}>{service.name}</Typography>
                    <Typography sx={{ color: "rgba(248,250,252,0.72)", fontSize: "0.85rem", lineHeight: 1.5, mb: 1.5 }}>
                      {getServiceDescription(service)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.5, zIndex: 2 }}>
                    {service.priceStarting && (
                      <Typography sx={{ color: "#D4AF37", fontWeight: 800, fontSize: "0.88rem" }}>
                        {service.priceStarting}
                      </Typography>
                    )}
                    <Typography
                      sx={{
                        color: "#D4AF37",
                        fontWeight: 900,
                        fontSize: "0.88rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5
                      }}
                    >
                      Learn More
                      <ArrowForwardIcon
                        className="explore-btn-arrow"
                        sx={{
                          fontSize: "1.1rem",
                          transition: "transform 0.28s ease"
                        }}
                      />
                    </Typography>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* Featured Projects Gallery */}
      {projectImages.length > 0 && (() => {
        const totalPages = Math.ceil(projectImages.length / 50);
        const paginatedImages = projectImages.slice((currentPage - 1) * 50, currentPage * 50);

        return (
          <Box sx={{ py: { xs: 6, md: 8 } }}>
            <Container maxWidth="lg">
              <Box sx={{ textAlign: "center", mb: 5 }}>
                <Chip label="📷 Featured Projects" sx={{ bgcolor: "rgba(212,175,55,0.12)", color: "#D4AF37", fontWeight: 900, mb: 1.5 }} />
                <Typography variant="h3" sx={{ fontWeight: 950, fontSize: { xs: "1.7rem", md: "2.2rem" }, mb: 2 }}>Real On-Site Works</Typography>
                <Typography sx={{ color: "rgba(248, 250, 252, 0.72)", maxWidth: 540, mx: "auto", fontSize: "0.92rem" }}>Glance through our real work site pictures showing material layout and structuring details.</Typography>
              </Box>

              <Box sx={{ columnCount: { xs: 2, md: 3 }, columnGap: 2 }}>
                {paginatedImages.map((imgObj, idx) => {
                  const absoluteIndex = (currentPage - 1) * 50 + idx;
                  return (
                    <Box
                      key={imgObj.url}
                      sx={{
                        breakInside: "avoid",
                        mb: 2,
                        position: "relative",
                        borderRadius: 3,
                        overflow: "hidden",
                        border: "1px solid rgba(212,175,55,0.18)",
                        cursor: "pointer",
                        "&:hover img": { transform: "scale(1.06)" },
                        "&:hover .proj-label": { opacity: 1 }
                      }}
                      onClick={() => openProjLightbox(imgObj, absoluteIndex)}
                    >
                      <Box
                        component="img"
                        src={imgObj.url}
                        alt={`${imgObj.serviceName} Work in Charkhi Dadri`}
                        title={`${imgObj.serviceName} Work in Charkhi Dadri`}
                        loading="lazy"
                        sx={{
                          width: "100%",
                          display: "block",
                          borderRadius: 3,
                          transition: "transform 0.4s ease"
                        }}
                      />
                      <Box
                        className="proj-label"
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(0deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.3) 100%)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                          p: 2,
                          opacity: 0,
                          transition: "opacity 0.3s ease"
                        }}
                      >
                        <Typography sx={{ fontWeight: 900, color: "#F8FAFC", fontSize: "0.95rem" }}>{imgObj.serviceName}</Typography>
                        <Typography sx={{ color: "#D4AF37", fontSize: "0.82rem", fontWeight: 800 }}>View Project</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    sx={{ borderColor: "rgba(212,175,55,0.45)", color: "#D4AF37", fontWeight: 900, borderRadius: "50px", textTransform: "none", "&:hover": { borderColor: "#D4AF37", bgcolor: "rgba(212,175,55,0.06)" } }}
                  >
                    Previous Page
                  </Button>
                  <Typography sx={{ color: "rgba(248, 250, 252, 0.72)", fontWeight: 800, fontSize: "0.95rem" }}>
                    Page {currentPage} of {totalPages}
                  </Typography>
                  <Button
                    variant="outlined"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    sx={{ borderColor: "rgba(212,175,55,0.45)", color: "#D4AF37", fontWeight: 900, borderRadius: "50px", textTransform: "none", "&:hover": { borderColor: "#D4AF37", bgcolor: "rgba(212,175,55,0.06)" } }}
                  >
                    Next Page
                  </Button>
                </Box>
              )}
            </Container>
          </Box>
        );
      })()}

      {/* Why Choose Us */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#0F172A", borderTop: "1px solid rgba(212,175,55,0.12)", borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1.1fr" }, gap: 4, alignItems: "center" }}>
            <Box
              component="img"
              src={projectImages[0]?.url || categoryImage}
              alt="Construction Quality"
              title="Construction Quality"
              loading="lazy"
              sx={{
                width: "100%",
                borderRadius: 4,
                border: "2px solid rgba(212,175,55,0.22)",
                boxShadow: "0 15px 35px rgba(0,0,0,0.5)"
              }}
            />
            <Box>
              <Chip label="📊 Why Choose Us" sx={{ bgcolor: "rgba(212,175,55,0.12)", color: "#D4AF37", fontWeight: 900, mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 950, fontSize: { xs: "1.7rem", md: "2.2rem" }, mb: 3 }}>High Density Quality Tier Setup</Typography>
              <Box sx={{ display: "grid", gap: 1.8 }}>
                {content.whyChooseList.map((itemStr) => (
                  <Box key={itemStr} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Typography sx={{ color: "#D4AF37", fontWeight: 950, fontSize: "1rem", lineHeight: 1.2 }}>✔</Typography>
                    <Typography sx={{ color: "rgba(248, 250, 252, 0.85)", fontWeight: 700, fontSize: "0.95rem" }}>{itemStr}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Google Reviews Testimonial Carousel */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Chip label="⭐ Google Reviews" sx={{ bgcolor: "rgba(212,175,55,0.12)", color: "#D4AF37", fontWeight: 900, mb: 1.5 }} />
            <Typography variant="h3" sx={{ fontWeight: 950, fontSize: { xs: "1.7rem", md: "2.2rem" } }}>Trusted By Local Families</Typography>
          </Box>

          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 4.5 },
              bgcolor: "#0F172A",
              border: "1px solid rgba(212,175,55,0.26)",
              borderRadius: 4,
              textAlign: "center",
              position: "relative"
            }}
          >
            <Typography sx={{ fontSize: "2.4rem", color: "#D4AF37", lineHeight: 1, mb: 0.5 }}>“</Typography>
            <Typography sx={{ fontSize: { xs: "0.98rem", md: "1.15rem" }, color: "rgba(248,250,252,0.9)", lineHeight: 1.7, mb: 3.5, fontStyle: "italic", minHeight: 70 }}>
              {reviews[reviewIndex].text}
            </Typography>
            <Typography sx={{ color: "#D4AF37", fontWeight: 950, fontSize: "1rem", mb: 0.5 }}>★★★★★</Typography>
            <Typography sx={{ fontWeight: 900, color: "#F8FAFC", fontSize: "0.95rem" }}>— {reviews[reviewIndex].author}</Typography>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 3 }}>
              <IconButton
                onClick={() => setReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)}
                sx={{
                  bgcolor: "rgba(248,250,252,0.05)",
                  color: "#D4AF37",
                  border: "1px solid rgba(212,175,55,0.2)",
                  "&:hover": { bgcolor: "rgba(248,250,252,0.1)" }
                }}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
              <IconButton
                onClick={() => setReviewIndex((prev) => (prev + 1) % reviews.length)}
                sx={{
                  bgcolor: "rgba(248,250,252,0.05)",
                  color: "#D4AF37",
                  border: "1px solid rgba(212,175,55,0.2)",
                  "&:hover": { bgcolor: "rgba(248,250,252,0.1)" }
                }}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#0F172A", borderTop: "1px solid rgba(212,175,55,0.12)", borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Chip label="❓ FAQ" sx={{ bgcolor: "rgba(212,175,55,0.12)", color: "#D4AF37", fontWeight: 900, mb: 1.5 }} />
            <Typography variant="h3" sx={{ fontWeight: 950, fontSize: { xs: "1.7rem", md: "2.2rem" }, mb: 2 }}>Frequently Asked Questions</Typography>
            <Typography sx={{ color: "rgba(248, 250, 252, 0.72)", fontSize: "0.92rem" }}>Got questions? We have complete clarity for your building process.</Typography>
          </Box>

          <Box>
            {content.faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  bgcolor: "rgba(245,245,245,0.03)",
                  color: "#F5F5F5",
                  border: "1px solid rgba(212,175,55,0.16)",
                  mb: 2,
                  borderRadius: "14px !important",
                  overflow: "hidden",
                  "&:before": { display: "none" }
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#D4AF37" }} />}>
                  <Typography sx={{ fontWeight: 900, color: "#F5F5F5", py: 0.5 }}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ borderTop: "1px solid rgba(212,175,55,0.1)", bgcolor: "rgba(0,0,0,0.22)", p: 3 }}>
                  <Typography sx={{ color: "rgba(245,245,245,0.76)", lineHeight: 1.7 }}>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* AI Summary Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: 4.5,
              bgcolor: "rgba(212,175,55,0.02)",
              border: "1px dashed rgba(212,175,55,0.38)",
              borderRadius: 5,
              position: "relative",
              overflow: "hidden"
            }}
          >
            <Box sx={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, bgcolor: "rgba(212,175,55,0.08)", borderRadius: "50%" }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
              <Typography sx={{ fontSize: "1.6rem" }}>🤖</Typography>
              <Typography variant="h5" sx={{ fontWeight: 950, color: "#D4AF37", letterSpacing: 0.5 }}>AI QUICK SUMMARY</Typography>
            </Box>
            <Typography sx={{ color: "rgba(248, 250, 252, 0.9)", fontSize: "1.05rem", lineHeight: 1.8, fontWeight: 700 }}>
              {content.aiSummary}
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* Footer CTA Banner Section */}
      <Box
        sx={{
          py: 8,
          background: categoryImage
            ? `linear-gradient(180deg, rgba(11, 15, 25, 0.85) 0%, rgba(11, 15, 25, 0.95) 100%), url("${categoryImage}") center/cover no-repeat`
            : "linear-gradient(135deg, #0B0F19 0%, #0F172A 100%)",
          borderTop: "2px solid rgba(212,175,55,0.22)",
          borderBottom: "2px solid rgba(212,175,55,0.22)",
          textAlign: "center",
          position: "relative",
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontWeight: 950,
              fontSize: { xs: "1.8rem", md: "2.8rem" },
              color: "#F8FAFC",
              letterSpacing: 1,
              mb: 1
            }}
          >
            {content.ctaTitle1}{" "}
            <span style={{ color: "#D4AF37" }}>{content.ctaTitle2}</span>
          </Typography>
          <Typography
            sx={{
              color: "rgba(248, 250, 252, 0.76)",
              fontSize: "1.05rem",
              mb: 5
            }}
          >
            {content.ctaSubtitle}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 2.5,
              maxWidth: 960,
              mx: "auto"
            }}
          >
            {/* Call Now Card */}
            <Paper
              component="a"
              href="tel:+919416856468"
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "rgba(15,23,42,0.65)",
                border: "1px solid rgba(212,175,55,0.38)",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#D4AF37",
                  bgcolor: "rgba(212,175,55,0.06)",
                  transform: "translateY(-4px)"
                }
              }}
            >
              <PhoneIcon sx={{ color: "#D4AF37", fontSize: "2rem" }} />
              <Box sx={{ textAlign: "left" }}>
                <Typography sx={{ color: "#D4AF37", fontSize: "0.75rem", fontWeight: 900, letterSpacing: 1 }}>CALL NOW</Typography>
                <Typography sx={{ color: "#F8FAFC", fontSize: "1rem", fontWeight: 800 }}>9416856468</Typography>
              </Box>
            </Paper>

            {/* WhatsApp Card */}
            <Paper
              component="a"
              href={`https://wa.me/919416856468?text=Hello%20Vishwakarma%20Build%20%26%20Furnish%2C%20I%20want%20to%20get%20a%20free%20estimate%20for%20${encodeURIComponent(content.quoteType)}.`}
              target="_blank"
              rel="noopener noreferrer"
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "rgba(15,23,42,0.65)",
                border: "1px solid rgba(212,175,55,0.38)",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#D4AF37",
                  bgcolor: "rgba(212,175,55,0.06)",
                  transform: "translateY(-4px)"
                }
              }}
            >
              <WhatsAppIcon sx={{ color: "#D4AF37", fontSize: "2rem" }} />
              <Box sx={{ textAlign: "left" }}>
                <Typography sx={{ color: "#D4AF37", fontSize: "0.75rem", fontWeight: 900, letterSpacing: 1 }}>WHATSAPP US</Typography>
                <Typography sx={{ color: "#F8FAFC", fontSize: "1rem", fontWeight: 800 }}>Chat with us</Typography>
              </Box>
            </Paper>

            {/* Get Free Quote Card */}
            <Paper
              onClick={() => openQuote(content.quoteType)}
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "rgba(15,23,42,0.65)",
                border: "1px solid rgba(212,175,55,0.38)",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#D4AF37",
                  bgcolor: "rgba(212,175,55,0.06)",
                  transform: "translateY(-4px)"
                }
              }}
            >
              <AssignmentIcon sx={{ color: "#D4AF37", fontSize: "2rem" }} />
              <Box sx={{ textAlign: "left" }}>
                <Typography sx={{ color: "#D4AF37", fontSize: "0.75rem", fontWeight: 900, letterSpacing: 1 }}>GET FREE QUOTE</Typography>
                <Typography sx={{ color: "#F8FAFC", fontSize: "1rem", fontWeight: 800 }}>Send Requirement</Typography>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Sticky Bottom CTA Bar */}
      <Paper
        elevation={10}
        sx={{
          position: "fixed",
          bottom: { xs: 12, md: 20 },
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "92%", sm: "80%", md: "auto" },
          bgcolor: "rgba(15,23,42,0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(212,175,55,0.35)",
          borderRadius: "50px",
          py: 1,
          px: { xs: 2, md: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          zIndex: 9999,
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
        }}
      >
        <Button
          variant="contained"
          startIcon={<PhoneIcon />}
          href="tel:+919416856468"
          sx={{ bgcolor: "#D4AF37", color: "#111827", fontWeight: 950, borderRadius: "50px", textTransform: "none", fontSize: { xs: "0.82rem", md: "0.9rem" }, px: { xs: 2, md: 3.5 }, "&:hover": { bgcolor: "#B88917" } }}
        >
          Call
        </Button>
        <Button
          variant="contained"
          startIcon={<WhatsAppIcon />}
          href={`https://wa.me/919416856468?text=Hello%20Vishwakarma%20Build%20%26%20Furnish%2C%20I%20want%20to%20inquire%20about%20${encodeURIComponent(content.quoteType)}.`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ bgcolor: "#25D366", color: "#FFFFFF", fontWeight: 950, borderRadius: "50px", textTransform: "none", fontSize: { xs: "0.82rem", md: "0.9rem" }, px: { xs: 2, md: 3.5 }, "&:hover": { bgcolor: "#20BA56" } }}
        >
          WhatsApp
        </Button>
        <Button
          variant="outlined"
          startIcon={<AssignmentIcon />}
          onClick={() => openQuote(content.quoteType)}
          sx={{ borderColor: "#D4AF37", color: "#D4AF37", fontWeight: 950, borderRadius: "50px", textTransform: "none", fontSize: { xs: "0.82rem", md: "0.9rem" }, px: { xs: 2, md: 3.5 }, "&:hover": { borderColor: "#B88917", color: "#B88917", bgcolor: "rgba(212,175,55,0.06)" } }}
        >
          Get Quote
        </Button>
      </Paper>

      {/* Project Lightbox Modal */}
      <Modal open={selectedProj !== null} onClose={() => setSelectedProj(null)}>
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.92)",
            display: "grid",
            placeItems: "center",
            p: { xs: 1.5, md: 4 },
            zIndex: 2000
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: 1100,
              maxHeight: "88vh",
              bgcolor: "#050816",
              border: "1px solid rgba(212,175,55,0.34)",
              borderRadius: 3,
              overflow: "hidden"
            }}
          >
            <Box
              component="img"
              src={selectedProj?.url || ""}
              alt={`${selectedProj?.serviceName} Work preview in Charkhi Dadri Haryana`}
              title={`${selectedProj?.serviceName} Work preview in Charkhi Dadri Haryana`}
              sx={{
                width: "100%",
                maxHeight: "78vh",
                display: "block",
                objectFit: "contain",
                bgcolor: "#050816"
              }}
            />
            {projectImages.length > 1 && (
              <>
                <IconButton
                  onClick={prevProj}
                  sx={{
                    position: "absolute",
                    left: { xs: 8, md: 14 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: { xs: 42, md: 54 },
                    height: { xs: 42, md: 54 },
                    bgcolor: "rgba(17,17,17,0.78)",
                    color: "#F5F5F5",
                    border: "1px solid rgba(212,175,55,0.32)",
                    "&:hover": { bgcolor: "rgba(17,17,17,0.95)", color: "#D4AF37" }
                  }}
                >
                  <KeyboardArrowLeftIcon fontSize="large" />
                </IconButton>
                <IconButton
                  onClick={nextProj}
                  sx={{
                    position: "absolute",
                    right: { xs: 8, md: 14 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: { xs: 42, md: 54 },
                    height: { xs: 42, md: 54 },
                    bgcolor: "rgba(17,17,17,0.78)",
                    color: "#F5F5F5",
                    border: "1px solid rgba(212,175,55,0.32)",
                    "&:hover": { bgcolor: "rgba(17,17,17,0.95)", color: "#D4AF37" }
                  }}
                >
                  <KeyboardArrowRightIcon fontSize="large" />
                </IconButton>
              </>
            )}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, gap: 1, p: 2, bgcolor: "#111827" }}>
              <Typography sx={{ color: "#F5F5F5", fontWeight: 800, overflowWrap: "anywhere" }}>
                {selectedProj?.serviceName}{projectImages.length > 1 ? ` (${(selectedProj?.index ?? 0) + 1}/${projectImages.length})` : ""}
              </Typography>
            </Box>
            <IconButton
              onClick={() => setSelectedProj(null)}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                bgcolor: "rgba(17,17,17,0.78)",
                color: "#F5F5F5",
                "&:hover": { bgcolor: "rgba(17,17,17,0.95)" }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

const CatalogSlugPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { openQuote } = useQuoteModal();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const galleryPageSize = isMobile ? 10 : 15;
  const galleryTopRef = useRef(null);
  const galleryBottomRef = useRef(null);
  const paginationScrollTarget = useRef("");
  const [type, setType] = useState("");
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sliderTick, setSliderTick] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPage, setMediaPage] = useState(1);
  const [mediaData, setMediaData] = useState({
    items: [],
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
    hasPrev: false,
    hasNext: false
  });
  const [mediaLoading, setMediaLoading] = useState(false);

  useEffect(() => {
    const fetchCatalogItem = async () => {
      try {
        setLoading(true);

        try {
          const categoryRes = await axiosInstance.get(`/categories/slug/${slug}`);
          setType("category");
          setItem(categoryRes.data.data);
          return;
        } catch (categoryError) {
          try {
            const serviceRes = await axiosInstance.get(`/services/slug/${slug}`);
            const serviceData = serviceRes.data.data;
            const categorySlug = serviceData.categoryId?.slug || "wooden-work-services";
            navigate(`/services/${categorySlug}/${slug}`, { replace: true });
            return;
          } catch (serviceError) {
            console.error("Catalog item not found:", serviceError);
            setType("error");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogItem();
  }, [slug]);

  useEffect(() => {
    setMediaPage(1);
  }, [slug]);

  useEffect(() => {
    if (type !== "service" || !item?.slug) return;

    const fetchServiceMedia = async () => {
      try {
        setMediaLoading(true);
        const response = await axiosInstance.get(`/services/slug/${item.slug}/media?page=${mediaPage}&limit=${galleryPageSize}`);
        if (response.data.success) {
          setMediaData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching service media:", error);
      } finally {
        setMediaLoading(false);
      }
    };

    fetchServiceMedia();
  }, [type, item?.slug, mediaPage, galleryPageSize]);

  useEffect(() => {
    setMediaPage(1);
  }, [galleryPageSize]);

  useEffect(() => {
    if (!isMobile || mediaLoading || !paginationScrollTarget.current) return;

    const target = paginationScrollTarget.current;
    paginationScrollTarget.current = "";

    window.requestAnimationFrame(() => {
      if (target === "bottom") {
        galleryBottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end"
        });
        return;
      }

      galleryTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }, [isMobile, mediaData.page, mediaLoading]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSliderTick(prev => prev + 1);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const getServiceImages = (service) => [
    ...(service.images || []),
    ...(service.beforeImages || []),
    ...(service.afterImages || [])
  ];

  const itemName = type === "service" ? item?.name : getCategoryName(item);
  const serviceSeo = type === "service" ? buildServiceSeo(itemName) : null;
  const seoPath = slug ? `/services/${slug}` : "/services";
  const seoServiceImages = type === "service"
    ? [
        item?.heroImage,
        ...(item?.images || []),
        ...(item?.beforeImages || []),
        ...(item?.afterImages || [])
      ].filter(Boolean).slice(0, 12).map((image) => getStaticAssetUrl(image))
    : [];

  const getSeoTitle = () => {
    if (type === "service") {
      return item?.seoTitle || serviceSeo?.title;
    }
    if (!itemName) {
      return "Construction, Furniture & Interior Services in Charkhi Dadri";
    }
    const lowerName = itemName.toLowerCase();
    if (lowerName.endsWith("services") || lowerName.endsWith("service")) {
      return `${itemName} in Charkhi Dadri`;
    }
    return `${itemName} Services in Charkhi Dadri`;
  };

  useSeo({
    title: getSeoTitle(),
    description:
      type === "service"
        ? item?.seoDescription || serviceSeo?.description
        : item?.description || "Explore construction, furniture, modular kitchen, wardrobe and interior services by Vishwakarma Build & Furnish in Charkhi Dadri, Haryana.",
    path: seoPath,
    image: type === "service" ? getStaticAssetUrl(item?.heroImage || item?.images?.[0] || "") : undefined,
    keywords:
      type === "service"
        ? [...(serviceSeo?.keywords || []), ...(item?.tags || [])]
        : [
            `${itemName || "services"} Charkhi Dadri`,
            `${itemName || "services"} Haryana`,
            "Vishwakarma Build & Furnish",
            "construction services Charkhi Dadri",
            "interior services Charkhi Dadri"
          ],
    structuredData:
      type === "service" && item
        ? {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Service",
                "@id": `${buildPageUrl(seoPath)}#service`,
                name: item.name,
                description: item.seoDescription || getServiceFullDescription(item),
                image: seoServiceImages,
                provider: simpleBusinessStructuredData,
                areaServed: simpleBusinessStructuredData.areaServed,
                category: getCategoryName(item.categoryId) || "Construction and Interior",
                url: buildPageUrl(seoPath)
              },
              {
                "@type": "ImageGallery",
                "@id": `${buildPageUrl(seoPath)}#images`,
                name: `${item.name} Images`,
                image: seoServiceImages.map((imageUrl, index) => ({
                  "@type": "ImageObject",
                  contentUrl: imageUrl,
                  url: imageUrl,
                  name: `${item.name} image ${index + 1}`,
                  caption: `${item.name} design and work in Charkhi Dadri Haryana`
                }))
              },
              {
                "@type": "FAQPage",
                "@id": `${buildPageUrl(seoPath)}#faq`,
                mainEntity: (item.faq || []).filter((faqItem) => faqItem.question || faqItem.answer).map((faqItem) => ({
                  "@type": "Question",
                  name: faqItem.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faqItem.answer
                  }
                }))
              }
            ]
          }
        : null
  });

  const shareMediaOnWhatsApp = (serviceName, mediaUrl) => {
    const message = `Hello Vishwakarma Build & Furnish, I am interested in ${serviceName}. Please share details for this image: ${mediaUrl}`;
    window.open(`https://wa.me/919416856468?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareServicePage = async () => {
    const url = window.location.href;
    const title = item?.name ? `${item.name} | Vishwakarma Build & Furnish` : document.title;
    const text = item?.name
      ? `Check this ${item.name} service by Vishwakarma Build & Furnish`
      : "Check this service by Vishwakarma Build & Furnish";

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      alert("Service page link copied");
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error sharing service page:", error);
      }
    }
  };

  const likeService = async (imageUrl = "") => {
    await axiosInstance.post("/marketplace/likes", {
      serviceId: item._id,
      imageUrl
    });
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center", bgcolor: "#111111" }}>
        <CircularProgress sx={{ color: "#D4AF37" }} />
      </Box>
    );
  }

  if (!item) {
    return <Box sx={{ minHeight: "60vh", bgcolor: "#111111", color: "#fff", p: 4 }}>Page not found</Box>;
  }

  const isPremiumCategory = ["construction-services", "wooden-work-services", "interior-services"].includes(slug);

  if (type === "category" && isPremiumCategory) {
    return <ConstructionCategoryPage item={item} slug={slug} navigate={navigate} openQuote={openQuote} />;
  }

  if (type === "service") {
    const heroImage = item.heroImage || "";
    const heroImageUrl = heroImage ? getStaticAssetUrl(heroImage) : "";
    const filteredMediaItems = (mediaData.items || []).filter(mediaItem => mediaItem.url !== heroImage);
    const lightboxItems = filteredMediaItems
      .filter(mediaItem => mediaItem.type === "image")
      .map((mediaItem, index) => ({
        ...mediaItem,
        index,
        src: getStaticAssetUrl(mediaItem.url)
      }));
    const openLightbox = (mediaItem) => {
      const index = lightboxItems.findIndex(item => item.url === mediaItem.url);
      setSelectedMedia(lightboxItems[index] || null);
    };
    const showLightboxItem = (direction) => {
      if (!lightboxItems.length) return;
      setSelectedMedia(prev => {
        const currentIndex = prev?.index ?? 0;
        const nextIndex = (currentIndex + direction + lightboxItems.length) % lightboxItems.length;
        return lightboxItems[nextIndex];
      });
    };
    const galleryGroups = filteredMediaItems.reduce((groups, mediaItem) => {
      const existingGroup = groups.find(group => group.title === mediaItem.title);
      if (existingGroup) {
        existingGroup.items.push(mediaItem);
      } else {
        groups.push({ title: mediaItem.title, items: [mediaItem] });
      }
      return groups;
    }, []);
    const features = item.features?.length ? item.features : [
      "Premium Materials",
      "Modern Designs",
      "Custom Sizes",
      "Expert Craftsmanship"
    ];
    const relatedServices = item.relatedServices || [];
    const getRelatedImage = (service) => {
      const image = service.heroImage || service.images?.[0] || "";
      return image ? getStaticAssetUrl(image) : "";
    };
    const goToMediaPage = (direction) => {
      paginationScrollTarget.current = direction > 0 ? "top" : "bottom";
      setMediaPage(prev => Math.max(prev + direction, 1));
    };

    return (
      <Box sx={{ bgcolor: "#111111", color: "#F5F5F5" }}>
        <Box
          sx={{
            minHeight: { xs: 460, md: 560 },
            display: "flex",
            alignItems: "center",
            background: heroImageUrl
              ? `linear-gradient(90deg, rgba(17,17,17,0.92), rgba(15,23,42,0.76), rgba(17,17,17,0.42)), url("${heroImageUrl}") center/cover no-repeat`
              : "linear-gradient(135deg, #111111 0%, #0F172A 100%)",
            borderBottom: "1px solid rgba(212,175,55,0.25)"
          }}
        >
          <Container sx={{ py: { xs: 5, md: 0 } }}>
            <Chip
              label={getCategoryName(item.categoryId) || "Service"}
              sx={{ bgcolor: "rgba(212,175,55,0.18)", color: "#D4AF37", mb: 2, fontWeight: 800 }}
            />
            <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: "2.15rem", sm: "2.7rem", md: "4.4rem" }, lineHeight: 1.08, overflowWrap: "anywhere", mb: 2, maxWidth: 900 }}>
              {item.name}
            </Typography>
            <Typography sx={{ color: "rgba(245,245,245,0.82)", maxWidth: 760, fontSize: { xs: "1rem", md: "1.18rem" }, lineHeight: 1.75, mb: 3 }}>
              {getServiceDescription(item)}
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                onClick={() => openQuote(item.name)}
                sx={{ bgcolor: "#D4AF37", color: "#111111", fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#B88917" } }}
              >
                Get Quote
              </Button>
              <Button variant="outlined" onClick={() => navigate(-1)} sx={{ borderColor: "#D4AF37", color: "#D4AF37", textTransform: "none" }}>
                Back
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={shareServicePage}
                sx={{ borderColor: "#D4AF37", color: "#D4AF37", textTransform: "none" }}
              >
                Share
              </Button>
              {/* <Button
                variant="outlined"
                startIcon={<FavoriteIcon />}
                onClick={() => likeService(heroImage)}
                sx={{ borderColor: "#D4AF37", color: "#D4AF37", textTransform: "none" }}
              >
                Like Service
              </Button> */}
            </Box>
          </Container>
        </Box>

        <Container sx={{ py: { xs: 6, md: 9 } }}>
          {(galleryGroups.length > 0 || mediaLoading) && (
            <Box sx={{ mb: { xs: 5, md: 7 } }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: "#D4AF37" }}>
                  Gallery
                </Typography>
                <Typography sx={{ color: "rgba(245,245,245,0.72)", fontWeight: 800 }}>
                  Page {mediaData.page} of {mediaData.totalPages} • {mediaData.total} media
                </Typography>
              </Box>
              {mediaLoading ? (
                <Box sx={{ display: "grid", placeItems: "center", py: 5 }}>
                  <CircularProgress sx={{ color: "#D4AF37" }} />
                </Box>
              ) : (
                <>
                  <Box ref={galleryTopRef} />
                  {galleryGroups.map(group => (
                    <Box key={group.title} sx={{ mb: 4 }}>
                      <Typography sx={{ fontWeight: 900, fontSize: "1.25rem", mb: 1.5, color: "#F5F5F5" }}>
                        {group.title}
                      </Typography>
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: { xs: 1, sm: 2 } }}>
                        {group.items.map((mediaItem) => {
                          const src = getStaticAssetUrl(mediaItem.url);
                          return (
                            <Paper
                              key={`${mediaItem.field}-${mediaItem.url}`}
                              sx={{
                                overflow: "hidden",
                                bgcolor: "#0F172A",
                                border: "1px solid rgba(212,175,55,0.2)",
                                borderRadius: 2,
                                position: "relative",
                                "&:hover .gallery-image": {
                                  transform: "scale(1.08)"
                                }
                              }}
                            >
                              {mediaItem.type === "video" ? (
                                <Box component="video" src={src} controls sx={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "contain", bgcolor: "#050816" }} />
                              ) : (
                                <>
                                  <Box
                                    className="gallery-image"
                                    component="img"
                                    src={src}
                                    alt={getImageAlt(item.name, `${item.name} ${group.title} design and work in Charkhi Dadri Haryana`)}
                                    title={getImageAlt(item.name, `${item.name} ${group.title} design and work in Charkhi Dadri Haryana`)}
                                    onClick={() => openLightbox(mediaItem)}
                                    loading="lazy"
                                    sx={{
                                      width: "100%",
                                      display: "block",
                                      aspectRatio: { xs: "1/1", sm: "16/9" },
                                      objectFit: "cover",
                                      bgcolor: "#050816",
                                      cursor: "zoom-in",
                                      transition: "transform 0.35s ease"
                                    }}
                                  />
                                  <Button
                                    size="small"
                                    startIcon={<ShareIcon />}
                                    onClick={() => shareMediaOnWhatsApp(item.name, src)}
                                    sx={{
                                      position: "absolute",
                                      right: 10,
                                      bottom: 10,
                                      bgcolor: "rgba(17,17,17,0.82)",
                                      color: "#D4AF37",
                                      border: "1px solid rgba(212,175,55,0.36)",
                                      textTransform: "none",
                                      fontWeight: 800,
                                      "&:hover": { bgcolor: "rgba(15,23,42,0.95)" }
                                    }}
                                  >
                                    Share
                                  </Button>
                                  <Button
                                    size="small"
                                    startIcon={<FavoriteIcon />}
                                    onClick={() => likeService(mediaItem.url)}
                                    sx={{
                                      position: "absolute",
                                      left: 10,
                                      bottom: 10,
                                      bgcolor: "rgba(17,17,17,0.82)",
                                      color: "#D4AF37",
                                      border: "1px solid rgba(212,175,55,0.36)",
                                      textTransform: "none",
                                      fontWeight: 800,
                                      "&:hover": { bgcolor: "rgba(15,23,42,0.95)" }
                                    }}
                                  >
                                    Like
                                  </Button>
                                </>
                              )}
                            </Paper>
                          );
                        })}
                      </Box>
                    </Box>
                  ))}
                  <Box ref={galleryBottomRef} />
                  {mediaData.totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 2, flexWrap: "wrap" }}>
                      <Button
                        disabled={!mediaData.hasPrev}
                        onClick={() => goToMediaPage(-1)}
                        variant="outlined"
                        sx={{ borderColor: "#D4AF37", color: "#D4AF37", textTransform: "none", minWidth: { xs: 130, sm: 0 } }}
                      >
                        Previous
                      </Button>
                      <Typography sx={{ color: "#F5F5F5", fontWeight: 900, minWidth: { xs: "100%", sm: 0 }, textAlign: "center", order: { xs: -1, sm: 0 } }}>
                        Page {mediaData.page} / {mediaData.totalPages}
                      </Typography>
                      <Button
                        disabled={!mediaData.hasNext}
                        onClick={() => goToMediaPage(1)}
                        variant="contained"
                        sx={{ bgcolor: "#D4AF37", color: "#111111", fontWeight: 900, textTransform: "none", minWidth: { xs: 130, sm: 0 }, "&:hover": { bgcolor: "#B88917" } }}
                      >
                        Next Page
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Box>
          )}

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.55fr 0.95fr" }, gap: 3, alignItems: "start" }}>
            <Box>
              <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: "#0F172A", color: "#F5F5F5", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 3, mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: "#D4AF37", mb: 2 }}>
                  Service Details
                </Typography>
                <Typography sx={{ color: "rgba(245,245,245,0.78)", fontSize: "1rem", lineHeight: 1.85 }}>
                  {getServiceFullDescription(item)}
                </Typography>
              </Paper>

              {item.faq?.length > 0 && (
                <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: "#0F172A", color: "#F5F5F5", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: "#D4AF37", mb: 2 }}>FAQ</Typography>
                  {item.faq.map((faqItem, index) => (
                    <Box key={index} sx={{ py: 1.8, borderBottom: index === item.faq.length - 1 ? "none" : "1px solid rgba(212,175,55,0.14)" }}>
                      <Typography sx={{ fontWeight: 900, color: "#F5F5F5", mb: 0.5 }}>{faqItem.question}</Typography>
                      <Typography sx={{ color: "rgba(245,245,245,0.72)" }}>{faqItem.answer}</Typography>
                    </Box>
                  ))}
                </Paper>
              )}
            </Box>

            <Box sx={{ display: "grid", gap: 3 }}>
              <Paper sx={{ p: 3, bgcolor: "#111827", color: "#F5F5F5", border: "1px solid rgba(212,175,55,0.26)", borderRadius: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "#D4AF37", mb: 2 }}>
                  Features
                </Typography>
                <Box sx={{ display: "grid", gap: 1 }}>
                  {features.map(feature => (
                    <Typography key={feature} sx={{ color: "rgba(245,245,245,0.82)" }}>
                      ✔ {feature}
                    </Typography>
                  ))}
                </Box>
              </Paper>

              <Paper sx={{ p: 3, bgcolor: "#111827", color: "#F5F5F5", border: "1px solid rgba(212,175,55,0.26)", borderRadius: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "#D4AF37", mb: 1 }}>
                  Price Note
                </Typography>
                {item.priceStarting && (
                  <Typography sx={{ color: "#F5F5F5", fontWeight: 900, mb: 1.5 }}>
                    {item.priceStarting}
                  </Typography>
                )}
                <Typography sx={{ color: "rgba(245,245,245,0.74)", lineHeight: 1.7 }}>
                  Pricing depends on your required quality, materials, customization, and project quantity.
                </Typography>
              </Paper>
            </Box>
          </Box>

          {relatedServices.length > 0 && (
            <Box sx={{ mt: { xs: 5, md: 7 } }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#D4AF37", mb: 3 }}>
                Related Services
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3 }}>
                {relatedServices.map((service) => {
                  const image = getRelatedImage(service);

                  return (
                    <Paper
                      key={service._id}
                      onClick={() => navigate(`/services/${service.slug}`)}
                      sx={{
                        minHeight: 250,
                        p: 3,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        overflow: "hidden",
                        position: "relative",
                        borderRadius: 3,
                        border: "1px solid rgba(212,175,55,0.24)",
                        color: "#F5F5F5",
                        background: image
                          ? `linear-gradient(180deg, rgba(17,17,17,0.36), rgba(15,23,42,0.94)), url("${image}") center/100% 100% no-repeat`
                          : "#111827",
                        transition: "0.28s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          borderColor: "#D4AF37",
                          boxShadow: "0 18px 42px rgba(0,0,0,0.32)"
                        }
                      }}
                    >
                      <Typography sx={{ fontSize: "2rem", mb: 1 }}>{service.emoji || "🔧"}</Typography>
                      <Typography sx={{ fontWeight: 900, fontSize: "1.35rem", mb: 1 }}>
                        {service.name}
                      </Typography>
                      <Typography sx={{ color: "rgba(245,245,245,0.78)", mb: 2, lineHeight: 1.55 }}>
                        {getServiceDescription(service) || "Explore this related service for your project."}
                      </Typography>
                      {service.priceStarting && (
                        <Typography sx={{ color: "#D4AF37", fontWeight: 900 }}>
                          {service.priceStarting}
                        </Typography>
                      )}
                    </Paper>
                  );
                })}
              </Box>
            </Box>
          )}
        </Container>
        <Modal open={!!selectedMedia} onClose={() => setSelectedMedia(null)}>
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.9)",
              display: "grid",
              placeItems: "center",
              p: { xs: 1.5, md: 4 }
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 1100,
                maxHeight: "88vh",
                bgcolor: "#050816",
                border: "1px solid rgba(212,175,55,0.34)",
                borderRadius: 2,
                overflow: "hidden"
              }}
            >
              <Box
                component="img"
                src={selectedMedia?.src || ""}
                alt={getImageAlt(item.name, `${item.name} ${selectedMedia?.title || "work"} preview in Charkhi Dadri Haryana`)}
                title={getImageAlt(item.name, `${item.name} ${selectedMedia?.title || "work"} preview in Charkhi Dadri Haryana`)}
                sx={{
                  width: "100%",
                  maxHeight: "78vh",
                  display: "block",
                  objectFit: "contain",
                  bgcolor: "#050816"
                }}
              />
              {lightboxItems.length > 1 && (
                <>
                  <IconButton
                    onClick={() => showLightboxItem(-1)}
                    sx={{
                      position: "absolute",
                      left: { xs: 8, md: 14 },
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: { xs: 42, md: 54 },
                      height: { xs: 42, md: 54 },
                      bgcolor: "rgba(17,17,17,0.78)",
                      color: "#F5F5F5",
                      border: "1px solid rgba(212,175,55,0.32)",
                      "&:hover": { bgcolor: "rgba(17,17,17,0.95)", color: "#D4AF37" }
                    }}
                  >
                    <KeyboardArrowLeftIcon fontSize="large" />
                  </IconButton>
                  <IconButton
                    onClick={() => showLightboxItem(1)}
                    sx={{
                      position: "absolute",
                      right: { xs: 8, md: 14 },
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: { xs: 42, md: 54 },
                      height: { xs: 42, md: 54 },
                      bgcolor: "rgba(17,17,17,0.78)",
                      color: "#F5F5F5",
                      border: "1px solid rgba(212,175,55,0.32)",
                      "&:hover": { bgcolor: "rgba(17,17,17,0.95)", color: "#D4AF37" }
                    }}
                  >
                    <KeyboardArrowRightIcon fontSize="large" />
                  </IconButton>
                </>
              )}
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, gap: 1, p: 1.5, bgcolor: "#111827" }}>
                <Typography sx={{ color: "#F5F5F5", fontWeight: 800, overflowWrap: "anywhere" }}>
                  {item.name}{lightboxItems.length > 1 ? ` (${(selectedMedia?.index ?? 0) + 1}/${lightboxItems.length})` : ""}
                </Typography>
                <Button
                  startIcon={<ShareIcon />}
                  onClick={() => selectedMedia && shareMediaOnWhatsApp(item.name, selectedMedia.src)}
                  sx={{ color: "#D4AF37", textTransform: "none", fontWeight: 900, justifyContent: "center" }}
                >
                  Share on WhatsApp
                </Button>
                <Button
                  startIcon={<FavoriteIcon />}
                  onClick={() => selectedMedia && likeService(selectedMedia.src)}
                  sx={{ color: "#D4AF37", textTransform: "none", fontWeight: 900, justifyContent: "center" }}
                >
                  Like Image
                </Button>
              </Box>
              <IconButton
                onClick={() => setSelectedMedia(null)}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  bgcolor: "rgba(17,17,17,0.78)",
                  color: "#F5F5F5",
                  "&:hover": { bgcolor: "rgba(17,17,17,0.95)" }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </Modal>
      </Box>
    );
  }

  const categoryImage = item.image ? getStaticAssetUrl(item.image) : "";

  return (
    <Box sx={{ bgcolor: "#111111", color: "#F5F5F5" }}>
      {/* Category Hero Header Banner */}
      <Box
        sx={{
          minHeight: { xs: 350, md: 440 },
          display: "flex",
          alignItems: "center",
          background: categoryImage
            ? `linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(17, 17, 17, 0.94) 100%), url("${categoryImage}") center/cover no-repeat`
            : "linear-gradient(135deg, #111111 0%, #0F172A 100%)",
          borderBottom: "1px solid rgba(212,175,55,0.25)",
          py: { xs: 6, md: 8 }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <Chip 
              label="Services" 
              sx={{ 
                bgcolor: "rgba(212,175,55,0.14)", 
                color: "#D4AF37", 
                border: "1px solid rgba(212,175,55,0.28)",
                fontWeight: 800,
                mb: 2.5 
              }} 
            />
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 900, 
                fontSize: { xs: "2.2rem", md: "3.8rem" },
                mb: 2,
                textShadow: "0 4px 12px rgba(0,0,0,0.5)"
              }}
            >
              {getCategoryEmoji(item)} {getCategoryName(item)}
            </Typography>
            <Typography 
              sx={{ 
                color: "rgba(245,245,245,0.85)", 
                maxWidth: 760, 
                mx: "auto", 
                fontSize: { xs: "0.95rem", md: "1.1rem" },
                lineHeight: 1.75,
                textShadow: "0 2px 8px rgba(0,0,0,0.4)"
              }}
            >
              {item.description}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Services Grid Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(3, 1fr)" }, gap: 3, alignItems: "stretch" }}>
          {(item.services || []).map(service => {
            const activeImage = service.heroImage
              ? getStaticAssetUrl(service.heroImage)
              : "";

            return (
              <Paper
                key={service._id}
                onClick={() => navigate(`/services/${slug}/${service.slug}`)}
                sx={{
                  p: 3,
                  cursor: "pointer",
                  minHeight: 240,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 1.5,
                  bgcolor: "rgba(245,245,245,0.03)",
                  background: activeImage
                    ? `linear-gradient(180deg, rgba(17,17,17,0.58), rgba(15,23,42,0.92)), url("${activeImage}") center/100% 100% no-repeat`
                    : "rgba(245,245,245,0.05)",
                  color: "#F5F5F5",
                  border: "1px solid rgba(212,175,55,0.2)",
                  borderRadius: 3,
                  transition: "all 0.25s ease",
                  "&:hover": { 
                    borderColor: "#D4AF37", 
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.5)"
                  }
                }}
              >
                <Typography sx={{ fontSize: "2.4rem", mb: 0.5 }}>{service.emoji || "🔧"}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, overflowWrap: "anywhere" }}>{service.name}</Typography>
                <Typography sx={{ color: "rgba(245,245,245,0.78)", mb: 2 }}>
                  {getServiceDescription(service)}
                </Typography>
                {service.priceStarting && <Typography sx={{ color: "#D4AF37", fontWeight: 800 }}>{service.priceStarting}</Typography>}
              </Paper>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default CatalogSlugPage;
