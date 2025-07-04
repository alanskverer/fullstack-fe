import { useMutation } from '@tanstack/react-query';
import apiClient from "../../api/apiClient.ts";
import { API_VERSION } from "../../constants/api";

export function useLogin() {
    return useMutation({
        mutationFn: (password: string) => {
            return apiClient.post(`/${API_VERSION}/admin/login`, { password });
        },
    });
}