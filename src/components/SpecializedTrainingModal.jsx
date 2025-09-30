import React, { useEffect, useRef } from 'react';
import { X, Code, Cloud, BrainCircuit } from 'lucide-react';

// This object holds the specific details for each on-demand course.
const trainingDetails = {
  "C & Python Programming": {
    icon: Code,
    color: "sky",
    description: "Master the foundational languages of modern software. Our training covers everything from basic syntax and logic to advanced data structures and algorithms, tailored to your skill level and goals.",
    keyTopics: [
      "Core C Concepts (Pointers, Memory Management)",
      "Python Fundamentals (Data Types, Control Flow)",
      "Object-Oriented Programming (OOP) Principles",
      "Data Structures & Algorithms (DSA)"
    ]
  },
  "Cloud & DevOps": {
    icon: Cloud,
    color: "amber",
    description: "Learn to build, deploy, and manage modern, scalable infrastructure. We cover the entire lifecycle, from cloud fundamentals on AWS/Azure to automated CI/CD pipelines.",
    keyTopics: [
      "Core Cloud Concepts (AWS, Azure, GCP)",
      "Containerization with Docker & Kubernetes",
      "CI/CD Pipelines (Jenkins, GitLab CI)",
      "Infrastructure as Code (Terraform)"
    ]
  },
  "AI & Data Science": {
    icon: BrainCircuit,
    color: "emerald",
    description: "Unlock the power of data. Our customized programs guide you through data analysis, machine learning models, and AI principles, using powerful libraries like Pandas, Scikit-learn, and TensorFlow.",
    keyTopics: [
      "Data Analysis & Visualization (Pandas, Matplotlib)",
      "Machine Learning Fundamentals (Supervised & Unsupervised)",
      "Model Training and Evaluation",
      "Introduction to Deep Learning"
    ]
  }
};

export default function SpecializedTrainingModal({ courseTitle, onClose }) {
  const modalRef = useRef();
  const details = trainingDetails[courseTitle];

  // Effect to handle clicks outside the modal to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalRef, onClose]);

  if (!details) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-slate-800 border border-slate-700 p-8 rounded-lg max-w-2xl w-full relative transform transition-all duration-300 scale-100 animate-fade-in">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <details.icon className={`w-10 h-10 text-${details.color}-400 flex-shrink-0`} />
            <div>
              <h2 className="text-2xl font-bold text-white">{courseTitle}</h2>
              <p className="text-sm text-slate-400">On-Demand Specialized Training</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <p className="text-slate-300 mb-6">{details.description}</p>
        
        <div className="bg-slate-900/50 p-4 rounded-md mb-6">
          <h3 className={`font-bold text-${details.color}-400 mb-2`}>Example Key Topics:</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-slate-300">
            {details.keyTopics.map(topic => <li key={topic}>• {topic}</li>)}
          </ul>
        </div>

        <p className="text-center text-amber-300 bg-amber-900/50 border border-amber-800 rounded-md p-3 text-sm mb-6">
          <strong>Note:</strong> This is a fully customizable program. The curriculum and duration will be designed to meet the specific requirements of you, your college group, or your corporate team.
        </p>

        <button 
          onClick={() => {
            onClose(); // Close the modal first
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full bg-sky-600 text-white font-semibold py-3 rounded-lg hover:bg-sky-700 transition-colors duration-300 text-lg"
        >
          Inquire About This Custom Training
        </button>
      </div>
    </div>
  );
}
