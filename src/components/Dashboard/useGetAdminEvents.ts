import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from "../../api/apiClient.ts";



const fetchUpcomingEvents = async (): Promise<AdminDashboardUpcomingEvent[]> => {
    const { data } = await apiClient.get('/events/admin-dashboard');
    console.log({data})

    return data;
};

export const useGetAdminEvents = () => {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: fetchUpcomingEvents,
    });
};



// API function for deleting event
const deleteEvent = async (eventId: string): Promise<void> => {
    await apiClient.delete(`/events/${eventId}`);
};

const createEvent = async (event: AdminDashboardUpcomingEvent): Promise<void> => {
    await apiClient.post(`/events/`, event);
};


// React Query mutation hook
export const useDeleteEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            // Invalidate and refetch the events query
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error) => {
            console.error('Error deleting event:', error);
        },
    });
};

export const useCreateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (event: AdminDashboardUpcomingEvent) => createEvent(event),
        onSuccess: () => {
            // Optionally refetch events or invalidate cache
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
};



type AdminDashboardUpcomingEvent = {
    _id: string;
    type: string;
    startDate: number;
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
    isVisible:boolean
};


