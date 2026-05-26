import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import api from '../../../utils/axiosConfig';

const money = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const modules = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'users', label: 'Users' },
  { id: 'partners', label: 'Partners' },
  { id: 'verification', label: 'Partner Verification' },
  { id: 'leads', label: 'Leads' },
  { id: 'likes', label: 'Service Likes' },
  { id: 'bills', label: 'Bills' },
  { id: 'cashback', label: 'Cashback' },
  { id: 'wallet', label: 'Wallet' },
  { id: 'referrals', label: 'Referrals' },
  { id: 'reviews', label: 'Partner Reviews' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'reports', label: 'Reports' }
];

export default function MarketplaceDashboard() {
  const { moduleId = 'analytics' } = useParams();
  const module = modules.some(item => item.id === moduleId) ? moduleId : 'analytics';
  const [analytics, setAnalytics] = useState(null);
  const [partners, setPartners] = useState([]);
  const [leads, setLeads] = useState([]);
  const [bills, setBills] = useState([]);
  const [wallet, setWallet] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [reviews, setReviews] = useState([]);

  const load = async () => {
    const [analyticsRes, partnersRes, leadsRes, billsRes, walletRes, referralsRes, reviewsRes] = await Promise.all([
      api.get('/analytics/admin'),
      api.get('/partners?includePending=true'),
      api.get('/marketplace/leads'),
      api.get('/marketplace/bills'),
      api.get('/marketplace/wallet'),
      api.get('/marketplace/referrals'),
      api.get('/marketplace/reviews?status=Pending')
    ]);
    setAnalytics(analyticsRes.data.data);
    setPartners(partnersRes.data.data || []);
    setLeads(leadsRes.data.data || []);
    setBills(billsRes.data.data || []);
    setWallet(walletRes.data.data || []);
    setReferrals(referralsRes.data.data || []);
    setReviews(reviewsRes.data.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => ([
    ['Total Leads', analytics?.totalLeads || 0],
    ['Converted Leads', analytics?.convertedLeads || 0],
    ['Bill Amount', money(analytics?.totalBillAmount)],
    ['Cashback Pending', money(analytics?.totalCashbackPending)],
    ['Cashback Paid', money(analytics?.totalCashbackPaid)],
    ['Partners', partners.length]
  ]), [analytics, partners.length]);

  const updatePartnerStatus = async (id, status) => {
    await api.patch(`/partners/${id}/status`, { status });
    load();
  };

  const updateLeadStatus = async (id, followUpStatus) => {
    await api.patch(`/marketplace/leads/${id}`, { followUpStatus });
    load();
  };

  const adminVerifyBill = async (id, approved) => {
    await api.patch(`/marketplace/bills/${id}/admin-verify`, { approved });
    load();
  };

  const markPaid = async (id) => {
    await api.patch(`/marketplace/bills/${id}/payment`, { status: 'Paid' });
    load();
  };

  const reviewStatus = async (id, status) => {
    await api.patch(`/marketplace/reviews/${id}/status`, { status });
    load();
  };

  return (
    <Box sx={{ color: '#111827' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={900} sx={{ color: '#F8FAFC' }}>Marketplace Admin</Typography>
        <Typography sx={{ color: 'rgba(248,250,252,0.7)' }}>Marketplace modules are available in the admin sidebar. Current section: {modules.find(item => item.id === module)?.label}.</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map(([label, value]) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={label}>
            <Paper sx={statCardSx}>
              <Typography sx={{ color: '#64748B', fontWeight: 800, fontSize: 13 }}>{label}</Typography>
              <Typography variant="h6" fontWeight={900} sx={{ color: '#0F172A', overflowWrap: 'anywhere' }}>{value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box>
        <Paper sx={{ p: { xs: 1.5, md: 2.5 }, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', minWidth: 0 }}>
          <ModuleTitle title={modules.find(item => item.id === module)?.label} />

          {module === 'analytics' && analytics && (
            <Stack spacing={2}>
              <AdminTable rows={analytics.serviceWise || []} columns={['Service', 'Views', 'Clicks', 'Likes', 'Leads', 'Bills Uploaded', 'Conversion']} render={(row) => [row.serviceName, row.views, row.clicks, row.likes, row.leads, row.billsUploaded, `${row.conversionPercent}%`]} />
              <AdminTable rows={analytics.topPerformingPartners || []} columns={['Partner', 'Views', 'Clicks', 'Bills', 'Bill Amount']} render={(row) => [row.shopName, row.views, row.clicks, row.billCount, money(row.totalBillAmount)]} />
            </Stack>
          )}

          {module === 'users' && <AdminTable rows={referrals} columns={['User', 'Mobile', 'WhatsApp', 'Referral Code', 'Valid Referrals', 'Eligible']} render={(row) => [row.user?.name, row.user?.mobile, row.user?.whatsappNumber, row.user?.referralCode, row.validReferrals, row.cashbackEligible ? 'Yes' : 'No']} />}
          {module === 'partners' && <AdminTable rows={partners} columns={['Shop', 'Owner', 'Mobile', 'WhatsApp', 'Status', 'Commission', 'Products']} render={(row) => [row.shopName, row.ownerName, row.mobile, row.whatsappNumber, <StatusChip status={row.status} />, `${row.commissionPercent || 0}%`, row.products?.length || 0]} />}
          {module === 'verification' && <AdminTable rows={partners} columns={['Shop', 'Owner', 'GST', 'Status', 'Action']} render={(row) => [row.shopName, row.ownerName, row.gstNumber || '-', <StatusChip status={row.status} />, <StatusButtons onSet={(status) => updatePartnerStatus(row._id, status)} />]} />}
          {module === 'leads' && <AdminTable rows={leads} columns={['User', 'Mobile', 'WhatsApp', 'Service', 'Category', 'Status', 'Action']} render={(row) => [row.user?.name, row.user?.mobile, row.user?.whatsappNumber, row.service?.name, row.category?.name, <StatusChip status={row.followUpStatus} />, <LeadStatus value={row.followUpStatus} onSet={(status) => updateLeadStatus(row._id, status)} />]} />}
          {module === 'likes' && analytics && <AdminTable rows={analytics.mostLikedServices || []} columns={['Service', 'Likes']} render={(row) => [row.serviceName, row.likes]} />}
          {module === 'bills' && <AdminTable rows={bills} columns={['User', 'Partner', 'Amount', 'Cashback', 'Status', 'Action']} render={(row) => [row.user?.name, row.partner?.shopName, money(row.billAmount), money(row.cashbackAmount), <StatusChip status={row.status} />, <Stack direction="row" spacing={1}><Button size="small" variant="contained" onClick={() => adminVerifyBill(row._id, true)}>Approve</Button><Button size="small" variant="outlined" color="error" onClick={() => adminVerifyBill(row._id, false)}>Reject</Button></Stack>]} />}
          {module === 'cashback' && <AdminTable rows={bills} columns={['User', 'Bill Amount', 'Cashback', 'Status', 'Payment']} render={(row) => [row.user?.name, money(row.billAmount), money(row.cashbackAmount), <StatusChip status={row.status} />, <Button size="small" variant="contained" onClick={() => markPaid(row._id)}>Mark Paid</Button>]} />}
          {module === 'wallet' && <AdminTable rows={wallet} columns={['User', 'Type', 'Amount', 'Status', 'Date']} render={(row) => [row.user?.name, row.type, money(row.amount), <StatusChip status={row.status} />, new Date(row.createdAt).toLocaleDateString()]} />}
          {module === 'referrals' && <AdminTable rows={referrals} columns={['User', 'Referral Code', 'Total', 'Valid', 'Pending/Invalid', 'Eligible']} render={(row) => [row.user?.name, row.user?.referralCode, row.totalReferrals, row.validReferrals, row.invalidOrPendingReferrals, row.cashbackEligible ? 'Yes' : 'No']} />}
          {module === 'reviews' && <AdminTable rows={reviews} columns={['User', 'Partner', 'Rating', 'Review', 'Status', 'Action']} render={(row) => [row.user?.name, row.partner?.shopName, row.rating, row.reviewText, <StatusChip status={row.status} />, <Stack direction="row" spacing={1}><Button size="small" variant="contained" onClick={() => reviewStatus(row._id, 'Approved')}>Approve</Button><Button size="small" variant="outlined" color="error" onClick={() => reviewStatus(row._id, 'Rejected')}>Reject</Button></Stack>]} />}
          {module === 'notifications' && <EmptyModule text="Notifications API is ready. Broadcast and read-status controls can be added in the next expansion." />}
          {module === 'reports' && <EmptyModule text="Analytics data is ready for reports. Export and filter controls can be added in the next expansion." />}
        </Paper>
      </Box>
    </Box>
  );
}

function ModuleTitle({ title }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
      <Typography variant="h5" fontWeight={900} sx={{ color: '#0F172A' }}>{title}</Typography>
    </Box>
  );
}

function AdminTable({ rows, columns, render }) {
  return (
    <Box sx={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: 1, bgcolor: '#FFFFFF' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: '#0F172A' }}>
            {columns.map(column => <TableCell key={column} sx={{ color: '#F8FAFC', fontWeight: 900, whiteSpace: 'nowrap' }}>{column}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row._id || row.serviceId || row.user?._id} sx={{ '&:nth-of-type(even)': { bgcolor: '#F8FAFC' } }}>
              {render(row).map((cell, index) => <TableCell key={index} sx={{ color: '#111827', maxWidth: 280, overflowWrap: 'anywhere' }}>{cell}</TableCell>)}
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ color: '#64748B', py: 4, textAlign: 'center' }}>No data found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}

function StatusButtons({ onSet }) {
  return (
    <Stack direction="row" spacing={1}>
      {['Verified', 'Rejected', 'Blocked'].map(status => (
        <Button key={status} size="small" variant={status === 'Verified' ? 'contained' : 'outlined'} color={status === 'Rejected' ? 'error' : 'primary'} onClick={() => onSet(status)}>
          {status}
        </Button>
      ))}
    </Stack>
  );
}

function LeadStatus({ value, onSet }) {
  return (
    <TextField select size="small" value={value || 'New Lead'} onChange={(e) => onSet(e.target.value)} sx={{ minWidth: 170 }}>
      {['New Lead', 'Contacted', 'Interested', 'Not Interested', 'Converted'].map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
    </TextField>
  );
}

function StatusChip({ status = 'Pending' }) {
  const color = ['Verified', 'Converted', 'Approved', 'Paid', 'Cashback Paid', 'Cashback Added To Wallet'].includes(status)
    ? 'success'
    : ['Rejected', 'Blocked', 'Partner Rejected'].includes(status)
      ? 'error'
      : 'warning';
  return <Chip size="small" label={status} color={color} sx={{ fontWeight: 800 }} />;
}

function EmptyModule({ text }) {
  return (
    <Paper sx={{ p: 3, bgcolor: '#FFFFFF', border: '1px dashed #CBD5E1' }}>
      <Typography sx={{ color: '#334155', fontWeight: 700 }}>{text}</Typography>
    </Paper>
  );
}

const statCardSx = {
  p: 2,
  bgcolor: '#F8FAFC',
  border: '1px solid #E2E8F0',
  minHeight: 92
};
