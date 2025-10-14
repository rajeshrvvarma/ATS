import React from 'react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';

export default function TrainerSignUp({ onNavigate }) {
  // Placeholder for Google sign up logic
  const handleGoogleSignUp = () => {
    // TODO: Integrate Google OAuth for trainers
    alert('Google sign up for trainers coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-teal-900 flex items-center justify-center py-12 px-4 relative">
      {/* Floating particles like homepage */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-2 h-2 bg-green-400 rounded-full top-10 left-10 animate-pulse"></div>
        <div className="absolute w-1 h-1 bg-green-300 rounded-full top-32 left-32 animate-pulse delay-100"></div>
        <div className="absolute w-3 h-3 bg-green-500 rounded-full top-64 right-20 animate-pulse delay-200"></div>
        <div className="absolute w-1 h-1 bg-green-400 rounded-full bottom-32 left-20 animate-pulse delay-300"></div>
        <div className="absolute w-2 h-2 bg-green-300 rounded-full bottom-10 right-40 animate-pulse delay-500"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-5xl w-full bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden relative z-10"
      >
        {/* Left: Content - Area 1: Dark green like homepage */}
        <div className="flex-1 p-8 flex flex-col justify-center bg-gradient-to-br from-slate-800 via-green-800 to-teal-800 relative">
          {/* Small floating dots in the left section */}
          <div className="absolute w-1 h-1 bg-green-400 rounded-full top-4 right-8 animate-pulse"></div>
          <div className="absolute w-2 h-2 bg-green-300 rounded-full bottom-8 left-4 animate-pulse delay-200"></div>
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow">Become a Trainer at Agnidhra Technologies</h2>
          <p className="text-lg text-green-100 mb-6">
            Join our mission to empower learners with cutting-edge skills in cybersecurity, technology, and more. As a trainer, you'll:
          </p>
          <ul className="list-disc pl-6 text-green-100 space-y-2 mb-6">
            <li>Share your expertise with a diverse student community</li>
            <li>Design and deliver impactful courses and workshops</li>
            <li>Grow your professional network and brand</li>
            <li>Earn competitive compensation and recognition</li>
          </ul>
          <div className="text-green-200 text-sm mt-4">
            <span className="font-semibold text-white">Why Agnidhra Technologies?</span> <br />
            - 1000+ students trained <br />
            - Industry-driven curriculum <br />
            - Flexible teaching opportunities
          </div>
        </div>
        {/* Right: Form - Area 2 & 3: Light background with dark inputs like homepage */}
        <div className="flex-1 p-8 flex flex-col justify-center bg-slate-50 border-l border-slate-200">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Trainer Registration</h3>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="Enter your full name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="Enter your email" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expertise / Subject</label>
              <input type="text" className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="e.g. Cybersecurity, Data Science" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn Profile (optional)</label>
              <input type="url" className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="https://linkedin.com/in/yourprofile" />
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 font-semibold shadow hover:bg-gray-50 transition-colors"
              >
                <FcGoogle className="w-6 h-6" />
                Sign Up with Google
              </button>
            </div>
          </form>
          <div className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <button className="text-blue-600 hover:underline" onClick={() => onNavigate && onNavigate('login')}>Login</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
