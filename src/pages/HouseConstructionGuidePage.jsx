import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
} from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering";
import FoundationIcon from "@mui/icons-material/Foundation";
import BrickworkIcon from "@mui/icons-material/HomeWork";
import RoofIcon from "@mui/icons-material/AccountBalance";
import ElectricalIcon from "@mui/icons-material/Bolt";
import PaintIcon from "@mui/icons-material/FormatPaint";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ConstructionIcon from "@mui/icons-material/Construction";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import { useSeo } from "../utils/seo";
import { colors } from "../data/constants";

const constructionSteps = [
  {
    label: "1. Architectural & Planning Phase",
    subTitle: "Blueprints, Maps & Vastu Alignment",
    icon: <EngineeringIcon sx={{ fontSize: 32 }} />,
    color: "#D4AF37",
    description:
      "Every dream house starts with a solid blueprint. This pre-construction stage sets the layout, structural strength, budget, and legal compliance.",
    timeline: "Weeks 1 - 3",
    deliverables: [
      "2D floor layout plans and 3D architectural elevations",
      "Structural designs & column positioning details",
      "Soil bearing capacity testing to plan foundation depth",
      "Municipal authority map approvals (Naksha Pass) & Vastu planning"
    ],
    materials: [
      "High-end CAD & Revit architectural design software",
      "Soil core testing equipment"
    ],
    qualityChecks: [
      "Confirm boundary lines and wall-to-wall measurements match on-site.",
      "Check Vastu directions (Main entry door, kitchen, and master bedroom locations).",
      "Verify structural drawings are signed by a certified structural engineer."
    ]
  },
  {
    label: "2. Excavation & Foundation (Substructure)",
    subTitle: "Establishing the Base of the House",
    icon: <FoundationIcon sx={{ fontSize: 32 }} />,
    color: "#4A90E2",
    description:
      "The foundation supports the entire load of the building. Excavation, footing reinforcement, and plinth beam casting happen in this crucial stage.",
    timeline: "Weeks 4 - 7",
    deliverables: [
      "Excavation of soil up to stable hard strata level (4-5 feet minimum)",
      "PCC (Plain Cement Concrete) bed laying for footings",
      "Steel rebar binding for column starter footings",
      "Plinth beam casting and anti-termite chemical treatment on ground level"
    ],
    materials: [
      "TMT Reinforcement Steel Bars (Grade Fe500D or Fe550)",
      "OPC/PPC Cement (Ultratech, Ambuja, or ACC)",
      "Crushed stone aggregates (10mm/20mm) & coarse river sand"
    ],
    qualityChecks: [
      "Verify foundation depth reaches a stable soil layer.",
      "Ensure proper concrete cover blocks (minimum 40mm) are used under steel rebars.",
      "Cure concrete footings and columns with water for at least 7-10 days."
    ]
  },
  {
    label: "3. Superstructure & Brickwork Masonry",
    subTitle: "Laying the Walls and Frames",
    icon: <BrickworkIcon sx={{ fontSize: 32 }} />,
    color: "#E28743",
    description:
      "The superstructure brings the physical shape to the building. Brick walls are constructed to define rooms, and lintel beams are cast above openings.",
    timeline: "Weeks 8 - 12",
    deliverables: [
      "Brick masonry walls using premium 1st class red bricks or fly ash bricks",
      "Lintel beams casting above doors and windows to distribute loads",
      "Installation of steel or wooden door/window outer frames (Chaukhats)",
      "Scaffolding setup for column extensions to roof level"
    ],
    materials: [
      "First-class clay bricks or high-strength AAC lightweight blocks",
      "Premium quality river/crushed sand & cement mortar (1:4 or 1:6 mix ratio)",
      "Pre-engineered steel/iron chaukhats or teakwood frames"
    ],
    qualityChecks: [
      "Check vertical alignment of walls using a plumb bob (Saahul) daily.",
      "Ensure horizontal cement joints do not exceed 10-12mm in thickness.",
      "Thoroughly wet bricks before laying and cure brick walls for 10 days."
    ]
  },
  {
    label: "4. Roof Slab Casting (RCC Slab)",
    subTitle: "Casting the Overhead Shell",
    icon: <RoofIcon sx={{ fontSize: 32 }} />,
    color: "#27AE60",
    description:
      "Casting the roof slab is a milestone event. Formwork is placed, steel mesh is bound, electrical conduit pipes are routed, and M20 concrete is poured.",
    timeline: "Weeks 13 - 15",
    deliverables: [
      "Waterproof plywood shuttering/formwork installation",
      "Reinforcement double-mesh steel binding with slab beams",
      "Concealed electrical PVC conduits & ceiling fan box layout routing",
      "Ready-mix or site-mix concrete pouring for roof slab and curing"
    ],
    materials: [
      "Reinforcement steel bars (Fe500D) with binding wire",
      "Grade M20 (1:1.5:3 mix) or M25 RCC concrete",
      "Concealed PVC conduit pipes and junction boxes"
    ],
    qualityChecks: [
      "Check that shuttering is completely stable, leak-proof, and properly oiled.",
      "Inspect cover blocks under slab steel (15-20mm cover block).",
      "Maintain continuous pond-curing (flooding roof with water) for 14 to 21 days."
    ]
  },
  {
    label: "5. Services Routing & Wall Plastering",
    subTitle: "Wiring, Plumbing & Smooth Wall Finish",
    icon: <ElectricalIcon sx={{ fontSize: 32 }} />,
    color: "#9B59B6",
    description:
      "Once the concrete structure is ready, plumbing pipes and electrical cables are chased into the walls. Afterwards, cement plaster is applied.",
    timeline: "Weeks 16 - 20",
    deliverables: [
      "Chasing walls for concealed electrical pipes & copper wire installation",
      "Plumbing waterline routing (CPVC/UPVC pipes) and drainage line setup",
      "Internal wall plastering with smooth sand finish",
      "External double-coat plastering mixed with waterproofing compound"
    ],
    materials: [
      "Fire-Retardant (FR) Multi-strand Copper Wires (Havells/Polycab)",
      "CPVC pipes (Astral/Supreme) & high-grade PVC drainage pipes",
      "Cement, fine sand, and Dr. Fixit waterproofing chemical"
    ],
    qualityChecks: [
      "Perform a water pressure test on plumbing pipes to check for leakages before plastering.",
      "Ensure earthing/grounding wire connection is properly deployed to the DB box.",
      "Cure all plastered surfaces with water twice a day for a minimum of 7 days."
    ]
  },
  {
    label: "6. Interiors, Flooring & Finishing",
    subTitle: "Transforming the Shell into a Home",
    icon: <PaintIcon sx={{ fontSize: 32 }} />,
    color: "#D4AF37",
    description:
      "The final phase focuses on beauty and comfort. Wall painting, tile/marble flooring, modular kitchen fitting, and custom wooden cabinets complete the home.",
    timeline: "Weeks 21 - 26+",
    deliverables: [
      "Wall putty coating, primer application, and premium emulsion paint finish",
      "Vitrified tiles or Italian marble flooring installation in rooms",
      "Custom false ceiling design implementation and LED lighting",
      "Modular kitchen, wardrobes, designer wooden doors, and bath fittings setup"
    ],
    materials: [
      "Double charge vitrified tiles or Indian/Italian marble slabs",
      "Asian Paints/Berger premium interior & exterior emulsion paint",
      "Waterproof commercial plywood, designer laminate, and premium modular kitchen hardware"
    ],
    qualityChecks: [
      "Ensure proper slope in bathrooms, balconies, and kitchen floors towards drains.",
      "Check door and wardrobe cabinet shutters alignments and lock operations.",
      "Verify electrical sockets for load capacity and proper voltage levels."
    ]
  }
];

