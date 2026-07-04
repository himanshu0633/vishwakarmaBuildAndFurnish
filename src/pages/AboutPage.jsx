import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Typography
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ConstructionIcon from "@mui/icons-material/Construction";
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
import ChairIcon from "@mui/icons-material/Chair";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import VerifiedIcon from "@mui/icons-material/Verified";
import GroupsIcon from "@mui/icons-material/Groups";
import FactoryIcon from "@mui/icons-material/Factory";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { motion, useInView } from "framer-motion";
import axiosInstance, { getStaticAssetUrl } from "../../utils/axiosConfig";
import { businessStructuredData, simpleBusinessStructuredData, buildPageUrl, useSeo } from "../utils/seo";

const phone = "9416856468";

const fadeInUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09 }
  }
};

const expertiseCards = [
  {
    title: "Construction Services",
    icon: <ConstructionIcon />,
    items: ["House Construction", "Government Projects", "Private Contracts", "Turnkey Projects", "Renovation Work"]
  },
  {
    title: "Furniture Manufacturing",
    icon: <ChairIcon />,
    items: ["Modular Kitchen", "Wardrobe", "Sofa Set", "TV Unit", "Custom Furniture"]
  },
  {
    title: "Interior Solutions",
    icon: <DesignServicesIcon />,
    items: ["False Ceiling", "Wall Panels", "Lighting Design", "Luxury Interiors", "Modern Designs"]
  }
];

const counters = [
  { value: 20, suffix: "+", label: "Years Experience" },
  { value: 500, suffix: "+", label: "Projects Completed" },
  { value: 500, suffix: "+", label: "Happy Clients" },
  { value: 30, suffix: "+", label: "Government & Private Contracts" }
];

const processSteps = [
  {
    title: "Consultation & Planning",
    desc: "Initial discussion to understand your specific requirements, design preferences, and layout planning."
  },
  {
    title: "Written Agreement",
    desc: "Everything we promise is provided in writing. We offer a formal agreement signed according to terms and conditions."
  },
  {
    title: "No Hidden Charges",
    desc: "Clear and transparent project costing. You will know exactly how much money is required, with absolutely zero hidden fees."
  },
  {
    title: "Guaranteed Timeline",
    desc: "We define and specify the exact number of days required to complete the work, ensuring timely delivery."
  },
  {
    title: "Premium Execution",
    desc: "Execution of construction, interiors, or furniture using high-quality materials and expert workmanship."
  },
  {
    title: "After-Sales Service",
    desc: "We stand by our work. We provide dedicated and reliable after-sales service and maintenance support."
  }
];

const reviews = [
  {
    text: "Very professional team and excellent finishing work. Our modular kitchen was completed exactly as we wanted.",
    name: "Rohit Sharma"
  },
  {
    text: "Affordable pricing with premium quality materials. Highly recommended for furniture and construction work.",
    name: "Deepak Verma"
  },
  {
    text: "Best construction contractor in Charkhi Dadri. Honest pricing and timely delivery.",
    name: "Aman Jangra"
  },
  {
    text: "Excellent interior work and modern designs. The team handled everything professionally.",
    name: "Pooja Malik"
  }
];

const galleryImages = [
  {
    title: "Workshop",
    image: "https://images.pexels.com/photos/5974255/pexels-photo-5974255.jpeg"
  },
  {
    title: "Workers",
    image: "https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg"
  },
  {
    title: "Construction Sites",
    image: "https://images.pexels.com/photos/5323962/pexels-photo-5323962.jpeg"
  },
  {
    title: "Furniture Manufacturing",
    image: "https://images.pexels.com/photos/5974300/pexels-photo-5974300.jpeg"
  },
  {
    title: "Completed Interiors",
    image: "https://images.pexels.com/photos/7516077/pexels-photo-7516077.png"
  }
];

