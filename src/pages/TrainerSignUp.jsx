import React from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function TrainerSignUp({ onNavigate }) {
  // Placeholder for Google sign up logic
  const handleGoogleSignUp = () => {
    // TODO: Integrate Google OAuth for trainers
    alert('Google sign up for trainers coming soon!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Trainer Sign Up</h2>
        <form className="space-y-6">
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
          <div className="pt-4">
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
    </div>
  );
}
