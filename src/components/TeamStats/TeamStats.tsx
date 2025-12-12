import { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
} from '@mui/material';
import { useGetTeamStats, useUpdateTeamStats, ITeamStatsDocument } from './useGetTeamStats';

interface EditableTeamStats extends ITeamStatsDocument {
    isEditing?: boolean;
}

export const TeamStats = () => {
    const { data, isLoading, error } = useGetTeamStats();
    const { mutate: updateTeamStats, isPending: isUpdating } = useUpdateTeamStats();
    const [editableTeams, setEditableTeams] = useState<EditableTeamStats[]>([]);

    console.log('TeamStats component - response:', data);

    // Initialize editable teams when data is loaded
    useState(() => {
        if (data?.data) {
            setEditableTeams(data.data.map(team => ({ ...team, isEditing: false })));
        }
    });

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center', py: 8 }}>
                <CircularProgress size={48} />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading team stats...</Typography>
                <Typography variant="body2" color="text.secondary">
                    Fetching NCAA team statistics
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">
                    Failed to load team stats. Please check your connection and try again.
                </Alert>
            </Container>
        );
    }

    if (!data?.data || data.data.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="info">No team stats available.</Alert>
            </Container>
        );
    }

    const teams = editableTeams.length > 0 ? editableTeams : data.data;

    const handleEdit = (index: number) => {
        const updatedTeams = [...teams];
        updatedTeams[index] = { ...updatedTeams[index], isEditing: true };
        setEditableTeams(updatedTeams);
    };

    const handleSave = (index: number) => {
        const team = teams[index];

        if (!team._id) {
            console.error('No _id found for team stats');
            return;
        }

        // Prepare update payload
        const updatePayload = {
            teamStatsId: team._id,
            record: team.record,
            avgPointsScored: team.avgPointsScored,
            avgPointsAllowed: team.avgPointsAllowed,
            form: team.form
        };

        console.log('Updating team stats:', updatePayload);

        // Call mutation
        updateTeamStats(updatePayload, {
            onSuccess: () => {
                // Exit edit mode after successful update
                const updatedTeams = [...teams];
                updatedTeams[index] = { ...updatedTeams[index], isEditing: false };
                setEditableTeams(updatedTeams);
                console.log('Team stats updated successfully!');
            },
            onError: (error) => {
                console.error('Failed to update team stats:', error);
            }
        });
    };

    const handleFieldChange = (index: number, field: string, value: string | number) => {
        const updatedTeams = [...teams];

        if (field === 'wins' || field === 'losses') {
            updatedTeams[index] = {
                ...updatedTeams[index],
                record: {
                    ...updatedTeams[index].record,
                    [field]: Number(value)
                }
            };
        } else if (field === 'avgPointsScored' || field === 'avgPointsAllowed') {
            updatedTeams[index] = {
                ...updatedTeams[index],
                [field]: Number(value)
            };
        } else {
            updatedTeams[index] = {
                ...updatedTeams[index],
                [field]: value
            };
        }

        setEditableTeams(updatedTeams);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    NCAA Team Stats
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    View and edit team statistics
                </Typography>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'grey.50' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Team Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Wins</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Losses</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Avg Points Scored</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Avg Points Allowed</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Form</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teams.map((team, index) => (
                            <TableRow key={team.teamId} hover>
                                <TableCell>
                                    {team.teamName}
                                </TableCell>
                                <TableCell>
                                    {team.isEditing ? (
                                        <TextField
                                            type="number"
                                            value={team.record.wins}
                                            onChange={(e) => handleFieldChange(index, 'wins', e.target.value)}
                                            size="small"
                                            sx={{ width: 80 }}
                                        />
                                    ) : (
                                        team.record.wins
                                    )}
                                </TableCell>
                                <TableCell>
                                    {team.isEditing ? (
                                        <TextField
                                            type="number"
                                            value={team.record.losses}
                                            onChange={(e) => handleFieldChange(index, 'losses', e.target.value)}
                                            size="small"
                                            sx={{ width: 80 }}
                                        />
                                    ) : (
                                        team.record.losses
                                    )}
                                </TableCell>
                                <TableCell>
                                    {team.isEditing ? (
                                        <TextField
                                            type="number"
                                            value={team.avgPointsScored}
                                            onChange={(e) => handleFieldChange(index, 'avgPointsScored', e.target.value)}
                                            size="small"
                                            sx={{ width: 100 }}
                                        />
                                    ) : (
                                        team.avgPointsScored.toFixed(1)
                                    )}
                                </TableCell>
                                <TableCell>
                                    {team.isEditing ? (
                                        <TextField
                                            type="number"
                                            value={team.avgPointsAllowed}
                                            onChange={(e) => handleFieldChange(index, 'avgPointsAllowed', e.target.value)}
                                            size="small"
                                            sx={{ width: 100 }}
                                        />
                                    ) : (
                                        team.avgPointsAllowed.toFixed(1)
                                    )}
                                </TableCell>
                                <TableCell>
                                    {team.isEditing ? (
                                        <TextField
                                            value={team.form}
                                            onChange={(e) => handleFieldChange(index, 'form', e.target.value)}
                                            size="small"
                                            sx={{ width: 120 }}
                                        />
                                    ) : (
                                        team.form
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {team.isEditing ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleSave(index)}
                                            disabled={isUpdating}
                                            startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : undefined}
                                        >
                                            {isUpdating ? 'Saving...' : 'Save'}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleEdit(index)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};
