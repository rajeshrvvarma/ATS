import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
    getCurrentUser,
    loginStudent,
    logoutStudent,
    onAuthStateChange,
    getStudentProfile,
    ROLES
} from '@/services/firebaseAuthService.js';

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to Firebase auth state
        const unsubscribe = onAuthStateChange(async (firebaseUser) => {
            if (firebaseUser) {
                // Try to get extended profile (role, etc.)
                let profile = await getStudentProfile(firebaseUser.uid);
                // If not found, fallback to basic user
                if (!profile) profile = { email: firebaseUser.email, role: ROLES.STUDENT };
                setUser({ ...firebaseUser, ...profile });
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe && unsubscribe();
    }, []);

    // Login for all roles (admin, student, instructor)
    const login = async (email, password) => {
        const result = await loginStudent(email, password);
        if (result?.user) {
            // Get extended profile
            let profile = await getStudentProfile(result.user.uid);
            if (!profile) profile = { email: result.user.email, role: ROLES.STUDENT };
            setUser({ ...result.user, ...profile });
        }
        return result;
    };

    const logout = async () => {
        await logoutStudent();
        setUser(null);
    };

    const isAuthenticated = () => !!user;

    const value = useMemo(() => ({ user, loading, login, logout, isAuthenticated }), [user, loading]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}


