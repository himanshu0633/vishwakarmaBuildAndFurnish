import { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import api from '../../../utils/axiosConfig';
import DataTable from './DataTable';
import EmptyState from './EmptyState';

export default function NotificationsPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get('/marketplace/notifications').then((res) => setRows(res.data.data || []));
  }, []);

  return rows.length ? (
    <DataTable
      rows={rows}
      columns={['Title', 'Message', 'Date']}
      render={(row) => [row.title, row.message, new Date(row.createdAt).toLocaleString()]}
    />
  ) : (
    <EmptyState icon={<NotificationsIcon />} title="No notifications" subtitle="Important updates will appear here." />
  );
}
