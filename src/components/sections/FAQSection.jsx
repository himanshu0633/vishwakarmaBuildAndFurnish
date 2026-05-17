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
    question: "Vishwakarma Build & Furnish kya services provide karta hai?",
    answer:
      "Vishwakarma Build & Furnish Charkhi Dadri me house construction, interior design, modular kitchen, wardrobe, doors, windows, tiles, marble, plumbing, electrical, paint work aur complete home renovation services provide karta hai."
  },
  {
    question: "Kya aap Charkhi Dadri me construction service dete ho?",
    answer:
      "Haan, hum Charkhi Dadri aur nearby Haryana areas me complete house construction, renovation, finishing aur interior work provide karte hain."
  },
  {
    question: "Aap kis-kis area me service dete ho?",
    answer:
      "Hum Charkhi Dadri, Bhiwani, Rohtak, Kosli, Mahendragarh, Jhajjar, Loharu aur nearby Haryana areas me construction, interior aur furnishing services provide karte hain."
  },
  {
    question: "Kya aap complete house construction ka kaam lete ho?",
    answer:
      "Haan, hum planning se lekar final finishing tak complete house construction ka kaam karte hain, jisme structure, plumbing, electrical, tiles, marble, paint aur interior work include ho sakta hai."
  },
  {
    question: "Kya aap home renovation ka kaam bhi karte ho?",
    answer:
      "Haan, hum old house renovation, room renovation, kitchen renovation, bathroom renovation, flooring, painting, furniture work aur complete interior upgrade ka kaam karte hain."
  },
  {
    question: "Kya aap modular kitchen banate ho?",
    answer:
      "Haan, hum Charkhi Dadri me custom modular kitchen design aur installation service provide karte hain, jisme smart storage, durable material aur modern finishing options available hote hain."
  },
  {
    question: "Modular kitchen banwane me kitna time lagta hai?",
    answer:
      "Modular kitchen ka time size, design, material aur site condition par depend karta hai. Measurement aur design final hone ke baad timeline clearly discuss kar di jati hai."
  },
  {
    question: "Kya aap wardrobe custom size me banate ho?",
    answer:
      "Haan, hum bedroom, dressing area aur storage space ke liye custom wardrobe design karte hain. Sliding wardrobe, hinged wardrobe aur premium finish options available ho sakte hain."
  },
  {
    question: "Kya aap plumbing, electrical aur paint work bhi karte ho?",
    answer:
      "Haan, hum plumbing, electrical aur paint work provide karte hain, jisme pipe fitting, leakage repair, wiring, switch board fitting, lighting setup, wall putty, repainting aur finishing work include ho sakta hai."
  },
  {
    question: "Kya aap doors aur windows ka custom work karte ho?",
    answer:
      "Haan, hum doors, windows, frames aur related furnishing work custom size, design aur material requirement ke according karte hain."
  },
  {
    question: "Kya aap tiles aur marble work provide karte ho?",
    answer:
      "Haan, hum floor tiles, wall tiles, bathroom tiles, kitchen tiles, marble flooring aur finishing work provide karte hain."
  },
  {
    question: "Kya aap plumbing service bhi dete ho?",
    answer:
      "Haan, hum bathroom plumbing, kitchen plumbing, pipe fitting, leakage repair, sanitary fitting aur renovation plumbing work provide karte hain."
  },
  {
    question: "Kya aap electrical work bhi karte ho?",
    answer:
      "Haan, hum home wiring, switch board fitting, lighting setup, fan fitting, electrical repair aur new construction electrical work provide karte hain."
  },
  {
    question: "Kya aap paint work provide karte ho?",
    answer:
      "Haan, hum interior paint, exterior paint, wall putty, texture paint, repainting aur finishing paint work provide karte hain."
  },
  {
    question: "Kya aap bathroom renovation karte ho?",
    answer:
      "Haan, hum bathroom renovation, tiles fitting, plumbing, sanitary fitting, waterproofing aur complete bathroom finishing work karte hain."
  },
  {
    question: "Kya aap kitchen renovation bhi karte ho?",
    answer:
      "Haan, hum old kitchen renovation, modular kitchen setup, storage improvement, tiles work, plumbing aur electrical fitting ke saath complete kitchen upgrade karte hain."
  },
  {
    question: "Kya aap commercial shop ya office interior bhi karte ho?",
    answer:
      "Haan, hum home ke saath shop, office aur commercial space ke interior, furnishing, paint, electrical aur renovation work ke liye bhi service provide karte hain."
  },
  {
    question: "Kya aap free quotation dete ho?",
    answer:
      "Haan, aap apni requirement call ya WhatsApp par share kar sakte hain. Requirement aur site details ke according quotation discuss kiya ja sakta hai."
  },
  {
    question: "Kya site visit available hai?",
    answer:
      "Haan, project requirement ke according site visit available ho sakti hai. Site visit me measurement, work scope, material aur estimate discuss kiya jata hai."
  },
  {
    question: "Estimate lene ke liye kya details chahiye hoti hain?",
    answer:
      "Estimate ke liye aapko service type, location, photos, measurements, material preference aur budget range share karni hoti hai."
  },
  {
    question: "Kya WhatsApp par estimate mil sakta hai?",
    answer:
      "Haan, aap photos, measurements aur requirement WhatsApp par bhej sakte hain. Uske basis par initial discussion aur approximate estimate diya ja sakta hai."
  },
  {
    question: "Kya aap labour with material aur only labour dono options dete ho?",
    answer:
      "Haan, project requirement ke according labour with material aur only labour dono options discuss kiye ja sakte hain."
  },
  {
    question: "Kaam start karne se pehle design ya plan discuss hota hai kya?",
    answer:
      "Haan, work start karne se pehle requirement, measurement, design idea, material, budget aur timeline clearly discuss ki jati hai."
  },
  {
    question: "Payment kaise hoti hai?",
    answer:
      "Payment project scope, quotation aur work stages ke according decide hoti hai. Final payment terms quotation ke time clear kar diye jate hain."
  },
  {
    question: "Kya aap small repair work bhi karte ho?",
    answer:
      "Haan, plumbing repair, electrical repair, paint touch-up, door/window repair, tiles repair aur minor renovation work ke liye bhi contact kar sakte hain."
  },
  {
    question: "Kya aap material selection me help karte ho?",
    answer:
      "Haan, hum budget aur requirement ke according tiles, marble, plywood, laminate, hardware, paint aur other finishing material selection me guidance de sakte hain."
  },
  {
    question: "Kya aap waterproofing ka kaam karte ho?",
    answer:
      "Haan, bathroom, roof, walls aur leakage areas ke liye waterproofing aur repair work requirement ke according provide kiya ja sakta hai."
  },
  {
    question: "Kya aap false ceiling ka kaam karte ho?",
    answer:
      "Haan, room, hall, office aur shop ke liye false ceiling, lighting setup aur interior finishing work discuss kiya ja sakta hai."
  },
  {
    question: "Kya aap furniture work bhi karte ho?",
    answer:
      "Haan, hum wardrobe, TV unit, kitchen storage, cabinet, doors, shelves aur custom furniture/furnishing work provide karte hain."
  },
  {
    question: "Kya aap TV unit banate ho?",
    answer:
      "Haan, hum custom TV unit design aur installation karte hain, jo room size, wall space aur storage requirement ke according banaya ja sakta hai."
  },
  {
    question: "Kya aap bed aur storage furniture bhi banate ho?",
    answer:
      "Haan, requirement ke according bed, storage bed, side table, cabinets aur custom furniture work discuss kiya ja sakta hai."
  },
  {
    question: "Kya aap ghar ke complete finishing work ka package dete ho?",
    answer:
      "Haan, hum construction ke baad plumbing, electrical, tiles, paint, doors, windows, kitchen, wardrobe aur interior finishing ka complete work package discuss kar sakte hain."
  },
  {
    question: "Kya aap renovation ke liye old structure inspect karte ho?",
    answer:
      "Haan, renovation se pehle site condition, old structure, leakage, wiring, plumbing aur finishing requirement check ki ja sakti hai."
  },
  {
    question: "Kya aap new home interior design karte ho?",
    answer:
      "Haan, new home ke liye modular kitchen, wardrobe, TV unit, paint, lighting, doors, windows aur furnishing work ke saath interior setup provide kiya ja sakta hai."
  },
  {
    question: "Kya aap low budget me bhi kaam karte ho?",
    answer:
      "Haan, hum customer ke budget aur requirement ke according practical material aur design options suggest karte hain."
  },
  {
    question: "Kya premium interior work available hai?",
    answer:
      "Haan, premium finish, modern design, high-quality material aur customized interior work ke options requirement ke according available ho sakte hain."
  },
  {
    question: "Kya aap work completion ke baad support dete ho?",
    answer:
      "Haan, work complete hone ke baad bhi agar koi related issue ya query hoti hai to aap contact kar sakte hain."
  },
  {
    question: "Vishwakarma Build & Furnish ko contact kaise karein?",
    answer:
      "Aap Vishwakarma Build & Furnish ko call ya WhatsApp ke through contact kar sakte hain. Website par enquiry form fill karke bhi service request bhej sakte hain."
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
};

const featuredQuestions = [
  "Vishwakarma Build & Furnish kya services provide karta hai?",
  "Kya aap Charkhi Dadri me construction service dete ho?",
  "Aap kis-kis area me service dete ho?",
  "Kya aap complete house construction ka kaam lete ho?",
  "Kya aap home renovation ka kaam bhi karte ho?",
  "Kya aap modular kitchen banate ho?",
  "Kya aap wardrobe custom size me banate ho?",
  "Kya aap plumbing, electrical aur paint work bhi karte ho?",
  "Kya aap tiles aur marble work provide karte ho?",
  "Kya aap free quotation dete ho?",
  "Kya WhatsApp par estimate mil sakta hai?",
  "Kaam start karne se pehle design ya plan discuss hota hai kya?"
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
