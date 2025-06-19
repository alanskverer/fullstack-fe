import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './index.css';
import { Login } from "./components/Login/Login";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const ProtectedRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Routes>
            <Route path="/" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
