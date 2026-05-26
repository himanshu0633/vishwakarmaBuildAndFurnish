import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Container,
  Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What services does Vishwakarma Build & Furnish provide?",
    answer:
      "Vishwakarma Build & Furnish provides house construction, interior design, modular kitchens, wardrobes, doors, windows, tile and marble work, plumbing, electrical work, painting, and complete home renovation services in Charkhi Dadri."
  },
  {
    question: "Do you provide construction services in Charkhi Dadri?",
    answer:
      "Yes. We provide complete house construction, renovation, finishing, and interior work in Charkhi Dadri and nearby Haryana areas."
  },
  {
    question: "Which areas do you serve?",
    answer:
      "We serve Charkhi Dadri, Bhiwani, Rohtak, Kosli, Mahendragarh, Jhajjar, Loharu, and nearby areas in Haryana."
  },
  {
    question: "Do you handle complete house construction?",
    answer:
      "Yes. We can manage complete house construction from planning to final finishing, including structure, plumbing, electrical, tiles, marble, paint, and interior work."
  },
  {
    question: "Do you provide home renovation services?",
    answer:
      "Yes. We handle old house renovation, room renovation, kitchen renovation, bathroom renovation, flooring, painting, furniture work, and complete interior upgrades."
  },
  {
    question: "Do you build modular kitchens?",
    answer:
      "Yes. We provide custom modular kitchen design and installation with smart storage, durable materials, and modern finish options."
  },
  {
    question: "How long does a modular kitchen take?",
    answer:
      "The timeline depends on kitchen size, design, material selection, and site conditions. We share a clear timeline after measurement and design finalization."
  },
  {
    question: "Do you make custom-size wardrobes?",
    answer:
      "Yes. We design custom wardrobes for bedrooms, dressing areas, and storage spaces, including sliding, hinged, and premium finish options."
  },
  {
    question: "Do you provide plumbing, electrical, and paint work?",
    answer:
      "Yes. We provide pipe fitting, leakage repair, wiring, switchboard fitting, lighting setup, wall putty, repainting, and finishing work."
  },
  {
    question: "Do you make custom doors and windows?",
    answer:
      "Yes. We make doors, windows, frames, and related furnishing work according to custom size, design, and material requirements."
  },
  {
    question: "Do you provide tile and marble work?",
    answer:
      "Yes. We provide floor tiles, wall tiles, bathroom tiles, kitchen tiles, marble flooring, and finishing work."
  },
  {
    question: "Do you provide free quotations?",
    answer:
      "Yes. You can share your requirement by call or WhatsApp. We discuss the quotation based on your requirement and site details."
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
};

const featuredQuestions = [
  "What services does Vishwakarma Build & Furnish provide?",
  "Do you provide construction services in Charkhi Dadri?",
  "Which areas do you serve?",
  "Do you handle complete house construction?",
  "Do you provide home renovation services?",
  "Do you build modular kitchens?",
  "Do you make custom-size wardrobes?",
  "Do you provide plumbing, electrical, and paint work?",
  "Do you provide tile and marble work?",
  "Do you provide free quotations?"
];

const FAQSection = () => {
  const [showAll, setShowAll] = useState(false);
  const featuredFaqs = featuredQuestions
    .map((question) => faqs.find((faq) => faq.question === question))
    .filter(Boolean);
  const moreFaqs = faqs.filter((faq) => !featuredQuestions.includes(faq.question));
  const visibleFaqs = showAll ? [...featuredFaqs, ...moreFaqs] : featuredFaqs;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 11 },
        background: "#111827",
        color: "#F8FAFC"
      }}
    >
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          sx={{ textAlign: "center", mb: { xs: 4, md: 5 } }}
        >
          <Chip
            icon={<HelpOutlineIcon />}
            label="FAQ"
            sx={{
              bgcolor: "rgba(212,175,55,0.14)",
              color: "#D4AF37",
              mb: 2,
              fontWeight: 800,
              "& .MuiChip-icon": { color: "#D4AF37" }
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontFamily: "Poppins, Montserrat, sans-serif",
              fontWeight: 900,
              fontSize: { xs: "2rem", md: "2.8rem" },
              color: "#F8FAFC",
              mb: 1.5
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            sx={{
              maxWidth: 760,
              mx: "auto",
              color: "rgba(248,250,252,0.72)",
              fontSize: { xs: "0.98rem", md: "1.08rem" },
              lineHeight: 1.7
            }}
          >
            Construction, interior, renovation, modular kitchen, furniture, plumbing, electrical, paint, tiles and marble work ke common questions.
          </Typography>
        </Box>

        <Box
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
          sx={{
            maxWidth: 980,
            mx: "auto",
            display: "grid",
            gap: 1.5
          }}
        >
          {visibleFaqs.map((faq, index) => (
            <Accordion
              key={faq.question}
              disableGutters
              elevation={0}
              sx={{
                bgcolor: "rgba(15,23,42,0.78)",
                color: "#F8FAFC",
                border: "1px solid rgba(212,175,55,0.22)",
                borderRadius: "8px !important",
                overflow: "hidden",
                "&:before": { display: "none" },
                "&.Mui-expanded": {
                  borderColor: "rgba(212,175,55,0.62)",
                  boxShadow: "0 16px 34px rgba(0,0,0,0.22)"
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#D4AF37" }} />}
                aria-controls={`faq-${index}-content`}
                id={`faq-${index}-header`}
                sx={{
                  minHeight: 58,
                  px: { xs: 2, md: 2.5 },
                  "& .MuiAccordionSummary-content": {
                    my: 1.4
                  }
                }}
              >
                <Typography sx={{ fontWeight: 800, fontSize: { xs: "0.98rem", md: "1.05rem" }, pr: 1.5 }}>
                  Q. {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  px: { xs: 2, md: 2.5 },
                  pt: 0,
                  pb: 2.5,
                  borderTop: "1px solid rgba(212,175,55,0.14)"
                }}
              >
                <Typography sx={{ color: "rgba(248,250,252,0.76)", lineHeight: 1.75, fontSize: "0.96rem" }}>
                  A. {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          {moreFaqs.length > 0 && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button
                type="button"
                variant="contained"
                onClick={() => setShowAll((current) => !current)}
                sx={{
                  bgcolor: "#D4AF37",
                  color: "#0F172A",
                  fontWeight: 900,
                  px: 3.25,
                  py: 1.1,
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "0 12px 30px rgba(212,175,55,0.2)",
                  "&:hover": {
                    bgcolor: "#B88917",
                    boxShadow: "0 16px 36px rgba(212,175,55,0.28)"
                  }
                }}
              >
                {showAll ? "View Less" : "View More"}
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default FAQSection;
