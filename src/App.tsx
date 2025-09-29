// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import TuitionPayment from './pages/TuitionPayment/TuitionPayment';
import { isAuthenticated } from './utils/auth';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return isAuthenticated() ? <>{children}</> : <Navigate to="/" replace />;
};

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Login Route */}
                <Route path="/" element={<Login />} />

                {/* Protected Tuition Payment Route */}
                <Route
                    path="/tuition-payment"
                    element={
                        <ProtectedRoute>
                            <TuitionPayment />
                        </ProtectedRoute>
                    }
                />

                {/* Redirect any unknown routes to login */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;