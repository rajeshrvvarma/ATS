import React from 'react';
import { motion } from 'framer-motion';

// Enhanced Animated Background Component for Landing Pages
const AnimatedBackground = ({ variant = 'default', children, className = '' }) => {
    const variants = {
        default: {
            gradient: 'bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950',
            overlay: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-red-900/20',
            particles: { color: 'bg-blue-400', count: 15 }
        },
        bootcamp: {
            gradient: 'bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900',
            overlay: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-800/25 via-purple-800/10 to-transparent',
            particles: { color: 'bg-blue-400', count: 18 }
        },
        premium: {
            gradient: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-950',
            overlay: 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-700/25 via-indigo-800/15 to-transparent',
            particles: { color: 'bg-purple-400', count: 20 }
        },
        specialized: {
            gradient: 'bg-gradient-to-br from-emerald-900 via-teal-900 to-blue-950',
            overlay: 'bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-800/25 via-teal-800/15 to-transparent',
            particles: { color: 'bg-emerald-400', count: 16 }
        },
        offensive: {
            gradient: 'bg-gradient-to-br from-red-900 via-orange-900 to-slate-900',
            overlay: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-800/25 via-orange-800/15 to-transparent',
            particles: { color: 'bg-red-400', count: 22 }
        },
        workshop: {
            gradient: 'bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950',
            overlay: 'bg-[radial-gradient(ellipse_at_top_center,_var(--tw-gradient-stops))] from-cyan-800/25 via-blue-800/15 to-transparent',
            particles: { color: 'bg-cyan-400', count: 14 }
        },
        contact: {
            gradient: 'bg-gradient-to-br from-slate-900 via-green-950 to-blue-950',
            overlay: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-blue-900/20',
            particles: { color: 'bg-green-400', count: 18 }
        },
        success: {
            gradient: 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-950',
            overlay: 'bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-800/25 via-emerald-800/15 to-transparent',
            particles: { color: 'bg-green-400', count: 16 }
        },
        error: {
            gradient: 'bg-gradient-to-br from-red-900 via-pink-900 to-slate-950',
            overlay: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-800/25 via-pink-800/15 to-transparent',
            particles: { color: 'bg-red-400', count: 12 }
        }
    };

    const currentVariant = variants[variant] || variants.default;

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className={`absolute inset-0 ${currentVariant.gradient}`}></div>
                <div className={`absolute inset-0 ${currentVariant.overlay}`}></div>
                
                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(currentVariant.particles.count)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`absolute w-1 h-1 ${currentVariant.particles.color} rounded-full opacity-70`}
                            initial={{
                                x: Math.random() * 1200, // Fixed width to prevent layout calculation
                                y: Math.random() * 800, // Fixed height to prevent layout calculation
                                opacity: Math.random() * 0.7
                            }}
                            animate={{
                                y: [null, -100, -200],
                                opacity: [null, 0.7, 0],
                                x: [null, Math.random() * 100 - 50]
                            }}
                            transition={{
                                duration: 6 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 3
                            }}
                        />
                    ))}
                </div>

                {/* Floating geometric shapes */}
                <div className="absolute inset-0 opacity-10">
                    {[...Array(Math.ceil(currentVariant.particles.count / 4))].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`absolute w-20 h-20 ${currentVariant.particles.color} rounded-full blur-xl`}
                            initial={{
                                x: Math.random() * 1200, // Fixed width to prevent layout calculation
                                y: Math.random() * 800, // Fixed height to prevent layout calculation
                            }}
                            animate={{
                                x: [null, Math.random() * 200 - 100],
                                y: [null, Math.random() * 200 - 100],
                            }}
                            transition={{
                                duration: 15 + Math.random() * 10,
                                repeat: Infinity,
                                repeatType: 'reverse',
                                delay: Math.random() * 5
                            }}
                        />
                    ))}
                </div>

                {/* Additional network-like connecting lines for tech theme */}
                <div className="absolute inset-0 opacity-5">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`absolute h-px ${currentVariant.particles.color}`}
                            style={{
                                width: '300px',
                                top: `${20 + i * 30}%`,
                                left: `${10 + i * 25}%`,
                                transform: 'rotate(45deg)',
                            }}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 0.3 }}
                            transition={{
                                duration: 3,
                                delay: i * 1,
                                repeat: Infinity,
                                repeatType: 'reverse',
                                repeatDelay: 2
                            }}
                        />
                    ))}
                </div>
            </div>
            
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default AnimatedBackground;