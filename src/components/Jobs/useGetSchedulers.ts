import { useQuery } from '@tanstack/react-query';
import apiClient from "../../api/apiClient.ts";
import { API_VERSION } from "../../constants/api";

export interface SchedulerInfo {
    id: string;
    queueName: string;
    nextRun: string;
    every?: number;
    pattern?: string;
    data?: any;
}

export type AllSchedulersGrouped = Record<string, SchedulerInfo[]>;

interface GetSchedulersResponse {
    success: boolean;
    message: string;
    data: AllSchedulersGrouped;
}

const fetchSchedulers = async (): Promise<GetSchedulersResponse> => {
    const { data } = await apiClient.get(`/${API_VERSION}/admin/bullmq/schedulers`);
    console.log('Schedulers data:', data);
    return data;
};

export const useGetSchedulers = () => {
    return useQuery({
        queryKey: ['bullmq-schedulers'],
        queryFn: fetchSchedulers,
        refetchInterval: 15000, // Refetch every 15 seconds
        refetchOnWindowFocus: true,
        staleTime: 10000,
    });
};
