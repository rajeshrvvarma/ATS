import React, { Suspense, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from '@/context/AuthContext.jsx';
import { CourseAccessProvider } from '@/context/SafeCourseAccessContext.jsx';
import { ToastProvider } from '@/context/ToastContext.jsx';
import ToastContainer from '@/components/ToastContainer.jsx';
import { ThemeProvider } from '@/context/ThemeContext.jsx';
import { SettingsProvider } from '@/context/SettingsContext.jsx';
import SettingsDrawer from '@/components/SettingsDrawer.jsx';
import WhatsAppWidget from '@/components/WhatsAppWidget.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import DashboardRouter from '@/components/DashboardRouter.jsx';

// Layout
import AnnouncementBanner from '@/components/AnnouncementBanner.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

// Lazy-loaded pages
const HomePage = React.lazy(() => import('@/pages/HomePage.jsx'));
const FreeWorkshopPage = React.lazy(() => import('@/pages/WorkshopPage.jsx'));
const BootcampPage = React.lazy(() => import('@/pages/BootcampPage.jsx'));
const DefensiveBootcampLandingPage = React.lazy(() => import('@/pages/DefensiveBootcampLandingPage.jsx'));
const DefensiveMasteryLandingPage = React.lazy(() => import('@/pages/DefensiveMasteryLandingPage.jsx'));
const OffensiveBootcampLandingPage = React.lazy(() => import('@/pages/OffensiveBootcampLandingPage.jsx'));
const OffensiveMasteryLandingPage = React.lazy(() => import('@/pages/OffensiveMasteryLandingPage.jsx'));
const SpecializedCoursesLandingPage = React.lazy(() => import('@/pages/SpecializedCoursesLandingPage.jsx'));
const TechnologyTrainingLandingPage = React.lazy(() => import('@/pages/TechnologyTrainingLandingPage.jsx'));
const CollegeTrainingLandingPage = React.lazy(() => import('@/pages/CollegeTrainingLandingPage.jsx'));
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
const VideoLearningPage = React.lazy(() => import('@/pages/VideoLearningPage.jsx'));
const StudentDashboard = React.lazy(() => import('@/pages/StudentDashboard.jsx'));
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard.jsx'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage.jsx'));
const QuizLibrary = React.lazy(() => import('@/components/QuizLibrary.jsx'));

/**
 * App.jsx is the root component of the application.
 * It acts as a simple router to manage which "page" is currently visible.
 */
export default function App() {
    const navigate = useNavigate();
    const location = useLocation();

    const pageToPath = useMemo(() => ({
        home: '/',
        workshop: '/workshop',
        defensiveBootcamp: '/bootcamp/defensive',
        offensiveBootcamp: '/bootcamp/offensive',
        defensiveBootcampLanding: '/defensive-security-bootcamp',
        defensiveMastery: '/defensive-security-mastery',
        offensiveBootcampLanding: '/ethical-hacking-bootcamp',
        offensiveMastery: '/offensive-security-mastery',
        specializedCourses: '/specialized-courses',
        technologyTraining: '/technology-training',
        collegeTraining: '/college-bulk-training',
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
        'video-learning': '/video-learning',
        dashboard: '/dashboard',
        admin: '/admin',
        login: '/login',
    }), []);

    const pathToPage = useMemo(() => ({
        '/': 'home',
        '/workshop': 'workshop',
        '/bootcamp/defensive': 'defensiveBootcamp',
        '/bootcamp/offensive': 'offensiveBootcamp',
        '/defensive-security-bootcamp': 'defensiveBootcampLanding',
        '/defensive-security-mastery': 'defensiveMastery',
        '/ethical-hacking-bootcamp': 'offensiveBootcampLanding',
        '/offensive-security-mastery': 'offensiveMastery',
        '/specialized-courses': 'specializedCourses',
        '/technology-training': 'technologyTraining',
        '/college-bulk-training': 'collegeTraining',
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
        '/video-learning': 'video-learning',
        '/dashboard': 'dashboard',
        '/admin': 'admin',
        '/login': 'login',
    }), []);

    const currentPage = pathToPage[location.pathname] || 'home';

    const go = (pageKey) => {
        const path = pageToPath[pageKey] || '/';
        navigate(path);
    };

    return (
        <AuthProvider>
        <CourseAccessProvider>
        <ThemeProvider>
        <SettingsProvider>
        <ToastProvider>
        <div className="bg-slate-900 antialiased">
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
                            <Route path="/" element={<HomePage onNavigate={go} />} />
                            <Route path="/workshop" element={<FreeWorkshopPage onNavigate={go} />} />
                            <Route path="/bootcamp/defensive" element={<BootcampPage onNavigate={go} type="defensive" />} />
                            <Route path="/bootcamp/offensive" element={<BootcampPage onNavigate={go} type="offensive" />} />
                            <Route path="/defensive-security-bootcamp" element={<DefensiveBootcampLandingPage onNavigate={go} />} />
                            <Route path="/defensive-security-mastery" element={<DefensiveMasteryLandingPage onNavigate={go} />} />
                            <Route path="/ethical-hacking-bootcamp" element={<OffensiveBootcampLandingPage onNavigate={go} />} />
                            <Route path="/offensive-security-mastery" element={<OffensiveMasteryLandingPage onNavigate={go} />} />
                            <Route path="/specialized-courses" element={<SpecializedCoursesLandingPage onNavigate={go} />} />
                            <Route path="/technology-training" element={<TechnologyTrainingLandingPage onNavigate={go} />} />
                            <Route path="/college-bulk-training" element={<CollegeTrainingLandingPage onNavigate={go} />} />
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
                            <Route path="/video-learning" element={<ProtectedRoute roles={['student','admin']}><VideoLearningPage onNavigate={go} /></ProtectedRoute>} />
                            <Route path="/quiz-library" element={<QuizLibrary onClose={() => go('/dashboard')} />} />
                            <Route path="/dashboard" element={<DashboardRouter onNavigate={go} />} />
                            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard onNavigate={go} /></ProtectedRoute>} />
                            <Route path="/login" element={<LoginPage onNavigate={go} onLogin={() => {}} />} />
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
        </AuthProvider>
    );
}

