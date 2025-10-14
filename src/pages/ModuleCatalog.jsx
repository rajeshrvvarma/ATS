import React from 'react';


// 102+ Modules grouped by category (from HTML report)
const moduleCategories = [
  {
    name: 'Programming Foundation',
    modules: [
      { title: 'C Programming Fundamentals', duration: '2 weeks' },
      { title: 'C++ Object-Oriented Programming', duration: '2 weeks' },
      { title: 'Java Programming', duration: '2 weeks' },
      { title: 'Python Programming', duration: '2 weeks' },
      { title: 'JavaScript & ES6+', duration: '2 weeks' },
      { title: 'Go Programming', duration: '2 weeks' },
      { title: 'Rust Programming', duration: '2 weeks' },
      { title: 'Data Structures & Algorithms', duration: '3 weeks' },
    ],
  },
  {
    name: 'Web Development Frontend',
    modules: [
      { title: 'HTML5 & CSS3 Mastery', duration: '2 weeks' },
      { title: 'Responsive Web Design', duration: '2 weeks' },
      { title: 'JavaScript DOM & APIs', duration: '2 weeks' },
      { title: 'React.js Development', duration: '3 weeks' },
      { title: 'Angular Framework', duration: '3 weeks' },
      { title: 'Vue.js Framework', duration: '2 weeks' },
    ],
  },
  {
    name: 'Web Development Backend',
    modules: [
      { title: 'Node.js & Express', duration: '2 weeks' },
      { title: 'Python Web Frameworks', duration: '2 weeks' },
      { title: 'Java Spring Boot', duration: '3 weeks' },
      { title: 'PHP & Laravel', duration: '2 weeks' },
      { title: 'Ruby on Rails', duration: '2 weeks' },
      { title: 'ASP.NET Core', duration: '2 weeks' },
      { title: 'RESTful API Design', duration: '2 weeks' },
    ],
  },
  {
    name: 'Database Technologies',
    modules: [
      { title: 'SQL Fundamentals', duration: '2 weeks' },
      { title: 'Advanced Database Design', duration: '2 weeks' },
      { title: 'NoSQL Databases', duration: '2 weeks' },
      { title: 'Redis & Caching', duration: '1 week' },
      { title: 'Elasticsearch & Search', duration: '2 weeks' },
      { title: 'Database Administration', duration: '2 weeks' },
      { title: 'Data Warehousing', duration: '2 weeks' },
      { title: 'Graph Databases', duration: '2 weeks' },
    ],
  },
  {
    name: 'Cloud Platforms',
    modules: [
      { title: 'AWS Fundamentals', duration: '2 weeks' },
      { title: 'AWS Advanced Services', duration: '3 weeks' },
      { title: 'AWS Solutions Architecture', duration: '2 weeks' },
      { title: 'Azure Fundamentals', duration: '2 weeks' },
      { title: 'Azure Advanced Services', duration: '3 weeks' },
      { title: 'Azure Solutions Architecture', duration: '2 weeks' },
      { title: 'Google Cloud Platform', duration: '2 weeks' },
      { title: 'Multi-Cloud Architecture', duration: '2 weeks' },
      { title: 'Cloud Cost Optimization', duration: '1 week' },
      { title: 'Serverless Computing', duration: '2 weeks' },
      { title: 'Cloud Networking', duration: '2 weeks' },
      { title: 'Cloud Storage Solutions', duration: '1 week' },
    ],
  },
  {
    name: 'DevOps & Infrastructure',
    modules: [
      { title: 'Linux System Administration', duration: '2 weeks' },
      { title: 'Docker & Containerization', duration: '2 weeks' },
      { title: 'Kubernetes Orchestration', duration: '3 weeks' },
      { title: 'CI/CD Pipeline Development', duration: '2 weeks' },
      { title: 'Infrastructure as Code', duration: '2 weeks' },
      { title: 'Configuration Management', duration: '2 weeks' },
      { title: 'Monitoring & Logging', duration: '2 weeks' },
      { title: 'GitOps & Version Control', duration: '1 week' },
      { title: 'Site Reliability Engineering', duration: '2 weeks' },
      { title: 'DevSecOps', duration: '2 weeks' },
    ],
  },
  {
    name: 'Mobile Development',
    modules: [
      { title: 'Android Native Development', duration: '3 weeks' },
      { title: 'iOS Native Development', duration: '3 weeks' },
      { title: 'React Native Cross-Platform', duration: '2 weeks' },
      { title: 'Flutter Development', duration: '2 weeks' },
      { title: 'Mobile Backend Services', duration: '2 weeks' },
      { title: 'Mobile App Testing & Deployment', duration: '1 week' },
    ],
  },
  {
    name: 'Data Science & Analytics',
    modules: [
      { title: 'Statistics for Data Science', duration: '2 weeks' },
      { title: 'Data Analysis with Python', duration: '2 weeks' },
      { title: 'Data Analysis with R', duration: '2 weeks' },
      { title: 'Machine Learning Fundamentals', duration: '3 weeks' },
      { title: 'Advanced Machine Learning', duration: '3 weeks' },
      { title: 'Deep Learning & Neural Networks', duration: '3 weeks' },
      { title: 'Natural Language Processing', duration: '2 weeks' },
      { title: 'Computer Vision', duration: '2 weeks' },
      { title: 'Big Data Processing', duration: '3 weeks' },
      { title: 'MLOps & Model Deployment', duration: '2 weeks' },
    ],
  },
  {
    name: 'Artificial Intelligence',
    modules: [
      { title: 'AI Fundamentals', duration: '2 weeks' },
      { title: 'Generative AI & LLMs', duration: '2 weeks' },
      { title: 'AI Model Development', duration: '3 weeks' },
      { title: 'AI Integration & APIs', duration: '2 weeks' },
      { title: 'Computer Vision AI', duration: '2 weeks' },
      { title: 'AI for Business Applications', duration: '2 weeks' },
    ],
  },
  {
    name: 'Cybersecurity',
    modules: [
      { title: 'Information Security Basics', duration: '2 weeks' },
      { title: 'Network Security', duration: '2 weeks' },
      { title: 'Web Application Security', duration: '2 weeks' },
      { title: 'Cloud Security', duration: '2 weeks' },
      { title: 'Incident Response & Forensics', duration: '2 weeks' },
      { title: 'Security Operations Center', duration: '2 weeks' },
      { title: 'Ethical Hacking & Pen Testing', duration: '3 weeks' },
      { title: 'Compliance & Governance', duration: '2 weeks' },
    ],
  },
  {
    name: 'Software Testing',
    modules: [
      { title: 'Manual Testing Fundamentals', duration: '2 weeks' },
      { title: 'Test Automation with Selenium', duration: '2 weeks' },
      { title: 'API Testing', duration: '1 week' },
      { title: 'Performance Testing', duration: '2 weeks' },
      { title: 'Mobile App Testing', duration: '1 week' },
    ],
  },
  {
    name: 'Specialized Technologies',
    modules: [
      { title: 'Blockchain Development', duration: '3 weeks' },
      { title: 'IoT & Embedded Systems', duration: '2 weeks' },
      { title: 'Game Development', duration: '3 weeks' },
      { title: 'AR/VR Development', duration: '3 weeks' },
      { title: 'Quantum Computing Basics', duration: '2 weeks' },
      { title: 'Edge Computing', duration: '2 weeks' },
      { title: 'Microservices Architecture', duration: '2 weeks' },
      { title: 'Enterprise Integration', duration: '2 weeks' },
    ],
  },
];


const ModuleCatalog = () => {
  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Complete Technology Module Catalog (102+)</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {moduleCategories.map((category) => (
            <div key={category.name} className="bg-slate-800 rounded-xl p-6 shadow-lg border-2 border-slate-700">
              <h2 className="text-2xl font-semibold text-sky-400 mb-4 flex items-center justify-between">
                {category.name}
                <span className="bg-sky-700 text-white text-xs px-3 py-1 rounded-full ml-2">{category.modules.length}</span>
              </h2>
              <ul className="space-y-2">
                {category.modules.map((mod, idx) => (
                  <li key={mod.title + idx} className="flex items-center justify-between bg-slate-900 rounded-lg px-3 py-2">
                    <span className="font-medium text-white">{mod.title}</span>
                    <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded-full ml-2">{mod.duration}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleCatalog;