const HouseConstructionGuidePage = () => {
  const [activeStep, setActiveStep] = useState(0);

  useSeo({
    title: "Step-by-Step House Construction Guide | Vishwakarma Build & Furnish",
    description:
      "A complete step-by-step home building guide in Charkhi Dadri & Haryana. Learn about the planning, foundation, brickwork, slab casting, and finishing stages.",
    path: "/house-construction-guide",
    keywords: [
      "house construction guide",
      "home building steps India",
      "construction contractor Haryana",
      "civil construction Charkhi Dadri",
      "how to build house step by step"
    ],
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const phone = "9416856468";
  const whatsappUrl = `https://wa.me/91${phone}?text=Hello%20Vishwakarma%20Build%20%26%20Furnish%2C%20I%20saw%20your%20House%20Construction%20Guide%20and%20want%20to%20discuss%20my%20new%20home%20project.`;

  return (
    <Box sx={{ bgcolor: "#111111", color: "#F8FAFC", minHeight: "100%", pb: 8 }}>
      {/* Hero Banner Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 10 },
          background:
            "linear-gradient(90deg, rgba(17,17,17,0.96), rgba(15,23,42,0.84)), url('https://images.pexels.com/photos/157811/pexels-photo-157811.jpeg') center/cover no-repeat",
          borderBottom: "1px solid rgba(212,175,55,0.28)",
          textAlign: "center"
        }}
      >
        <Container maxWidth="md">
          <Chip
            icon={<ConstructionIcon />}
            label="Complete Home Building Guide"
            sx={{
              bgcolor: "rgba(212,175,55,0.18)",
              color: "#D4AF37",
              fontWeight: 900,
              mb: 2.5,
              "& .MuiChip-icon": { color: "#D4AF37" }
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2.2rem", md: "3.6rem" },
              lineHeight: 1.15,
              mb: 2,
              fontFamily: '"Montserrat", "Poppins", sans-serif'
            }}
          >
            How We Build Your House
          </Typography>
          <Typography
            sx={{
              color: "rgba(248,250,252,0.82)",
              fontSize: { xs: "1rem", md: "1.15rem" },
              lineHeight: 1.7,
              maxWidth: 750,
              mx: "auto",
              mb: 4
            }}
          >
            Building a house is a journey of precision and trust. Here is our step-by-step
            guide detailing every phase from layout plans and structural foundation to modular interiors.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
            <Button
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<WhatsAppIcon />}
              sx={{
                bgcolor: "#D4AF37",
                color: "#111827",
                fontWeight: 900,
                px: 3.5,
                py: 1.25,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": { bgcolor: "#B88917" }
              }}
            >
              Consult with Engineer
            </Button>
            <Button
              href={`tel:+91${phone}`}
              variant="outlined"
              startIcon={<PhoneIcon />}
              sx={{
                borderColor: "#D4AF37",
                color: "#D4AF37",
                fontWeight: 900,
                px: 3.5,
                py: 1.25,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": { borderColor: "#D4AF37", bgcolor: "rgba(212,175,55,0.08)" }
              }}
            >
              Call Us Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stepper Content Section */}
      <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 9 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                bgcolor: "#0F172A",
                border: "1px solid rgba(212,175,55,0.25)",
                borderRadius: 3
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: "#D4AF37",
                  fontWeight: 900,
                  fontSize: { xs: "1.6rem", md: "2.1rem" },
                  mb: 3.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5
                }}
              >
                <ConstructionIcon /> Construction Steps Checklist
              </Typography>

              <Stepper activeStep={activeStep} orientation="vertical" sx={{
                '& .MuiStepLabel-label': { color: 'rgba(248, 250, 252, 0.7)', fontWeight: 700 },
                '& .MuiStepLabel-label.Mui-active': { color: '#D4AF37', fontWeight: 900 },
                '& .MuiStepLabel-label.Mui-completed': { color: 'rgba(248, 250, 252, 0.85)' },
                '& .MuiStepIcon-root': { color: 'rgba(212, 175, 55, 0.28)' },
                '& .MuiStepIcon-root.Mui-active': { color: '#D4AF37' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#27AE60' }
              }}>
                {constructionSteps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      icon={
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: activeStep === index ? "#D4AF37" : activeStep > index ? "#27AE60" : "rgba(245,245,245,0.1)",
                            color: activeStep === index ? "#111111" : "#F8FAFC",
                            fontWeight: 900,
                            fontSize: "14px"
                          }}
                        >
                          {index + 1}
                        </Box>
                      }
                    >
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {step.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(212,175,55,0.85)", fontWeight: 700 }}>
                        {step.subTitle} — {step.timeline}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ mt: 1.5, mb: 3 }}>
                        <Typography sx={{ color: "rgba(248,250,252,0.85)", lineHeight: 1.65, mb: 2.5 }}>
                          {step.description}
                        </Typography>

                        {/* Deliverables List */}
                        <Typography sx={{ color: "#D4AF37", fontWeight: 800, fontSize: "0.92rem", mb: 1 }}>
                          What is Done (Key Deliverables):
                        </Typography>
                        <Box sx={{ display: "grid", gap: 1, mb: 2.5 }}>
                          {step.deliverables.map((item) => (
                            <Box key={item} sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                              <CheckCircleIcon sx={{ color: "#27AE60", fontSize: 17, mt: 0.2, flexShrink: 0 }} />
                              <Typography sx={{ color: "rgba(248,250,252,0.76)", fontSize: "0.88rem" }}>{item}</Typography>
                            </Box>
                          ))}
                        </Box>

                        {/* Materials List */}
                        <Typography sx={{ color: "#D4AF37", fontWeight: 800, fontSize: "0.92rem", mb: 1 }}>
                          Primary Materials Used:
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1.2, flexWrap: "wrap", mb: 2.5 }}>
                          {step.materials.map((mat) => (
                            <Chip
                              key={mat}
                              label={mat}
                              size="small"
                              sx={{
                                bgcolor: "rgba(248,250,252,0.06)",
                                border: "1px solid rgba(248,250,252,0.15)",
                                color: "rgba(248,250,252,0.9)",
                                fontWeight: 600
                              }}
                            />
                          ))}
                        </Box>

                        {/* Quality Checks */}
                        <Paper
                          sx={{
                            p: 2.2,
                            bgcolor: "rgba(212,175,55,0.06)",
                            border: "1px solid rgba(212,175,55,0.2)",
                            borderRadius: 2,
                            mb: 3
                          }}
                        >
                          <Typography sx={{ color: "#D4AF37", fontWeight: 900, fontSize: "0.92rem", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                            ⚠️ Key Quality Checks for Homeowners:
                          </Typography>
                          <Box sx={{ display: "grid", gap: 1 }}>
                            {step.qualityChecks.map((chk, i) => (
                              <Typography key={i} sx={{ color: "rgba(248,250,252,0.76)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                                • {chk}
                              </Typography>
                            ))}
                          </Box>
                        </Paper>

                        <Box sx={{ mb: 2 }}>
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{
                              mr: 1,
                              bgcolor: "#D4AF37",
                              color: "#111111",
                              fontWeight: 900,
                              textTransform: "none",
                              "&:hover": { bgcolor: "#B88917" }
                            }}
                          >
                            {index === constructionSteps.length - 1 ? "Finish Guide" : "Next Stage"}
                          </Button>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ color: "rgba(248,250,252,0.7)", textTransform: "none" }}
                          >
                            Back
                          </Button>
                        </Box>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === constructionSteps.length && (
                <Paper square elevation={0} sx={{ p: 3, bgcolor: "rgba(39,174,96,0.12)", border: "1px solid #27AE60", borderRadius: 2, mt: 3, textAlign: "center" }}>
                  <Typography sx={{ fontWeight: 900, fontSize: "1.15rem", color: "#F8FAFC", mb: 1.5 }}>
                    🎉 Completed the House Construction Guide!
                  </Typography>
                  <Typography sx={{ color: "rgba(248,250,252,0.8)", mb: 2, fontSize: "0.92rem" }}>
                    Ready to build your own dream house in Haryana with complete peace of mind? Contact our engineers today for a detailed estimate.
                  </Typography>
                  <Button
                    onClick={handleReset}
                    sx={{ mt: 1, mr: 1.5, color: "#D4AF37", fontWeight: 700 }}
                  >
                    Restart Guide
                  </Button>
                  <Button
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    sx={{
                      mt: 1,
                      bgcolor: "#27AE60",
                      color: "#fff",
                      fontWeight: 900,
                      textTransform: "none",
                      "&:hover": { bgcolor: "#219653" }
                    }}
                  >
                    Get Free Quote on WhatsApp
                  </Button>
                </Paper>
              )}
            </Paper>
          </Grid>

          {/* Sidebar Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "grid", gap: 3, position: "sticky", top: 130 }}>
              <Paper
                sx={{
                  p: 3,
                  bgcolor: "#0F172A",
                  border: "1px solid rgba(212,175,55,0.22)",
                  borderRadius: 3
                }}
              >
                <Typography variant="h5" sx={{ color: "#D4AF37", fontWeight: 900, mb: 1.8 }}>
                  Why Choose Us?
                </Typography>
                <Divider sx={{ mb: 2.2, borderColor: "rgba(212,175,55,0.15)" }} />
                <Box sx={{ display: "grid", gap: 2 }}>
                  {[
                    "Zero hidden charges: Detailed quotation given before contract signing.",
                    "Formal written agreement detailing exact timeline & quality specs.",
                    "Experienced structural engineers and civil contractors.",
                    "End-to-end integration: From concrete foundation to customized wood interiors."
                  ].map((text, i) => (
                    <Box key={i} sx={{ display: "flex", gap: 1.2 }}>
                      <CheckCircleIcon sx={{ color: "#D4AF37", fontSize: 20, flexShrink: 0, mt: 0.2 }} />
                      <Typography sx={{ color: "rgba(248,250,252,0.76)", fontSize: "0.88rem", lineHeight: 1.5 }}>
                        {text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>

              <Paper
                sx={{
                  p: 3,
                  bgcolor: "#0F172A",
                  border: "1px solid rgba(212,175,55,0.22)",
                  borderRadius: 3,
                  textAlign: "center"
                }}
              >
                <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 900, mb: 1.2 }}>
                  Need Civil Estimates?
                </Typography>
                <Typography sx={{ color: "rgba(248,250,252,0.72)", fontSize: "0.85rem", lineHeight: 1.6, mb: 2.5 }}>
                  Share your plot area, map specs, and number of floors. We provide fully calculated, structural-grade cost evaluations.
                </Typography>
                <Button
                  href={`tel:+91${phone}`}
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: "#D4AF37",
                    color: "#111827",
                    fontWeight: 900,
                    textTransform: "none",
                    py: 1.15,
                    borderRadius: 2,
                    mb: 1.5,
                    "&:hover": { bgcolor: "#B88917" }
                  }}
                >
                  Call +91-{phone}
                </Button>
                <Button
                  href="/contact"
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: "#D4AF37",
                    color: "#D4AF37",
                    fontWeight: 700,
                    textTransform: "none",
                    py: 1.15,
                    borderRadius: 2,
                    "&:hover": { borderColor: "#D4AF37", bgcolor: "rgba(212,175,55,0.06)" }
                  }}
                >
                  Fill Inquiry Form
                </Button>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HouseConstructionGuidePage;
