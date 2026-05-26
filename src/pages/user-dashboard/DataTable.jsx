import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

export default function DataTable({ rows, columns, render, emptyText = 'No data found' }) {
  return (
    <Paper sx={{ overflowX: 'auto', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: '#0F172A' }}>
            {columns.map(column => (
              <TableCell key={column} sx={{ color: '#F8FAFC', fontWeight: 900, whiteSpace: 'nowrap' }}>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row._id || row.id} sx={{ '&:nth-of-type(even)': { bgcolor: '#F8FAFC' } }}>
              {render(row).map((cell, index) => (
                <TableCell key={index} sx={{ color: '#111827', maxWidth: 280, overflowWrap: 'anywhere' }}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box sx={{ py: 5, textAlign: 'center' }}>
                  <Typography sx={{ color: '#64748B', fontWeight: 800 }}>{emptyText}</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
