// Import the complete module data from JSON file
import modulesData from '../../modules.json';

// Export only active modules (filter out hidden/archived)
export const modules = modulesData.filter(m => !m.status || m.status === 'active');

// Export learning paths (extracted from all modules)
export const learningPaths = [
  'AWS Cloud Architect',
  'DevOps Engineer',
  'AI/ML Engineer',
  'Data Scientist',
  'Full Stack Developer (Modern)',
  'DSA/Programming Interviews',
  'Android Developer',
  'Frontend Developer',
  'Web App Developer',
  'Embedded Systems Engineer',
  'IoT Developer',
  'Cloud Security Architect',
  'Cybersecurity Analyst',
  'Penetration Tester',
  'Network Engineer',
  'Linux Administrator',
  'Product Manager',
  'Tech Lead',
  'Soft Skills Specialist',
  'UI/UX Designer',
  'Backend Developer',
  'Mobile Developer',
  'Cloud Engineer',
  'SRE / Systems Engineer',
  'Solutions Architect',
  'QA Automation Engineer',
  'Data Analyst / BI Developer',
  'Blockchain Developer',
  'IoT Engineer',
  'Game Developer',
  'AR/VR Developer',
  'High-Performance Computing',
  'All Paths'
];
