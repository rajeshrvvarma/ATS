import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, login as svcLogin, logout as svcLogout, isAuthenticated } from '@/services/authService.js';

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const u = getCurrentUser();
        if (u) setUser(u);
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const result = await svcLogin(email, password);
        if (result?.user) setUser(result.user);
        return result;
    };

    const logout = () => {
        svcLogout();
        setUser(null);
    };

    const value = useMemo(() => ({ user, loading, login, logout, isAuthenticated: isAuthenticated() }), [user, loading]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}


