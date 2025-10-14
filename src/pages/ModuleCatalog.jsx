import React from 'react';



// --- Module Data Structure ---
// For brevity, only a few modules are shown with details. In production, all 102+ modules would be included with full details.
const modules = [
  {
    title: 'Python Programming',
    category: 'Programming Foundation',
    duration: '2 weeks',
    price: 699,
    description: 'Learn Python from scratch. Covers syntax, data types, control flow, functions, OOP, and basic libraries.',
    curriculum: [
      'Python syntax and variables',
      'Data types and structures',
      'Control flow (if, loops)',
      'Functions and modules',
      'Object-Oriented Programming',
      'File I/O',
      'Error handling',
      'Popular libraries (requests, pandas, matplotlib)'
    ],
    learningPaths: [
      'AWS Cloud Architect',
      'DevOps Engineer',
      'AI/ML Engineer',
      'Data Scientist',
      'Full Stack Developer (Modern)',
      'DSA/Programming Interviews'
    ]
  },
  {
    title: 'AWS Fundamentals',
    category: 'Cloud Platforms',
    duration: '2 weeks',
    price: 699,
    description: 'Introduction to AWS core services, IAM, EC2, S3, and cloud concepts.',
    curriculum: [
      'AWS global infrastructure',
      'IAM and security',
      'EC2, S3, RDS basics',
      'VPC and networking',
      'Cloud best practices'
    ],
    learningPaths: [
      'AWS Cloud Architect',
      'Cloud Security Architect',
      'DevOps Engineer'
    ]
  },
  {
    title: 'Data Structures & Algorithms',
    category: 'Programming Foundation',
    duration: '3 weeks',
    price: 699,
    description: 'Core DSA concepts for interviews and problem solving.',
    curriculum: [
      'Arrays, Linked Lists',
      'Stacks, Queues',
      'Trees, Graphs',
      'Sorting and Searching',
      'Recursion',
      'Algorithmic complexity'
    ],
    learningPaths: [
      'DSA/Programming Interviews',
      'Full Stack Developer (Modern)',
      'AI/ML Engineer'
    ]
  },
  // ... Add all other modules here with similar structure ...
];

const ModuleCatalog = () => {
  const [selectedModule, setSelectedModule] = React.useState(null);
  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Complete Technology Module Catalog (102+)</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod, idx) => (
            <div key={mod.title + idx} className="bg-slate-800 rounded-xl p-6 shadow-lg border-2 border-slate-700 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-sky-400 mb-2">{mod.title}</h2>
                <div className="text-xs text-slate-400 mb-2">{mod.category} • {mod.duration}</div>
                <p className="text-slate-300 mb-3 min-h-[48px]">{mod.description}</p>
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
                  {mod.learningPaths && mod.learningPaths.map((path, i) => (
                    <li key={path + i} className="bg-slate-700 text-sky-200 px-2 py-1 rounded-full text-xs">{path}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

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
