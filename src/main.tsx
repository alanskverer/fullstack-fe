import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { Login } from "./components/Login/Login";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { Jobs } from "./components/Jobs/Jobs";
import { LiveEventConfig } from "./components/LiveEventConfig/LiveEventConfig";
import { NavigationLayout } from "./components/Layout/NavigationLayout";
import { LandingPage } from "./components/LandingPage/LandingPage";
import Privacy from "./components/Privacy/Privacy";
import TermsDocx from "./components/Terms/TermsDocx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthValidation } from "./hooks/useAuthValidation";

const queryClient = new QueryClient();

const ProtectedRoute = ({ isAuthenticated, onLogout }: { isAuthenticated: boolean; onLogout: () => void }) => {
    return isAuthenticated ? <NavigationLayout onLogout={onLogout} /> : <Navigate to="/admin/login" replace />;
};

function App() {
    // Check localStorage for existing authentication on app start
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const authData = localStorage.getItem('bettim-admin-auth');
        if (!authData) return false;
        
        try {
            const { authenticated, timestamp } = JSON.parse(authData);
            // Check if token is older than 24 hours
            const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;
            if (isExpired) {
                localStorage.removeItem('bettim-admin-auth');
                return false;
            }
            return authenticated;
        } catch {
            // Invalid data format, clear it
            localStorage.removeItem('bettim-admin-auth');
            return false;
        }
    });

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('bettim-admin-auth', JSON.stringify({
            authenticated: true,
            timestamp: Date.now()
        }));
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('bettim-admin-auth');
    };

    // Validate authentication with server on app startup
    useAuthValidation(isAuthenticated, handleLogout);

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<TermsDocx />} />
            <Route
                path="/admin/login"
                element={
                    isAuthenticated
                        ? <Navigate to="/admin/dashboard" replace />
                        : <Login onLogin={handleLogin} />
                }
            />
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout} />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/jobs" element={<Jobs />} />
                <Route path="/admin/live-config" element={<LiveEventConfig />} />
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
