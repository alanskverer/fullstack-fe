import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import './Dashboard.scss';
import { useCreateEvent, useDeleteEvent, useGetAdminEvents } from "./useGetAdminEvents";

export const Dashboard = () => {
    const { data, isLoading } = useGetAdminEvents();
    const { mutate: deleteEvent } = useDeleteEvent();
    const {mutate: createEvent} = useCreateEvent()

    if (isLoading) return "Loading...";
    if (!data) return null;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <Typography variant="h4" gutterBottom>
                    Events
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Add or remove upcoming events from the app
                </Typography>
            </div>

            <div className="dashboard-items">
                {data.map((event) => {
                    const { id, homeTeam, awayTeam, isVisible } = event;

                    return (
                        <div key={id} className="dashboard-row">
                            <Card className="dashboard-card">
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        {homeTeam?.name} VS {awayTeam?.name}
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Button
                                variant="outlined"
                                onClick={() => isVisible ? deleteEvent(id) : createEvent(event)}
                                sx={{ height: 'fit-content', alignSelf: 'center', ml: 2 }}
                            >
                                {isVisible ? "Remove" : "Add"}

                            </Button>
                            <div> id: {id}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
