import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Chip,
    Divider,
    Container,
    Alert,
    Stack,
    CircularProgress
} from '@mui/material';
import { useState } from 'react';
import './Dashboard.scss';
import { useCreateEvent, useGetAdminEvents } from "./useGetAdminEvents";

export const Dashboard = () => {
    const { data, isLoading, error } = useGetAdminEvents();
    const { mutate: createEvent } = useCreateEvent();
    const [processingEventId, setProcessingEventId] = useState<string | null>(null);

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center', py: 8 }}>
                <CircularProgress size={48} />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading events...</Typography>
                <Typography variant="body2" color="text.secondary">
                    Fetching the latest NCAA games
                </Typography>
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
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </Button>
                    }
                >
                    Failed to load events. Please check your connection and try again.
                </Alert>
            </Container>
        );
    }

    if (!data?.data) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="warning">No events data available.</Alert>
            </Container>
        );
    }

    const { dbEvents, externalEvents } = data.data;

    interface EventCardProps {
        event: {
            _id?: string;
            providerEventId: string;
            type: string;
            status: string;
            startDate: string;
            homeTeam: {
                id: string;
                name: string;
                logoUrl: string;
            };
            awayTeam: {
                id: string;
                name: string;
                logoUrl: string;
            };
            createdAt?: string;
            updatedAt?: string;
        };
        isInDatabase: boolean;
    }

    const EventCard = ({ event, isInDatabase }: EventCardProps) => (
        <Box 
            key={isInDatabase ? event._id : event.providerEventId}
            sx={{ width: { xs: '100%', md: '48%' }, mb: 3 }}
        >
            <Card 
                variant="outlined" 
                sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                    }
                }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                            label={event.type} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                        />
                        <Chip 
                            label={isInDatabase ? "In Database" : "Available"} 
                            size="small" 
                            color={isInDatabase ? "success" : "default"}
                            variant={isInDatabase ? "filled" : "outlined"}
                        />
                    </Box>
                    
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {event.homeTeam?.name} vs {event.awayTeam?.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {new Date(event.startDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Status: {event.status}
                    </Typography>

                    {isInDatabase && event._id && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            ID: {event._id}
                        </Typography>
                    )}
                </CardContent>

                {!isInDatabase && (
                    <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={processingEventId === event.providerEventId}
                            onClick={() => {
                                setProcessingEventId(event.providerEventId);
                                createEvent(event, {
                                    onSettled: () => setProcessingEventId(null)
                                });
                            }}
                            sx={{ fontWeight: 600 }}
                            startIcon={
                                processingEventId === event.providerEventId ? (
                                    <CircularProgress size={16} color="inherit" />
                                ) : undefined
                            }
                        >
                            {processingEventId === event.providerEventId
                                ? "Adding..."
                                : "Add to Database"
                            }
                        </Button>
                    </Box>
                )}
            </Card>
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    Events Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Manage events in your database
                </Typography>
            </Box>

            {/* Summary Stats */}
            <Box sx={{ mb: 4 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Box sx={{ flex: 1 }}>
                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                                    {dbEvents.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Events in Database
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                                    {externalEvents.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Available to Add
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Stack>
            </Box>

            {/* Events in Database Section */}
            {dbEvents.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'success.main' }}>
                        Events in Database ({dbEvents.length})
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        These events are currently active in your database and visible to users
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>
                        {dbEvents.map((event) => (
                            <EventCard key={event._id} event={event} isInDatabase={true} />
                        ))}
                    </Box>
                </Box>
            )}

            {dbEvents.length > 0 && externalEvents.length > 0 && <Divider sx={{ my: 4 }} />}

            {/* Available Events Section */}
            {externalEvents.length > 0 && (
                <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                        Available Events to Add ({externalEvents.length})
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        These events are available from external sources and can be added to your database
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>
                        {externalEvents.map((event) => (
                            <EventCard key={event.providerEventId} event={event} isInDatabase={false} />
                        ))}
                    </Box>
                </Box>
            )}

            {/* Empty States */}
            {dbEvents.length === 0 && externalEvents.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No events available at the moment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Check back later for new NCAA games to manage
                    </Typography>
                </Box>
            )}
        </Container>
    );
};
