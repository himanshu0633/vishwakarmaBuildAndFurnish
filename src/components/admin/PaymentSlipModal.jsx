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
  Email as EmailIcon,
  History as HistoryIcon
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

const PaymentSlipModal = ({
  open,
  onClose,
  payment,
  client,
  financials,
  payments = [],
  totalPaid: totalPaidProp,
  remainingBalance: remainingBalanceProp
}) => {
  const handlePrint = () => {
    window.print();
  };

  // 1. All payments chronologically
  const allPayments = React.useMemo(() => {
    let list = Array.isArray(payments) ? [...payments] : [];
    if (payment) {
      const exists = list.some(
        (p) =>
          (payment._id && p._id === payment._id) ||
          (payment.receiptNo && p.receiptNo === payment.receiptNo)
      );
      if (!exists) {
        list.push(payment);
      }
    }
    list = list.filter((p) => p && !p.isDeleted);
    return list.sort((a, b) => {
      const timeA = new Date(a.date || a.createdAt || 0).getTime();
      const timeB = new Date(b.date || b.createdAt || 0).getTime();
      return timeA - timeB;
    });
  }, [payments, payment]);

  // 2. Index of current payment
  const currentPaymentIndex = React.useMemo(() => {
    if (!payment) return -1;
    return allPayments.findIndex(
      (p) =>
        (payment._id && p._id === payment._id) ||
        (payment.receiptNo && p.receiptNo === payment.receiptNo)
    );
  }, [allPayments, payment]);

  // 3. Prior payments
  const priorPayments = React.useMemo(() => {
    if (currentPaymentIndex > 0) {
      return allPayments.slice(0, currentPaymentIndex);
    }
    if (!payment) return [];
    const currentTime = new Date(payment.date || payment.createdAt || 0).getTime();
    return allPayments.filter(
      (p) =>
        ((payment._id && p._id !== payment._id) ||
          (payment.receiptNo && p.receiptNo !== payment.receiptNo)) &&
        new Date(p.date || p.createdAt || 0).getTime() < currentTime
    );
  }, [allPayments, currentPaymentIndex, payment]);

  const priorTotal = React.useMemo(() => {
    return priorPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }, [priorPayments]);

  const currentAmount = Number(payment?.amount || 0);

  const effectiveTotalPaid = React.useMemo(() => {
    const sumCalculated = priorTotal + currentAmount;
    const propTotal = Number(totalPaidProp ?? financials?.totalPaid ?? client?.totalPaid);
    if (!isNaN(propTotal) && propTotal > sumCalculated) {
      return propTotal;
    }
    return sumCalculated;
  }, [priorTotal, currentAmount, totalPaidProp, financials, client]);

  const effectiveContractAmount = React.useMemo(() => {
    return Number(client?.contractAmount ?? financials?.contractAmount ?? 0);
  }, [client, financials]);

  const effectiveRemainingBalance = React.useMemo(() => {
    if (effectiveContractAmount > 0) {
      return Math.max(0, effectiveContractAmount - effectiveTotalPaid);
    }
    return Number(remainingBalanceProp ?? financials?.remainingBalance ?? 0);
  }, [effectiveContractAmount, effectiveTotalPaid, remainingBalanceProp, financials]);

  const formattedAmount = currentAmount.toLocaleString('en-IN');
  const formattedContract = effectiveContractAmount.toLocaleString('en-IN');
  const formattedTotalPaid = effectiveTotalPaid.toLocaleString('en-IN');
  const formattedBalance = effectiveRemainingBalance.toLocaleString('en-IN');
  if (!open || !payment || !client) return null;

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

        {/* Previous Payments History Box */}
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden', mb: 3, bgcolor: '#fafafa' }}>
          <Box sx={{ bgcolor: '#f5f5f5', px: 2, py: 1, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryIcon sx={{ fontSize: 18, color: '#b8860b' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#333' }}>
                Previous Payments Record (पिछला भुगतान विवरण)
              </Typography>
            </Box>
            <Chip
              label={`${priorPayments.length} Previous`}
              size="small"
              sx={{ bgcolor: '#fef3c7', color: '#b8860b', fontWeight: 700, fontSize: '0.75rem' }}
            />
          </Box>

          {priorPayments.length === 0 ? (
            <Box sx={{ p: 1.5, textAlign: 'center', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Initial Installment / पहली किश्त (No previous payments recorded)
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 1.5 }}>
              {priorPayments.map((p, idx) => {
                const pDate = p.date
                  ? new Date(p.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })
                  : '—';
                return (
                  <Box
                    key={p._id || `prev-${idx}`}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 0.8,
                      borderBottom: idx === priorPayments.length - 1 ? 'none' : '1px solid #eee'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#888' }}>
                        #{idx + 1}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#222' }}>
                        {pDate}
                      </Typography>
                      <Chip
                        label={p.paymentMode || 'Cash'}
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#e2e8f0', color: '#475569', fontWeight: 600 }}
                      />
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {p.stepTitle || p.notes || p.receiptNo || 'Payment'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#111' }}>
                      ₹ {Number(p.amount || 0).toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                );
              })}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, mt: 0.5, borderTop: '1px dashed #ccc' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#555' }}>
                  Total Previous Paid (पिछला कुल):
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#b8860b' }}>
                  ₹ {priorTotal.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Account Statement Summary Table */}
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
          <Box sx={{ bgcolor: '#f5f5f5', px: 2, py: 1, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#333' }}>
              Project Financial Balance Overview (खाता स्थिति / लेजर)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 2, textAlign: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Total Contract Value (कुल तय बजट)</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#111' }}>₹ {formattedContract}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Total Paid Till Date (अब तक कुल प्राप्त)</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#2e7d32' }}>₹ {formattedTotalPaid}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Current Balance Due (शेष बकाया)</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: effectiveRemainingBalance > 0 ? '#d32f2f' : '#2e7d32' }}>
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
