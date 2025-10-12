import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from "../../api/apiClient.ts";
import { API_VERSION } from "../../constants/api";

interface RemoveSchedulerParams {
    schedulerId: string;
    queueName: string;
}

const removeScheduler = async ({ schedulerId, queueName }: RemoveSchedulerParams): Promise<void> => {
    await apiClient.delete(`/${API_VERSION}/admin/bullmq/schedulers/${schedulerId}?queueName=${queueName}`);
};

export const useRemoveScheduler = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeScheduler,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bullmq-schedulers'] });
        },
        onError: (error) => {
            console.error('Error removing scheduler:', error);
        },
    });
};
