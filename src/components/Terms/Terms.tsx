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
import GavelIcon from '@mui/icons-material/Gavel';
import { useNavigate } from 'react-router-dom';

type SectionId = 'acceptance' | 'use' | 'accounts' | 'intellectual' | 'disclaimer' | 'liability' | 'termination' | 'modifications' | 'governing' | 'contact';

const Terms: React.FC = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<SectionId | false>('acceptance');

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
          <GavelIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Terms & Conditions
          </Typography>
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Last updated: November 2025
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Introduction */}
        <Paper elevation={0} sx={{ bgcolor: 'info.light', p: 2, mb: 3, borderRadius: 1 }}>
          <Typography variant="body2">
            These Terms & Conditions govern your use of the Bettim application. By accessing and using Bettim, you agree to be bound by these terms. If you do not agree with any part of these terms, you may not use the service.
          </Typography>
        </Paper>

        {/* Accordion Sections */}

        {/* 1. Acceptance of Terms */}
        <Accordion
          expanded={expanded === 'acceptance'}
          onChange={handleAccordionChange('acceptance')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              1. Acceptance of Terms
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                By downloading, installing, and using the Bettim application, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions and our Privacy Policy.
              </Typography>

              <Typography variant="body2">
                If you are accessing Bettim on behalf of a company or organization, you represent and warrant that you have the authority to bind that entity to these terms.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 2. Use License & Restrictions */}
        <Accordion
          expanded={expanded === 'use'}
          onChange={handleAccordionChange('use')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              2. Use License & Restrictions
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Bettim grants you a non-exclusive, non-transferable, revocable license to use the application for personal, non-commercial purposes. You agree NOT to:
              </Typography>

              <Box component="ul" sx={{ m: 0, pl: 2, mb: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Reproduce, duplicate, or copy any content or functionality from Bettim
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Modify or reverse engineer the application or any part of it
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Use Bettim for commercial purposes or competitor analysis
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Attempt to gain unauthorized access to the application or its systems
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Transmit malware, viruses, or any code of destructive nature
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Harass, abuse, or threaten other users or our staff
                </Typography>
                <Typography component="li" variant="body2">
                  Use automated tools, bots, or scripts to access or manipulate the service
                </Typography>
              </Box>

              <Typography variant="body2">
                We reserve the right to suspend or terminate your access if you violate these restrictions.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 3. User Accounts */}
        <Accordion
          expanded={expanded === 'accounts'}
          onChange={handleAccordionChange('accounts')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              3. User Accounts & Responsibilities
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Account Creation:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                To use Bettim, you must be at least 13 years old (or the applicable age of digital consent in your jurisdiction). You must provide accurate, complete, and current information during registration.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Your Responsibilities:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                You are responsible for maintaining the confidentiality of your password and account. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
              </Typography>

              <Typography variant="body2">
                Bettim is not liable for any loss or damage arising from unauthorized use of your account if you have failed to maintain confidentiality.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 4. Intellectual Property Rights */}
        <Accordion
          expanded={expanded === 'intellectual'}
          onChange={handleAccordionChange('intellectual')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              4. Intellectual Property Rights
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                All content, features, and functionality of Bettim—including but not limited to text, graphics, logos, images, and software—are owned by Bettim, its content providers, or other providers of such material and are protected by international copyright and intellectual property laws.
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                You may not reproduce, distribute, transmit, or display any content from Bettim without our prior written permission.
              </Typography>

              <Typography variant="body2">
                Your use of Bettim does not grant you ownership of any intellectual property rights in the application or its content.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 5. Disclaimer of Warranties */}
        <Accordion
          expanded={expanded === 'disclaimer'}
          onChange={handleAccordionChange('disclaimer')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              5. Disclaimer of Warranties
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Paper elevation={0} sx={{ bgcolor: 'warning.light', p: 1.5, mb: 2, borderLeft: 4, borderColor: 'warning.main' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.dark' }}>
                  "AS IS" BASIS
                </Typography>
              </Paper>

              <Typography variant="body2" sx={{ mb: 2 }}>
                Bettim is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the application, including:
              </Typography>

              <Box component="ul" sx={{ m: 0, pl: 2, mb: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Implied warranties of merchantability, fitness for a particular purpose, or non-infringement
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  The accuracy, completeness, or timeliness of any information provided
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  That the service will be uninterrupted or error-free
                </Typography>
                <Typography component="li" variant="body2">
                  That defects will be corrected
                </Typography>
              </Box>

              <Typography variant="body2">
                We disclaim all liability for any technical, operational, or security issues with the application.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 6. Limitation of Liability */}
        <Accordion
          expanded={expanded === 'liability'}
          onChange={handleAccordionChange('liability')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              6. Limitation of Liability
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                To the maximum extent permitted by law, Bettim shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or relating to your use of the application, including:
              </Typography>

              <Box component="ul" sx={{ m: 0, pl: 2, mb: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Loss of data or virtual currency
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Loss of profits or revenue
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Business interruption
                </Typography>
                <Typography component="li" variant="body2">
                  Personal injury or property damage
                </Typography>
              </Box>

              <Typography variant="body2">
                In no event shall our total liability exceed the amount you have paid to us, if any, in the six months preceding the claim.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 7. Termination */}
        <Accordion
          expanded={expanded === 'termination'}
          onChange={handleAccordionChange('termination')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              7. Termination & Account Closure
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Bettim may terminate or suspend your account and access to the application at any time, without notice, for any reason, including violation of these terms.
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                You may request to close your account at any time by contacting support@bettim.app. Upon termination:
              </Typography>

              <Box component="ul" sx={{ m: 0, pl: 2, mb: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Your access to Bettim will be immediately revoked
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Virtual currency balances will be forfeited
                </Typography>
                <Typography component="li" variant="body2">
                  Your account data may be deleted in accordance with our Privacy Policy
                </Typography>
              </Box>

              <Typography variant="body2">
                Termination does not relieve you of any obligations incurred prior to termination.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 8. Modifications to Terms */}
        <Accordion
          expanded={expanded === 'modifications'}
          onChange={handleAccordionChange('modifications')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              8. Modifications to Terms & Service
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Bettim reserves the right to modify these Terms & Conditions at any time. Changes will be effective when posted, and your continued use of the application constitutes your acceptance of the modified terms.
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                We also reserve the right to modify, suspend, or discontinue the service or any part of it, with or without notice.
              </Typography>

              <Typography variant="body2">
                We will update the "Last updated" date when we make material changes. For significant changes, we will notify you through the application.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 9. Governing Law */}
        <Accordion
          expanded={expanded === 'governing'}
          onChange={handleAccordionChange('governing')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              9. Governing Law & Jurisdiction
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                These Terms & Conditions are governed by and construed in accordance with the laws of the jurisdiction where Bettim is registered, without regard to its conflict of law provisions.
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                You agree that any legal action or dispute arising from these terms shall be resolved exclusively in the courts located in that jurisdiction.
              </Typography>

              <Typography variant="body2">
                You consent to the exclusive jurisdiction and venue of these courts and waive any claim that the proceedings have been brought in an inconvenient venue.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 10. Contact Information */}
        <Accordion
          expanded={expanded === 'contact'}
          onChange={handleAccordionChange('contact')}
          sx={{ mb: 3 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              10. Contact Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="div" sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                If you have questions about these Terms & Conditions or need to report a violation, please contact us:
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

export default Terms;
