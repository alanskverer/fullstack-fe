import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate } from 'react-router-dom';

type SectionId = 'collection' | 'usage' | 'virtual' | 'sharing' | 'rights' | 'security' | 'cookies' | 'children' | 'contact' | 'updates';

const Privacy: React.FC = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<SectionId | false>('collection');

  const handleAccordionChange = (panel: SectionId) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ textTransform: 'none', color: 'inherit' }}
          >
            Back
          </Button>
        </Box>

        {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <SecurityIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Privacy Policy
          </Typography>
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Last updated: November 2025
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Introduction */}
        <Paper elevation={0} sx={{ bgcolor: 'info.light', p: 2, mb: 3, borderRadius: 1 }}>
          <Typography variant="body2">
            Bettim is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our virtual money sports betting app.
          </Typography>
        </Paper>

        {/* Accordion Sections */}

        {/* 1. Information We Collect */}
        <Accordion
          expanded={expanded === 'collection'}
          onChange={handleAccordionChange('collection')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              1. Information We Collect
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Account Information:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                When you create an account, we collect your email address, username, and password for authentication and account management.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Device Information:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                We collect information about your device, including IP address, browser type, operating system, and device identifiers to provide and improve our services.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Game Activity:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                We track your betting history, virtual currency transactions, game statistics, and gameplay patterns to enhance your experience.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Location Data:
              </Typography>
              <Typography variant="body2">
                We may collect approximate location data to ensure compliance with regional regulations and provide location-specific features.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 2. How We Use Your Information */}
        <Accordion
          expanded={expanded === 'usage'}
          onChange={handleAccordionChange('usage')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              2. How We Use Your Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" component="div" sx={{ mb: 2 }}>
                We use the information we collect for the following purposes:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Account authentication and management
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Providing and personalizing our gaming services
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Processing virtual currency transactions
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Improving app performance and user experience
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Monitoring for fraud and ensuring security
                </Typography>
                <Typography component="li" variant="body2">
                  Sending service-related notifications and updates
                </Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 3. Virtual Currency Disclaimer */}
        <Accordion
          expanded={expanded === 'virtual'}
          onChange={handleAccordionChange('virtual')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              3. Virtual Currency Disclaimer
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Paper elevation={0} sx={{ bgcolor: 'warning.light', p: 1.5, mb: 2, borderLeft: 4, borderColor: 'warning.main' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.dark' }}>
                  IMPORTANT DISCLAIMER
                </Typography>
              </Paper>

              <Typography variant="body2" sx={{ mb: 2 }}>
                The virtual currency used in Bettim has no real-world monetary value. It cannot be exchanged for real money, goods, or services outside of the app. Virtual currency is earned and spent exclusively within the Bettim ecosystem for entertainment purposes only.
              </Typography>

              <Typography variant="body2">
                All bets placed and virtual currency earned are for entertainment purposes. Bettim is not a real money gambling application and does not involve real financial transactions.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 4. Data Sharing & Third Parties */}
        <Accordion
          expanded={expanded === 'sharing'}
          onChange={handleAccordionChange('sharing')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              4. Data Sharing & Third Parties
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                We do not sell, trade, or rent your personal information to third parties. We may share information with:
              </Typography>

              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Service Providers:</strong> Hosting providers, analytics services, and customer support platforms that help us operate the app
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Legal Requirements:</strong> When required by law or to protect our rights
                </Typography>
                <Typography component="li" variant="body2">
                  <strong>Business Transfers:</strong> In the event of merger, acquisition, or sale of assets
                </Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 5. Your Rights & Data Control */}
        <Accordion
          expanded={expanded === 'rights'}
          onChange={handleAccordionChange('rights')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              5. Your Rights & Data Control
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                You have the right to:
              </Typography>

              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Access:</strong> Request a copy of your personal data
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Correction:</strong> Update or correct your information
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Deletion:</strong> Request deletion of your account and associated data
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Export:</strong> Export your data in a portable format
                </Typography>
                <Typography component="li" variant="body2">
                  <strong>Opt-Out:</strong> Opt out of non-essential communications
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ mt: 2 }}>
                To exercise any of these rights, contact us at support@bettim.co
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 6. Data Security */}
        <Accordion
          expanded={expanded === 'security'}
          onChange={handleAccordionChange('security')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              6. Data Security
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                We implement comprehensive security measures to protect your data:
              </Typography>

              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  SSL/TLS encryption for data transmission
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Secure password hashing and authentication
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Regular security audits and updates
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Access controls and data segregation
                </Typography>
                <Typography component="li" variant="body2">
                  Employee training on data protection practices
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ mt: 2 }}>
                However, no security system is 100% secure. We encourage you to use strong passwords and report any security concerns immediately.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 7. Cookies & Tracking */}
        <Accordion
          expanded={expanded === 'cookies'}
          onChange={handleAccordionChange('cookies')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              7. Cookies & Tracking
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Bettim uses cookies and similar technologies for:
              </Typography>

              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Session Management:</strong> Keeping you logged in securely
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>User Preferences:</strong> Remembering your settings and choices
                </Typography>
                <Typography component="li" variant="body2">
                  <strong>Analytics:</strong> Understanding how users interact with our app
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ mt: 2 }}>
                You can control cookie settings through your browser preferences, though some cookies are necessary for app functionality.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 8. Children's Privacy */}
        <Accordion
          expanded={expanded === 'children'}
          onChange={handleAccordionChange('children')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              8. Children's Privacy
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Bettim is intended for users aged 13 and above. We do not knowingly collect personal information from children under 13.
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                If we discover that we have collected information from a child under 13, we will immediately delete such information and notify the parent or guardian.
              </Typography>

              <Typography variant="body2">
                Parents or guardians who believe their child has provided information to Bettim should contact us immediately at support@bettim.co
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 9. Contact Information */}
        <Accordion
          expanded={expanded === 'contact'}
          onChange={handleAccordionChange('contact')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              9. Contact Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us:
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Email:
                </Typography>
                <Typography variant="body2">
                  support@bettim.co
                </Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 10. Updates to Privacy Policy */}
        <Accordion
          expanded={expanded === 'updates'}
          onChange={handleAccordionChange('updates')}
          sx={{ mb: 3 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              10. Updates to Privacy Policy
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                We will notify you of any material changes by updating the "Last updated" date at the top of this page and, for significant changes, by sending you a notification through the app.
              </Typography>

              <Typography variant="body2">
                Your continued use of Bettim following the posting of revised Privacy Policy means you accept and agree to the changes.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Footer */}
        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="caption" color="textSecondary">
            © 2025 Bettim. All rights reserved.
          </Typography>
        </Box>

        <Box sx={{ pb: 2 }} />
      </Container>
    </Box>
  );
};

export default Privacy;
