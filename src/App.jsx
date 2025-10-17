const CourseBuilder = React.lazy(() => import('@/pages/CourseBuilder.jsx'));
import React, { Suspense, useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from '@/context/AuthContext.jsx';
import { CourseAccessProvider } from '@/context/SafeCourseAccessContext.jsx';
import { AccessControlProvider } from '@/context/AccessControlContext.jsx';
import { ToastProvider } from '@/context/ToastContext.jsx';
import ToastContainer from '@/components/ToastContainer.jsx';
import { ThemeProvider } from '@/context/ThemeContext.jsx';
import { SettingsProvider } from '@/context/SettingsContext.jsx';
import SettingsDrawer from '@/components/SettingsDrawer.jsx';
import WhatsAppWidget from '@/components/WhatsAppWidget.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import DashboardRouter from '@/components/DashboardRouter.jsx';
import notificationService from '@/services/notificationService.js';
import NotificationInitializer from '@/components/NotificationInitializer.jsx';

// Layout
import AnnouncementBanner from '@/components/AnnouncementBanner.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

// Lazy-loaded pages
const HomePage = React.lazy(() => import('@/pages/HomePage.jsx'));
const BootcampPage = React.lazy(() => import('@/pages/BootcampPage.jsx'));
// Landing pages archived - content moved to Events & Batches and Premium Courses
const TechnologyTrainingLandingPage = React.lazy(() => import('@/pages/TechnologyTrainingLandingPage.jsx'));
const CollegeTrainingLandingPage = React.lazy(() => import('@/pages/CollegeTrainingLandingPage.jsx'));
// Module pages archived - focusing on premium courses only
const TermsPage = React.lazy(() => import('@/pages/TermsPage.jsx'));
const DisclaimerPage = React.lazy(() => import('@/pages/DisclaimerPage.jsx'));
const AccountActivationPage = React.lazy(() => import('@/pages/AccountActivationPage.jsx'));
const PaymentSuccessPage = React.lazy(() => import('@/pages/PaymentSuccessPage.jsx'));
const PaymentFailedPage = React.lazy(() => import('@/pages/PaymentFailedPage.jsx'));
const CancellationRefundPage = React.lazy(() => import('@/pages/CancellationRefundPage.jsx'));
const ShippingPage = React.lazy(() => import('@/pages/ShippingPage.jsx'));
const PrivacyPage = React.lazy(() => import('@/pages/PrivacyPage.jsx'));
const ContactUsPage = React.lazy(() => import('@/pages/ContactUsPage.jsx'));
const EnrollUsPage = React.lazy(() => import('@/pages/EnrollUsPage.jsx'));
const LearningManagementSystemPage = React.lazy(() => import('@/pages/LearningManagementSystemPage.jsx'));
const StudentDashboard = React.lazy(() => import('@/pages/StudentDashboard.jsx'));
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard.jsx'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage.jsx'));
const TrainerSignUp = React.lazy(() => import('@/pages/TrainerSignUp.jsx'));
const Profile = React.lazy(() => import('@/pages/Profile.jsx'));
const QuizLibrary = React.lazy(() => import('@/components/QuizLibrary.jsx'));
const EventsBatchesPage = React.lazy(() => import('@/pages/UpcomingBatchesPage.jsx'));

// Course Pages
const DefensiveSecurityProfessional = React.lazy(() => import('@/pages/courses/DefensiveSecurityProfessional.jsx'));
const OffensiveSecurityMastery = React.lazy(() => import('@/pages/courses/OffensiveSecurityMastery.jsx'));
const MultiCloudDevOpsMastery = React.lazy(() => import('@/pages/courses/MultiCloudDevOpsMastery.jsx'));
const MERNStackDeveloper = React.lazy(() => import('@/pages/courses/MERNStackDeveloper.jsx'));
const FullStackPythonDeveloper = React.lazy(() => import('@/pages/courses/FullStackPythonDeveloper.jsx'));
const DataScienceAI = React.lazy(() => import('@/pages/courses/DataScienceAI.jsx'));
const AWSCloudEngineer = React.lazy(() => import('@/pages/courses/AWSCloudEngineer.jsx'));
const SoftwareTestingQA = React.lazy(() => import('@/pages/courses/SoftwareTestingQA.jsx'));

