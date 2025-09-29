import React from 'react';
import { ArrowLeft } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';

const LegalPage = ({ onNavigate, title, children }) => (
    <div className="bg-slate-900 text-white min-h-screen">
        <div className="container mx-auto px-6 py-12 md:py-20">
            <button onClick={() => onNavigate('home')} className="flex items-center text-sky-400 hover:text-sky-300 transition-colors mb-8"><ArrowLeft size={20} className="mr-2" />Back to Home</button>
            <SectionTitle className="!mb-4">{title}</SectionTitle>
            <p className="text-center text-slate-400 mb-12">Last updated: September 29, 2025</p>
            <div className="max-w-3xl mx-auto bg-slate-800 p-8 md:p-12 rounded-lg border border-slate-700 text-slate-300 space-y-6">{children}</div>
        </div>
    </div>
);

export default function DisclaimerPage({ onNavigate }) {
    return (
        <LegalPage onNavigate={onNavigate} title="Disclaimer">
            <p>The information provided by Agnidhra Technologies on this website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
            <h3 className="text-xl font-bold text-sky-400 pt-4">Professional Disclaimer</h3><p>The website cannot and does not contain financial or career advice. The information is provided for educational and informational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of career or employment guarantee.</p>
            <h3 className="text-xl font-bold text-sky-400 pt-4">External Links Disclaimer</h3><p>The site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.</p>
        </LegalPage>
    );
}

