import { useQuery } from '@tanstack/react-query';
import apiClient from "../../api/apiClient.ts";
import { API_VERSION } from "../../constants/api";

// Types matching backend response
export type JobState = 'waiting' | 'active' | 'delayed' | 'failed' | 'completed';

export interface JobInfo {
    id: string;
    name: string;
    queueName: string;
    state: JobState;
    data: any;
    timestamp: string;
    attemptsMade: number;
    failedReason?: string;
    processedOn?: string;
    finishedOn?: string;
}

export interface QueueJobsGrouped {
    active: JobInfo[];
    delayed: JobInfo[];
    failed: JobInfo[];
    completed: JobInfo[];
}

export type AllJobsGrouped = Record<string, QueueJobsGrouped>;

interface GetJobsResponse {
    success: boolean;
    message: string;
    data: AllJobsGrouped;
}

const fetchJobs = async (): Promise<GetJobsResponse> => {
    const { data } = await apiClient.get(`/${API_VERSION}/admin/bullmq/jobs`);
    console.log('Jobs data:', data);
    return data;
};

export const useGetJobs = () => {
    return useQuery({
        queryKey: ['bullmq-jobs'],
        queryFn: fetchJobs,
        refetchInterval: 15000, // Refetch every 15 seconds
        refetchOnWindowFocus: true,
        staleTime: 10000,
    });
};
