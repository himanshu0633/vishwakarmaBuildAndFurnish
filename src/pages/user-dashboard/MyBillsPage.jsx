import DataTable from './DataTable';
import { money, useDashboard } from './DashboardContext';
import { Chip } from '@mui/material';

export default function MyBillsPage() {
  const { bills } = useDashboard();

  return (
    <DataTable
      rows={bills}
      columns={['Partner', 'Amount', 'Cashback', 'Status', 'Purchase Date']}
      emptyText="No bills have been uploaded yet."
      render={(row) => [
        row.partner?.shopName,
        money(row.billAmount),
        money(row.cashbackAmount),
        <Chip size="small" label={row.status} color={row.status?.includes('Rejected') ? 'error' : row.status?.includes('Paid') || row.status?.includes('Approved') ? 'success' : 'warning'} />,
        new Date(row.purchaseDate).toLocaleDateString()
      ]}
    />
  );
}
