
import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Enhanced Animated Background Component for Landing Pages
const AnimatedBackground = ({ variant = 'default', children, className = '' }) => {

    // Adaptive particle count based on device
    function getAdaptiveCount(base) {
        if (window.deviceMemory && window.deviceMemory <= 2) return Math.max(18, Math.floor(base * 0.5));
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return Math.max(18, Math.floor(base * 0.5));
        if (/Mobi|Android/i.test(navigator.userAgent)) return Math.max(22, Math.floor(base * 0.7));
        return Math.floor(base * 2.2); // Full enhancement: 2x+ particles
    }
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
    // Adaptive particle count
    const [particleCount, setParticleCount] = useState(() => getAdaptiveCount(currentVariant.particles.count));
    // Mouse position state (throttled)
    const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
    const containerRef = useRef(null);
    // Throttle mousemove to 30fps
    useEffect(() => {
        let last = 0;
        const handleMove = (e) => {
            const now = Date.now();
            if (now - last < 33) return;
            last = now;
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            let x, y;
            if (e.touches && e.touches.length > 0) {
                x = (e.touches[0].clientX - rect.left) / rect.width;
                y = (e.touches[0].clientY - rect.top) / rect.height;
            } else {
                x = (e.clientX - rect.left) / rect.width;
                y = (e.clientY - rect.top) / rect.height;
            }
            setMouse({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
        };
        const ref = containerRef.current;
        if (ref) {
            ref.addEventListener('mousemove', handleMove);
            ref.addEventListener('touchmove', handleMove);
        }
        return () => {
            if (ref) {
                ref.removeEventListener('mousemove', handleMove);
                ref.removeEventListener('touchmove', handleMove);
            }
        };
    }, []);

    // Animate particles to follow mouse
    const particles = Array.from({ length: particleCount }).map((_, i) => {
        // Spread particles in a grid, then offset by mouse
        const angle = (i / particleCount) * 2 * Math.PI;
        const radius = 180 + 80 * Math.sin(i * 1.7);
        // Mouse offset
        const mx = (mouse.x - 0.5) * 600;
        const my = (mouse.y - 0.5) * 400;
        // Randomize shape: ball or square
        const isBall = i % 2 === 0;
        return (
            <motion.div
                key={i}
                className={`absolute ${isBall ? 'rounded-full' : 'rounded-md'} ${currentVariant.particles.color}`}
                style={{
                    width: isBall ? 12 : 16,
                    height: isBall ? 12 : 16,
                    opacity: 0.5 + 0.4 * Math.abs(Math.sin(i + mouse.x * 3)),
                    zIndex: 2,
                }}
                animate={{
                    x: 600 + Math.cos(angle) * radius + mx + Math.sin(i + mouse.y * 6) * 30,
                    y: 300 + Math.sin(angle) * radius + my + Math.cos(i + mouse.x * 6) * 30,
                    rotate: isBall ? 0 : (mouse.x * 360 + i * 10),
                    opacity: 0.5 + 0.4 * Math.abs(Math.sin(i + mouse.x * 3)),
                }}
                transition={{
                    type: 'spring',
                    stiffness: 60,
                    damping: 18,
                    mass: 0.7,
                }}
            />
        );
    });

    // Geometric shapes (blurred, follow mouse)
    const shapes = Array.from({ length: Math.ceil(particleCount / 4) }).map((_, i) => {
        const angle = (i / (particleCount / 4)) * 2 * Math.PI;
        const radius = 220 + 60 * Math.cos(i * 2.1);
        return (
            <motion.div
                key={i}
                className={`absolute w-24 h-24 ${currentVariant.particles.color} ${i % 2 === 0 ? 'rounded-full' : 'rounded-md'} blur-xl`}
                style={{ opacity: 0.12 + 0.08 * Math.abs(Math.sin(i + mouse.y * 2)), zIndex: 1 }}
                animate={{
                    x: 600 + Math.cos(angle) * radius + (mouse.x - 0.5) * 300,
                    y: 300 + Math.sin(angle) * radius + (mouse.y - 0.5) * 200,
                    rotate: mouse.x * 360 + i * 20,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 40,
                    damping: 20,
                    mass: 1.2,
                }}
            />
        );
    });

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
        <div className={`relative overflow-hidden ${className}`} ref={containerRef} style={{ minHeight: 400 }}>
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