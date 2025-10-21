import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
    Paper,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Save as SaveIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    Settings as SettingsIcon,
    Speed as SpeedIcon,
    Timer as TimerIcon
} from '@mui/icons-material';
import { useGetLiveEventConfig, useUpdateLiveEventConfig, useDeleteLiveEventConfig, LiveEventConfig as LiveEventConfigType } from './useLiveEventConfig';

export const LiveEventConfig = () => {
    const { data: config, isLoading, error, refetch } = useGetLiveEventConfig();
    const { mutate: updateConfig, isPending: isUpdating } = useUpdateLiveEventConfig();
    const { mutate: deleteConfig, isPending: isDeleting } = useDeleteLiveEventConfig();

    const [formData, setFormData] = useState<LiveEventConfigType>({
        regularIntervalMs: 15000,
        halfTimeIntervalMs: 60000
    });
    const [displayData, setDisplayData] = useState({
        regularIntervalSeconds: 15,
        halfTimeIntervalSeconds: 60
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({ open: false, message: '', severity: 'success' });

    // Update form data when config changes
    useEffect(() => {
        if (config) {
            setFormData(config);
            setDisplayData({
                regularIntervalSeconds: Math.round(config.regularIntervalMs / 1000),
                halfTimeIntervalSeconds: Math.round(config.halfTimeIntervalMs / 1000)
            });
        }
    }, [config]);

    const handleInputChange = (field: 'regularIntervalSeconds' | 'halfTimeIntervalSeconds') => (event: React.ChangeEvent<HTMLInputElement>) => {
        const seconds = parseInt(event.target.value) || 0;
        const milliseconds = seconds * 1000;
        
        setDisplayData(prev => ({ ...prev, [field]: seconds }));
        
        if (field === 'regularIntervalSeconds') {
            setFormData(prev => ({ ...prev, regularIntervalMs: milliseconds }));
        } else {
            setFormData(prev => ({ ...prev, halfTimeIntervalMs: milliseconds }));
        }
    };

    const handleSave = () => {
        updateConfig(formData, {
            onSuccess: () => {
                setSnackbar({
                    open: true,
                    message: 'Live event configuration updated successfully',
                    severity: 'success'
                });
            },
            onError: (error) => {
                setSnackbar({
                    open: true,
                    message: `Failed to update configuration: ${(error as Error).message}`,
                    severity: 'error'
                });
            }
        });
    };

    const handleDelete = () => {
        deleteConfig(undefined, {
            onSuccess: () => {
                setSnackbar({
                    open: true,
                    message: 'Live event configuration deleted successfully',
                    severity: 'success'
                });
                setDeleteDialogOpen(false);
            },
            onError: (error) => {
                setSnackbar({
                    open: true,
                    message: `Failed to delete configuration: ${(error as Error).message}`,
                    severity: 'error'
                });
            }
        });
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center', py: 8 }}>
                <CircularProgress size={48} />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading configuration...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert 
                    severity="error"
                    action={
                        <Button 
                            color="inherit" 
                            size="small" 
                            onClick={() => refetch()}
                        >
                            Retry
                        </Button>
                    }
                >
                    Failed to load live event configuration. Please check your connection and try again.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                        Live Event Configuration
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Control update intervals for live basketball events
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh configuration">
                        <IconButton onClick={() => refetch()} disabled={isLoading}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Current Status */}
            <Card variant="outlined" sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <SettingsIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Current Status
                        </Typography>
                    </Box>
                    {config ? (
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                    <TimerIcon color="primary" sx={{ mb: 1 }} />
                                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                                        {Math.round(config.regularIntervalMs / 1000)}s
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Regular Play (Q1-Q4, BT, NS)
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                    <SpeedIcon color="secondary" sx={{ mb: 1 }} />
                                    <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }}>
                                        {Math.round(config.halfTimeIntervalMs / 1000)}s
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Halftime (HT)
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    ) : (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            <Typography variant="body2">
                                No custom configuration set. Events are processed every 15 seconds by default.
                            </Typography>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Configuration Form */}
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                        Update Configuration
                    </Typography>

                    {/* Interval Inputs */}
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Regular Play Interval"
                                type="number"
                                value={displayData.regularIntervalSeconds}
                                onChange={handleInputChange('regularIntervalSeconds')}
                                helperText="Seconds for Q1-Q4, BT, NS"
                                inputProps={{ min: 1, step: 1 }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Halftime Interval"
                                type="number"
                                value={displayData.halfTimeIntervalSeconds}
                                onChange={handleInputChange('halfTimeIntervalSeconds')}
                                helperText="Seconds for HT"
                                inputProps={{ min: 1, step: 1 }}
                            />
                        </Grid>
                    </Grid>

                    {/* Info Alert */}
                    <Alert severity="info" sx={{ mt: 3 }}>
                        <Typography variant="body2">
                            <strong>Note:</strong> Changes take effect within ~15 seconds (next job execution).
                        </Typography>
                    </Alert>

                    {/* Action Buttons */}
                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={!config || isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Config'}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Saving...' : 'Save Configuration'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Configuration</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the live event configuration? 
                        This will return to the default 15-second processing interval.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

