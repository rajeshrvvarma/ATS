import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { Shield, Target, Users, BookOpen } from 'lucide-react';

const DefensiveSecurityProfessional = () => {
  const courseData = {
    title: "Defensive Security Professional",
    subtitle: "Master SOC Operations, Incident Response & Threat Detection",
    description: "Become a cybersecurity defender with comprehensive training in Security Operations Center (SOC) operations, incident response, threat hunting, and defensive security strategies. This program transforms beginners into skilled security analysts ready to protect organizations from cyber threats.",
    category: "cybersecurity",
    courseId: "defensive-security-professional",

    keyBenefits: [
      "Master SOC Analyst tools and techniques",
      "Learn incident response and threat hunting",
      "Hands-on experience with SIEM platforms",
      "Industry-recognized certifications preparation",
      "Real-world security scenarios and simulations"
    ],

    duration: "8 Weeks",
    level: "Beginner to Advanced",
    price: "₹20,000",
    originalPrice: "₹35,000",

    batchInfo: {
      date: "15th November 2025",
      time: "09:00 AM TO 06:00 PM"
    },

    highlights: [
      {
        icon: Shield,
        title: "SOC Operations Mastery",
        description: "Master security monitoring, threat detection, and incident response workflows"
      },
      {
        icon: Target,
        title: "Threat Hunting Skills",
        description: "Learn proactive threat hunting techniques and advanced detection methods"
      },
      {
        icon: Users,
        title: "Real-World Experience",
        description: "Practice with actual security incidents and industry-standard tools"
      },
      {
        icon: BookOpen,
        title: "Industry Certifications",
        description: "Prepare for CompTIA Security+, CySA+, and other industry certifications"
      }
    ],

    features: [
      {
        title: "SIEM Platform Mastery",
        description: "Hands-on experience with Splunk, QRadar, and other leading SIEM platforms"
      },
      {
        title: "Incident Response Framework",
        description: "Learn NIST and ISO incident response frameworks with practical scenarios"
      },
      {
        title: "Threat Intelligence",
        description: "Understand threat intelligence sources and integration into security operations"
      },
      {
        title: "Security Monitoring",
        description: "Master 24/7 security monitoring techniques and alert triage"
      },
      {
        title: "Malware Analysis",
        description: "Basic to intermediate malware analysis and reverse engineering"
      },
      {
        title: "Compliance & Reporting",
        description: "Learn regulatory compliance requirements and security reporting"
      }
    ],

    skills: [
      "SIEM Operations",
      "Incident Response",
      "Threat Hunting",
      "Log Analysis",
      "Network Security Monitoring",
      "Malware Analysis",
      "Digital Forensics",
      "Vulnerability Assessment",
      "Security Frameworks",
      "Threat Intelligence",
      "Security Automation",
      "Compliance Management"
    ],

    curriculum: [
      {
        title: "Cybersecurity Fundamentals",
        topics: [
          "CIA Triad and Security Principles",
          "Threat Landscape Overview",
          "Risk Management Basics",
          "Security Frameworks (NIST, ISO 27001)"
        ]
      },
      {
        title: "SOC Operations & SIEM",
        topics: [
          "SOC Structure and Roles",
          "SIEM Platform Operations",
          "Log Collection and Analysis",
          "Alert Triage and Investigation"
        ]
      },
      {
        title: "Incident Response",
        topics: [
          "Incident Response Lifecycle",
          "Evidence Collection and Preservation",
          "Containment and Eradication",
          "Recovery and Lessons Learned"
        ]
      },
      {
        title: "Threat Hunting & Intelligence",
        topics: [
          "Threat Hunting Methodologies",
          "Threat Intelligence Sources",
          "IOCs and TTPs Analysis",
          "Threat Landscape Assessment"
        ]
      },
      {
        title: "Network Security Monitoring",
        topics: [
          "Network Traffic Analysis",
          "IDS/IPS Configuration",
          "Packet Capture Analysis",
          "Network Anomaly Detection"
        ]
      },
      {
        title: "Malware Analysis Basics",
        topics: [
          "Static Malware Analysis",
          "Dynamic Analysis Techniques",
          "Sandbox Analysis",
          "Malware Classification"
        ]
      },
      {
        title: "Digital Forensics",
        topics: [
          "Forensic Investigation Process",
          "Evidence Acquisition",
          "File System Analysis",
          "Memory Forensics"
        ]
      },
      {
        title: "Compliance & Reporting",
        topics: [
          "Regulatory Requirements",
          "Security Metrics and KPIs",
          "Incident Reporting",
          "Audit Preparation"
        ]
      }
    ],

    programs: [
      {
        name: "Premium Training",
        price: "₹20,000",
        type: "premium",
        popular: true,
        features: [
          "8 Weeks Intensive Training",
          "Hands-on Lab Sessions",
          "Industry Expert Instructors",
          "Real-world Projects",
          "Certification Preparation",
          "Job Placement Assistance",
          "Lifetime Access to Resources"
        ]
      },
      {
        name: "Corporate Training",
        price: "Contact Us",
        type: "corporate",
        features: [
          "Customized Curriculum",
          "On-site Training Available",
          "Team-based Learning",
          "Flexible Scheduling",
          "Multiple Batches",
          "Volume Discounts",
          "Executive Briefings"
        ]
      }
    ],

    prerequisites: "Basic understanding of computer networks and operating systems is helpful but not mandatory. This course is designed to take beginners from fundamentals to professional level. Enthusiasm to learn cybersecurity and commitment to hands-on practice are the main requirements.",

    eligibility: [
      "Any Graduate - B.Tech, BSc, B.Com, BBA, etc.",
      "All IT & Non-IT Branches - CSE, EEE, Civil, Mech, Bio, etc.",
      "Working professionals seeking career transition",
      "No prior cybersecurity experience required",
      "No CGPA cut-off. Career gap is not a barrier"
    ],

    testimonials: [
      {
        name: "Priya Sharma",
        role: "SOC Analyst at TCS",
        content: "The defensive security course at Agnidhra was exactly what I needed. The hands-on SIEM training and real incident scenarios prepared me perfectly for my current role as a SOC analyst."
      },
      {
        name: "Rahul Patel",
        role: "Security Engineer at Infosys",
        content: "Excellent training program with industry-relevant content. The instructors are knowledgeable and the practical approach helped me land a security engineer position within 2 months of completion."
      },
      {
        name: "Sneha Reddy",
        role: "Incident Response Specialist",
        content: "The incident response training was outstanding. I learned everything from basic concepts to advanced threat hunting. Now I'm confidently handling security incidents at my organization."
      }
    ],

    faqs: [
      {
        question: "What career opportunities are available after this course?",
        answer: "Graduates can pursue roles as SOC Analyst, Security Engineer, Incident Response Specialist, Cyber Threat Analyst, Security Consultant, and Compliance Analyst. The average starting salary ranges from ₹4-8 LPA."
      },
      {
        question: "Do I need prior cybersecurity experience?",
        answer: "No prior cybersecurity experience is required. The course starts with fundamentals and progressively builds to advanced topics. Basic computer knowledge is sufficient."
      },
      {
        question: "What tools and platforms will I learn?",
        answer: "You'll get hands-on experience with industry-standard tools including Splunk, QRadar, Wireshark, Metasploit, YARA, and various open-source security tools."
      },
      {
        question: "Is there placement assistance provided?",
        answer: "Yes, we provide comprehensive placement assistance including resume building, interview preparation, and direct connections with our hiring partners in the cybersecurity industry."
      },
      {
        question: "What certifications should I pursue after this course?",
        answer: "We recommend CompTIA Security+, CompTIA CySA+, GCIH (GIAC), or vendor-specific certifications like Splunk or IBM QRadar certifications."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default DefensiveSecurityProfessional;