import { useEffect } from 'react';
import apiClient from '../api/apiClient';
import { API_VERSION } from '../constants/api';

export const useAuthValidation = (isAuthenticated: boolean, onLogout: () => void) => {
    useEffect(() => {
        if (!isAuthenticated) return;

        // Validate authentication with server on app startup
        const validateAuth = async () => {
            try {
                // Try to make a simple API call that requires authentication
                await apiClient.get(`/${API_VERSION}/admin/events/dashboard`);
            } catch (error) {
                // If the request fails, user is not authenticated
                console.log('Authentication validation failed, logging out');
                onLogout();
            }
        };

        validateAuth();
    }, [isAuthenticated, onLogout]);
};

