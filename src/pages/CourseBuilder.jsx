import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// TODO: Import full modules data and learning path mapping
const modules = [
  // Example module
  {
    id: 'python-programming',
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
  // ...add all modules here...
];

const CourseBuilder = () => {
  const [selectedModules, setSelectedModules] = useState([]);

  // Drag and drop handlers
  const onDragEnd = (result) => {
    if (!result.destination) return;
    // Drag from modules to path
    if (result.source.droppableId === 'modules' && result.destination.droppableId === 'path') {
      const mod = modules[result.source.index];
      if (!selectedModules.find(m => m.id === mod.id)) {
        setSelectedModules([...selectedModules, mod]);
      }
    }
    // Remove from path
    if (result.source.droppableId === 'path' && result.destination.droppableId === 'modules') {
      const newPath = [...selectedModules];
      newPath.splice(result.source.index, 1);
      setSelectedModules(newPath);
    }
  };

  // Calculate total price and duration
  const totalPrice = selectedModules.reduce((sum, m) => sum + m.price, 0);
  // For demo, just sum durations as weeks
  const totalDuration = selectedModules.reduce((sum, m) => {
    const match = m.duration.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  // Find unlocked learning paths
  const unlockedPaths = Array.from(new Set(selectedModules.flatMap(m => m.learningPaths)));

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Build Your Custom Learning Path</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* All Modules */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="modules">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-slate-800 rounded-xl p-6 shadow-lg min-h-[500px]">
                  <h2 className="text-xl font-semibold text-sky-400 mb-4">All Modules</h2>
                  {modules.map((mod, idx) => (
                    <Draggable key={mod.id} draggableId={mod.id} index={idx}>
                      {(prov) => (
                        <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="bg-slate-900 rounded-lg p-4 mb-3 shadow flex flex-col">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white">{mod.title}</span>
                            <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded-full ml-2">{mod.duration}</span>
                          </div>
                          <div className="text-slate-300 text-sm mb-2">{mod.description}</div>
                          <div className="text-green-400 font-bold">₹{mod.price}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {mod.learningPaths.map((path, i) => (
                              <span key={i} className="bg-slate-700 text-sky-200 px-2 py-1 rounded-full text-xs">{path}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {/* My Learning Path */}
            <Droppable droppableId="path">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-slate-800 rounded-xl p-6 shadow-lg min-h-[500px]">
                  <h2 className="text-xl font-semibold text-green-400 mb-4">My Learning Path</h2>
                  {selectedModules.length === 0 && <div className="text-slate-400">Drag modules here to build your path</div>}
                  {selectedModules.map((mod, idx) => (
                    <Draggable key={mod.id} draggableId={mod.id+':path'} index={idx}>
                      {(prov) => (
                        <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="bg-slate-900 rounded-lg p-4 mb-3 shadow flex flex-col">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white">{mod.title}</span>
                            <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded-full ml-2">{mod.duration}</span>
                          </div>
                          <div className="text-slate-300 text-sm mb-2">{mod.description}</div>
                          <div className="text-green-400 font-bold">₹{mod.price}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <div className="mt-6">
                    <div className="text-white font-bold">Total Price: <span className="text-green-400">₹{totalPrice}</span></div>
                    <div className="text-white font-bold">Total Duration: <span className="text-blue-400">{totalDuration} weeks</span></div>
                  </div>
                  <div className="mt-6">
                    <div className="text-xs text-slate-400 mb-1">Unlocked Learning Paths:</div>
                    <ul className="flex flex-wrap gap-2">
                      {unlockedPaths.map((path, i) => (
                        <li key={path + i} className="bg-slate-700 text-sky-200 px-2 py-1 rounded-full text-xs">{path}</li>
                      ))}
                    </ul>
                  </div>
                  <button className="mt-8 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg">
                    Enroll in My Path
                  </button>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default CourseBuilder;
