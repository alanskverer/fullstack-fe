import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from "../../api/apiClient.ts";
import { API_VERSION } from "../../constants/api";

// Types matching backend response
export interface ITeamStatsRecord {
    wins: number;
    losses: number;
}

export interface ITeamStatsDocument {
    _id?: string;
    teamId: string;
    leagueId: number;
    teamName: string;
    record: ITeamStatsRecord;
    avgPointsScored: number;
    avgPointsAllowed: number;
    form: string;
    createdAt: string;
    updatedAt: string;
}

interface GetTeamStatsResponse {
    success: boolean;
    leagueId: number;
    data: ITeamStatsDocument[];
}

const fetchTeamStats = async (): Promise<GetTeamStatsResponse> => {
    const { data } = await apiClient.get(`/${API_VERSION}/admin/ncaa-team-stats`);
    console.log('Team Stats data:', data);
    return data;
};

export const useGetTeamStats = () => {
    return useQuery({
        queryKey: ['ncaa-team-stats'],
        queryFn: fetchTeamStats,
    });
};

// Update team stats mutation
interface UpdateTeamStatsParams {
    teamStatsId: string;
    record?: ITeamStatsRecord;
    avgPointsScored?: number;
    avgPointsAllowed?: number;
    form?: string;
}

const updateTeamStats = async (params: UpdateTeamStatsParams): Promise<void> => {
    await apiClient.patch(`/${API_VERSION}/admin/ncaa-team-stats`, params);
};

export const useUpdateTeamStats = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTeamStats,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ncaa-team-stats'] });
        },
        onError: (error) => {
            console.error('Error updating team stats:', error);
        },
    });
};
