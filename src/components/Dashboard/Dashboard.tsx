import { Card, CardContent, Typography, Button } from '@mui/material';
import './Dashboard.scss';
import { useCreateEvent, useDeleteEvent, useGetAdminEvents } from "./useGetAdminEvents";
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
    const { data, isLoading } = useGetAdminEvents();
    const { mutate: deleteEvent } = useDeleteEvent();
    const { mutate: createEvent } = useCreateEvent();
    const navigate = useNavigate();

    if (isLoading) return "Loading...";
    if (!data) return null;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className={"logout-container"}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate('/', { replace: true })}
                        sx={{ mt: 2 }}
                    >
                        Logout
                    </Button>
                </div>
                <div>
                    <Typography variant="h4" gutterBottom>
                        Events
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Add or remove upcoming events from the app
                    </Typography>
                </div>

            </div>

            <div className="dashboard-items">
                {data.map((event) => {
                    const { _id, homeTeam, awayTeam, isVisible } = event;

                    return (
                        <div key={_id} className="dashboard-row">
                            <Card className="dashboard-card">
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        {homeTeam?.name} VS {awayTeam?.name}
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Button
                                variant="outlined"
                                onClick={() => isVisible ? deleteEvent(_id) : createEvent(event)}
                                sx={{ height: 'fit-content', alignSelf: 'center', ml: 2 }}
                            >
                                {isVisible ? "Remove" : "Add"}
                            </Button>
                            <div> id: {_id}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
