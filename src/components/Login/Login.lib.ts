import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useLogin() {
    return useMutation({
        mutationFn: (password: string) => {
            // Replace with your real API call
            return axios.post('http://localhost:8080/api/admin/login', { password });
        },
    });
}