
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Enhanced Animated Background Component used site-wide
const AnimatedBackground = ({
    variant = 'default',
    children,
    className = '',
    uniformCount = null, // number: enforce same particle count everywhere
    enableParticles = true,
    enableShapes = true,
    enableLines = true,
    // new: extra symbol toggles
    enableSquares = true,
    enablePlus = true,
    // global speed/intensity controls
    speedMultiplier = 1,
    intensity = 'medium', // 'low' | 'medium' | 'high' | number multiplier
    minHeight = 400
}) => {

    // Adaptive particle count based on device
    // Use higher particle counts and higher opacity for all variants
    const variants = {
        default: {
            gradient: 'bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950',
            overlay: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-red-900/20',
            particles: { color: 'bg-blue-400', count: 40 }
        },
        programs: {
            gradient: 'bg-gradient-to-br from-slate-800 via-blue-900 to-purple-900',
            overlay: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-800/20 via-transparent to-purple-800/20',
            particles: { color: 'bg-blue-400', count: 42 }
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
        testimonials: {
            gradient: 'bg-gradient-to-br from-slate-800 via-purple-900 to-blue-900',
            overlay: 'bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-800/20 via-transparent to-blue-800/20',
            particles: { color: 'bg-purple-400', count: 38 }
        },
        contact: {
            gradient: 'bg-gradient-to-br from-slate-900 via-green-950 to-blue-950',
            overlay: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-blue-900/20',
            particles: { color: 'bg-green-400', count: 40 }
        },
        success: {
            gradient: 'bg-gradient-to-br from-slate-900 via-emerald-950 to-blue-950',
            overlay: 'bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-900/25 via-transparent to-blue-900/20',
            particles: { color: 'bg-emerald-400', count: 36 }
        },
        footer: {
            gradient: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950',
            overlay: 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-purple-900/20',
            particles: { color: 'bg-indigo-400', count: 28 }
        },
        error: {
            gradient: 'bg-gradient-to-br from-red-900 via-pink-900 to-slate-950',
            overlay: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-800/25 via-pink-800/15 to-transparent',
            particles: { color: 'bg-red-400', count: 32 }
        }
    };

    // Fallback: If variant is not found, use 'default' style
    const currentVariant = Object.prototype.hasOwnProperty.call(variants, variant) ? variants[variant] : variants.default;
    // Intensity multiplier
    const intensityMap = { low: 0.75, medium: 1, high: 1.6 };
    const multiplier = typeof intensity === 'number' ? intensity : (intensityMap[intensity] ?? 1);
    // If uniformCount provided, use it for consistency across pages; otherwise scale by intensity
    const particleCount = typeof uniformCount === 'number' ? uniformCount : Math.round(currentVariant.particles.count * multiplier);
    // Old animation: random movement, more visible
    const particles = enableParticles ? Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
            key={`p-${i}`}
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
                duration: (7 + Math.random() * 5) / speedMultiplier,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: Math.random() * 4
            }}
        />
    )) : null;

    // Geometric shapes (blurred, random movement, more visible)
    const shapes = enableShapes ? Array.from({ length: Math.ceil(particleCount / 3.5) }).map((_, i) => (
        <motion.div
            key={`s-${i}`}
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
                duration: (16 + Math.random() * 8) / speedMultiplier,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: Math.random() * 6
            }}
        />
    )) : null;

    // Square glyphs
    const squares = enableSquares ? Array.from({ length: Math.ceil(particleCount / 5) }).map((_, i) => (
        <motion.div
            key={`q-${i}`}
            className={`absolute w-2 h-2 ${currentVariant.particles.color}`}
            style={{ opacity: 0.7, borderRadius: 2 }}
            initial={{ x: Math.random() * 1200, y: Math.random() * 800, rotate: Math.random() * 360 }}
            animate={{
                x: [null, Math.random() * 1200],
                y: [null, Math.random() * 800],
                rotate: [null, Math.random() * 360]
            }}
            transition={{ duration: (10 + Math.random() * 6) / speedMultiplier, repeat: Infinity, repeatType: 'reverse', delay: Math.random() * 5 }}
        />
    )) : null;

    // Plus glyphs
    const pluses = enablePlus ? Array.from({ length: Math.ceil(particleCount / 6) }).map((_, i) => (
        <motion.div key={`plus-${i}`} className="absolute" style={{ opacity: 0.6 }}
            initial={{ x: Math.random() * 1200, y: Math.random() * 800, rotate: 0 }}
            animate={{ x: [null, Math.random() * 1200], y: [null, Math.random() * 800], rotate: [0, 45, 0] }}
            transition={{ duration: (14 + Math.random() * 8) / speedMultiplier, repeat: Infinity, repeatType: 'reverse', delay: Math.random() * 6 }}
        >
            <div className={`absolute ${currentVariant.particles.color}`} style={{ width: 10, height: 2, borderRadius: 2 }}></div>
            <div className={`absolute ${currentVariant.particles.color}`} style={{ width: 2, height: 10, borderRadius: 2, left: 4 }}></div>
        </motion.div>
    )) : null;

    // Network lines (static, for tech look)
    const lines = enableLines ? Array.from({ length: 4 }).map((_, i) => (
        <motion.div
            key={`l-${i}`}
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
                duration: 3 / speedMultiplier,
                delay: i * 1,
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: 2
            }}
        />
    )) : null;

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ minHeight }}>
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none select-none">
                <div className={`absolute inset-0 ${currentVariant.gradient}`}></div>
                <div className={`absolute inset-0 ${currentVariant.overlay}`}></div>
                {particles}
                {shapes}
                {squares}
                {pluses}
                {lines}
            </div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default AnimatedBackground;