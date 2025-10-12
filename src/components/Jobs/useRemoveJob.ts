import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from "../../api/apiClient.ts";
import { API_VERSION } from "../../constants/api";

interface RemoveJobParams {
    jobId: string;
    queueName: string;
}

const removeJob = async ({ jobId, queueName }: RemoveJobParams): Promise<void> => {
    await apiClient.delete(`/${API_VERSION}/admin/bullmq/jobs/${jobId}?queueName=${queueName}`);
};

export const useRemoveJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bullmq-jobs'] });
        },
        onError: (error) => {
            console.error('Error removing job:', error);
        },
    });
};
