import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { Login } from "./components/Login/Login";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { Jobs } from "./components/Jobs/Jobs";
import { NavigationLayout } from "./components/Layout/NavigationLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const ProtectedRoute = ({ isAuthenticated, onLogout }: { isAuthenticated: boolean; onLogout: () => void }) => {
    return isAuthenticated ? <NavigationLayout onLogout={onLogout} /> : <Navigate to="/" replace />;
};

function App() {
    // Check localStorage for existing authentication on app start
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => localStorage.getItem('bettim-admin-auth') === 'true'
    );

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('bettim-admin-auth', 'true');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('bettim-admin-auth');
    };

    return (
        <Routes>
            <Route 
                path="/" 
                element={
                    isAuthenticated 
                        ? <Navigate to="/dashboard" replace /> 
                        : <Login onLogin={handleLogin} />
                } 
            />
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/jobs" element={<Jobs />} />
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
