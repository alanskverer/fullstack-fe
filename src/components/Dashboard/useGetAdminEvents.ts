import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from "../../api/apiClient.ts";
import { API_VERSION } from "../../constants/api";

// Updated type to match backend response structure
type AdminDashboardResponse = {
    message: string;
    data: {
        dbEvents: IEvent[];
        externalEvents: IEvent[];
    };
};

type IEvent = {
    providerEventId: string;
    type: string;
    status: string;
    startDate: string;
    homeTeam: {
        id: string;
        name: string;
        logoUrl: string;
    };
    awayTeam: {
        id: string;
        name: string;
        logoUrl: string;
    };
    _id?: string; // Only exists for dbEvents
    createdAt?: string;
    updatedAt?: string;
};

const fetchAdminDashboardData = async (): Promise<AdminDashboardResponse> => {
    const { data } = await apiClient.get(`/${API_VERSION}/admin/events/dashboard`);
    console.log('Dashboard data:', data);
    return data;
};

export const useGetAdminEvents = () => {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: fetchAdminDashboardData,
    });
};

// API function for deleting event (using _id from dbEvents)
const deleteEvent = async (eventId: string): Promise<void> => {
  await apiClient.delete(`/${API_VERSION}/admin/events/${eventId}`);
};

// API function for creating event (using external event data)
const createEvent = async (event: IEvent): Promise<void> => {
    await apiClient.post(`/${API_VERSION}/admin/events`, event);
};

// React Query mutation hook for deletion
export const useDeleteEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error) => {
            console.error('Error deleting event:', error);
        },
    });
};

// React Query mutation hook for creation
export const useCreateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (event: IEvent) => createEvent(event),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error) => {
            console.error('Error creating event:', error);
        },
    });
};

