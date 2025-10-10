import React, { useState, useEffect } from 'react';
import { Linkedin, Youtube, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

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
                const [{ initializeApp, getApps, getApp }, { getAuth, signInAnonymously }, { getFirestore, doc, onSnapshot, runTransaction, serverTimestamp }] = await firebasePromise;

                // Prevent duplicate app initialization
                let app;
                try {
                    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
                } catch (error) {
                    // If app already exists with different config, use existing
                    app = getApp();
                }
                
                const auth = getAuth(app);
                const db = getFirestore(app);

                // Try anonymous authentication with error handling
                try {
                    await signInAnonymously(auth);
                    console.log('Firebase: Anonymous authentication successful');
                } catch (authError) {
                    console.warn('Firebase: Anonymous authentication failed:', authError.message);
                    // Continue without authentication - Firestore might still work with public rules
                }
                
                const appId = "ATStatic"; // Using the repo name as the App ID for consistency
                const counterRef = doc(db, `artifacts/${appId}/public/data/siteStats`, 'visits');

                const hasVisited = sessionStorage.getItem('agnidhra-site-visited');

                try {
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
                        console.log('Firebase: Visit count updated successfully');
                    }

                    const unsubscribe = onSnapshot(counterRef, (docSnap) => {
                        if (docSnap.exists()) {
                            setVisitCount(docSnap.data().count.toLocaleString());
                        } else {
                            setVisitCount('1');
                        }
                    }, (error) => {
                        console.warn("Firebase: Error fetching visit count:", error.message);
                        setVisitCount('N/A');
                    });

                    return () => unsubscribe();
                } catch (firestoreError) {
                    console.warn('Firebase: Firestore operations failed:', firestoreError.message);
                    setVisitCount('N/A');
                }

            } catch (error) {
                console.error("Firebase initialization or counter error:", error);
                setVisitCount('N/A');
            }
        };

        initAndCount();

    }, []);

    return (
        <footer className="text-slate-400 py-16 relative overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-purple-900/20"></div>
                
                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-indigo-400 rounded-full opacity-70"
                            initial={{
                                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                                y: Math.random() * 600,
                                opacity: Math.random() * 0.7
                            }}
                            animate={{
                                y: [null, -100, -200],
                                opacity: [null, 0.7, 0]
                            }}
                            transition={{
                                duration: 8 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 4
                            }}
                        />
                    ))}
                </div>

                {/* Floating geometric shapes */}
                <div className="absolute inset-0 opacity-5">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-32 h-32 bg-indigo-400 rounded-full blur-3xl"
                            initial={{
                                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                                y: Math.random() * 400,
                            }}
                            animate={{
                                x: [null, Math.random() * 300 - 150],
                                y: [null, Math.random() * 200 - 100],
                            }}
                            transition={{
                                duration: 20 + Math.random() * 10,
                                repeat: Infinity,
                                repeatType: 'reverse',
                                delay: Math.random() * 6
                            }}
                        />
                    ))}
                </div>
            </div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Column 1: Company Info */}
                    <div className="md:col-span-2">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mr-4">
                                <img src="/logo.png" alt="AT Logo" className="w-10 h-10 rounded-full"/>
                            </div>
                            <span className="text-2xl font-bold text-white">Agnidhra Technologies</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
                            Empowering the next wave of cybersecurity professionals with practical, 
                            hands-on training in high-demand skills.
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <a 
                                href="https://www.linkedin.com/company/agnidhra-technologies" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="LinkedIn" 
                                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                            >
                                <Linkedin size={20} />
                            </a>
                            <a 
                                href="https://www.youtube.com/@agnidhra-technologies" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="YouTube" 
                                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                            >
                                <Youtube size={20} />
                            </a>
                            <a 
                                href="https://www.instagram.com/agnidhra_technologies/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Instagram" 
                                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
                            >
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Programs */}
                    <div>
                        <h4 className="font-bold text-lg text-white mb-6 flex items-center">
                            <div className="w-1 h-6 bg-blue-500 mr-3"></div>
                            Programs
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <button 
                                    onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })} 
                                    className="hover:text-blue-400 transition-colors duration-200 text-left"
                                >
                                    Defensive Security
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })} 
                                    className="hover:text-blue-400 transition-colors duration-200 text-left"
                                >
                                    Offensive Security
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })} 
                                    className="hover:text-blue-400 transition-colors duration-200 text-left"
                                >
                                    Cloud Security
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => onNavigate('workshop')} 
                                    className="hover:text-blue-400 transition-colors duration-200 text-left"
                                >
                                    Free Workshop
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => onNavigate('video-learning')} 
                                    className="hover:text-blue-400 transition-colors duration-200 text-left"
                                >
                                    Video Learning
                                </button>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Column 3: Legal & Support */}
                    <div>
                        <h4 className="font-bold text-lg text-white mb-6 flex items-center">
                            <div className="w-1 h-6 bg-purple-500 mr-3"></div>
                            Legal & Support
                        </h4>
                        <ul className="space-y-3">
                           <li>
                               <button 
                                   onClick={() => onNavigate('terms')} 
                                   className="hover:text-blue-400 transition-colors duration-200 text-left"
                               >
                                   Terms & Conditions
                               </button>
                           </li>
                           <li>
                               <button 
                                   onClick={() => onNavigate('privacy')} 
                                   className="hover:text-blue-400 transition-colors duration-200 text-left"
                               >
                                   Privacy Policy
                               </button>
                           </li>
                           <li>
                               <button 
                                   onClick={() => onNavigate('cancellationRefund')} 
                                   className="hover:text-blue-400 transition-colors duration-200 text-left"
                               >
                                   Refund Policy
                               </button>
                           </li>
                           <li>
                               <button 
                                   onClick={() => onNavigate('contact')} 
                                   className="hover:text-blue-400 transition-colors duration-200 text-left"
                               >
                                   Contact Us
                               </button>
                           </li>
                           <li>
                               <button 
                                   onClick={() => onNavigate('disclaimer')} 
                                   className="hover:text-blue-400 transition-colors duration-200 text-left"
                               >
                                   Disclaimer
                               </button>
                           </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500">
                        &copy; {new Date().getFullYear()} Agnidhra Technologies. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-2 text-slate-500">
                        <div className="flex items-center gap-2">
                            <span className="animate-pulse inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                            <span className="text-sm">Site Visitors: {visitCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

