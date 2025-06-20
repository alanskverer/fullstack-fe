// src/apiClient.ts
import axios from 'axios';

console.log(import.meta.env.VITE_API_URL)
// Create Axios instance with base URL from Vite environment
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export default apiClient;