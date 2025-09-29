import React, { useState, useEffect } from 'react';

// Import all the page and layout components
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import HomePage from '@/pages/HomePage.jsx';
import FreeWorkshopPage from '@/pages/WorkshopPage.jsx';
import BootcampPage from '@/pages/BootcampPage.jsx';
import TermsPage from '@/pages/TermsPage.jsx';
import DisclaimerPage from '@/pages/DisclaimerPage.jsx';

/**
 * App.jsx is the root component of the application.
 * It acts as a simple router to manage which "page" is currently visible.
 */
export default function App() {
    // 'currentPage' state determines which component to render. 'home' is the default.
    const [currentPage, setCurrentPage] = useState('home');

    // This effect runs whenever the currentPage changes, ensuring the user
    // is scrolled to the top of the new page they navigate to.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    // This function acts as a router. Based on the 'currentPage' state,
    // it returns the correct page component to be displayed.
    const renderPage = () => {
        switch (currentPage) {
            case 'workshop':
                return <FreeWorkshopPage onNavigate={setCurrentPage} />;
            case 'defensiveBootcamp':
                return <BootcampPage onNavigate={setCurrentPage} type="defensive" />;
            case 'offensiveBootcamp':
                return <BootcampPage onNavigate={setCurrentPage} type="offensive" />;
            case 'terms':
                return <TermsPage onNavigate={setCurrentPage} />;
            case 'disclaimer':
                return <DisclaimerPage onNavigate={setCurrentPage} />;
            case 'home':
            default:
                return <HomePage onNavigate={setCurrentPage} />;
        }
    };

    return (
        <div className="bg-slate-900 antialiased">
            {/* The Header and Footer wrap the currently active page. */}
            <Header onNavigate={setCurrentPage} currentPage={currentPage} />
            <main>
                {renderPage()}
            </main>
            <Footer onNavigate={setCurrentPage} />
        </div>
    );
}

