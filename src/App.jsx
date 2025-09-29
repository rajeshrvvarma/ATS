import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import FreeWorkshopPage from './pages/WorkshopPage.jsx';
import BootcampPage from './pages/BootcampPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import DisclaimerPage from './pages/DisclaimerPage.jsx';

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

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
            <Header onNavigate={setCurrentPage} currentPage={currentPage} />
            <main>
                {renderPage()}
            </main>
            <Footer onNavigate={setCurrentPage} />
        </div>
    );
}

