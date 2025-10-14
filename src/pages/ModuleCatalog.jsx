import React, { useEffect } from 'react';
import { modules } from '@/data/modules.js';

const ModuleCatalog = () => {
  const [selectedModule, setSelectedModule] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  // On mount, read query parameters for filter & category
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const filter = params.get('filter');
      const category = params.get('category');
      if (filter) setSearchTerm(filter);
      if (category && category !== 'All') setSelectedCategory(category);
    }
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(modules.map(mod => mod.category))];

  // Filter modules based on search and category
  const filteredModules = modules.filter(mod => {
    const matchesSearch = mod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mod.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  return (
    <div className="min-h-screen bg-gradient-blue py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Complete Technology Module Catalog ({modules.length} Modules)</h1>
        
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          {/* Category Filter */}
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
          
          {/* Results Count */}
          <div className="text-center text-slate-400">
            Showing {filteredModules.length} of {modules.length} modules
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModules.map((mod, idx) => (
            <div key={mod.id || mod.title + idx} className="bg-slate-800 rounded-xl p-6 shadow-lg border-2 border-slate-700 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-sky-400 mb-2">{mod.title}</h2>
                <div className="text-xs text-slate-400 mb-2">{mod.category} • {mod.duration}</div>
                <p className="text-slate-300 mb-3 min-h-[48px]">{mod.description.substring(0, 120)}...</p>
                <div className="mb-2">
                  <span className="font-bold text-green-400 text-lg">₹{mod.price}</span>
                </div>
                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg mb-2"
                  onClick={() => window.location.href = `/enroll?module=${encodeURIComponent(mod.title)}`}
                >
                  Enroll
                </button>
                <button
                  className="text-blue-400 underline text-sm mt-1"
                  onClick={() => setSelectedModule(mod)}
                >
                  View Details
                </button>
              </div>
              <div className="mt-4">
                <div className="text-xs text-slate-400 font-semibold mb-1">Learning Paths:</div>
                <ul className="flex flex-wrap gap-2">
                  {mod.learningPaths && mod.learningPaths.slice(0, 3).map((path, i) => (
                    <li key={path + i} className="bg-slate-700 text-sky-200 px-2 py-1 rounded-full text-xs">{path}</li>
                  ))}
                  {mod.learningPaths && mod.learningPaths.length > 3 && (
                    <li className="text-xs text-slate-400">+{mod.learningPaths.length - 3} more</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredModules.length === 0 && (
          <div className="text-center text-slate-400 mt-12">
            <p className="text-xl">No modules found matching your criteria.</p>
            <p className="text-sm mt-2">Try adjusting your search or filter.</p>
          </div>
        )}

        {/* Modal for module details */}
        {selectedModule && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedModule(null)}>
            <div className="bg-slate-900 rounded-xl shadow-2xl p-8 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-slate-400 hover:text-white" onClick={() => setSelectedModule(null)}>&times;</button>
              <h2 className="text-2xl font-bold text-sky-400 mb-2">{selectedModule.title}</h2>
              <div className="text-xs text-slate-400 mb-2">{selectedModule.category} • {selectedModule.duration}</div>
              <p className="text-slate-300 mb-4">{selectedModule.description}</p>
              <div className="mb-4">
                <h3 className="font-semibold text-white mb-1">Curriculum:</h3>
                <ul className="list-disc list-inside text-slate-200 text-sm space-y-1">
                  {selectedModule.curriculum && selectedModule.curriculum.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-white mb-1">Learning Paths:</h3>
                <ul className="flex flex-wrap gap-2">
                  {selectedModule.learningPaths && selectedModule.learningPaths.map((path, i) => (
                    <li key={path + i} className="bg-slate-700 text-sky-200 px-2 py-1 rounded-full text-xs">{path}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-2">
                <span className="font-bold text-green-400 text-lg">₹{selectedModule.price}</span>
                <button
                  className="ml-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                  onClick={() => window.location.href = `/enroll?module=${encodeURIComponent(selectedModule.title)}`}
                >
                  Enroll in this Module
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleCatalog;
