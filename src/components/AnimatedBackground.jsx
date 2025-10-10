
import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Enhanced Animated Background Component for Landing Pages
const AnimatedBackground = ({ variant = 'default', children, className = '' }) => {

    // Adaptive particle count based on device
    // Use higher particle counts and higher opacity for all variants
    const variants = {
        default: {
            gradient: 'bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950',
            overlay: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-red-900/20',
            particles: { color: 'bg-blue-400', count: 40 }
        },
        bootcamp: {
            gradient: 'bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900',
            overlay: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-800/25 via-purple-800/10 to-transparent',
            particles: { color: 'bg-blue-400', count: 44 }
        },
        premium: {
            gradient: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-950',
            overlay: 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-700/25 via-indigo-800/15 to-transparent',
            particles: { color: 'bg-purple-400', count: 48 }
        },
        specialized: {
            gradient: 'bg-gradient-to-br from-emerald-900 via-teal-900 to-blue-950',
            overlay: 'bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-800/25 via-teal-800/15 to-transparent',
            particles: { color: 'bg-emerald-400', count: 40 }
        },
        offensive: {
            gradient: 'bg-gradient-to-br from-red-900 via-orange-900 to-slate-900',
            overlay: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-800/25 via-orange-800/15 to-transparent',
            particles: { color: 'bg-red-400', count: 50 }
        },
        workshop: {
            gradient: 'bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950',
            overlay: 'bg-[radial-gradient(ellipse_at_top_center,_var(--tw-gradient-stops))] from-cyan-800/25 via-blue-800/15 to-transparent',
            particles: { color: 'bg-cyan-400', count: 36 }
        },
        contact: {
            gradient: 'bg-gradient-to-br from-slate-900 via-green-950 to-blue-950',
            overlay: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-blue-900/20',
            particles: { color: 'bg-green-400', count: 40 }
        },
        success: {
            gradient: 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-950',
            overlay: 'bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-800/25 via-emerald-800/15 to-transparent',
            particles: { color: 'bg-green-400', count: 36 }
        },
        error: {
            gradient: 'bg-gradient-to-br from-red-900 via-pink-900 to-slate-950',
            overlay: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-800/25 via-pink-800/15 to-transparent',
            particles: { color: 'bg-red-400', count: 32 }
        }
    };

    // Fallback: If variant is not found, use 'default' style
    const currentVariant = Object.prototype.hasOwnProperty.call(variants, variant) ? variants[variant] : variants.default;
    // Use static, higher particle count for all variants
    const particleCount = currentVariant.particles.count;
    // Old animation: random movement, more visible
    const particles = Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
            key={i}
            className={`absolute w-2 h-2 ${currentVariant.particles.color} rounded-full`}
            initial={{
                x: Math.random() * 1200,
                y: Math.random() * 800,
                opacity: 0.7 + Math.random() * 0.25
            }}
            animate={{
                x: [null, Math.random() * 1200],
                y: [null, Math.random() * 800],
                opacity: [null, 0.85 + Math.random() * 0.15]
            }}
            transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: Math.random() * 4
            }}
        />
    ));

    // Geometric shapes (blurred, random movement, more visible)
    const shapes = Array.from({ length: Math.ceil(particleCount / 4) }).map((_, i) => (
        <motion.div
            key={i}
            className={`absolute w-24 h-24 ${currentVariant.particles.color} rounded-full blur-xl`}
            style={{ opacity: 0.18 + Math.random() * 0.12, zIndex: 1 }}
            initial={{
                x: Math.random() * 1200,
                y: Math.random() * 800,
            }}
            animate={{
                x: [null, Math.random() * 1200],
                y: [null, Math.random() * 800],
                rotate: [null, Math.random() * 360]
            }}
            transition={{
                duration: 18 + Math.random() * 8,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: Math.random() * 6
            }}
        />
    ));

    // Network lines (static, for tech look)
    const lines = Array.from({ length: 3 }).map((_, i) => (
        <motion.div
            key={i}
            className={`absolute h-px ${currentVariant.particles.color}`}
            style={{
                width: '300px',
                top: `${20 + i * 30}%`,
                left: `${10 + i * 25}%`,
                transform: 'rotate(45deg)',
                zIndex: 0,
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
    ));

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ minHeight: 400 }}>
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none select-none">
                <div className={`absolute inset-0 ${currentVariant.gradient}`}></div>
                <div className={`absolute inset-0 ${currentVariant.overlay}`}></div>
                {particles}
                {shapes}
                {lines}
            </div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default AnimatedBackground;