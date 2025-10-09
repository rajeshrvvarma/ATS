/**
 * Authentication Service
 * Handles user authentication, authorization, and security features
 */

// Enhanced user roles and permissions
const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin', // Unified role for admin/instructor/owner
  OWNER: 'admin' // Alias for owner (same permissions as admin)
};

const PERMISSIONS = {
  [ROLES.STUDENT]: [
    'view_courses',
    'enroll_courses',
    'view_progress',
    'download_certificates',
    'update_profile',
    'view_dashboard',
    'track_progress',
    'view_certificates'
  ],
  [ROLES.ADMIN]: [
    // Admin has all permissions (instructor + owner + admin)
    'manage_users',
    'manage_courses', 
    'create_courses',
    'edit_courses',
    'delete_courses',
    'view_students',
    'manage_students',
    'view_analytics',
    'manage_system',
    'view_audit_logs',
    'manage_certificates',
    'grade_assignments',
    'manage_enrollments',
    'view_admin_dashboard',
    'export_data',
    'import_data',
    'manage_settings'
  ]
};

// Mock user data
let currentUser = null;
let sessionToken = null;

/**
 * Login user with email and password
 */
export const login = async (email, password) => {
  try {
    // Mock authentication - in real app, this would call your API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Enhanced mock users (FOR DEVELOPMENT ONLY - REPLACE WITH REAL AUTH IN PRODUCTION)
    // WARNING: These are demo credentials. In production, implement proper authentication
    const mockUsers = [
      { 
        id: 1, 
        email: 'admin@agnidhra.com', 
        password: 'SecureAdmin@2024!', 
        role: ROLES.ADMIN, 
        name: 'Administrator', 
        twoFactorEnabled: false,
        profileImage: null,
        joinDate: '2024-01-01',
        department: 'Administration'
      },
      { 
        id: 2, 
        email: 'owner@agnidhra.com', 
        password: 'OwnerPass@2024!', 
        role: ROLES.ADMIN, 
        name: 'Owner/Instructor', 
        twoFactorEnabled: false,
        profileImage: null,
        joinDate: '2024-01-01',
        department: 'Management'
      },
      { 
        id: 3, 
        email: 'student@agnidhra.com', 
        password: 'StudentDemo@2024!', 
        role: ROLES.STUDENT, 
        name: 'Student User', 
        twoFactorEnabled: false,
        profileImage: null,
        joinDate: '2024-01-15',
        enrollments: [],
        progress: {}
      }
    ];
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Generate session token
    sessionToken = generateSessionToken();
    currentUser = { ...user, password: undefined }; // Remove password from user object
    
    // Save to localStorage
    localStorage.setItem('authToken', sessionToken);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Log login event
    logSecurityEvent('LOGIN', `User ${email} logged in successfully`);
    
    return {
      success: true,
      user: currentUser,
      token: sessionToken
    };
  } catch (error) {
    logSecurityEvent('LOGIN_FAILED', `Failed login attempt for ${email}: ${error.message}`);
    throw error;
  }
};

/**
 * Google OAuth (mock)
 * In production, integrate Firebase/Auth0; here we simulate success
 */
export const loginWithGoogle = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const mockGoogleUser = { id: 4, email: 'google.user@example.com', role: ROLES.STUDENT, name: 'Google User', twoFactorEnabled: false };
  sessionToken = generateSessionToken();
  currentUser = mockGoogleUser;
  localStorage.setItem('authToken', sessionToken);
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  logSecurityEvent('LOGIN_OAUTH', `User ${mockGoogleUser.email} logged in via Google`);
  return { success: true, user: currentUser, token: sessionToken };
};

/**
 * Logout user
 */
export const logout = () => {
  if (currentUser) {
    logSecurityEvent('LOGOUT', `User ${currentUser.email} logged out`);
  }
  
  currentUser = null;
  sessionToken = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  if (!currentUser) {
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      currentUser = JSON.parse(savedUser);
      sessionToken = savedToken;
    }
  }
  
  return currentUser;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const user = getCurrentUser();
  const token = localStorage.getItem('authToken');
  return !!(user && token);
};

/**
 * Check if user has specific permission
 */
export const hasPermission = (permission) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const userPermissions = PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
};

/**
 * Check if user has specific role
 */
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

/**
 * Check if user is admin
 */
export const isAdmin = () => {
  return hasRole(ROLES.ADMIN);
};

/**
 * Check if user is instructor
 */
export const isInstructor = () => {
  return hasRole(ROLES.INSTRUCTOR);
};

/**
 * Check if user is student
 */
export const isStudent = () => {
  return hasRole(ROLES.STUDENT);
};

/**
 * Enable two-factor authentication
 */
export const enableTwoFactor = async (userId, secretKey) => {
  try {
    // Mock 2FA setup - in real app, this would save to database
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (currentUser) {
      currentUser.twoFactorEnabled = true;
      currentUser.twoFactorSecret = secretKey;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      logSecurityEvent('2FA_ENABLED', `User ${currentUser.email} enabled 2FA`);
    }
    
    return { success: true };
  } catch (error) {
    logSecurityEvent('2FA_ENABLE_FAILED', `Failed to enable 2FA for user ${userId}: ${error.message}`);
    throw error;
  }
};

/**
 * Verify two-factor authentication code
 */
export const verifyTwoFactor = async (code) => {
  try {
    // Mock 2FA verification - in real app, this would verify with authenticator
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock valid code
    if (code === '123456') {
      logSecurityEvent('2FA_VERIFIED', `User ${currentUser?.email} verified 2FA code`);
      return { success: true };
    } else {
      logSecurityEvent('2FA_FAILED', `Invalid 2FA code attempt for user ${currentUser?.email}`);
      throw new Error('Invalid verification code');
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Change user password
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    // Mock password validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real app, verify current password with server
    if (currentPassword !== 'current123') {
      throw new Error('Current password is incorrect');
    }
    
    // Update password (in real app, this would be hashed and sent to server)
    logSecurityEvent('PASSWORD_CHANGED', `User ${user.email} changed password`);
    
    return { success: true };
  } catch (error) {
    logSecurityEvent('PASSWORD_CHANGE_FAILED', `Failed password change for user ${currentUser?.email}: ${error.message}`);
    throw error;
  }
};

/**
 * Generate session token
 */
const generateSessionToken = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `sess_${timestamp}_${random}`;
};

/**
 * Log security events
 */
const logSecurityEvent = (event, details) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: navigator.userAgent,
    ip: '127.0.0.1' // Mock IP - in real app, get from request
  };
  
  // Save to localStorage (in real app, send to server)
  const existingLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
  existingLogs.push(logEntry);
  
  // Keep only last 1000 entries
  if (existingLogs.length > 1000) {
    existingLogs.splice(0, existingLogs.length - 1000);
  }
  
  localStorage.setItem('securityLogs', JSON.stringify(existingLogs));
};

/**
 * Get security logs
 */
export const getSecurityLogs = (limit = 50) => {
  const logs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
  return logs.slice(-limit).reverse();
};

/**
 * Get user permissions
 */
export const getUserPermissions = () => {
  const user = getCurrentUser();
  if (!user) return [];
  return PERMISSIONS[user.role] || [];
};

/**
 * Check if user can access admin panel
 */
export const canAccessAdmin = () => {
  return hasPermission('manage_users') || hasPermission('view_analytics');
};

/**
 * Get user role display name
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    [ROLES.STUDENT]: 'Student',
    [ROLES.INSTRUCTOR]: 'Instructor',
    [ROLES.ADMIN]: 'Administrator'
  };
  return roleNames[role] || 'Unknown';
};