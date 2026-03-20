import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { Login } from "./components/Login/Login";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { Jobs } from "./components/Jobs/Jobs";
import { LiveEventConfig } from "./components/LiveEventConfig/LiveEventConfig";
import { TeamStats } from "./components/TeamStats/TeamStats";
import { NavigationLayout } from "./components/Layout/NavigationLayout";
import { LandingPage } from "./components/LandingPage/LandingPage";
import Privacy from "./components/Privacy/Privacy";
import TermsDocx from "./components/Terms/TermsDocx";
import QA from "./components/QA/QA";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const ProtectedRoute = ({ isAuthenticated, onLogout }: { isAuthenticated: boolean; onLogout: () => void }) => {
    return isAuthenticated ? <NavigationLayout onLogout={onLogout} /> : <Navigate to="/admin/login" replace />;
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<TermsDocx />} />
            <Route path="/qa" element={<QA />} />
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
                <Route path="/admin/team-stats" element={<TeamStats />} />
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
