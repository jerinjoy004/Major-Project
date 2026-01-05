import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth/AuthProvider';
import { LoginPage } from './pages/LoginPage';
import { StorePage } from './pages/StorePage';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/store"
                        element={
                            <ProtectedRoute>
                                <StorePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/store" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
