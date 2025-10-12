import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from "../../api/apiClient.ts";
import { API_VERSION } from "../../constants/api";
import { JobState } from './useGetJobs';

interface RemoveQueueJobsParams {
    queueName: string;
    state?: JobState;
}

const removeQueueJobs = async ({ queueName, state }: RemoveQueueJobsParams): Promise<void> => {
    const url = state
        ? `/${API_VERSION}/admin/bullmq/queues/${queueName}/jobs?state=${state}`
        : `/${API_VERSION}/admin/bullmq/queues/${queueName}/jobs`;
    await apiClient.delete(url);
};

export const useRemoveQueueJobs = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeQueueJobs,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bullmq-jobs'] });
        },
        onError: (error) => {
            console.error('Error removing queue jobs:', error);
        },
    });
};
