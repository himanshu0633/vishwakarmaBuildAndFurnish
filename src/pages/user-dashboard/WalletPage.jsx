import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import DataTable from './DataTable';
import { money, useDashboard } from './DashboardContext';

export default function WalletPage() {
  const { wallet } = useDashboard();
  if (!wallet) return null;

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3, bgcolor: '#0F172A', color: '#F8FAFC', border: '1px solid rgba(212,175,55,0.25)' }}>
        <Typography sx={{ color: 'rgba(248,250,252,0.72)', fontWeight: 800 }}>Wallet Balance</Typography>
        <Typography variant="h3" fontWeight={900} sx={{ color: '#D4AF37' }}>{money(wallet.walletBalance)}</Typography>
      </Paper>
      <Grid container spacing={2}>
        {[
          ['Total Cashback Earned', wallet.totalCashbackEarned],
          ['Pending Cashback', wallet.pendingCashback],
          ['Approved Cashback', wallet.approvedCashback],
          ['Paid Cashback', wallet.paidCashback],
          ['Wallet Balance', wallet.walletBalance],
          ['Referral Bonus', wallet.referralBonus]
        ].map(([label, value]) => (
          <Grid item xs={12} sm={6} md={4} key={label}>
            <Paper sx={{ p: 2, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
              <Typography color="text.secondary" fontWeight={800}>{label}</Typography>
              <Typography variant="h5" fontWeight={900} sx={{ color: '#0F172A' }}>{money(value)}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box>
        <Typography fontWeight={900} sx={{ color: '#0F172A', mb: 1 }}>Transactions</Typography>
        <DataTable rows={wallet.transactions || []} columns={['Type', 'Amount', 'Status', 'Date']} emptyText="No wallet transactions yet." render={(row) => [row.type, money(row.amount), row.status, new Date(row.createdAt).toLocaleString()]} />
      </Box>
    </Stack>
  );
}
