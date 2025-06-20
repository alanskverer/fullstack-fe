import { useMutation } from '@tanstack/react-query';
import apiClient from "../../api/apiClient.ts";

export function useLogin() {
    return useMutation({
        mutationFn: (password: string) => {
            return apiClient.post('/admin/login', { password });
        },
    });
}