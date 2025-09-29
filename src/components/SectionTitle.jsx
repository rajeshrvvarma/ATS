import React from 'react';

export default function SectionTitle({ children, className = '' }) {
    return (
        <h2 className={`text-3xl md:text-4xl font-bold text-center text-white mb-12 ${className}`}>{children}</h2>
    );
}

