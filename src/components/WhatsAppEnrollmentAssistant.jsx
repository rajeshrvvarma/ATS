import React from 'react';
import { MessageCircle, Phone, User, Clock } from 'lucide-react';
import { messageTemplates } from './WhatsAppWidget';

/**
 * WhatsApp Enrollment Assistant
 * Contextual WhatsApp integration for course enrollment pages
 */
export default function WhatsAppEnrollmentAssistant({ courseName, batchName, className = "" }) {
  const whatsappNumber = "919160813700";

  // Create contextual message based on course and batch
  const createContextualMessage = () => {
    let message = `Hi! I'm interested in enrolling in the ${courseName || 'cybersecurity course'}`;
    if (batchName) {
      message += ` for the ${batchName} batch`;
    }
    message += `. Can you help me with the enrollment process and answer some questions?`;
    return message;
  };

  const handleWhatsAppClick = () => {
    const message = createContextualMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
  };

  const handleCallClick = () => {
    window.open(`tel:+91${whatsappNumber}`, '_self');
  };

  return (
    <div className={`bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-200/20 ${className}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            Need Help with Enrollment?
          </h3>
          <p className="text-slate-300 text-sm mb-4">
            Get instant assistance from our enrollment specialists. We're here to help you choose the right program and complete your enrollment smoothly.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <User className="w-4 h-4 text-green-400" />
              <span>Personal program guidance</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock className="w-4 h-4 text-green-400" />
              <span>Quick response within minutes</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </button>
            
            <button
              onClick={handleCallClick}
              className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-slate-600"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
            <span>✓ Instant response</span>
            <span>✓ Expert guidance</span>
            <span>✓ Free consultation</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact WhatsApp Assistance Banner for smaller spaces
 */
export function WhatsAppAssistanceBanner({ message, className = "" }) {
  const whatsappNumber = "919160813700";

  const handleClick = () => {
    const finalMessage = message || messageTemplates.general;
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className={`bg-green-500/20 border border-green-500/30 rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Questions? Get instant help!</p>
            <p className="text-xs text-green-200">Chat with our experts on WhatsApp</p>
          </div>
        </div>
        
        <button
          onClick={handleClick}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Chat Now
        </button>
      </div>
    </div>
  );
}

export { messageTemplates };