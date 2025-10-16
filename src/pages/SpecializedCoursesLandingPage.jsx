import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Clock, Users, Award, Target, Shield, Code, Server, BrainCircuit, Zap, Eye, Info, X, BookOpen, Play } from 'lucide-react';
import EnhancedEnrollmentModal from '@/components/EnhancedEnrollmentModal.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';

const SpecializedCoursesLandingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [enrollmentModal, setEnrollmentModal] = useState({ isOpen: false, courseType: '', courseName: '' });
  const [courseDetailsModal, setCourseDetailsModal] = useState({ isOpen: false, course: null });
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Courses', icon: Target },
    { id: 'cloud', name: 'Cloud Security', icon: Server },
    { id: 'forensics', name: 'Digital Forensics', icon: Eye },
    { id: 'malware', name: 'Malware Analysis', icon: BrainCircuit },
    { id: 'compliance', name: 'Compliance & GRC', icon: Shield },
    { id: 'incident', name: 'Incident Response', icon: Zap }
  ];

  const specializedCourses = [
    // Cloud Security
    {
      id: 1,
      category: 'cloud',
      title: 'AWS Security Specialist',
      duration: '4 weeks',
      level: 'Intermediate',
      price: '₹3,999',
      originalPrice: '₹5,999',
      description: 'Master AWS security services, IAM, and cloud-native security tools.',
      features: [
        'AWS Security Services Deep Dive',
        'Cloud Security Architecture',
        'Compliance in Cloud (SOC2, PCI)',
        'Incident Response in AWS',
        'Hands-on AWS Security Labs'
      ],
      enrolled: 23,
      maxSeats: 50,
      highlights: ['AWS Certified Security Preparation', 'Real AWS Environment Labs', 'Industry Projects'],
      color: 'blue',
      prerequisites: [
        'Basic AWS cloud knowledge',
        'Understanding of network security concepts',
        'Familiarity with Linux/Windows administration'
      ],
      careerOutcomes: [
        'AWS Security Specialist roles',
        'Cloud Security Engineer positions',
        'AWS Solutions Architect - Security',
        'Cloud Compliance Analyst'
      ]
    },
    {
      id: 2,
      category: 'cloud',
      title: 'Azure Security Engineer',
      duration: '4 weeks',
      level: 'Intermediate',
      price: '₹3,999',
      originalPrice: '₹5,999',
      description: 'Comprehensive Azure security implementation and management.',
      features: [
        'Azure Security Center Mastery',
        'Azure AD Security Features',
        'Key Vault & Secrets Management',
        'Network Security in Azure',
        'Azure Sentinel SIEM'
      ],
      enrolled: 18,
      maxSeats: 40,
      highlights: ['AZ-500 Exam Preparation', 'Live Azure Labs', 'Microsoft Partnership'],
      color: 'blue',
      curriculum: [
        {
          title: 'Azure Security Fundamentals',
          topics: ['Azure Security Center', 'Security Policies', 'Compliance Dashboard', 'Security Recommendations']
        },
        {
          title: 'Identity & Access Management',
          topics: ['Azure Active Directory', 'Conditional Access', 'Privileged Identity Management', 'Multi-Factor Authentication']
        },
        {
          title: 'Data & Application Security',
          topics: ['Key Vault Management', 'Database Security', 'Application Security', 'Encryption Services']
        },
        {
          title: 'Security Operations',
          topics: ['Azure Sentinel', 'Security Incident Response', 'Threat Detection', 'Security Monitoring']
        }
      ],
      prerequisites: [
        'Basic Azure knowledge',
        'Understanding of security concepts',
        'Networking fundamentals'
      ],
      careerOutcomes: [
        'Azure Security Engineer',
        'Cloud Security Specialist',
        'Azure Solutions Architect',
        'Security Consultant'
      ]
    },
    {
      id: 3,
      category: 'cloud',
      title: 'Multi-Cloud Security Architect',
      duration: '6 weeks',
      level: 'Advanced',
      price: '₹5,999',
      originalPrice: '₹8,999',
      description: 'Advanced multi-cloud security architecture and governance.',
      features: [
        'Multi-Cloud Architecture Design',
        'Cross-Cloud Identity Management',
        'Cloud Security Automation',
        'Container & Kubernetes Security',
        'DevSecOps in Cloud'
      ],
      enrolled: 12,
      maxSeats: 25,
      highlights: ['Multi-Cloud Certification Track', 'Advanced Labs', 'Industry Mentorship'],
      color: 'purple',
      curriculum: [
        {
          title: 'Multi-Cloud Strategy',
          topics: ['Cloud Architecture Patterns', 'Vendor Comparison', 'Hybrid Cloud Design', 'Cost Optimization']
        },
        {
          title: 'Security Architecture',
          topics: ['Cross-Cloud Identity', 'Unified Security Policies', 'Compliance Management', 'Risk Assessment']
        },
        {
          title: 'Container Security',
          topics: ['Kubernetes Security', 'Container Scanning', 'Runtime Protection', 'DevSecOps Integration']
        },
        {
          title: 'Automation & Governance',
          topics: ['Security Automation', 'Policy as Code', 'Continuous Compliance', 'Monitoring Solutions']
        }
      ],
      prerequisites: [
        'AWS and Azure experience',
        'Security architecture knowledge',
        'Container technologies familiarity'
      ],
      careerOutcomes: [
        'Multi-Cloud Security Architect',
        'Cloud Security Consultant',
        'Enterprise Security Engineer',
        'DevSecOps Lead'
      ]
    },

    // Digital Forensics
    {
      id: 4,
      category: 'forensics',
      title: 'Digital Forensics Investigator',
      duration: '5 weeks',
      level: 'Beginner to Intermediate',
      price: '₹4,999',
      originalPrice: '₹7,999',
      description: 'Comprehensive digital forensics investigation techniques.',
      features: [
        'Digital Evidence Collection',
        'File System Forensics',
        'Network Forensics Analysis',
        'Mobile Device Forensics',
        'Legal Aspects of Digital Evidence'
      ],
      enrolled: 15,
      maxSeats: 30,
      highlights: ['Industry-Standard Tools', 'Real Case Studies', 'Legal Framework Training'],
      color: 'green',
      curriculum: [
        {
          title: 'Forensics Fundamentals',
          topics: ['Digital Evidence Lifecycle', 'Chain of Custody', 'Forensic Acquisition', 'Write Blockers & Imaging']
        },
        {
          title: 'File System Analysis',
          topics: ['NTFS/FAT32/EXT Forensics', 'Deleted File Recovery', 'Timeline Analysis', 'Registry Forensics']
        },
        {
          title: 'Network & Memory Forensics',
          topics: ['Network Traffic Analysis', 'Memory Dumps', 'Volatile Data Collection', 'Live Response']
        },
        {
          title: 'Mobile & Cloud Forensics',
          topics: ['iOS/Android Forensics', 'Cloud Evidence Collection', 'Social Media Investigations', 'Cryptocurrency Tracing']
        },
        {
          title: 'Legal & Reporting',
          topics: ['Court Testimony', 'Expert Witness Preparation', 'Forensic Reporting', 'Ethics in Forensics']
        }
      ],
      prerequisites: [
        'Basic computer systems knowledge',
        'Understanding of operating systems',
        'Legal awareness and attention to detail'
      ],
      careerOutcomes: [
        'Digital Forensics Investigator',
        'Incident Response Analyst',
        'Computer Crime Investigator',
        'eDiscovery Specialist'
      ]
    },
    {
      id: 5,
      category: 'forensics',
      title: 'Advanced Malware Forensics',
      duration: '4 weeks',
      level: 'Advanced',
      price: '₹4,499',
      originalPrice: '₹6,999',
      description: 'Advanced malware analysis and reverse engineering techniques.',
      features: [
        'Static & Dynamic Malware Analysis',
        'Reverse Engineering Techniques',
        'Sandbox Analysis',
        'Memory Forensics',
        'Threat Attribution'
      ],
      enrolled: 8,
      maxSeats: 20,
      highlights: ['Malware Analysis Lab', 'Custom Analysis Tools', 'Threat Intelligence'],
      color: 'red',
      curriculum: [
        {
          title: 'Advanced Static Analysis',
          topics: ['PE Structure Analysis', 'Disassembly Techniques', 'Code Obfuscation', 'Packer Analysis']
        },
        {
          title: 'Dynamic Analysis',
          topics: ['Behavioral Analysis', 'API Monitoring', 'Network Analysis', 'Sandbox Evasion']
        },
        {
          title: 'Memory Forensics',
          topics: ['Memory Dumps Analysis', 'Process Investigation', 'Rootkit Detection', 'Volatile Artifacts']
        },
        {
          title: 'Threat Intelligence',
          topics: ['Attribution Techniques', 'IOC Generation', 'Threat Hunting', 'YARA Rules']
        }
      ],
      prerequisites: [
        'Basic malware analysis knowledge',
        'Assembly language familiarity',
        'Windows internals understanding'
      ],
      careerOutcomes: [
        'Senior Malware Analyst',
        'Threat Intelligence Analyst',
        'Incident Response Specialist',
        'Security Researcher'
      ]
    },

    // Malware Analysis
    {
      id: 6,
      category: 'malware',
      title: 'Malware Analysis Fundamentals',
      duration: '3 weeks',
      level: 'Beginner',
      price: '₹2,999',
      originalPrice: '₹4,999',
      description: 'Introduction to malware analysis and reverse engineering.',
      features: [
        'Malware Types & Families',
        'Basic Static Analysis',
        'Dynamic Analysis Techniques',
        'Behavioral Analysis',
        'Report Writing'
      ],
      enrolled: 32,
      maxSeats: 60,
      highlights: ['Hands-on Malware Samples', 'Safe Analysis Environment', 'Industry Tools'],
      color: 'red',
      curriculum: [
        {
          title: 'Malware Fundamentals',
          topics: ['Malware Classification', 'Attack Vectors', 'Malware Families', 'Safe Lab Setup']
        },
        {
          title: 'Static Analysis',
          topics: ['PE File Analysis', 'Strings & Import Analysis', 'Entropy Analysis', 'Signature Detection']
        },
        {
          title: 'Dynamic Analysis',
          topics: ['Sandbox Analysis', 'Behavioral Monitoring', 'Network Traffic Analysis', 'Registry/File Changes']
        },
        {
          title: 'Advanced Techniques',
          topics: ['Packed Malware', 'Anti-Analysis Evasion', 'Code Injection', 'Persistence Mechanisms']
        }
      ],
      prerequisites: [
        'Basic programming knowledge',
        'Understanding of Windows/Linux systems',
        'Network fundamentals'
      ],
      careerOutcomes: [
        'Malware Analyst',
        'Threat Intelligence Analyst',
        'Security Researcher',
        'Incident Response Specialist'
      ]
    },
    {
      id: 7,
      category: 'malware',
      title: 'Advanced Reverse Engineering',
      duration: '6 weeks',
      level: 'Advanced',
      price: '₹5,499',
      originalPrice: '₹8,499',
      description: 'Advanced reverse engineering and exploit analysis.',
      features: [
        'Assembly Language Mastery',
        'Debugger Usage & Techniques',
        'Anti-Analysis Evasion',
        'Exploit Development',
        'Custom Tool Development'
      ],
      enrolled: 9,
      maxSeats: 15,
      highlights: ['Advanced RE Tools', 'Custom Exploit Development', 'Elite Mentorship'],
      color: 'purple',
      curriculum: [
        {
          title: 'Assembly & Architecture',
          topics: ['x86/x64 Assembly', 'CPU Architecture', 'Instruction Sets', 'Memory Management']
        },
        {
          title: 'Advanced Debugging',
          topics: ['WinDbg Mastery', 'IDA Pro Advanced', 'Ghidra Analysis', 'Custom Scripts']
        },
        {
          title: 'Anti-Analysis Techniques',
          topics: ['Packing/Unpacking', 'Anti-Debug Tricks', 'VM Detection', 'Code Obfuscation']
        },
        {
          title: 'Exploit Development',
          topics: ['Buffer Overflows', 'ROP Chains', 'Exploit Mitigations', 'Custom Tool Creation']
        }
      ],
      prerequisites: [
        'Strong programming background',
        'Assembly language knowledge',
        'Malware analysis experience'
      ],
      careerOutcomes: [
        'Senior Reverse Engineer',
        'Exploit Developer',
        'Security Researcher',
        'Advanced Threat Analyst'
      ]
    },

    // Compliance & GRC
    {
      id: 8,
      category: 'compliance',
      title: 'ISO 27001 Lead Implementer',
      duration: '4 weeks',
      level: 'Intermediate',
      price: '₹3,499',
      originalPrice: '₹5,499',
      description: 'Complete ISO 27001 implementation and audit preparation.',
      features: [
        'ISO 27001:2013 Framework',
        'Risk Management Implementation',
        'ISMS Documentation',
        'Internal Audit Techniques',
        'Certification Process'
      ],
      enrolled: 28,
      maxSeats: 50,
      highlights: ['ISO Certification Preparation', 'Real Implementation Projects', 'Audit Experience'],
      color: 'blue',
      curriculum: [
        {
          title: 'ISO 27001 Foundation',
          topics: ['ISMS Fundamentals', 'ISO 27001:2013 Structure', 'Information Security Principles', 'Risk Management Framework']
        },
        {
          title: 'Implementation Planning',
          topics: ['Gap Analysis', 'Project Planning', 'Resource Allocation', 'Timeline Development']
        },
        {
          title: 'ISMS Documentation',
          topics: ['Policies & Procedures', 'Risk Assessment Methodology', 'Statement of Applicability', 'Control Implementation']
        },
        {
          title: 'Audit & Certification',
          topics: ['Internal Audit Process', 'Management Review', 'Certification Audit Preparation', 'Continuous Improvement']
        }
      ],
      prerequisites: [
        'Basic information security knowledge',
        'Understanding of risk management',
        'Project management experience preferred'
      ],
      careerOutcomes: [
        'ISO 27001 Lead Implementer',
        'Information Security Manager',
        'GRC Consultant',
        'Compliance Auditor'
      ]
    },
    {
      id: 9,
      category: 'compliance',
      title: 'GRC Analyst Professional',
      duration: '5 weeks',
      level: 'Intermediate',
      price: '₹4,299',
      originalPrice: '₹6,499',
      description: 'Governance, Risk, and Compliance management expertise.',
      features: [
        'GRC Framework Implementation',
        'Risk Assessment Methodologies',
        'Compliance Program Management',
        'Third-Party Risk Management',
        'GRC Tools & Technologies'
      ],
      enrolled: 21,
      maxSeats: 40,
      highlights: ['GRC Certification Track', 'Industry Best Practices', 'Tool Training'],
      color: 'green',
      curriculum: [
        {
          title: 'GRC Foundations',
          topics: ['Governance Frameworks', 'Risk Management Principles', 'Compliance Overview', 'GRC Integration']
        },
        {
          title: 'Risk Assessment',
          topics: ['Risk Identification', 'Risk Analysis Methods', 'Risk Treatment', 'Risk Monitoring']
        },
        {
          title: 'Compliance Management',
          topics: ['Regulatory Requirements', 'Compliance Programs', 'Audit Management', 'Reporting Systems']
        },
        {
          title: 'GRC Tools & Automation',
          topics: ['GRC Platform Implementation', 'Automated Controls', 'Dashboard Development', 'Continuous Monitoring']
        }
      ],
      prerequisites: [
        'Basic understanding of business processes',
        'Risk management awareness',
        'Regulatory knowledge helpful'
      ],
      careerOutcomes: [
        'GRC Analyst',
        'Risk Management Specialist',
        'Compliance Officer',
        'Governance Consultant'
      ]
    },

    // Incident Response
    {
      id: 10,
      category: 'incident',
      title: 'Incident Response Specialist',
      duration: '4 weeks',
      level: 'Intermediate',
      price: '₹3,999',
      originalPrice: '₹5,999',
      description: 'Comprehensive incident response and crisis management.',
      features: [
        'Incident Response Lifecycle',
        'Digital Forensics for IR',
        'Threat Hunting Techniques',
        'Crisis Communication',
        'Post-Incident Analysis'
      ],
      enrolled: 19,
      maxSeats: 35,
      highlights: ['Real Incident Simulations', 'Industry Playbooks', 'Crisis Management'],
      color: 'red',
      curriculum: [
        {
          title: 'Incident Response Framework',
          topics: ['NIST IR Framework', 'Preparation Phase', 'Detection & Analysis', 'Containment Strategy']
        },
        {
          title: 'Investigation Techniques',
          topics: ['Digital Forensics', 'Evidence Collection', 'Timeline Analysis', 'Attribution Methods']
        },
        {
          title: 'Response & Recovery',
          topics: ['Containment Procedures', 'Eradication Methods', 'Recovery Planning', 'Business Continuity']
        },
        {
          title: 'Communication & Learning',
          topics: ['Crisis Communication', 'Stakeholder Management', 'Post-Incident Review', 'Process Improvement']
        }
      ],
      prerequisites: [
        'Basic security knowledge',
        'Understanding of network concepts',
        'Familiarity with security tools'
      ],
      careerOutcomes: [
        'Incident Response Analyst',
        'Security Operations Specialist',
        'Digital Forensics Investigator',
        'Crisis Management Coordinator'
      ]
    },
    {
      id: 11,
      category: 'incident',
      title: 'Advanced Threat Hunting',
      duration: '5 weeks',
      level: 'Advanced',
      price: '₹4,799',
      originalPrice: '₹7,299',
      description: 'Advanced threat hunting and proactive threat detection.',
      features: [
        'Threat Hunting Methodologies',
        'Advanced Analytics & ML',
        'Threat Intelligence Integration',
        'Custom Detection Rules',
        'Automated Threat Hunting'
      ],
      enrolled: 11,
      maxSeats: 25,
      highlights: ['Advanced Analytics Tools', 'Threat Intelligence Feeds', 'Custom Hunting Tools'],
      color: 'purple',
      curriculum: [
        {
          title: 'Threat Hunting Foundations',
          topics: ['Hunting Methodologies', 'Hypothesis Development', 'Data Sources', 'Hunting Maturity Model']
        },
        {
          title: 'Advanced Analytics',
          topics: ['Statistical Analysis', 'Machine Learning for Security', 'Anomaly Detection', 'Behavioral Analytics']
        },
        {
          title: 'Threat Intelligence',
          topics: ['CTI Integration', 'IOC Development', 'TTP Analysis', 'Attribution Techniques']
        },
        {
          title: 'Automation & Tools',
          topics: ['SIEM Query Development', 'Custom Detection Rules', 'Hunting Automation', 'Tool Integration']
        }
      ],
      prerequisites: [
        'Strong security operations background',
        'SIEM experience',
        'Understanding of attack techniques'
      ],
      careerOutcomes: [
        'Senior Threat Hunter',
        'Threat Intelligence Analyst',
        'Security Architect',
        'Advanced SOC Analyst'
      ]
    }
  ];

  const filteredCourses = selectedCategory === 'all'
    ? specializedCourses
    : specializedCourses.filter(course => course.category === selectedCategory);

  const handleEnrollment = (course) => {
    const courseType = course.title.toLowerCase().replace(/\s+/g, '-');
    setEnrollmentModal({ isOpen: true, courseType, courseName: course.title });
  };

  const handleCourseDetails = (course) => {
    setCourseDetailsModal({ isOpen: true, course });
  };

  return (
    <div className="min-h-screen text-white">
      <div className="bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Specialized Cybersecurity Courses
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 mb-8">
                Master Niche Skills • Become a Domain Expert
              </p>
              <p className="text-xl text-gray-400 mb-12">
                Choose from our specialized courses designed for specific cybersecurity domains and advanced skill development
              </p>
            </motion.div>

            {/* Stats Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-800 rounded-2xl p-8 mb-8 border border-purple-700"
            >
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-purple-400 mb-2">11+</div>
                  <div className="text-gray-300">Specialized Courses</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-400 mb-2">6</div>
                  <div className="text-gray-300">Domain Areas</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-400 mb-2">200+</div>
                  <div className="text-gray-300">Students Enrolled</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-yellow-400 mb-2">95%</div>
                  <div className="text-gray-300">Job Placement Rate</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Choose Your Specialization</h2>
            <p className="text-gray-400">Filter courses by domain expertise</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{category.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => {
              const progressPercentage = (course.enrolled / course.maxSeats) * 100;
              const seatsLeft = course.maxSeats - course.enrolled;

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-gray-800 rounded-2xl p-6 border-2 hover:border-${course.color}-500 transition-all duration-300 transform hover:scale-105`}
                >
                  {/* Course Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`px-3 py-1 bg-${course.color}-600 rounded-full text-sm font-semibold`}>
                        {course.level}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-gray-400 text-sm">{course.description}</p>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-300 mb-3">What You'll Learn:</h4>
                    <ul className="space-y-2">
                      {course.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start text-gray-400 text-sm">
                          <CheckCircle className={`h-4 w-4 text-${course.color}-400 mr-2 mt-0.5 flex-shrink-0`} />
                          {feature}
                        </li>
                      ))}
                      {course.features.length > 3 && (
                        <li className="text-gray-500 text-sm ml-6">
                          +{course.features.length - 3} more topics...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Highlights */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {course.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 bg-${course.color}-900 text-${course.color}-200 rounded-md text-xs border border-${course.color}-600`}
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Enrollment Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Enrolled: {course.enrolled}</span>
                      <span className="text-gray-400">{seatsLeft} seats left</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`bg-${course.color}-500 h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="border-t border-gray-700 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className={`text-2xl font-bold text-${course.color}-400`}>{course.price}</div>
                        <div className="text-sm text-gray-500 line-through">{course.originalPrice}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Starts Soon</div>
                        <div className={`text-sm font-semibold text-${course.color}-400`}>Limited Seats</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCourseDetails(course)}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Info size={16} />
                        Course Details
                      </motion.button>

                      <button
                        onClick={() => handleEnrollment(course)}
                        className={`w-full bg-gradient-to-r from-${course.color}-600 to-${course.color}-700 hover:from-${course.color}-700 hover:to-${course.color}-800 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center`}
                      >
                        Enroll Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Specialized Courses */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Specialized Training?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Deep dive into specific domains and become a recognized expert in your chosen field
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-purple-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Domain Expertise</h3>
              <p className="text-gray-400">
                Develop deep, specialized knowledge that makes you indispensable in your chosen domain
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Industry Recognition</h3>
              <p className="text-gray-400">
                Gain certifications and skills that are highly valued by industry leaders and employers
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Small Batches</h3>
              <p className="text-gray-400">
                Learn in small, focused groups with personalized attention from expert instructors
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-blue-900">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Cybersecurity Specialization Today</h2>
            <p className="text-slate-300 text-lg mb-8">
              Join hundreds of professionals who have advanced their careers with our specialized cybersecurity training programs
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAdvisorOpen(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300"
              >
                Get Career Guidance
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Create and trigger download of course catalog
                  const link = document.createElement('a');
                  link.href = '/specialized-courses-catalog.pdf';
                  link.download = 'Specialized-Cybersecurity-Courses-Catalog.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="border border-slate-600 hover:border-green-500 px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Download Course Catalog
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      </div>

      {/* Course Details Modal */}
      {courseDetailsModal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setCourseDetailsModal({ isOpen: false, course: null })}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6 border-b border-slate-700 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {courseDetailsModal.course?.title}
                </h3>
                <p className="text-slate-300">
                  {courseDetailsModal.course?.description}
                </p>
              </div>
              <button
                onClick={() => setCourseDetailsModal({ isOpen: false, course: null })}
                className="p-2 hover:bg-slate-700/40 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Course Details */}
              <div className="space-y-6">
                {/* Course Highlights */}
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-blue-600" />
                    Course Highlights
                  </h4>
                  <ul className="space-y-2">
                    {courseDetailsModal.course?.highlights?.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-300">
                        <ArrowRight size={14} className="text-sky-400 mt-1 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prerequisites */}
                {courseDetailsModal.course?.prerequisites && (
                  <div>
                    <h4 className="font-semibold text-white mb-3">Prerequisites</h4>
                    <ul className="space-y-2">
                      {courseDetailsModal.course.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-300">
                          <ArrowRight size={14} className="text-indigo-400 mt-1 flex-shrink-0" />
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Career Outcomes */}
                {courseDetailsModal.course?.careerOutcomes && (
                  <div>
                    <h4 className="font-semibold text-white mb-3">Career Outcomes</h4>
                    <ul className="space-y-2">
                      {courseDetailsModal.course.careerOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-300">
                          <ArrowRight size={14} className="text-emerald-400 mt-1 flex-shrink-0" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column - Curriculum */}
              <div>
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Play size={18} className="text-blue-600" />
                  Curriculum
                </h4>
                <div className="space-y-3">
                  {courseDetailsModal.course?.curriculum?.map((module, index) => (
                    <div key={index} className="border border-slate-700 rounded-lg p-4 bg-slate-800/50">
                      <h5 className="font-medium text-white mb-2">
                        Module {index + 1}: {module.title}
                      </h5>
                      <ul className="space-y-1">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="text-sm text-slate-300 flex items-start gap-2">
                            <ArrowRight size={12} className="text-slate-400 mt-1 flex-shrink-0" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-sky-400">
                  {courseDetailsModal.course?.price}
                </div>
                <div className="text-sm text-slate-300">Duration: {courseDetailsModal.course?.duration}</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setCourseDetailsModal({ isOpen: false, course: null });
                  handleEnrollment(courseDetailsModal.course);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300"
              >
                Enroll Now
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Enrollment Modal */}
      <EnhancedEnrollmentModal
        isOpen={enrollmentModal.isOpen}
        onClose={() => setEnrollmentModal({ isOpen: false, courseType: '', courseName: '' })}
        courseType={enrollmentModal.courseType}
        courseName={enrollmentModal.courseName}
      />

      <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
      <ScrollNavigation />
    </div>
  );
};

export default SpecializedCoursesLandingPage;