/**
 * App.jsx is the root component of the application.
 * It acts as a simple router to manage which "page" is currently visible.
 */
export default function App() {
    const navigate = useNavigate();
    const location = useLocation();

    const pageToPath = useMemo(() => ({
        home: '/',
        defensiveBootcamp: '/bootcamp/defensive',
        offensiveBootcamp: '/bootcamp/offensive',
        // Landing pages archived - content moved to Events & Batches
        technologyTraining: '/technology-academy',
        collegeTraining: '/college-bulk-training',
        'upcoming-batches': '/upcoming-batches',
        'events-batches': '/events-batches',
        terms: '/terms',
        disclaimer: '/disclaimer',
        'accountActivation-defensive': '/activate/defensive',
        'accountActivation-offensive': '/activate/offensive',
        accountActivation: '/activate',
        paymentSuccess: '/payment/success',
        paymentFailed: '/payment/failed',
        cancellationRefund: '/cancellation-refund',
        shipping: '/shipping',
        privacy: '/privacy',
        contact: '/contact',
        enroll: '/enroll',
    profile: '/profile',
    dashboard: '/dashboard',
    admin: '/admin',
    login: '/login',
    'trainer-signup': '/trainer-signup',
    // Module routes archived
    courseBuilder: '/course-builder',
    }), []);

    const pathToPage = useMemo(() => ({
        '/': 'home',
        '/bootcamp/defensive': 'defensiveBootcamp',
        '/bootcamp/offensive': 'offensiveBootcamp',
        // Landing pages archived - redirecting to events-batches
        '/technology-academy': 'technologyTraining',
        '/college-bulk-training': 'collegeTraining',
        '/upcoming-batches': 'upcoming-batches',
        '/events-batches': 'events-batches',
        '/terms': 'terms',
        '/disclaimer': 'disclaimer',
        '/activate/defensive': 'accountActivation-defensive',
        '/activate/offensive': 'accountActivation-offensive',
        '/activate': 'accountActivation',
        '/payment/success': 'paymentSuccess',
        '/payment/failed': 'paymentFailed',
        '/cancellation-refund': 'cancellationRefund',
        '/shipping': 'shipping',
        '/privacy': 'privacy',
        '/contact': 'contact',
    '/enroll': 'enroll',
    '/profile': 'profile',
    '/dashboard': 'dashboard',
    '/admin': 'admin',
    '/login': 'login',
    '/trainer-signup': 'trainer-signup',
    // Module routes archived
    '/course-builder': 'courseBuilder',
    }), []);

    const currentPage = pathToPage[location.pathname] || 'home';

    // Simplified navigation function
    const go = (pageKey, params = {}) => {
        // Handle navigation with query parameters (e.g., "video-learning?course=xyz")
        if (typeof pageKey === 'string' && pageKey.includes('?')) {
            const [key, queryString] = pageKey.split('?');
            const path = pageToPath[key] || '/';
            navigate(`${path}?${queryString}`);
        } else {
            const path = pageToPath[pageKey] || '/';
            navigate(path);
        }
    };

    return (
        <AuthProvider>
        <AccessControlProvider>
        <CourseAccessProvider>
        <ThemeProvider>
        <SettingsProvider>
        <ToastProvider>
        <div className="min-h-screen bg-slate-900 antialiased">
                {/* Initialize notification service for authenticated users */}
                <NotificationInitializer />

                <AnnouncementBanner onNavigate={go} />
                <Header onNavigate={go} currentPage={currentPage} />
            <main>
                    <Suspense fallback={
                        <div className="loading">
                            <div style={{textAlign: 'center'}}>
                                <div style={{fontSize: '1.5rem', marginBottom: '1rem'}}>⚡</div>
                                <div>Loading...</div>
                            </div>
                        </div>
                    }>
                        <AnimatePresence mode="wait">
                        <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                        <Routes>
                            <Route path="/course-builder" element={<CourseBuilder />} />
                            <Route path="/" element={<HomePage onNavigate={go} />} />
                            <Route path="/workshop" element={<Navigate to="/events-batches" replace />} />
                            <Route path="/bootcamp/defensive" element={<BootcampPage onNavigate={go} type="defensive" />} />
                            <Route path="/bootcamp/offensive" element={<BootcampPage onNavigate={go} type="offensive" />} />
                            {/* Landing pages archived - redirect to events-batches */}
                            <Route path="/defensive-security-bootcamp" element={<Navigate to="/events-batches" replace />} />
                            <Route path="/defensive-security-mastery" element={<Navigate to="/" replace />} />
                            <Route path="/ethical-hacking-bootcamp" element={<Navigate to="/events-batches" replace />} />
                            <Route path="/offensive-security-mastery" element={<Navigate to="/" replace />} />
                            <Route path="/specialized-courses" element={<Navigate to="/" replace />} />
                            <Route path="/technology-training" element={<Navigate to="/technology-academy" replace />} />
                            <Route path="/technology-academy" element={<TechnologyTrainingLandingPage onNavigate={go} />} />
                            <Route path="/college-bulk-training" element={<CollegeTrainingLandingPage onNavigate={go} />} />
                            <Route path="/events-batches" element={<EventsBatchesPage onNavigate={go} />} />

                            {/* Course Pages */}
                            <Route path="/courses/defensive-security-professional" element={<DefensiveSecurityProfessional onNavigate={go} />} />
                            <Route path="/courses/offensive-security-mastery" element={<OffensiveSecurityMastery onNavigate={go} />} />
                            <Route path="/courses/multi-cloud-devops-mastery" element={<MultiCloudDevOpsMastery onNavigate={go} />} />
                            <Route path="/courses/mern-stack-developer" element={<MERNStackDeveloper onNavigate={go} />} />
                            <Route path="/courses/fullstack-python-developer" element={<FullStackPythonDeveloper onNavigate={go} />} />
                            <Route path="/courses/data-science-ai" element={<DataScienceAI onNavigate={go} />} />
                            <Route path="/courses/aws-cloud-engineer" element={<AWSCloudEngineer onNavigate={go} />} />
                            <Route path="/courses/software-testing-qa" element={<SoftwareTestingQA onNavigate={go} />} />

                            <Route path="/terms" element={<TermsPage onNavigate={go} />} />
                            <Route path="/disclaimer" element={<DisclaimerPage onNavigate={go} />} />
                            <Route path="/activate/defensive" element={<AccountActivationPage onNavigate={go} planType="defensiveBootcamp" />} />
                            <Route path="/activate/offensive" element={<AccountActivationPage onNavigate={go} planType="offensiveBootcamp" />} />
                            <Route path="/activate" element={<AccountActivationPage onNavigate={go} planType="defensiveBootcamp" />} />
                            <Route path="/payment/success" element={<PaymentSuccessPage onNavigate={go} />} />
                            <Route path="/payment/failed" element={<PaymentFailedPage onNavigate={go} />} />
                            <Route path="/cancellation-refund" element={<CancellationRefundPage onNavigate={go} />} />
                            <Route path="/shipping" element={<ShippingPage onNavigate={go} />} />
                            <Route path="/privacy" element={<PrivacyPage onNavigate={go} />} />
                            <Route path="/contact" element={<ContactUsPage onNavigate={go} />} />
                            <Route path="/enroll" element={<EnrollUsPage onNavigate={go} />} />
                            <Route path="/video-learning" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/profile" element={<ProtectedRoute roles={['student','instructor','admin']}><Profile onNavigate={go} /></ProtectedRoute>} />
                            <Route path="/quiz-library" element={<QuizLibrary onClose={() => go('/dashboard')} />} />
                            <Route path="/dashboard" element={<DashboardRouter onNavigate={go} />} />
                            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard onNavigate={go} /></ProtectedRoute>} />
                            <Route path="/login" element={<LoginPage onNavigate={go} onLogin={() => {}} />} />
                            <Route path="/trainer-signup" element={<TrainerSignUp onNavigate={go} />} />
                            {/* Module routes archived - premium courses only */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                        </motion.div>
                        </AnimatePresence>
                    </Suspense>
            </main>
                <Footer onNavigate={go} />
                <ToastContainer />
                <SettingsDrawer />
                <WhatsAppWidget />
        </div>
        </ToastProvider>
        </SettingsProvider>
        </ThemeProvider>
        </CourseAccessProvider>
        </AccessControlProvider>
        </AuthProvider>
    );
}