const teamPhotos = [
  {
    title: "Site Planning Team",
    image: "https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg"
  },
  {
    title: "Furniture Workshop Team",
    image: "https://images.pexels.com/photos/5974255/pexels-photo-5974255.jpeg"
  },
  {
    title: "Interior Execution Team",
    image: "https://images.pexels.com/photos/5974300/pexels-photo-5974300.jpeg"
  }
];

const serviceAreas = [
  "Charkhi Dadri",
  "Bhiwani",
  "Mahendragarh",
  "Rewari",
  "Rohtak",
  "Jhajjar",
  "Nearby villages"
];

const defaultSections = [
  {
    key: "hero",
    kicker: "About Us",
    title: "About Vishwakarma Build & Furnish",
    text: "Serving Charkhi Dadri Since 2003 With Trusted Construction, Interior & Custom Furniture Solutions.",
    text2: "From Foundation to Furniture - We Build Quality That Lasts.",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
  },
  {
    key: "history",
    kicker: "Company History",
    title: "Trusted Workmanship Since 2003",
    text: "Vishwakarma Build & Furnish has been serving Charkhi Dadri and nearby areas since 2003. Founded by Sunil Jangra, our company specializes in construction work, interior solutions, and custom furniture manufacturing.",
    text2: "We undertake both government and private projects with complete professionalism and quality workmanship."
  },
  {
    key: "quality",
    kicker: "Material Transparency",
    title: "Quality Depends On Your Selected Budget",
    text: "The quality of material always depends on the customer's selected budget. Premium quality materials provide better durability and long-lasting performance.",
    text2: "We focus on transparency and guide every client properly before starting the project, so the final work matches the design, budget, and expected durability."
  },
  {
    key: "factory",
    kicker: "Why Clients Trust Us",
    title: "Why Our Work Stands Out",
    text: "Our experienced craftsmen and workers are skilled in handling all types of furniture and construction work. We have partnerships with advanced manufacturing factories equipped with modern machinery that help us create premium and customized designs with high finishing quality.",
    text2: "Whether it's a modern modular kitchen, luxury wardrobe, custom sofa, or house construction project - we deliver work exactly according to the client's expectations.",
    image: "https://images.pexels.com/photos/5974255/pexels-photo-5974255.jpeg"
  },
  {
    key: "warranty",
    kicker: "Quality Assurance",
    title: "Built For Trust And Customer Satisfaction",
    text: "Our goal is not just to complete projects, but to build trust and customer satisfaction through strong workmanship and premium finishing.",
    text2: ""
  },
  {
    key: "experience",
    kicker: "Experience",
    title: "Local Team For Homes, Shops And Projects",
    text: "Our experience covers house construction, renovation, modular kitchen, wardrobes, doors, windows, wall panels, false ceiling, furniture manufacturing, and complete interior finishing.",
    text2: "We serve Charkhi Dadri along with Bhiwani, Mahendragarh, Rewari, Rohtak, Jhajjar, and nearby villages with site-based planning and practical material guidance."
  },
  {
    key: "cta",
    kicker: "Contact Details",
    title: "Let's Build Your Dream Space Together",
    text: "Call us for construction, interiors, custom furniture, modular kitchen, wardrobes, sofa sets, and complete turnkey work.",
    text2: "Charkhi Dadri, Haryana"
  }
];

const getAboutSection = (sections, key) =>
  sections.find((section) => section.key === key) || defaultSections.find((section) => section.key === key) || {};

