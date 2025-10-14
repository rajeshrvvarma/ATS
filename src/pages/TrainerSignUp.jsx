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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-5xl w-full bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden"
      >
        {/* Left: Content */}
        <div className="flex-1 p-8 flex flex-col justify-center bg-gradient-to-br from-blue-400 via-blue-200 to-green-200 animate-gradient-x">
          <h2 className="text-4xl font-bold text-blue-800 mb-4 drop-shadow">Become a Trainer at Agnidhra Technologies</h2>
          <p className="text-lg text-slate-700 mb-6">
            Join our mission to empower learners with cutting-edge skills in cybersecurity, technology, and more. As a trainer, you'll:
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-6">
            <li>Share your expertise with a diverse student community</li>
            <li>Design and deliver impactful courses and workshops</li>
            <li>Grow your professional network and brand</li>
            <li>Earn competitive compensation and recognition</li>
          </ul>
          <div className="text-slate-600 text-sm mt-4">
            <span className="font-semibold">Why Agnidhra Technologies?</span> <br />
            - 1000+ students trained <br />
            - Industry-driven curriculum <br />
            - Flexible teaching opportunities
          </div>
        </div>
        {/* Right: Form */}
  <div className="flex-1 p-8 flex flex-col justify-center bg-white border-l border-slate-100">
          <h3 className="text-2xl font-bold text-blue-700 mb-6">Trainer Registration</h3>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Enter your full name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Enter your email" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expertise / Subject</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="e.g. Cybersecurity, Data Science" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile (optional)</label>
              <input type="url" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="https://linkedin.com/in/yourprofile" />
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
