import React, { Suspense, useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
// Auth and SafeCourseAccessContext removed for static site simplification
import { ThemeProvider } from '@/context/ThemeContext.jsx';
import WhatsAppWidget from '@/components/WhatsAppWidget.jsx';

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
const CancellationRefundPage = React.lazy(() => import('@/pages/CancellationRefundPage.jsx'));
const ShippingPage = React.lazy(() => import('@/pages/ShippingPage.jsx'));
const PrivacyPage = React.lazy(() => import('@/pages/PrivacyPage.jsx'));
const ContactUsPage = React.lazy(() => import('@/pages/ContactUsPage.jsx'));
// Removed LMS and auth/dashboard pages per request
const Profile = React.lazy(() => import('@/pages/Profile.jsx'));
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
const JavaFullStackDeveloper = React.lazy(() => import('@/pages/courses/JavaFullStackDeveloper.jsx'));
const DevOpsEngineerBootcamp = React.lazy(() => import('@/pages/courses/DevOpsEngineerBootcamp.jsx'));
const AzureCloudSolutions = React.lazy(() => import('@/pages/courses/AzureCloudSolutions.jsx'));
const AIMLEngineer = React.lazy(() => import('@/pages/courses/AIMLEngineer.jsx'));
const BusinessIntelligenceAnalyst = React.lazy(() => import('@/pages/courses/BusinessIntelligenceAnalyst.jsx'));
const ManualTestingSpecialist = React.lazy(() => import('@/pages/courses/ManualTestingSpecialist.jsx'));
const ReactNativeDeveloper = React.lazy(() => import('@/pages/courses/ReactNativeDeveloper.jsx'));
const FlutterAppDeveloper = React.lazy(() => import('@/pages/courses/FlutterAppDeveloper.jsx'));

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
    // removed dashboard/login routes
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
    // Module routes archived
    '/course-builder': 'courseBuilder',
    }), []);

    const currentPage = pathToPage[location.pathname] || 'home';

    // Enhanced navigation function - handles both page keys and direct URL paths
    const go = (pageKey, params = {}) => {
        // Handle direct URL paths (like '/courses/course-name')
        if (typeof pageKey === 'string' && pageKey.startsWith('/')) {
            navigate(pageKey);
            // Ensure scroll to top after navigation
            setTimeout(() => window.scrollTo(0, 0), 100);
            return;
        }

        // Handle navigation with query parameters (e.g., "video-learning?course=xyz")
        if (typeof pageKey === 'string' && pageKey.includes('?')) {
            const [key, queryString] = pageKey.split('?');
            const path = pageToPath[key] || '/';
            navigate(`${path}?${queryString}`);
        } else {
            const path = pageToPath[pageKey] || '/';
            navigate(path);
        }
        // Ensure scroll to top after any navigation
        setTimeout(() => window.scrollTo(0, 0), 100);
    };

    // Scroll to top on route change (handles both programmatic and browser navigation)
    useEffect(() => {
        // Scroll to top immediately
        window.scrollTo(0, 0);

        // Also ensure smooth scroll behavior is reset
        document.documentElement.style.scrollBehavior = 'auto';

        // Re-enable smooth scrolling after a brief delay
        setTimeout(() => {
            document.documentElement.style.scrollBehavior = 'smooth';
        }, 100);
    }, [location.pathname]);

    return (
        <ThemeProvider>
    <div className="min-h-screen bg-slate-900 antialiased">
                {/* Notification system removed */}

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
                            {/* Course builder removed */}
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
                            <Route path="/courses/java-fullstack-developer" element={<JavaFullStackDeveloper onNavigate={go} />} />
                            <Route path="/courses/devops-engineer-bootcamp" element={<DevOpsEngineerBootcamp onNavigate={go} />} />
                            <Route path="/courses/azure-cloud-solutions" element={<AzureCloudSolutions onNavigate={go} />} />
                            <Route path="/courses/ai-ml-engineer" element={<AIMLEngineer onNavigate={go} />} />
                            <Route path="/courses/business-intelligence-analyst" element={<BusinessIntelligenceAnalyst onNavigate={go} />} />
                            <Route path="/courses/manual-testing-specialist" element={<ManualTestingSpecialist onNavigate={go} />} />
                            <Route path="/courses/react-native-developer" element={<ReactNativeDeveloper onNavigate={go} />} />
                            <Route path="/courses/flutter-app-developer" element={<FlutterAppDeveloper onNavigate={go} />} />

                            <Route path="/terms" element={<TermsPage onNavigate={go} />} />
                            <Route path="/disclaimer" element={<DisclaimerPage onNavigate={go} />} />
                            {/* Account activation and payment pages removed */}
                            <Route path="/cancellation-refund" element={<CancellationRefundPage onNavigate={go} />} />
                            <Route path="/shipping" element={<ShippingPage onNavigate={go} />} />
                            <Route path="/privacy" element={<PrivacyPage onNavigate={go} />} />
                            <Route path="/contact" element={<ContactUsPage onNavigate={go} />} />
                            {/* Enroll page removed */}
                            <Route path="/profile" element={<Profile onNavigate={go} />} />
                            {/* Module routes archived - premium courses only */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                        </motion.div>
                        </AnimatePresence>
                    </Suspense>
            </main>
                <Footer onNavigate={go} />
                {/* WhatsApp widget temporarily removed - will be repositioned per page */}
        </div>
    </ThemeProvider>
    );
}