const AnimatedCounter = ({ value, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;

    let frame;
    let startTime;
    const duration = 1200;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(value * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const AboutPage = () => {
  const [cmsGalleryImages, setCmsGalleryImages] = useState([]);
  const [aboutContent, setAboutContent] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const [galleryResponse, aboutResponse] = await Promise.all([
          axiosInstance.get("/gallery?featured=true&limit=5"),
          axiosInstance.get("/about-content")
        ]);

        if (galleryResponse.data.success) setCmsGalleryImages(galleryResponse.data.data || []);
        if (aboutResponse.data.success) setAboutContent(aboutResponse.data.data || null);
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };

    fetchAboutData();
  }, []);

  const rawGalleryImages = cmsGalleryImages.length
    ? cmsGalleryImages.map((item) => ({ ...item, image: getStaticAssetUrl(item.image) }))
    : (aboutContent?.workshopPhotos?.length ? aboutContent.workshopPhotos : galleryImages);
  const displayGalleryImages = rawGalleryImages.map((item) => ({ ...item, image: getStaticAssetUrl(item.image) }));
  const displayTeamPhotos = (aboutContent?.teamPhotos?.length ? aboutContent.teamPhotos : teamPhotos)
    .map((item) => ({ ...item, image: getStaticAssetUrl(item.image) }));
  const currentSections = aboutContent?.sections?.length ? aboutContent.sections : defaultSections;
  const currentServiceAreas = aboutContent?.serviceAreas?.length ? aboutContent.serviceAreas : serviceAreas;
  const currentPhone = aboutContent?.phone || phone;
  const currentLocation = aboutContent?.location || "Charkhi Dadri, Haryana";
  const heroSection = getAboutSection(currentSections, "hero");
  const historySection = getAboutSection(currentSections, "history");
  const qualitySection = getAboutSection(currentSections, "quality");
  const factorySection = getAboutSection(currentSections, "factory");
  const warrantySection = getAboutSection(currentSections, "warranty");
  const experienceSection = getAboutSection(currentSections, "experience");
  const ctaSection = getAboutSection(currentSections, "cta");
  const heroImage = getStaticAssetUrl(heroSection.image || "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg");

  const handleWhatsApp = () => {
    const message = "Hello Vishwakarma Build & Furnish, I want to discuss my construction/interior/furniture project.";
    window.open(`https://wa.me/91${currentPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  useSeo({
    title: heroSection.title || "About Vishwakarma Build & Furnish",
    description: historySection.text || "Company history, experience, workshop photos, team photos and contact details for Vishwakarma Build & Furnish in Charkhi Dadri, Haryana.",
    path: "/about",
    image: heroImage,
    keywords: [
      "Vishwakarma Build & Furnish about",
      "construction company Charkhi Dadri",
      "furniture workshop Charkhi Dadri",
      "interior team Haryana",
      ...currentServiceAreas
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          ...businessStructuredData,
          foundingDate: "2003",
          founder: {
            "@type": "Person",
            name: "Sunil Jangra"
          },
          employee: displayTeamPhotos.map((item) => ({
            "@type": "Person",
            name: item.title
          })),
          areaServed: currentServiceAreas,
          review: reviews.map((review) => ({
            "@type": "Review",
            author: {
              "@type": "Person",
              name: review.name
            },
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5"
            },
            reviewBody: review.text
          }))
        },
        {
          "@type": "AboutPage",
          "@id": `${buildPageUrl("/about")}#about`,
          name: "About Vishwakarma Build & Furnish",
          url: buildPageUrl("/about"),
          mainEntity: simpleBusinessStructuredData
        },
        {
          "@type": "ImageGallery",
          "@id": `${buildPageUrl("/about")}#workshop-team-photos`,
          name: "Factory, Workshop and Team Photos",
          image: [...displayGalleryImages, ...displayTeamPhotos].map((item) => ({
            "@type": "ImageObject",
            name: item.title,
            contentUrl: item.image,
            url: item.image
          }))
        }
      ]
    }
  });

  return (
    <Box sx={{ bgcolor: "#111111", color: "#F8FAFC", overflowX: "hidden" }}>
      <Box
        sx={{
          minHeight: { xs: 520, md: 620 },
          display: "flex",
          alignItems: "center",
          position: "relative",
          background: `linear-gradient(90deg, rgba(17,17,17,0.94), rgba(15,23,42,0.78)), url('${heroImage}') center/cover no-repeat`,
          borderBottom: "1px solid rgba(212,175,55,0.28)"
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 7, md: 9 } }}>
          <Box component={motion.div} initial="hidden" animate="visible" variants={staggerContainer}>
            <Chip
              component={motion.div}
              variants={fadeInUp}
              icon={<VerifiedIcon />}
              label={heroSection.kicker || "About Us"}
              sx={{ bgcolor: "rgba(212,175,55,0.16)", color: "#D4AF37", fontWeight: 900, mb: 2, "& .MuiChip-icon": { color: "#D4AF37" } }}
            />
            <Typography
              component={motion.h1}
              variants={fadeInUp}
              sx={{ maxWidth: 980, fontSize: { xs: "2.35rem", sm: "3rem", md: "4.5rem" }, lineHeight: 1.05, fontWeight: 900, mb: 2, overflowWrap: "anywhere" }}
            >
              {heroSection.title}
            </Typography>
            <Typography
              component={motion.p}
              variants={fadeInUp}
              sx={{ maxWidth: 860, color: "rgba(248,250,252,0.82)", fontSize: { xs: "1rem", md: "1.28rem" }, lineHeight: 1.75, mb: 2 }}
            >
              {heroSection.text}
            </Typography>
            <Typography component={motion.p} variants={fadeInUp} sx={{ color: "#D4AF37", fontWeight: 900, fontSize: { xs: "1rem", md: "1.2rem" } }}>
              {heroSection.text2}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Section>
        <TwoColumn>
          <Box>
            <SectionKicker>{historySection.kicker}</SectionKicker>
            <SectionTitle>{historySection.title}</SectionTitle>
            <BodyText>
              {historySection.text}
            </BodyText>
            <BodyText>
              {historySection.text2}
            </BodyText>
          </Box>
          <InfoPanel icon={<GroupsIcon />} title="Complete Project Support">
            Home construction, modern interiors, and custom furniture handled with planning, skilled labor, material guidance, and premium finishing.
          </InfoPanel>
        </TwoColumn>
      </Section>

      {/* OUR CONSTRUCTION PROCESS Timeline Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#0B0F19", overflow: "hidden", borderTop: "1px solid rgba(212,175,55,0.16)", borderBottom: "1px solid rgba(212,175,55,0.16)" }}>
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
                OUR CONSTRUCTION PROCESS
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
          <Box sx={{ position: "relative", width: "100%", mt: 6 }}>
            {/* Dashed Connector Line */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: "23px", md: "28px" },
                left: "4%",
                right: "4%",
                height: "2px",
                borderTop: "2px dashed rgba(212,175,55,0.4)",
                zIndex: 1,
                display: { xs: "none", lg: "block" }
              }}
            />

            {/* Steps Row */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: { xs: "wrap", lg: "nowrap" },
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: { xs: 3, lg: 1 },
                position: "relative",
                zIndex: 2
              }}
            >
              {[
                { label: "Planning & Design", icon: <AssignmentIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
                { label: "Foundation Work", icon: <FoundationIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
                { label: "Structure Work", icon: <GridOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
                { label: "Brick Work", icon: <GridOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
                { label: "Plaster Work", icon: <BuildIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
                { label: "Electrical Work", icon: <FlashOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
                { label: "Plumbing Work", icon: <ShowerIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
                { label: "Flooring & Tiling", icon: <GridOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> },
                { label: "Finishing & Handover", icon: <KeyIcon sx={{ fontSize: { xs: "1.1rem", md: "1.45rem" } }} /> }
              ].map((step) => (
                <Box
                  key={step.label}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    width: { xs: "calc(33.33% - 16px)", sm: "calc(25% - 16px)", lg: "auto" },
                    flex: { xs: "none", lg: 1 },
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
        </Container>
      </Box>

      <Section dark>
        <CenterHeader title="What We Specialize In" subtitle="Construction, furniture manufacturing, and interior services under one trusted brand." />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3, alignItems: "stretch" }}>
          {expertiseCards.map((card) => (
            <Paper key={card.title} component={motion.div} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} elevation={0} sx={cardSx}>
              <Box sx={{ color: "#D4AF37", mb: 2, "& svg": { fontSize: 42 } }}>{card.icon}</Box>
              <Typography sx={{ fontSize: "1.35rem", fontWeight: 900, mb: 2 }}>{card.title}</Typography>
              <Box sx={{ display: "grid", gap: 1 }}>
                {card.items.map((item) => (
                  <Typography key={item} sx={{ color: "rgba(248,250,252,0.78)" }}>✓ {item}</Typography>
                ))}
              </Box>
            </Paper>
          ))}
        </Box>
      </Section>

      <Section>
        <TwoColumn>
          <InfoPanel icon={<VerifiedIcon />} title="Quality That Matches Your Budget">
            We believe every customer has different requirements and budgets. That's why we provide customized solutions according to the client's needs, design preferences, and material quality.
          </InfoPanel>
          <Box>
            <SectionKicker>{qualitySection.kicker}</SectionKicker>
            <SectionTitle>{qualitySection.title}</SectionTitle>
            <BodyText>
              {qualitySection.text}
            </BodyText>
            <BodyText>
              {qualitySection.text2}
            </BodyText>
          </Box>
        </TwoColumn>
      </Section>

      <Section dark>
        <TwoColumn>
          <Box>
            <SectionKicker>{factorySection.kicker}</SectionKicker>
            <SectionTitle>{factorySection.title}</SectionTitle>
            <BodyText>
              {factorySection.text}
            </BodyText>
            <BodyText>
              {factorySection.text2}
            </BodyText>
          </Box>
          <InfoPanel icon={<FactoryIcon />} title="Modern Factory Support">
            Advanced machinery, experienced craftsmen, and proper finishing processes help us deliver premium customized results.
          </InfoPanel>
        </TwoColumn>
      </Section>

      <Section>
        <TwoColumn>
          <InfoPanel icon={<VerifiedIcon />} title="Long Lasting Quality & Warranty">
            We focus on providing durable and reliable work. Depending on the selected materials and project type, we provide quality assurance and long-lasting solutions designed to perform for years.
          </InfoPanel>
          <Box>
            <SectionKicker>{warrantySection.kicker}</SectionKicker>
            <SectionTitle>{warrantySection.title}</SectionTitle>
            <BodyText>
              {warrantySection.text}
            </BodyText>
            {warrantySection.text2 && <BodyText>{warrantySection.text2}</BodyText>}
          </Box>
        </TwoColumn>
      </Section>

      <Section dark>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2.5 }}>
          {counters.map((counter) => (
            <Paper key={counter.label} elevation={0} sx={{ ...cardSx, textAlign: "center", minHeight: 150, justifyContent: "center" }}>
              <Typography sx={{ color: "#D4AF37", fontWeight: 900, fontSize: { xs: "2.3rem", md: "2.8rem" }, lineHeight: 1 }}>
                <AnimatedCounter value={counter.value} suffix={counter.suffix} />
              </Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.76)", fontWeight: 800, mt: 1 }}>
                {counter.label}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Section>

      <Section>
        <TwoColumn>
          <Box>
            <SectionKicker>{experienceSection.kicker}</SectionKicker>
            <SectionTitle>{experienceSection.title}</SectionTitle>
            <BodyText>
              {experienceSection.text}
            </BodyText>
            <BodyText>
              {experienceSection.text2}
            </BodyText>
          </Box>
          <InfoPanel icon={<PhoneIcon />} title="Contact Details">
            Phone / WhatsApp: +91 {currentPhone}. Location: {currentLocation}. Call for construction, interiors, furniture, workshop manufacturing, and site visit discussion.
          </InfoPanel>
        </TwoColumn>
      </Section>

      <Section>
        <CenterHeader title="Our Working Process" subtitle="A clear, written, and reliable workflow for every construction, interior, and furniture project." />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3 }}>
          {processSteps.map((step, index) => (
            <Paper
              key={step.title}
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "#0F172A",
                color: "#F8FAFC",
                border: "1px solid rgba(212,175,55,0.28)",
                borderRadius: 2.5,
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                transition: "0.25s ease",
                "&:hover": {
                  borderColor: "#D4AF37",
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.3)"
                }
              }}
            >
              <Typography sx={{ color: "#D4AF37", fontWeight: 900, fontSize: "1.6rem", mb: 1.5 }}>
                {String(index + 1).padStart(2, "0")}
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: "1.25rem", mb: 1, color: "#F8FAFC" }}>
                {step.title}
              </Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.72)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                {step.desc}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Section>

      <Section dark>
        <CenterHeader title="What Our Clients Say" subtitle="Real feedback from clients who trusted us for furniture, interior, and construction work." />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 3 }}>
          {reviews.map((review) => (
            <Paper key={review.name} elevation={0} sx={cardSx}>
              <FormatQuoteIcon sx={{ color: "#D4AF37", fontSize: 34, mb: 1 }} />
              <Typography sx={{ color: "rgba(248,250,252,0.82)", lineHeight: 1.8, mb: 2 }}>
                "{review.text}"
              </Typography>
              <Typography sx={{ color: "#D4AF37", fontWeight: 900 }}>- {review.name}</Typography>
            </Paper>
          ))}
        </Box>
      </Section>

      <Section>
        <CenterHeader title="Factory & Workshop Photos" subtitle="Workshop photos, workers, construction sites, furniture manufacturing, and completed interiors." />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(5, 1fr)" }, gap: 2 }}>
          {displayGalleryImages.map((item) => (
            <Paper key={item.title} elevation={0} sx={{ position: "relative", overflow: "hidden", minHeight: { xs: 230, md: 280 }, borderRadius: 2, border: "1px solid rgba(212,175,55,0.24)", background: `linear-gradient(180deg, rgba(17,17,17,0.08), rgba(15,23,42,0.85)), url("${item.image}") center/cover no-repeat` }}>
              <Typography sx={{ position: "absolute", left: 16, right: 16, bottom: 16, color: "#F8FAFC", fontWeight: 900, textShadow: "0 8px 20px rgba(0,0,0,0.5)" }}>
                {item.title}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Section>

      <Section dark>
        <CenterHeader title="Team Photos" subtitle="Our site planning, workshop, and interior execution teams handle every project with care." />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
          {displayTeamPhotos.map((item) => (
            <Paper key={item.title} elevation={0} sx={{ position: "relative", overflow: "hidden", minHeight: { xs: 260, md: 340 }, borderRadius: 2, border: "1px solid rgba(212,175,55,0.24)", background: `linear-gradient(180deg, rgba(17,17,17,0.04), rgba(15,23,42,0.82)), url("${item.image}") center/cover no-repeat` }}>
              <Typography sx={{ position: "absolute", left: 16, right: 16, bottom: 16, color: "#F8FAFC", fontWeight: 900, textShadow: "0 8px 20px rgba(0,0,0,0.5)" }}>
                {item.title}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Section>

      <Box sx={{ py: { xs: 7, md: 9 }, bgcolor: "#0F172A", borderTop: "1px solid rgba(212,175,55,0.24)" }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: { xs: "2rem", md: "3.2rem" }, lineHeight: 1.12, fontWeight: 900, mb: 2 }}>
            {ctaSection.title}
          </Typography>
          <Typography sx={{ color: "rgba(248,250,252,0.74)", mb: 3, lineHeight: 1.7 }}>
            {ctaSection.text}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, flexWrap: "wrap", mb: 3 }}>
            <Button href={`tel:+91${currentPhone}`} variant="contained" title="Call Now" startIcon={<PhoneIcon />} sx={goldButtonSx}>Call Now</Button>
            <Button onClick={handleWhatsApp} variant="outlined" startIcon={<WhatsAppIcon />} sx={outlineButtonSx}>WhatsApp Us</Button>
          </Box>
          <Typography sx={{ color: "#D4AF37", fontWeight: 900 }}>+91 {currentPhone}</Typography>
          <Typography sx={{ color: "rgba(248,250,252,0.74)" }}>{ctaSection.text2 || currentLocation}</Typography>
        </Container>
      </Box>
    </Box>
  );
};

const Section = ({ children, dark = false }) => (
  <Box sx={{ py: { xs: 6, md: 9 }, bgcolor: dark ? "#0F172A" : "#111111" }}>
    <Container maxWidth="lg">{children}</Container>
  </Box>
);

const TwoColumn = ({ children }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 3, md: 5 }, alignItems: "center" }}>
    {children}
  </Box>
);

