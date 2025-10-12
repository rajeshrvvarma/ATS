import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Clock, Users, Award, Target, Shield, Code, Server, BrainCircuit, Zap, Eye, Info, X, BookOpen, Play } from 'lucide-react';
import EnhancedEnrollmentModal from '@/components/EnhancedEnrollmentModal.jsx';
import { useCoursePricing, formatPrice } from '@/hooks/useCoursePricing.js';
import AnimatedBackground from '@/components/AnimatedBackground.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';

const SpecializedCoursesLandingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [enrollmentModal, setEnrollmentModal] = useState({ isOpen: false, courseType: '', courseName: '' });
  const [courseDetailsModal, setCourseDetailsModal] = useState({ isOpen: false, course: null });
  const coursePricingData = useCoursePricing();
  const coursePricing = coursePricingData?.pricing || {};
  const pricingLoading = coursePricingData?.loading || false;
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  // Mapping from course titles to centralized pricing IDs
  const titleToIdMap = {
    'AWS Security Specialist': 'aws-security-specialist',
    'Azure Security Engineer': 'azure-security-engineer',
    'Multi-Cloud Security Architect': 'multi-cloud-security-architect',
    'Digital Forensics Investigator': 'digital-forensics-investigator',
    'Advanced Malware Forensics': 'advanced-malware-forensics',
    'Malware Analysis Fundamentals': 'malware-analysis-fundamentals',
    'Advanced Reverse Engineering': 'advanced-reverse-engineering',
    'ISO 27001 Lead Implementer': 'iso-27001-lead-implementer',
    'GRC Analyst Professional': 'grc-analyst-professional',
    'Incident Response Specialist': 'incident-response-specialist',
    'Advanced Threat Hunting': 'advanced-threat-hunting'
  };

  // Helper function to get pricing info
  const getPricing = (title) => {
    const courseId = titleToIdMap[title];
    if (pricingLoading) {
      return { finalPrice: '...', originalPrice: '...' };
    }
    if (coursePricing && courseId && coursePricing[courseId]) {
      return {
        finalPrice: formatPrice(coursePricing[courseId].finalPrice),
        originalPrice: formatPrice(coursePricing[courseId].originalPrice)
      };
    }
    // Fallback to hardcoded prices if not found
    return null;
  };

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
      curriculum: [
        {
          title: 'AWS Security Fundamentals',
          topics: ['AWS Shared Responsibility Model', 'IAM Policies & Roles', 'Security Groups & NACLs', 'AWS CloudTrail & CloudWatch']
        },
        {
          title: 'Data Protection in AWS',
          topics: ['KMS Key Management', 'S3 Bucket Security', 'RDS Encryption', 'Secrets Manager']
        },
        {
          title: 'Network Security',
          topics: ['VPC Security', 'AWS WAF', 'Shield & DDoS Protection', 'Private Link & VPN']
        },
        {
          title: 'Compliance & Monitoring',
          topics: ['AWS Config Rules', 'Security Hub', 'GuardDuty', 'Macie for Data Discovery']
        }
      ],
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
      color: 'blue'
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
      color: 'purple'
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
      color: 'red'
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
      color: 'purple'
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
      color: 'green'
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
      color: 'red'
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
      color: 'purple'
    }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? specializedCourses 
    : specializedCourses.filter(course => course.category === selectedCategory);

  const handleEnrollment = (course) => {
    const courseType = titleToIdMap[course.title];
    setEnrollmentModal({ isOpen: true, courseType, courseName: course.title });
  };

  const handleCourseDetails = (course) => {
    setCourseDetailsModal({ isOpen: true, course });
  };

  return (
    <div className="min-h-screen text-white">
      <AnimatedBackground variant="specialized">
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
                        {(() => {
                          const dynamicPricing = getPricing(course.title);
                          return dynamicPricing ? (
                            <>
                              <div className={`text-2xl font-bold text-${course.color}-400`}>{dynamicPricing.finalPrice}</div>
                              <div className="text-sm text-gray-500 line-through">{dynamicPricing.originalPrice}</div>
                            </>
                          ) : (
                            <>
                              <div className={`text-2xl font-bold text-${course.color}-400`}>{course.price}</div>
                              <div className="text-sm text-gray-500 line-through">{course.originalPrice}</div>
                            </>
                          );
                        })()}
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-blue-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Specialize?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Choose your specialization and become a domain expert. Start your journey to advanced cybersecurity expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className="bg-white text-purple-900 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              Explore All Courses
            </button>
            <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-purple-900 transition-all duration-300">
              Download Course Catalog
            </button>
          </div>
        </div>
      </section>
      </AnimatedBackground>

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
            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  {courseDetailsModal.course?.title}
                </h3>
                <p className="text-slate-600">
                  {courseDetailsModal.course?.description}
                </p>
              </div>
              <button
                onClick={() => setCourseDetailsModal({ isOpen: false, course: null })}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Course Details */}
              <div className="space-y-6">
                {/* Course Highlights */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-blue-600" />
                    Course Highlights
                  </h4>
                  <ul className="space-y-2">
                    {courseDetailsModal.course?.highlights?.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-700">
                        <ArrowRight size={14} className="text-blue-600 mt-1 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prerequisites */}
                {courseDetailsModal.course?.prerequisites && (
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">Prerequisites</h4>
                    <ul className="space-y-2">
                      {courseDetailsModal.course.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-700">
                          <ArrowRight size={14} className="text-orange-600 mt-1 flex-shrink-0" />
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Career Outcomes */}
                {courseDetailsModal.course?.careerOutcomes && (
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">Career Outcomes</h4>
                    <ul className="space-y-2">
                      {courseDetailsModal.course.careerOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-700">
                          <ArrowRight size={14} className="text-green-600 mt-1 flex-shrink-0" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column - Curriculum */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Play size={18} className="text-blue-600" />
                  Curriculum
                </h4>
                <div className="space-y-3">
                  {courseDetailsModal.course?.curriculum?.map((module, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <h5 className="font-medium text-slate-800 mb-2">
                        Module {index + 1}: {module.title}
                      </h5>
                      <ul className="space-y-1">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="text-sm text-slate-600 flex items-start gap-2">
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
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-blue-600">
                  {(() => {
                    const dynamicPricing = getPricing(courseDetailsModal.course?.title);
                    return dynamicPricing ? dynamicPricing.finalPrice : courseDetailsModal.course?.price;
                  })()}
                </div>
                <div className="text-sm text-slate-600">Duration: {courseDetailsModal.course?.duration}</div>
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
        coursePrice={pricingLoading ? undefined : (coursePricing?.[enrollmentModal.courseType]?.finalPrice)}
      />
      
      <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
      <ScrollNavigation />
    </div>
  );
};

export default SpecializedCoursesLandingPage;