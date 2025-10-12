import { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Snackbar,
    Grid,
    Tooltip
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { useGetJobs, AllJobsGrouped, JobInfo } from './useGetJobs';
import { useRemoveJob } from './useRemoveJob';
import { useRemoveQueueJobs } from './useRemoveQueueJobs';
import { useGetSchedulers, AllSchedulersGrouped, SchedulerInfo } from './useGetSchedulers';
import { useRemoveScheduler } from './useRemoveScheduler';

export const Jobs = () => {
    const { data, isLoading, error, refetch } = useGetJobs();
    const { data: schedulersData, isLoading: isLoadingSchedulers, error: schedulersError, refetch: refetchSchedulers } = useGetSchedulers();
    const { mutate: removeJob, isPending: isRemovingJob } = useRemoveJob();
    const { mutate: removeQueueJobs, isPending: isRemovingQueueJobs } = useRemoveQueueJobs();
    const { mutate: removeScheduler, isPending: isRemovingScheduler } = useRemoveScheduler();

    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: 'job' | 'queue' | 'scheduler';
        jobId?: string;
        queueName?: string;
        state?: string;
        schedulerId?: string;
    }>({ open: false, type: 'job' });

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({ open: false, message: '', severity: 'success' });

    const [expandedQueues, setExpandedQueues] = useState<Set<string>>(new Set());

    // Console log the data
    console.log('Jobs component - data:', data);

    const handleDeleteJob = (jobId: string, queueName: string) => {
        setConfirmDialog({
            open: true,
            type: 'job',
            jobId,
            queueName
        });
    };

    const handleClearQueue = (queueName: string) => {
        setConfirmDialog({
            open: true,
            type: 'queue',
            queueName
        });
    };

    const handleDeleteScheduler = (schedulerId: string, queueName: string) => {
        setConfirmDialog({
            open: true,
            type: 'scheduler',
            schedulerId,
            queueName
        });
    };

    const handleAccordionChange = (queueName: string) => {
        setExpandedQueues(prev => {
            const newSet = new Set(prev);
            if (newSet.has(queueName)) {
                newSet.delete(queueName);
            } else {
                newSet.add(queueName);
            }
            return newSet;
        });
    };

    const handleExpandAll = () => {
        if (!data?.data) return;
        const allQueueNames = Object.keys(data.data);
        setExpandedQueues(new Set(allQueueNames));
    };

    const handleCollapseAll = () => {
        setExpandedQueues(new Set());
    };

    const handleConfirmDelete = () => {
        if (confirmDialog.type === 'job' && confirmDialog.jobId && confirmDialog.queueName) {
            removeJob(
                { jobId: confirmDialog.jobId, queueName: confirmDialog.queueName },
                {
                    onSuccess: () => {
                        setSnackbar({
                            open: true,
                            message: 'Job deleted successfully',
                            severity: 'success'
                        });
                    },
                    onError: (error) => {
                        setSnackbar({
                            open: true,
                            message: `Failed to delete job: ${(error as Error).message}`,
                            severity: 'error'
                        });
                    }
                }
            );
        } else if (confirmDialog.type === 'queue' && confirmDialog.queueName) {
            removeQueueJobs(
                { queueName: confirmDialog.queueName },
                {
                    onSuccess: () => {
                        setSnackbar({
                            open: true,
                            message: 'Queue jobs cleared successfully',
                            severity: 'success'
                        });
                    },
                    onError: (error) => {
                        setSnackbar({
                            open: true,
                            message: `Failed to clear queue: ${(error as Error).message}`,
                            severity: 'error'
                        });
                    }
                }
            );
        } else if (confirmDialog.type === 'scheduler' && confirmDialog.schedulerId && confirmDialog.queueName) {
            removeScheduler(
                { schedulerId: confirmDialog.schedulerId, queueName: confirmDialog.queueName },
                {
                    onSuccess: () => {
                        setSnackbar({
                            open: true,
                            message: 'Scheduler removed successfully',
                            severity: 'success'
                        });
                    },
                    onError: (error) => {
                        setSnackbar({
                            open: true,
                            message: `Failed to remove scheduler: ${(error as Error).message}`,
                            severity: 'error'
                        });
                    }
                }
            );
        }
        setConfirmDialog({ open: false, type: 'job' });
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center', py: 8 }}>
                <CircularProgress size={48} />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading jobs...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">
                    Failed to load jobs. Error: {(error as Error).message}
                </Alert>
            </Container>
        );
    }

    if (!data?.data) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="warning">No jobs data available.</Alert>
            </Container>
        );
    }

    const jobsData: AllJobsGrouped = data.data;
    const schedulersDataParsed: AllSchedulersGrouped = schedulersData?.data || {};

    // Calculate summary stats
    const summary = Object.values(jobsData).reduce(
        (acc, queue) => ({
            active: acc.active + queue.active.length,
            delayed: acc.delayed + queue.delayed.length,
            failed: acc.failed + queue.failed.length,
            completed: acc.completed + queue.completed.length
        }),
        { active: 0, delayed: 0, failed: 0, completed: 0 }
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header with Refresh */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                        BullMQ Jobs Monitor
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Auto-refreshes every 15 seconds
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="text"
                        size="small"
                        onClick={handleExpandAll}
                    >
                        Expand All
                    </Button>
                    <Button
                        variant="text"
                        size="small"
                        onClick={handleCollapseAll}
                    >
                        Collapse All
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => {
                            refetch();
                            refetchSchedulers();
                        }}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
                                {summary.active}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Active Jobs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                                {summary.delayed}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Delayed Jobs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
                                {summary.failed}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Failed Jobs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                                {summary.completed}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Completed Jobs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Display each queue */}
            {Object.entries(jobsData).map(([queueName, queueJobs]) => {
                const totalJobs =
                    queueJobs.active.length +
                    queueJobs.delayed.length +
                    queueJobs.failed.length +
                    queueJobs.completed.length;

                const schedulers = schedulersDataParsed[queueName] || [];

                return (
                    <Accordion
                        key={queueName}
                        expanded={expandedQueues.has(queueName)}
                        onChange={() => handleAccordionChange(queueName)}
                        sx={{ mb: 3 }}
                        elevation={2}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                bgcolor: 'grey.50',
                                '&:hover': { bgcolor: 'grey.100' },
                                borderBottom: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {queueName}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                                    <Chip label={`${totalJobs} total`} color="primary" variant="outlined" size="small" />
                                    <Tooltip title="Clear all jobs">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleClearQueue(queueName);
                                            }}
                                            disabled={isRemovingQueueJobs || totalJobs === 0}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            {/* Job counts by state */}
                            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                <Chip label={`Active: ${queueJobs.active.length}`} color="info" size="small" />
                                <Chip label={`Delayed: ${queueJobs.delayed.length}`} color="warning" size="small" />
                                <Chip label={`Failed: ${queueJobs.failed.length}`} color="error" size="small" />
                                <Chip label={`Completed: ${queueJobs.completed.length}`} color="success" size="small" />
                                {schedulers.length > 0 && (
                                    <Chip label={`🔄 Schedulers: ${schedulers.length}`} color="secondary" size="small" />
                                )}
                            </Box>

                            {/* Schedulers for this queue */}
                            {schedulers.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                        🔄 Schedulers
                                    </Typography>
                                    {schedulers.map((scheduler: SchedulerInfo) => (
                                        <Box
                                            key={scheduler.id}
                                            sx={{
                                                mb: 1,
                                                p: 2,
                                                border: '1px solid',
                                                borderColor: 'secondary.light',
                                                borderRadius: 1,
                                                bgcolor: 'secondary.lighter',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                                                    {scheduler.id}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Next run: {new Date(scheduler.nextRun).toLocaleString()}
                                                    {scheduler.every && ` | Every ${scheduler.every}ms`}
                                                    {scheduler.pattern && ` | Pattern: ${scheduler.pattern}`}
                                                </Typography>
                                                {scheduler.data && (
                                                    <Accordion sx={{ mt: 1 }}>
                                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                            <Typography variant="caption">View Data</Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <Typography
                                                                variant="caption"
                                                                component="pre"
                                                                sx={{
                                                                    fontFamily: 'monospace',
                                                                    whiteSpace: 'pre-wrap',
                                                                    wordBreak: 'break-word',
                                                                    bgcolor: 'grey.100',
                                                                    p: 1,
                                                                    borderRadius: 1
                                                                }}
                                                            >
                                                                {JSON.stringify(scheduler.data, null, 2)}
                                                            </Typography>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                )}
                                            </Box>
                                            <Tooltip title="Remove scheduler">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteScheduler(scheduler.id, queueName)}
                                                    disabled={isRemovingScheduler}
                                                    sx={{ ml: 2 }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {/* Display jobs by state */}
                            {(['active', 'delayed', 'failed', 'completed'] as const).map((state) => {
                                const jobs = queueJobs[state];
                                if (jobs.length === 0) return null;

                                // Completed jobs collapsed by default
                                const defaultExpanded = state !== 'completed';

                                return (
                                    <Accordion key={state} defaultExpanded={defaultExpanded}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                                                {state} Jobs ({jobs.length})
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {jobs.map((job: JobInfo) => (
                                                <Box
                                                    key={job.id}
                                                    sx={{
                                                        mb: 2,
                                                        p: 2,
                                                        border: '1px solid',
                                                        borderColor: state === 'failed' ? 'error.light' : 'grey.300',
                                                        borderRadius: 1,
                                                        bgcolor: state === 'failed' ? 'error.lighter' : 'grey.50',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start'
                                                    }}
                                                >
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                                                            ID: {job.id}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Name: {job.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                            {new Date(job.timestamp).toLocaleString()} | Attempts: {job.attemptsMade}
                                                        </Typography>
                                                        {job.failedReason && (
                                                            <Alert severity="error" sx={{ mt: 1 }}>
                                                                {job.failedReason}
                                                            </Alert>
                                                        )}
                                                        <Accordion sx={{ mt: 1 }}>
                                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                                <Typography variant="caption">View Data</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <Typography
                                                                    variant="caption"
                                                                    component="pre"
                                                                    sx={{
                                                                        fontFamily: 'monospace',
                                                                        whiteSpace: 'pre-wrap',
                                                                        wordBreak: 'break-word',
                                                                        bgcolor: 'grey.100',
                                                                        p: 1,
                                                                        borderRadius: 1
                                                                    }}
                                                                >
                                                                    {JSON.stringify(job.data, null, 2)}
                                                                </Typography>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </Box>
                                                    <Tooltip title="Delete job">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteJob(job.id, queueName)}
                                                            disabled={isRemovingJob}
                                                            sx={{ ml: 2 }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })}
                        </AccordionDetails>
                    </Accordion>
                );
            })}

            {/* Empty state */}
            {Object.keys(jobsData).length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No queues found
                    </Typography>
                </Box>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, type: 'job' })}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {confirmDialog.type === 'job'
                            ? `Are you sure you want to delete job ${confirmDialog.jobId}?`
                            : confirmDialog.type === 'queue'
                            ? `Are you sure you want to clear all jobs from queue ${confirmDialog.queueName}?`
                            : `Are you sure you want to remove scheduler ${confirmDialog.schedulerId}? This will stop it from creating new jobs.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog({ open: false, type: 'job' })}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        {confirmDialog.type === 'scheduler' ? 'Remove' : 'Delete'}
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
