import React, { useState, useEffect } from 'react';
import { Linkedin, Youtube, Instagram } from 'lucide-react';

// NOTE: The Firebase logic remains the same. The only changes are to the layout (JSX).

// It's a good practice to lazy-load Firebase to improve initial page load speed.
// This means Firebase code is only downloaded when the footer component is actually rendered.
const firebasePromise = Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore')
]);

export default function Footer({ onNavigate }) {
    const [visitCount, setVisitCount] = useState('...');

    useEffect(() => {
        const initAndCount = async () => {
            try {
                // Read the Firebase config from the Netlify environment variable
                const firebaseConfigStr = import.meta.env.VITE_FIREBASE_CONFIG;
                if (!firebaseConfigStr) {
                    console.error("Firebase config environment variable is not set.");
                    setVisitCount('N/A');
                    return;
                }
                const firebaseConfig = JSON.parse(firebaseConfigStr);

                // Use the lazy-loaded Firebase modules
                const [{ initializeApp }, { getAuth, signInAnonymously }, { getFirestore, doc, onSnapshot, runTransaction, serverTimestamp }] = await firebasePromise;

                const app = initializeApp(firebaseConfig);
                const auth = getAuth(app);
                const db = getFirestore(app);

                await signInAnonymously(auth);
                
                const appId = "ATStatic"; // Using the repo name as the App ID for consistency
                const counterRef = doc(db, `artifacts/${appId}/public/data/siteStats`, 'visits');

                const hasVisited = sessionStorage.getItem('agnidhra-site-visited');

                if (!hasVisited) {
                    await runTransaction(db, async (transaction) => {
                        const docSnap = await transaction.get(counterRef);
                        if (!docSnap.exists()) {
                            transaction.set(counterRef, { count: 1, lastUpdated: serverTimestamp() });
                        } else {
                            const newCount = docSnap.data().count + 1;
                            transaction.update(counterRef, { count: newCount, lastUpdated: serverTimestamp() });
                        }
                    });
                    sessionStorage.setItem('agnidhra-site-visited', 'true');
                }

                const unsubscribe = onSnapshot(counterRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setVisitCount(docSnap.data().count.toLocaleString());
                    } else {
                        setVisitCount('1');
                    }
                }, (error) => {
                    console.error("Error fetching visit count:", error);
                    setVisitCount('N/A');
                });

                return () => unsubscribe();

            } catch (error) {
                console.error("Firebase initialization or counter error:", error);
                setVisitCount('N/A');
            }
        };

        initAndCount();

    }, []);

    return (
        <footer className="bg-slate-900 text-slate-400 py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: Logo and Brand */}
                    <div className="col-span-1 md:col-span-2 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start mb-4">
                            <img src="/logo.png" alt="Agnidhra Technologies Logo" className="w-10 h-10 rounded-full mr-3"/>
                            <span className="text-xl font-bold text-white">Agnidhra Technologies</span>
                        </div>
                        <p className="max-w-md mx-auto md:mx-0">Empowering the next wave of tech leaders with practical, hands-on training in high-demand skills.</p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-sky-400 transition-colors">About Us</button></li>
                            <li><button onClick={() => document.getElementById('offerings')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-sky-400 transition-colors">Our Offerings</button></li>
                            <li><button onClick={() => document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-sky-400 transition-colors">Admissions</button></li>
                            <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-sky-400 transition-colors">Contact</button></li>
                        </ul>
                    </div>
                    
                    {/* Column 3: Connect and Legal */}
                    <div>
                        <h4 className="font-bold text-lg text-white mb-4">Connect</h4>
                        <div className="flex justify-center md:justify-start space-x-4 mb-6">
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-sky-400 transition-colors"><Linkedin size={24} /></a>
                            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-sky-400 transition-colors"><Youtube size={24} /></a>
                            <a href="https://www.instagram.com/agnidhra_technologies/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-sky-400 transition-colors"><Instagram size={24} /></a>
                        </div>
                        <ul className="space-y-2">
                           <li><button onClick={() => onNavigate('terms')} className="hover:text-sky-400 transition-colors">Terms & Conditions</button></li>
                           <li><button onClick={() => onNavigate('disclaimer')} className="hover:text-sky-400 transition-colors">Disclaimer</button></li>
                        </ul>
                    </div>
                </div>

                {/* --- THIS IS THE UPDATED SECTION --- */}
                {/* Bottom Bar: Copyright and Visitor Counter */}
                <div className="mt-8 border-t border-slate-700 pt-8 text-center text-slate-500 flex flex-col items-center gap-2">
                    <p>&copy; {new Date().getFullYear()} Agnidhra Technologies. All Rights Reserved.</p>
                    <div className="flex items-center gap-2">
                        <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-green-500 opacity-75"></span>
                        <span>Site Visitors: {visitCount}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

