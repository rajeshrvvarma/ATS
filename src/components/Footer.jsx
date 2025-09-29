import React, { useState, useEffect } from 'react';
import { Linkedin, Youtube, Instagram } from 'lucide-react';

// Import Firebase modules. These are required for the site counter.
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, runTransaction, serverTimestamp } from 'firebase/firestore';

export default function Footer({ onNavigate }) {
    // State to hold the visit count. Initialize with a loading indicator.
    const [visitCount, setVisitCount] = useState('...');

    useEffect(() => {
        // This effect runs once when the component mounts to initialize the counter.
        const initAndCount = async () => {
            try {
                // These global variables are provided by the hosting environment.
                const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
                const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
                const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

                if (!firebaseConfig.apiKey) {
                    console.error("Firebase config is missing.");
                    setVisitCount('N/A');
                    return;
                }

                // Initialize Firebase
                const app = initializeApp(firebaseConfig);
                const auth = getAuth(app);
                const db = getFirestore(app);

                // Sign in the user anonymously or with a custom token
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
                
                // Define the path to the counter document in Firestore
                const counterRef = doc(db, `artifacts/${appId}/public/data/siteStats`, 'visits');

                // --- Increment Logic ---
                // We use sessionStorage to count a user only once per browser session.
                const hasVisited = sessionStorage.getItem('agnidhra-site-visited');

                if (!hasVisited) {
                    // Use a transaction to safely create or update the counter.
                    await runTransaction(db, async (transaction) => {
                        const docSnap = await transaction.get(counterRef);
                        if (!docSnap.exists()) {
                            // If the document doesn't exist, create it.
                            transaction.set(counterRef, { count: 1, lastUpdated: serverTimestamp() });
                        } else {
                            // Otherwise, increment the count.
                            const newCount = docSnap.data().count + 1;
                            transaction.update(counterRef, { count: newCount, lastUpdated: serverTimestamp() });
                        }
                    });
                    // Mark this session as counted.
                    sessionStorage.setItem('agnidhra-site-visited', 'true');
                }

                // --- Real-time Listener ---
                // This listens for changes to the counter and updates the UI instantly.
                const unsubscribe = onSnapshot(counterRef, (docSnap) => {
                    if (docSnap.exists()) {
                        // Format the number with commas for better readability
                        setVisitCount(docSnap.data().count.toLocaleString());
                    } else {
                        // If the doc doesn't exist yet, we are visitor #1
                        setVisitCount('1');
                    }
                }, (error) => {
                    console.error("Error fetching visit count:", error);
                    setVisitCount('N/A');
                });

                // The returned function will be called when the component unmounts,
                // cleaning up the listener to prevent memory leaks.
                return () => unsubscribe();

            } catch (error) {
                console.error("Firebase initialization or counter error:", error);
                setVisitCount('N/A');
            }
        };

        initAndCount();

    }, []); // The empty array ensures this effect runs only once.

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
                            <li><button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-sky-400 transition-colors">FAQ</button></li>
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

                {/* Bottom Bar: Copyright and Visitor Counter */}
                <div className="mt-8 border-t border-slate-700 pt-8 text-center text-slate-500 flex flex-col sm:flex-row justify-between items-center">
                    <p>&copy; {new Date().getFullYear()} Agnidhra Technologies. All Rights Reserved.</p>
                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                        <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-green-500 opacity-75"></span>
                        <span>Site Visitors: {visitCount}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

