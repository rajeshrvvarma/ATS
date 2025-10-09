import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Users, BookOpen, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * WhatsApp Integration Widget
 * Free WhatsApp Business integration for instant customer support
 */
export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickOptions, setShowQuickOptions] = useState(false);
  
  // Your WhatsApp Business number (from ContactUsPage.jsx)
  const whatsappNumber = "919160813700";
  
  // Pre-defined message templates for different inquiries
  const messageTemplates = {
    courseInquiry: "Hi! I'm interested in learning more about your cybersecurity courses. Can you help me choose the right program?",
    enrollment: "Hello! I'd like to enroll in a cybersecurity course. What are the available batches and pricing?",
    payment: "Hi! I have a question regarding payment options and course fees. Can you assist me?",
    technical: "Hello! I need technical support with course access or platform issues. Can you help?",
    general: "Hi! I have some questions about Agnidhra Technologies cybersecurity training programs."
  };

  // Quick action options
  const quickActions = [
    {
      id: 'courseInquiry',
      icon: BookOpen,
      title: 'Course Information',
      description: 'Learn about our programs',
      message: messageTemplates.courseInquiry,
      color: 'bg-blue-500'
    },
    {
      id: 'enrollment',
      icon: Users,
      title: 'Enroll Now',
      description: 'Join upcoming batch',
      message: messageTemplates.enrollment,
      color: 'bg-green-500'
    },
    {
      id: 'payment',
      icon: CreditCard,
      title: 'Payment Help',
      description: 'Payment & pricing info',
      message: messageTemplates.payment,
      color: 'bg-purple-500'
    },
    {
      id: 'technical',
      icon: Phone,
      title: 'Technical Support',
      description: 'Platform assistance',
      message: messageTemplates.technical,
      color: 'bg-orange-500'
    }
  ];

  // Generate WhatsApp URL
  const generateWhatsAppURL = (message = messageTemplates.general) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };

  // Handle quick action click
  const handleQuickAction = (action) => {
    const whatsappURL = generateWhatsAppURL(action.message);
    window.open(whatsappURL, '_blank');
    setIsOpen(false);
    setShowQuickOptions(false);
    
    // Track usage analytics (optional)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'whatsapp_click', {
        'event_category': 'engagement',
        'event_label': action.id
      });
    }
  };

  // Auto-show widget on mobile devices after 3 seconds
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const hasSeenWidget = localStorage.getItem('whatsapp_widget_seen');
    
    if (isMobile && !hasSeenWidget) {
      const timer = setTimeout(() => {
        setShowQuickOptions(true);
        localStorage.setItem('whatsapp_widget_seen', 'true');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showQuickOptions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="mb-4 bg-white rounded-2xl shadow-2xl p-4 w-80 max-w-[90vw]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Need Help?</h3>
                    <p className="text-xs text-slate-500">Chat with us on WhatsApp</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQuickOptions(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="p-3 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left group"
                    >
                      <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="text-sm font-medium text-slate-800 mb-1">{action.title}</h4>
                      <p className="text-xs text-slate-500">{action.description}</p>
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => window.open(generateWhatsAppURL(), '_blank')}
                className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white rounded-xl py-2 px-4 text-sm font-medium transition-colors duration-200"
              >
                Start General Chat
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main WhatsApp Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowQuickOptions(!showQuickOptions)}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl transition-colors duration-200 relative group"
          title="Chat with us on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
          
          {/* Pulsing notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          
          {/* Hover tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-slate-800 text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap">
              Chat on WhatsApp
            </div>
          </div>
        </motion.button>
      </div>

      {/* Mobile-specific quick access bar (appears on course pages) */}
      <div className="fixed bottom-0 left-0 right-0 bg-green-500 text-white p-3 z-40 md:hidden" style={{ display: window.location.pathname.includes('/bootcamp') || window.location.pathname.includes('/course') ? 'block' : 'none' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Need help choosing a course?</p>
            <p className="text-xs opacity-90">Get instant guidance from our experts</p>
          </div>
          <button
            onClick={() => window.open(generateWhatsAppURL(messageTemplates.courseInquiry), '_blank')}
            className="bg-white text-green-600 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-green-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat Now
          </button>
        </div>
      </div>
    </>
  );
}

// Export message templates for use in other components
export { messageTemplates };