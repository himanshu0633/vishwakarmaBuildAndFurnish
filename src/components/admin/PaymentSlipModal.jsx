import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  Chip
} from '@mui/material';
import {
  Print as PrintIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import logoImg from '../../assets/logo.png';

// Number to Indian English words converter
const numberToWords = (num) => {
  if (!num || isNaN(num)) return 'Zero';
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n) => {
    let str = '';
    if (n > 99) {
      str += a[Math.floor(n / 100)] + 'Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : ' ');
    } else if (n > 0) {
      str += a[n];
    }
    return str;
  };

  let n = Math.floor(num);
  let crore = Math.floor(n / 10000000);
  n %= 10000000;
  let lakh = Math.floor(n / 100000);
  n %= 100000;
  let thousand = Math.floor(n / 1000);
  n %= 1000;
  let remainder = n;

  let res = '';
  if (crore > 0) res += inWords(crore) + 'Crore ';
  if (lakh > 0) res += inWords(lakh) + 'Lakh ';
  if (thousand > 0) res += inWords(thousand) + 'Thousand ';
  if (remainder > 0) res += inWords(remainder);

  return res.trim() + ' Rupees Only';
};

const PaymentSlipModal = ({ open, onClose, payment, client, totalPaid = 0, remainingBalance = 0 }) => {
  if (!payment || !client) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedAmount = Number(payment.amount || 0).toLocaleString('en-IN');
  const formattedContract = Number(client.contractAmount || 0).toLocaleString('en-IN');
  const formattedTotalPaid = Number(totalPaid || 0).toLocaleString('en-IN');
  const formattedBalance = Number(remainingBalance || 0).toLocaleString('en-IN');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& @media print': {
          '& .MuiDialog-paper': {
            boxShadow: 'none',
            margin: 0,
            maxWidth: '100% !important',
            width: '100% !important'
          }
        }
      }}
    >
      <DialogContent sx={{ p: { xs: 2, sm: 4 }, bgcolor: '#fff', color: '#111' }} id="printable-payment-slip">
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-payment-slip, #printable-payment-slip * {
                visibility: visible;
              }
              #printable-payment-slip {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                padding: 20px !important;
                background: white !important;
                color: black !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}
        </style>

        {/* Header with Logo & Brand Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, borderBottom: '2px solid #D4AF37' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src={logoImg}
              alt="Vishwakarma Build & Furnish"
              sx={{ height: 65, width: 'auto', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#111', letterSpacing: 0.5 }}>
                VISHWAKARMA BUILD & FURNISH
              </Typography>
              <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'block' }}>
                From Foundation to Furniture • Construction & Interior Solutions
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem', mt: 0.5 }}>
                Charkhi Dadri, Haryana | Call / WhatsApp: <strong>+91 9416856468</strong>
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Box sx={{ display: 'inline-block', px: 2, py: 0.5, bgcolor: '#111', color: '#D4AF37', borderRadius: 1, fontWeight: 700, fontSize: '0.9rem' }}>
              OFFICIAL PAYMENT RECEIPT
            </Box>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 600, color: '#333' }}>
              Receipt No: <span style={{ color: '#b8860b' }}>{payment.receiptNo || 'VBF-REC'}</span>
            </Typography>
            <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
              Date: {payment.date ? new Date(payment.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN')}
            </Typography>
          </Box>
        </Box>

        {/* Email Status Indicator */}
        {payment.emailSent && (
          <Box sx={{ mt: 1.5, p: 1, bgcolor: '#e8f5e9', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 18 }} />
            <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 600 }}>
              Official receipt copy was emailed automatically to: {client.email}
            </Typography>
          </Box>
        )}

        {/* Client & Payment Details Grid */}
        <Box sx={{ my: 3 }}>
          <Grid container spacing={2}>
            {/* Client Details Box */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2, border: '1px solid #e0e0e0', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#b8860b', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Billed To / Client Details:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#111' }}>
                  {client.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mt: 0.5 }}>
                  <strong>Site / Address:</strong> {client.location}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mt: 0.5 }}>
                  <strong>Phone:</strong> +91 {client.phone}
                </Typography>
                {client.email && (
                  <Typography variant="body2" sx={{ color: '#555', mt: 0.5 }}>
                    <strong>Email:</strong> {client.email}
                  </Typography>
                )}
                {client.aadharNo && (
                  <Typography variant="body2" sx={{ color: '#555', mt: 0.5 }}>
                    <strong>Aadhar Card No:</strong> {client.aadharNo}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Transaction / Mode Box */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2, border: '1px solid #e0e0e0', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#b8860b', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Transaction Particulars:
                </Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  <strong>Payment Mode:</strong> <Chip label={payment.paymentMode || 'Cash'} size="small" sx={{ fontWeight: 700, bgcolor: '#111', color: '#D4AF37', ml: 0.5 }} />
                </Typography>
                {payment.transactionRef && (
                  <Typography variant="body2" sx={{ color: '#555', mt: 1 }}>
                    <strong>Ref / UTR / Cheque No:</strong> {payment.transactionRef}
                  </Typography>
                )}
                {payment.stepTitle && (
                  <Typography variant="body2" sx={{ color: '#555', mt: 1 }}>
                    <strong>Work Stage / Milestone:</strong> {payment.stepTitle}
                  </Typography>
                )}
                {payment.notes && (
                  <Typography variant="body2" sx={{ color: '#555', mt: 1 }}>
                    <strong>Remarks / Note:</strong> {payment.notes}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Amount Box */}
        <Box sx={{ p: 2.5, bgcolor: '#111', color: '#fff', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
              Amount Received with Thanks
            </Typography>
            <Typography variant="body1" sx={{ color: '#e0e0e0', fontStyle: 'italic', mt: 0.5 }}>
              {numberToWords(payment.amount)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#D4AF37' }}>
              ₹ {formattedAmount}
            </Typography>
          </Box>
        </Box>

        {/* Account Statement Summary Table */}
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
          <Box sx={{ bgcolor: '#f5f5f5', px: 2, py: 1, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#333' }}>
              Project Financial Balance Overview
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 2, textAlign: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Total Contract Value</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#111' }}>₹ {formattedContract}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Total Paid Till Date</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#2e7d32' }}>₹ {formattedTotalPaid}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Current Balance Due</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: remainingBalance > 0 ? '#d32f2f' : '#2e7d32' }}>
                ₹ {formattedBalance}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Signatures & Terms */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pt: 4, mt: 3, borderTop: '1px dashed #ccc' }}>
          <Box sx={{ maxWidth: '60%' }}>
            <Typography variant="caption" sx={{ color: '#777', display: 'block' }}>
              * This is a computer-generated official receipt issued by Vishwakarma Build & Furnish.
            </Typography>
            <Typography variant="caption" sx={{ color: '#777', display: 'block' }}>
              * Payments received via Cheque/Online are subject to realization.
            </Typography>
            <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 700, display: 'block', mt: 0.5 }}>
              Thank you for trusting Vishwakarma Build & Furnish!
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', minWidth: 200 }}>
            <Box sx={{ height: 40, borderBottom: '1px solid #333', mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#111' }}>
              Authorized Signatory
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Vishwakarma Build & Furnish
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5', borderTop: '1px solid #ddd' }} className="no-print">
        <Button onClick={onClose} startIcon={<CloseIcon />} sx={{ color: '#666' }}>
          Close
        </Button>
        <Button
          onClick={handlePrint}
          variant="contained"
          startIcon={<PrintIcon />}
          sx={{
            bgcolor: '#D4AF37',
            color: '#111',
            fontWeight: 700,
            '&:hover': { bgcolor: '#b8860b' }
          }}
        >
          Print / Save PDF Slip
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentSlipModal;
