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
import ChairIcon from "@mui/icons-material/Chair";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import VerifiedIcon from "@mui/icons-material/Verified";
import GroupsIcon from "@mui/icons-material/Groups";
import FactoryIcon from "@mui/icons-material/Factory";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { motion, useInView } from "framer-motion";
import axiosInstance, { getStaticAssetUrl } from "../../utils/axiosConfig";

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
  { value: 100, suffix: "+", label: "Happy Clients" },
  { value: 2, suffix: "", label: "Government & Private Contracts" }
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

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axiosInstance.get("/gallery?featured=true&limit=5");
        if (response.data.success) {
          setCmsGalleryImages(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching about gallery:", error);
      }
    };

    fetchGallery();
  }, []);

  const handleWhatsApp = () => {
    const message = "Hello Vishwakarma Build & Furnish, I want to discuss my construction/interior/furniture project.";
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const displayGalleryImages = cmsGalleryImages.length
    ? cmsGalleryImages.map((item) => ({ ...item, image: getStaticAssetUrl(item.image) }))
    : galleryImages;

  return (
    <Box sx={{ bgcolor: "#111111", color: "#F8FAFC", overflowX: "hidden" }}>
      <Box
        sx={{
          minHeight: { xs: 520, md: 620 },
          display: "flex",
          alignItems: "center",
          position: "relative",
          background: "linear-gradient(90deg, rgba(17,17,17,0.94), rgba(15,23,42,0.78)), url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg') center/cover no-repeat",
          borderBottom: "1px solid rgba(212,175,55,0.28)"
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 7, md: 9 } }}>
          <Box component={motion.div} initial="hidden" animate="visible" variants={staggerContainer}>
            <Chip
              component={motion.div}
              variants={fadeInUp}
              icon={<VerifiedIcon />}
              label="About Us"
              sx={{ bgcolor: "rgba(212,175,55,0.16)", color: "#D4AF37", fontWeight: 900, mb: 2, "& .MuiChip-icon": { color: "#D4AF37" } }}
            />
            <Typography
              component={motion.h1}
              variants={fadeInUp}
              sx={{ maxWidth: 980, fontSize: { xs: "2.35rem", sm: "3rem", md: "4.5rem" }, lineHeight: 1.05, fontWeight: 900, mb: 2, overflowWrap: "anywhere" }}
            >
              About Vishwakarma Build & Furnish
            </Typography>
            <Typography
              component={motion.p}
              variants={fadeInUp}
              sx={{ maxWidth: 860, color: "rgba(248,250,252,0.82)", fontSize: { xs: "1rem", md: "1.28rem" }, lineHeight: 1.75, mb: 2 }}
            >
              Serving Charkhi Dadri Since 2003 With Trusted Construction, Interior & Custom Furniture Solutions.
            </Typography>
            <Typography component={motion.p} variants={fadeInUp} sx={{ color: "#D4AF37", fontWeight: 900, fontSize: { xs: "1rem", md: "1.2rem" } }}>
              From Foundation to Furniture - We Build Quality That Lasts.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Section>
        <TwoColumn>
          <Box>
            <SectionKicker>Who We Are</SectionKicker>
            <SectionTitle>Trusted Workmanship Since 2003</SectionTitle>
            <BodyText>
              Vishwakarma Build & Furnish has been serving Charkhi Dadri and nearby areas since 2003. Founded by Sunil Jangra, our company specializes in construction work, interior solutions, and custom furniture manufacturing.
            </BodyText>
            <BodyText>
              We undertake both government and private projects with complete professionalism and quality workmanship. From home construction to luxury interiors and customized furniture, our team delivers reliable solutions tailored to every client's requirements.
            </BodyText>
          </Box>
          <InfoPanel icon={<GroupsIcon />} title="Complete Project Support">
            Home construction, modern interiors, and custom furniture handled with planning, skilled labor, material guidance, and premium finishing.
          </InfoPanel>
        </TwoColumn>
      </Section>

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
            <SectionKicker>Material Transparency</SectionKicker>
            <SectionTitle>Quality Depends On Your Selected Budget</SectionTitle>
            <BodyText>
              The quality of material always depends on the customer's selected budget. Premium quality materials provide better durability and long-lasting performance.
            </BodyText>
            <BodyText>
              We focus on transparency and guide every client properly before starting the project, so the final work matches the design, budget, and expected durability.
            </BodyText>
          </Box>
        </TwoColumn>
      </Section>

      <Section dark>
        <TwoColumn>
          <Box>
            <SectionKicker>Why Clients Trust Us</SectionKicker>
            <SectionTitle>Why Our Work Stands Out</SectionTitle>
            <BodyText>
              Our experienced craftsmen and workers are skilled in handling all types of furniture and construction work. We have partnerships with advanced manufacturing factories equipped with modern machinery that help us create premium and customized designs with high finishing quality.
            </BodyText>
            <BodyText>
              Whether it's a modern modular kitchen, luxury wardrobe, custom sofa, or house construction project - we deliver work exactly according to the client's expectations.
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
            <SectionKicker>Quality Assurance</SectionKicker>
            <SectionTitle>Built For Trust And Customer Satisfaction</SectionTitle>
            <BodyText>
              Our goal is not just to complete projects, but to build trust and customer satisfaction through strong workmanship and premium finishing.
            </BodyText>
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
        <CenterHeader title="Gallery" subtitle="Workshop photos, workers, construction sites, furniture manufacturing, and completed interiors." />
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

      <Box sx={{ py: { xs: 7, md: 9 }, bgcolor: "#0F172A", borderTop: "1px solid rgba(212,175,55,0.24)" }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: { xs: "2rem", md: "3.2rem" }, lineHeight: 1.12, fontWeight: 900, mb: 2 }}>
            Let's Build Your Dream Space Together
          </Typography>
          <Typography sx={{ color: "rgba(248,250,252,0.74)", mb: 3, lineHeight: 1.7 }}>
            Call us for construction, interiors, custom furniture, modular kitchen, wardrobes, sofa sets, and complete turnkey work.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, flexWrap: "wrap", mb: 3 }}>
            <Button href={`tel:+91${phone}`} variant="contained" startIcon={<PhoneIcon />} sx={goldButtonSx}>Call Now</Button>
            <Button onClick={handleWhatsApp} variant="outlined" startIcon={<WhatsAppIcon />} sx={outlineButtonSx}>WhatsApp Us</Button>
          </Box>
          <Typography sx={{ color: "#D4AF37", fontWeight: 900 }}>+91 {phone}</Typography>
          <Typography sx={{ color: "rgba(248,250,252,0.74)" }}>Charkhi Dadri, Haryana</Typography>
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
