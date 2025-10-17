import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Clock, ArrowRight, Code, Globe, Cloud, Database, Shield, Server, Eye, Target, Laptop, TestTube, BrainCircuit, BookOpen, X, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modules as staticModules } from '@/data/modules.js';
import ModernEnrollmentModal from '@/components/ModernEnrollmentModal.jsx';

const ModuleCatalog = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [modules, setModules] = React.useState(staticModules || []);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const location = useLocation();
  const [expandedCard, setExpandedCard] = React.useState(null);
  const [courseDetailsModal, setCourseDetailsModal] = React.useState({ isOpen: false, course: null });
  const [enrollmentModal, setEnrollmentModal] = React.useState({ isOpen: false, courseType: '', courseName: '' });

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

  // On mount, read query parameters for filter & category
  const syncFromParams = () => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    const category = params.get('category');
    // If no query params, clear all filters
    if (!filter && !category) {
      setSelectedCategory('All');
      return;
    }
    // Ignore filter param
    if (category && category !== 'All') setSelectedCategory(category); else setSelectedCategory('All');
  };

  useEffect(() => {
    syncFromParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Fetch dynamic modules.json (keep fallback if fails)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/modules.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
        const data = await res.json();
        if (!cancelled) {
          // Filter out hidden and archived modules
          const activeModules = Array.isArray(data)
            ? data.filter(m => !m.status || m.status === 'active')
            : staticModules.filter(m => !m.status || m.status === 'active');
          setModules(activeModules);
        }
      } catch (e) {
        if (!cancelled) {
          // Filter static modules too
          const activeStaticModules = staticModules.filter(m => !m.status || m.status === 'active');
          setModules(activeStaticModules);
          setError('Using fallback module data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Get unique categories (from active modules only)
  const categories = ['All', ...new Set(modules.map(mod => mod.category))];

  // Filter modules based on search and category
  const filteredModules = modules.filter(mod => {
    const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
    return matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Complete Technology Module Catalog ({modules.length} Modules)</h1>
        {error && (<div className="text-center text-amber-400 text-sm mb-4">{error}</div>)}
        {loading && (<div className="text-center text-slate-300 py-8">Loading modules...</div>)}

        {/* Category Filter Only Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="text-center text-slate-400 flex flex-col items-center gap-2">
            <span>Showing {filteredModules.length} of {modules.length} modules</span>
            {(selectedCategory !== 'All') && (
              <button
                onClick={() => { setSelectedCategory('All'); window.history.replaceState({}, '', '/module-catalog'); }}
                className="text-xs text-blue-300 hover:text-blue-200 underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModules.map((mod, idx) => {
            const IconComponent = getCategoryIcon(mod.category);
            const colorClass = getCategoryColor(mod.category);
            return (
              <div
                key={mod.id || mod.title + idx}
                className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`p-4 bg-${colorClass}-500/20 rounded-lg`}>
                      <IconComponent className={`w-8 h-8 text-${colorClass}-400`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{mod.title}</h2>
                      <div className="text-sm text-slate-400 mb-2">{mod.category}</div>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed line-clamp-3">{mod.description}</p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="w-4 h-4" />
                      {mod.duration}
                    </div>
                    <div className="text-xl font-bold text-blue-400">
                      ₹{mod.price}
                    </div>
                  </div>
                  {mod.learningPaths && mod.learningPaths.length > 0 && (
                    <div className="mb-6">
                      <div className="text-sm text-slate-400 mb-3">Learning Paths:</div>
                      <div className="flex flex-wrap gap-2">
                        {mod.learningPaths.slice(0, 3).map((path, i) => (
                          <span key={path + i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{path}</span>
                        ))}
                        {mod.learningPaths.length > 3 && (
                          <span className="text-xs text-slate-400">+{mod.learningPaths.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setCourseDetailsModal({
                      isOpen: true,
                      course: {
                        ...mod,
                        highlights: [
                          'Industry-standard curriculum',
                          'Hands-on practical projects',
                          'Expert instructor guidance',
                          'Lifetime access to materials',
                          'Certificate of completion'
                        ]
                      }
                    })}
                    className="w-full bg-slate-700 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Course Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEnrollmentModal({
                      isOpen: true,
                      courseType: 'module',
                      course: mod
                    })}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results Message */}
        {(!loading && filteredModules.length === 0) && (
          <div className="text-center text-slate-300 mt-12 max-w-xl mx-auto bg-slate-800/60 p-6 rounded-xl border border-slate-700">
            <p className="text-xl font-semibold mb-2">No modules matched your filter.</p>
            <button
              onClick={() => { setSelectedCategory('All'); window.history.replaceState({}, '', '/module-catalog'); }}
              className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >Show All Modules</button>
          </div>
        )}
      </div>

      {/* Course Details Modal */}
      <AnimatePresence>
        {courseDetailsModal.isOpen && courseDetailsModal.course && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setCourseDetailsModal({ isOpen: false, course: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setCourseDetailsModal({ isOpen: false, course: null })}
                className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"
              >
                <X size={24} />
              </button>

              <div className="p-8">
                <h2 className="text-3xl font-bold text-white mb-4">{courseDetailsModal.course.title}</h2>
                <p className="text-slate-300 mb-6">{courseDetailsModal.course.description}</p>

                {/* Course Highlights */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                    <BookOpen size={20} />
                    Course Highlights
                  </h3>
                  <ul className="space-y-2">
                    {courseDetailsModal.course.highlights?.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300">
                        <ArrowRight size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Curriculum */}
                {courseDetailsModal.course.curriculum && courseDetailsModal.course.curriculum.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                      <Play size={20} />
                      Curriculum
                    </h3>
                    <div className="space-y-2">
                      {courseDetailsModal.course.curriculum.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-300">
                          <ArrowRight size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prerequisites */}
                {courseDetailsModal.course.prerequisites && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-green-400 mb-3">Prerequisites</h3>
                    <p className="text-slate-300">{courseDetailsModal.course.prerequisites}</p>
                  </div>
                )}

                {/* Career Outcomes */}
                {courseDetailsModal.course.learningPaths && courseDetailsModal.course.learningPaths.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-cyan-400 mb-3">Career Outcomes</h3>
                    <div className="flex flex-wrap gap-2">
                      {courseDetailsModal.course.learningPaths.map((path, idx) => (
                        <span key={idx} className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm">
                          {path}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer with Price and Enroll */}
                <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="text-center sm:text-left">
                    <div className="text-2xl font-bold text-blue-400">
                      ₹{courseDetailsModal.course.price}
                    </div>
                    <div className="text-sm text-slate-400">{courseDetailsModal.course.duration}</div>
                  </div>
                  <button
                    onClick={() => {
                      setCourseDetailsModal({ isOpen: false, course: null });
                      setEnrollmentModal({
                        isOpen: true,
                        courseType: 'module',
                        courseName: courseDetailsModal.course.title
                      });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2"
                  >
                    Enroll Now
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enrollment Modal */}
      <ModernEnrollmentModal
        isOpen={enrollmentModal.isOpen}
        onClose={() => setEnrollmentModal({ isOpen: false, courseType: '', course: null })}
        courseData={enrollmentModal.course || null}
      />
    </div>
  );
};

export default ModuleCatalog;
