import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { howItWorks } from '../data/siteData';

export default function HowItWorksPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>How It Works</Typography>
      <Grid container spacing={2}>
        {howItWorks.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.step}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700}>{item.step}</Typography>
                <Typography fontWeight={600} mt={1}>{item.title}</Typography>
                <Typography variant="body2" mt={1}>{item.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
