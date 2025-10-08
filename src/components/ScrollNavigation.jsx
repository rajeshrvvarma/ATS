import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const ScrollNavigation = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [showScrollBottom, setShowScrollBottom] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            
            // Show scroll to top button when user has scrolled down
            setShowScrollTop(scrollTop > 300);
            
            // Hide scroll to bottom button when near bottom of page
            setShowScrollBottom(scrollTop < scrollHeight - clientHeight - 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    return (
        <div className="fixed left-6 bottom-6 z-50 flex flex-col gap-3">
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="w-5 h-5" />
                </button>
            )}
            
            {showScrollBottom && (
                <button
                    onClick={scrollToBottom}
                    className="bg-slate-600 hover:bg-slate-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                    aria-label="Scroll to bottom"
                >
                    <ChevronDown className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default ScrollNavigation;