import React from 'react';

// Minimal enrollment modal stub to keep CollegeTrainingLandingPage functional
const ModernEnrollmentModal = ({ isOpen, onClose, courseData = null }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-2">{courseData?.title || 'Enroll'}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">Please contact us on WhatsApp to complete enrollment or request a pricing quote.</p>

        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ModernEnrollmentModal;