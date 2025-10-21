import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from "../../api/apiClient.ts";
import { API_VERSION } from "../../constants/api";

// Types matching backend response
export interface LiveEventConfig {
    regularIntervalMs: number; // Interval for normal game play (Q1/Q2/Q3/Q4/BT/NS) in milliseconds
    halfTimeIntervalMs: number; // Interval during halftime (HT) in milliseconds
}

// API functions
const fetchLiveEventConfig = async (): Promise<LiveEventConfig | null> => {
    const { data } = await apiClient.get(`/${API_VERSION}/admin/dashboard/live-event/config`);
    return data;
};

const updateLiveEventConfig = async (config: LiveEventConfig): Promise<LiveEventConfig> => {
    const { data } = await apiClient.post(`/${API_VERSION}/admin/dashboard/live-event/config`, config);
    return data;
};

const deleteLiveEventConfig = async (): Promise<null> => {
    const { data } = await apiClient.delete(`/${API_VERSION}/admin/dashboard/live-event/config`);
    return data;
};

// React Query hooks
export const useGetLiveEventConfig = () => {
    return useQuery({
        queryKey: ['live-event-config'],
        queryFn: fetchLiveEventConfig,
        refetchOnWindowFocus: true,
        staleTime: 30000, // 30 seconds
    });
};

export const useUpdateLiveEventConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateLiveEventConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['live-event-config'] });
        },
        onError: (error) => {
            console.error('Error updating live event config:', error);
        },
    });
};

export const useDeleteLiveEventConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteLiveEventConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['live-event-config'] });
        },
        onError: (error) => {
            console.error('Error deleting live event config:', error);
        },
    });
};
