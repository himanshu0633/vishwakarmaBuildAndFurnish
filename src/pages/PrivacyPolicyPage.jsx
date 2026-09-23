import React from "react";
import { Box, Container, Typography, Paper, Divider, Stack, Chip, Button } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SecurityUpdateGoodIcon from "@mui/icons-material/SecurityUpdateGood";
import { Link as RouterLink } from "react-router-dom";

const PrivacyPolicyPage = () => {
  return (
    <Box sx={{ bgcolor: "#0d0f12", color: "#F8FAFC", minHeight: "100%", py: { xs: 5, md: 8 } }}>
      <Container maxWidth="md">
        {/* Header Hero */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Chip
            icon={<ShieldIcon sx={{ color: "#D4AF37 !important" }} />}
            label="Privacy & Transparency"
            sx={{
              bgcolor: "rgba(212,175,55,0.12)",
              color: "#D4AF37",
              fontWeight: 800,
              fontSize: "0.85rem",
              px: 1.5,
              py: 2.2,
              borderRadius: "20px",
              border: "1px solid rgba(212,175,55,0.3)",
              mb: 2.5
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.1rem", md: "2.8rem" },
              fontWeight: 900,
              lineHeight: 1.2,
              mb: 2,
              background: "linear-gradient(135deg, #FFFFFF 40%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Privacy Policy
          </Typography>
          <Typography sx={{ color: "rgba(248,250,252,0.7)", fontSize: "0.95rem" }}>
            <strong>Vishwakarma Build & Furnish</strong> &bull; Mobile App: <strong>VB&F Connect</strong>
          </Typography>
          <Typography sx={{ color: "rgba(248,250,252,0.5)", fontSize: "0.85rem", mt: 0.5 }}>
            Last Updated: September 2026 &bull; Effective Date: September 2026
          </Typography>
        </Box>

        {/* Policy Content Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            bgcolor: "#14171d",
            borderRadius: 3,
            border: "1px solid rgba(212,175,55,0.22)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
          }}
        >
          {/* Quick Summary Notice */}
          <Box
            sx={{
              p: 2.5,
              bgcolor: "rgba(212,175,55,0.08)",
              borderRadius: 2,
              border: "1px solid rgba(212,175,55,0.25)",
              mb: 4
            }}
          >
            <Typography sx={{ color: "#D4AF37", fontWeight: 800, fontSize: "1rem", mb: 0.8, display: "flex", alignItems: "center", gap: 1 }}>
              <SecurityUpdateGoodIcon fontSize="small" /> Commitment to Privacy
            </Typography>
            <Typography sx={{ color: "rgba(248,250,252,0.82)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              At Vishwakarma Build & Furnish (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we respect your privacy and are committed to protecting the personal data of our website visitors, clients, and mobile app (&ldquo;VB&F Connect&rdquo;) users. We never sell or rent your personal information to third parties.
            </Typography>
          </Box>

          <Stack spacing={4}>
            {/* Section 1 */}
            <Box>
              <Typography variant="h5" sx={{ color: "#D4AF37", fontWeight: 800, fontSize: "1.25rem", mb: 1.5 }}>
                1. Information We Collect
              </Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.8)", fontSize: "0.92rem", lineHeight: 1.7, mb: 1.5 }}>
                We collect only the minimum required information to provide construction, furnishing, and project tracking services:
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0, color: "rgba(248,250,252,0.78)", fontSize: "0.92rem", lineHeight: 1.8 }}>
                <li><strong>Account & Contact Details:</strong> Name, phone number, email address, and site/delivery address when you register, book a service, or sign in as a client.</li>
                <li><strong>Project & Financial Records:</strong> Construction milestones, work progress updates, payment receipts, vouchers, and statement records associated with your project.</li>
                <li><strong>User Media & Uploads:</strong> Photos or documents you choose to upload (such as payment transfer screenshots or site photos).</li>
                <li><strong>Technical & App Diagnostics:</strong> Basic device details (model, OS version) and crash diagnostic logs to keep the application stable and responsive.</li>
              </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

            {/* Section 2 */}
            <Box>
              <Typography variant="h5" sx={{ color: "#D4AF37", fontWeight: 800, fontSize: "1.25rem", mb: 1.5 }}>
                2. Device Permissions Used by Mobile App
              </Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.8)", fontSize: "0.92rem", lineHeight: 1.7, mb: 1.5 }}>
                The <strong>VB&F Connect</strong> Android app requests permissions strictly when required for specific user actions:
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0, color: "rgba(248,250,252,0.78)", fontSize: "0.92rem", lineHeight: 1.8 }}>
                <li><strong>Camera & Photos/Storage:</strong> Used solely when you choose to take a photo or select an image from your gallery to upload payment slips or site reference images. We do not access your gallery without your explicit action.</li>
                <li><strong>Internet & Network State:</strong> Required to securely connect to our servers, fetch your real-time project updates, and sync payment voucher data.</li>
                <li><strong>Notifications:</strong> Used to notify you when a milestone is completed, a new site photo is added, or a payment voucher is generated.</li>
              </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

            {/* Section 3 */}
            <Box>
              <Typography variant="h5" sx={{ color: "#D4AF37", fontWeight: 800, fontSize: "1.25rem", mb: 1.5 }}>
                3. How We Use Your Information
              </Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.8)", fontSize: "0.92rem", lineHeight: 1.7, mb: 1.5 }}>
                Your data is utilized strictly for lawful business and service delivery purposes:
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0, color: "rgba(248,250,252,0.78)", fontSize: "0.92rem", lineHeight: 1.8 }}>
                <li>To manage, build, and deliver your construction and interior furnishing projects.</li>
                <li>To generate and provide transparent, verified milestone reports and payment voucher receipts.</li>
                <li>To communicate critical project updates, schedule site visits, and respond to your customer inquiries.</li>
                <li>To prevent fraud and maintain the security and integrity of user accounts.</li>
              </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

            {/* Section 4 */}
            <Box>
              <Typography variant="h5" sx={{ color: "#D4AF37", fontWeight: 800, fontSize: "1.25rem", mb: 1.5 }}>
                4. Data Sharing & Third Parties
              </Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.8)", fontSize: "0.92rem", lineHeight: 1.7 }}>
                <strong>We do not sell, rent, or trade your personal information to third-party marketing companies.</strong> Data is shared only with trusted infrastructure providers (such as Google Play Services and cloud hosting providers) strictly necessary to run the app, or when required by applicable law or governmental authority.
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

            {/* Section 5 */}
            <Box>
              <Typography variant="h5" sx={{ color: "#D4AF37", fontWeight: 800, fontSize: "1.25rem", mb: 1.5 }}>
                5. Data Security & Storage
              </Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.8)", fontSize: "0.92rem", lineHeight: 1.7 }}>
                We employ industry-standard security measures, including 256-bit SSL/TLS encryption for all data in transit between your mobile app/browser and our servers. Access to client project records is protected via role-based authentication and restricted administrative controls.
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

            {/* Section 6 - Account Deletion */}
            <Box>
              <Typography variant="h5" sx={{ color: "#D4AF37", fontWeight: 800, fontSize: "1.25rem", mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                <DeleteOutlineIcon sx={{ color: "#D4AF37" }} /> 6. Data Retention & Account Deletion
              </Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.8)", fontSize: "0.92rem", lineHeight: 1.7, mb: 1.5 }}>
                You have the right to request access to, correction of, or deletion of your personal account and associated project records at any time.
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2, border: "1px solid rgba(255,255,255,0.08)" }}>
                <Typography sx={{ color: "#F8FAFC", fontSize: "0.9rem", mb: 1, fontWeight: 700 }}>
                  How to request data deletion:
                </Typography>
                <Typography sx={{ color: "rgba(248,250,252,0.75)", fontSize: "0.88rem", lineHeight: 1.6 }}>
                  Send an email to <strong>info@vishwakarmabuildandfurnish.in</strong> with the subject line <em>&ldquo;Account Deletion Request&rdquo;</em> and your registered phone number. Your account and non-statutory data will be permanently deleted within 15–30 business days upon verification.
                </Typography>
              </Paper>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

            {/* Section 7 */}
            <Box>
              <Typography variant="h5" sx={{ color: "#D4AF37", fontWeight: 800, fontSize: "1.25rem", mb: 1.5 }}>
                7. Children&rsquo;s Privacy
              </Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.8)", fontSize: "0.92rem", lineHeight: 1.7 }}>
                Our mobile application and website are designed for adults managing property construction and home interior contracts. We do not knowingly collect personal information from individuals under the age of 18.
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

            {/* Section 8 */}
            <Box>
              <Typography variant="h5" sx={{ color: "#D4AF37", fontWeight: 800, fontSize: "1.25rem", mb: 1.5 }}>
                8. Contact Us
              </Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.8)", fontSize: "0.92rem", lineHeight: 1.7, mb: 2 }}>
                If you have questions, feedback, or concerns regarding this Privacy Policy or how your data is handled, please contact our privacy compliance team:
              </Typography>
              <Stack spacing={1.2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "rgba(248,250,252,0.85)", fontSize: "0.92rem" }}>
                  <LocationOnOutlinedIcon sx={{ color: "#D4AF37" }} />
                  <span><strong>Vishwakarma Build & Furnish</strong>, Charkhi Dadri, Haryana, India - 127306</span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "rgba(248,250,252,0.85)", fontSize: "0.92rem" }}>
                  <EmailOutlinedIcon sx={{ color: "#D4AF37" }} />
                  <span><strong>Email:</strong> info@vishwakarmabuildandfurnish.in</span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "rgba(248,250,252,0.85)", fontSize: "0.92rem" }}>
                  <PhoneOutlinedIcon sx={{ color: "#D4AF37" }} />
                  <span><strong>Phone:</strong> +91 9416856468</span>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Back to Home Button */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            component={RouterLink}
            to="/"
            variant="outlined"
            sx={{
              borderColor: "rgba(212,175,55,0.4)",
              color: "#D4AF37",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              py: 1,
              "&:hover": { borderColor: "#D4AF37", bgcolor: "rgba(212,175,55,0.08)" }
            }}
          >
            &larr; Return to Homepage
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicyPage;
