/**
 * NotificationInitializer - Handles notification service initialization for authenticated users
 */

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import notificationService from '@/services/notificationService.js';

const NotificationInitializer = () => {
    const { user } = useAuth();

    useEffect(() => {
        const initNotifications = async () => {
            if (user?.uid) {
                try {
                    console.log('🔔 Initializing notification service for user:', user.uid);
                    await notificationService.initialize(user.uid);
                    console.log('✅ Notification service initialized successfully');
                } catch (error) {
                    console.error('❌ Failed to initialize notification service:', error);
                    // Don't throw error to avoid breaking the app
                }
            } else {
                console.log('👤 No authenticated user, skipping notification initialization');
            }
        };

        initNotifications();
    }, [user?.uid]); // Re-initialize when user changes

    // This component doesn't render anything
    return null;
};

export default NotificationInitializer;