const SectionKicker = ({ children }) => (
  <Typography sx={{ color: "#D4AF37", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", mb: 1 }}>
    {children}
  </Typography>
);

const SectionTitle = ({ children }) => (
  <Typography sx={{ fontSize: { xs: "2rem", md: "3rem" }, lineHeight: 1.12, fontWeight: 900, mb: 2, overflowWrap: "anywhere" }}>
    {children}
  </Typography>
);

const BodyText = ({ children }) => (
  <Typography sx={{ color: "rgba(248,250,252,0.76)", lineHeight: 1.85, mb: 2, fontSize: "1rem" }}>
    {children}
  </Typography>
);

const CenterHeader = ({ title, subtitle }) => (
  <Box sx={{ textAlign: "center", mb: { xs: 4, md: 5 } }}>
    <SectionKicker>Vishwakarma Build & Furnish</SectionKicker>
    <Typography sx={{ fontSize: { xs: "2rem", md: "3rem" }, lineHeight: 1.12, fontWeight: 900, mb: 1.5 }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography sx={{ maxWidth: 760, mx: "auto", color: "rgba(248,250,252,0.72)", lineHeight: 1.75 }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

const InfoPanel = ({ icon, title, children }) => (
  <Paper elevation={0} sx={{ ...cardSx, minHeight: { xs: 260, md: 330 }, justifyContent: "center" }}>
    <Box sx={{ color: "#D4AF37", mb: 2, "& svg": { fontSize: 48 } }}>{icon}</Box>
    <Typography sx={{ fontSize: { xs: "1.5rem", md: "1.8rem" }, fontWeight: 900, mb: 1.5 }}>{title}</Typography>
    <Typography sx={{ color: "rgba(248,250,252,0.76)", lineHeight: 1.8 }}>{children}</Typography>
  </Paper>
);

const cardSx = {
  p: { xs: 2.5, md: 3 },
  bgcolor: "#111827",
  color: "#F8FAFC",
  border: "1px solid rgba(212,175,55,0.28)",
  borderRadius: 3,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  transition: "0.25s ease",
  "&:hover": {
    borderColor: "#D4AF37",
    transform: "translateY(-4px)",
    boxShadow: "0 18px 44px rgba(0,0,0,0.28)"
  }
};

const goldButtonSx = {
  bgcolor: "#D4AF37",
  color: "#111111",
  fontWeight: 900,
  textTransform: "none",
  px: 3,
  "&:hover": { bgcolor: "#B88917" }
};

const outlineButtonSx = {
  borderColor: "#D4AF37",
  color: "#D4AF37",
  fontWeight: 900,
  textTransform: "none",
  px: 3,
  "&:hover": { borderColor: "#D4AF37", bgcolor: "rgba(212,175,55,0.1)" }
};

export default AboutPage;
