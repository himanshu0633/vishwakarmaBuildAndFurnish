import { Box, Button, Chip, Paper, Stack, TextField, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShareIcon from '@mui/icons-material/Share';
import DataTable from './DataTable';
import { useDashboard } from './DashboardContext';

export default function ReferralsPage() {
  const { referrals, user, setMessage } = useDashboard();
  if (!referrals) return null;

  const referralCode = user?.referralCode || '';
  const referralLink = `${window.location.origin}/login?ref=${encodeURIComponent(referralCode)}`;
  const shareText = `Register on Vishwakarma Build & Furnish using my referral code: ${referralCode}. Link: ${referralLink}`;

  const copyReferralLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setMessage('Referral link copied.');
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Vishwakarma Build & Furnish Referral',
        text: shareText,
        url: referralLink
      });
      return;
    }

    await copyReferralLink();
  };

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3, bgcolor: referrals.cashbackEligible ? '#ECFDF5' : '#FFFBEB', border: `1px solid ${referrals.cashbackEligible ? '#86EFAC' : '#FDE68A'}`, boxShadow: 'none' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography fontWeight={900} sx={{ color: '#0F172A' }}>Referral Requirement</Typography>
            <Typography sx={{ color: '#64748B' }}>A minimum of 2 valid referrals is required for cashback eligibility.</Typography>
          </Box>
          <Chip label={`Cashback eligible: ${referrals.cashbackEligible ? 'Yes' : 'No'}`} color={referrals.cashbackEligible ? 'success' : 'warning'} />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5, mt: 2 }}>
          <MiniStat label="Total" value={referrals.totalReferrals} />
          <MiniStat label="Valid" value={referrals.validReferrals} />
          <MiniStat label="Pending/Invalid" value={referrals.invalidOrPendingReferrals} />
        </Box>
      </Paper>

      <Paper sx={{ p: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Typography fontWeight={900} sx={{ color: '#0F172A' }}>Share Referral Link</Typography>
        <Typography sx={{ color: '#64748B', mb: 2 }}>
          Anyone who registers through this link will have your referral code filled automatically.
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <TextField
            label="Referral Link"
            value={referralLink}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={copyReferralLink} sx={{ whiteSpace: 'nowrap' }}>
            Copy
          </Button>
          <Button variant="contained" startIcon={<ShareIcon />} onClick={shareReferralLink} sx={{ bgcolor: '#D4AF37', color: '#111111', fontWeight: 900, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#B88917' } }}>
            Share
          </Button>
          <Button
            variant="outlined"
            startIcon={<WhatsAppIcon />}
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ whiteSpace: 'nowrap' }}
          >
            WhatsApp
          </Button>
        </Stack>
      </Paper>

      <DataTable
        rows={referrals.details || []}
        columns={['Name', 'Mobile', 'WhatsApp', 'Bill Uploaded', 'Bill Verified', 'Valid']}
        emptyText="You do not have any referrals yet."
        render={(row) => [row.referredUserName, row.mobileNumber, row.whatsappNumber, row.billUploaded ? 'Yes' : 'No', row.billVerified ? 'Yes' : 'No', row.referralValid ? 'Yes' : 'No']}
      />
    </Stack>
  );
}

function MiniStat({ label, value }) {
  return (
    <Paper sx={{ p: 1.5, boxShadow: 'none', border: '1px solid rgba(15,23,42,0.08)' }}>
      <Typography sx={{ color: '#64748B', fontSize: 13, fontWeight: 800 }}>{label}</Typography>
      <Typography variant="h5" fontWeight={900} sx={{ color: '#0F172A' }}>{value}</Typography>
    </Paper>
  );
}
