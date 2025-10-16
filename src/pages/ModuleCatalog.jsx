import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Clock, ArrowRight, Code, Globe, Cloud, Database, Shield, Server, Eye, Target, Laptop, TestTube, BrainCircuit, BookOpen } from 'lucide-react';
import { modules as staticModules } from '@/data/modules.js';

const ModuleCatalog = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [modules, setModules] = React.useState(staticModules || []);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [expandedCard, setExpandedCard] = React.useState(null);
  const location = useLocation();

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
          setModules(Array.isArray(data) ? data : staticModules);
        }
      } catch (e) {
        if (!cancelled) {
          setModules(staticModules);
          setError('Using fallback module data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Get unique categories
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
                    onClick={() => setExpandedCard(idx => idx === mod.id ? null : mod.id)}
                    className="w-full bg-slate-700 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Course Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open(mod.enrollUrl || '#', '_blank')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Enroll Now
                  </button>
                </div>
                {/* Expandable details section */}
                {expandedCard === mod.id && (
                  <div className="mt-4 bg-slate-700/80 rounded-lg p-4 text-slate-200 animate-fade-in">
                    <div className="mb-2"><span className="font-semibold">Full Description:</span> {mod.fullDescription || mod.description}</div>
                    {mod.topics && mod.topics.length > 0 && (
                      <div className="mb-2">
                        <span className="font-semibold">Topics Covered:</span>
                        <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                          {mod.topics.map((topic, i) => <li key={topic + i}>{topic}</li>)}
                        </ul>
                      </div>
                    )}
                    {mod.prerequisites && (
                      <div className="mb-2"><span className="font-semibold">Prerequisites:</span> {mod.prerequisites}</div>
                    )}
                    {mod.instructor && (
                      <div className="mb-2"><span className="font-semibold">Instructor:</span> {mod.instructor}</div>
                    )}
                  </div>
                )}
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
    </div>
  );
};

export default ModuleCatalog;
