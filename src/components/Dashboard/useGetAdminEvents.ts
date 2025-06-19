import { useQuery } from '@tanstack/react-query';
import axios from "axios";
import { useMutation, useQueryClient } from '@tanstack/react-query';



const fetchUpcomingEvents = async (): Promise<AdminDashboardUpcomingEvent[]> => {
    const { data } = await axios.get('http://localhost:8080/api/events/admin-dashboard');
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
    await axios.delete(`http://localhost:8080/api/events/${eventId}`);
};

const createEvent = async (event: AdminDashboardUpcomingEvent): Promise<void> => {
    await axios.post(`http://localhost:8080/api/events/`, event);
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
    id: string;
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


