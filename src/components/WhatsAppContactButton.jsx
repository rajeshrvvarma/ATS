import React, { useState } from 'react';
import { MessageCircle, Phone, Users, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * WhatsApp Contact Button - Strategic placement for course pages
 * Can be placed in hero sections, enrollment sections, or as floating button
 */
export default function WhatsAppContactButton({
  variant = 'floating', // 'floating', 'inline', 'hero'
  courseContext = '', // Course name for contextual messaging
  className = '',
  showQuickActions = true
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const whatsappNumber = "919160813700";

  // Context-aware message templates
  const getContextualMessage = (actionType = 'general') => {
    const coursePrefix = courseContext ? `regarding ${courseContext}` : '';

    const messages = {
      general: `Hi! I'm interested in learning more about your cybersecurity training programs ${coursePrefix}. Can you help me?`,
      enrollment: `Hello! I'd like to enroll in ${courseContext || 'a cybersecurity course'}. What are the available batches and pricing?`,
      info: `Hi! I need more information about ${courseContext || 'your cybersecurity courses'}. Can you provide details about curriculum and certification?`,
      pricing: `Hello! I'd like to know about pricing and payment options for ${courseContext || 'your cybersecurity training'}. Can you help?`
    };

    return messages[actionType] || messages.general;
  };

  const quickActions = [
    {
      id: 'enrollment',
      icon: Users,
      title: 'Enroll Now',
      description: 'Join upcoming batch',
      message: getContextualMessage('enrollment'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'info',
      icon: BookOpen,
      title: 'Course Details',
      description: 'Get more information',
      message: getContextualMessage('info'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'pricing',
      icon: Phone,
      title: 'Pricing & Schedule',
      description: 'Discuss fees & timing',
      message: getContextualMessage('pricing'),
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const openWhatsApp = (message) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsExpanded(false);
  };

  // Floating variant (bottom-right corner)
  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <AnimatePresence>
          {isExpanded && showQuickActions && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="mb-4 space-y-3"
            >
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * quickActions.indexOf(action) }}
                    onClick={() => openWhatsApp(action.message)}
                    className={`flex items-center gap-3 ${action.color} text-white px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold text-sm">{action.title}</div>
                      <div className="text-xs opacity-90">{action.description}</div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (showQuickActions) {
              setIsExpanded(!isExpanded);
            } else {
              openWhatsApp(getContextualMessage());
            }
          }}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          {isExpanded ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </motion.button>
      </div>
    );
  }

  // Inline variant (for hero sections or CTAs)
  if (variant === 'inline') {
    return (
      <button
        onClick={() => openWhatsApp(getContextualMessage())}
        className={`flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg ${className}`}
      >
        <MessageCircle className="w-5 h-5" />
        Chat on WhatsApp
      </button>
    );
  }

  // Hero variant (prominent CTA in hero sections)
  if (variant === 'hero') {
    return (
      <div className={`space-y-4 ${className}`}>
        <button
          onClick={() => openWhatsApp(getContextualMessage())}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-3"
        >
          <MessageCircle className="w-6 h-6" />
          Get Instant Course Info on WhatsApp
        </button>

        {showQuickActions && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => openWhatsApp(action.message)}
                  className={`${action.color} text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 justify-center`}
                >
                  <IconComponent className="w-4 h-4" />
                  {action.title}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return null;
}