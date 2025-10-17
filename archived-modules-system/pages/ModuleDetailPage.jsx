import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Clock, Award, Target, Shield, Code, Server, BrainCircuit, Zap, Eye, X, BookOpen, Play, ArrowLeft, Users, Star, TrendingUp, Globe, Cloud, Database, Laptop, TestTube } from 'lucide-react';
import ModernEnrollmentModal from '@/components/ModernEnrollmentModal.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';
import { modules as staticModules } from '@/data/modules.js';

const ModuleDetailPage = ({ onNavigate }) => {
  const location = useLocation();
  const [module, setModule] = useState(null);
  const [enrollmentModal, setEnrollmentModal] = useState({ isOpen: false, courseType: '', courseName: '' });
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get module ID from URL params or location state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const moduleId = params.get('id') || location.state?.moduleId;

    if (moduleId) {
      // Find module from static data
      const foundModule = staticModules.find(m => m.id === moduleId);
      // Check if module is active (not hidden or archived)
      if (foundModule && (!foundModule.status || foundModule.status === 'active')) {
        setModule(foundModule);
      } else if (foundModule && (foundModule.status === 'hidden' || foundModule.status === 'archived')) {
        // Module exists but is not accessible
        setModule(null);
      }
    }
    setLoading(false);
  }, [location]);

  // Category icon mapping
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Programming Foundation': Code,
      'Web Development': Globe,
      'Cloud Computing': Cloud,
      'Data Science & Analytics': Database,
      'Cybersecurity Foundation': Shield,
      'Network Security': Server,
      'Threat Intelligence': Eye,
      'Incident Response': Target,
      'DevOps & Infrastructure': Laptop,
      'Testing & Quality Assurance': TestTube,
      'Advanced Programming': BrainCircuit,
    };
    return iconMap[category] || BookOpen;
  };

  // Category color mapping
  const getCategoryColor = (category) => {
    const colorMap = {
      'Programming Foundation': 'blue',
      'Web Development': 'green',
      'Cloud Computing': 'sky',
      'Data Science & Analytics': 'purple',
      'Cybersecurity Foundation': 'red',
      'Network Security': 'orange',
      'Threat Intelligence': 'yellow',
      'Incident Response': 'pink',
      'DevOps & Infrastructure': 'cyan',
      'Testing & Quality Assurance': 'teal',
      'Advanced Programming': 'indigo',
    };
    return colorMap[category] || 'blue';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading module details...</div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Module Not Found</h1>
          <button
            onClick={() => onNavigate('moduleCatalog')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Browse All Modules
          </button>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(module.category);
  const colorClass = getCategoryColor(module.category);

  return (
    <>
      <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
      <ModernEnrollmentModal
        isOpen={enrollmentModal.isOpen}
        onClose={() => setEnrollmentModal({ isOpen: false, courseType: '', courseName: '' })}
        courseData={enrollmentModal.course ? enrollmentModal.course : { title: enrollmentModal.courseName }}
      />
      <ScrollNavigation />

      <div className="min-h-screen bg-slate-900">
        {/* Hero Section */}
        <section className="relative bg-slate-900 py-20 border-b border-slate-800">
          <div className="container mx-auto px-6">
            {/* Back Button */}
            <button
              onClick={() => onNavigate('moduleCatalog')}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Module Catalog
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Module Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 bg-${colorClass}-500/20 rounded-lg`}>
                    <CategoryIcon className={`w-8 h-8 text-${colorClass}-400`} />
                  </div>
                  <span className="text-slate-400 text-lg">{module.category}</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                  {module.title}
                </h1>

                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                  {module.description}
                </p>

                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-semibold">{module.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
                    <Award className="w-5 h-5 text-green-400" />
                    <span className="text-white font-semibold">Certificate</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
                    <Target className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-semibold">Self-Paced</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-green-400">
                    ₹{module.price}
                  </div>
                  <button
                    onClick={() => setEnrollmentModal({ isOpen: true, courseType: 'module', courseName: module.title })}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 flex items-center gap-2"
                  >
                    Enroll Now
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

              {/* Right: Key Highlights */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-slate-800 rounded-xl p-8 border border-slate-700"
              >
                <h3 className="text-2xl font-bold text-white mb-6">What You'll Learn</h3>
                <div className="space-y-4">
                  {module.curriculum && module.curriculum.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                  {module.curriculum && module.curriculum.length > 5 && (
                    <div className="text-blue-400 text-sm">+ {module.curriculum.length - 5} more topics</div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        {module.curriculum && module.curriculum.length > 0 && (
          <section className="py-16 bg-slate-900">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold text-white mb-4">Detailed Curriculum</h2>
                <p className="text-xl text-slate-300">Everything you'll master in this module</p>
              </motion.div>

              <div className="max-w-4xl mx-auto">
                <div className="space-y-4">
                  {module.curriculum.map((topic, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`bg-${colorClass}-500/20 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0`}>
                          <span className={`text-${colorClass}-400 font-bold`}>{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-lg">{topic}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Learning Paths Section */}
        {module.learningPaths && module.learningPaths.length > 0 && (
          <section className="py-16 bg-slate-800">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold text-white mb-4">Career Paths</h2>
                <p className="text-xl text-slate-300">This module prepares you for these career paths</p>
              </motion.div>

              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {module.learningPaths.map((path, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-slate-700 text-white px-6 py-3 rounded-full border border-slate-600 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="font-medium">{path}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-slate-900">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Learning?</h2>
              <p className="text-xl text-slate-100 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are mastering {module.title} and advancing their careers.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setEnrollmentModal({ isOpen: true, courseType: 'module', courseName: module.title })}
                  className="bg-white text-blue-600 font-bold px-8 py-4 rounded-lg hover:bg-slate-100 transition-all duration-300 flex items-center gap-2"
                >
                  Enroll Now - ₹{module.price}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsAdvisorOpen(true)}
                  className="bg-slate-800 text-white font-bold px-8 py-4 rounded-lg hover:bg-slate-700 transition-all duration-300 flex items-center gap-2"
                >
                  Talk to Career Advisor
                  <Users className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Modules Section */}
        <section className="py-16 bg-slate-800">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Explore More Modules</h2>
              <p className="text-xl text-slate-300">Continue building your skills</p>
            </motion.div>

            <div className="text-center">
              <button
                onClick={() => onNavigate('moduleCatalog')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 inline-flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Browse All Modules
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ModuleDetailPage;
