import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { Sword, Target, Shield, Lock, Eye, Code, Database, Globe } from 'lucide-react';

const OffensiveSecurityMastery = () => {
  const courseData = {
    title: "Offensive Security Mastery",
    subtitle: "Master Ethical Hacking & Penetration Testing",
    description: "Become an expert ethical hacker and penetration tester with comprehensive training in offensive security techniques, vulnerability assessment, and red team operations. This program takes you from beginner to advanced penetration testing professional ready to secure organizations through ethical hacking.",
    category: "cybersecurity",
    courseId: "offensive-security-mastery",

    keyBenefits: [
      "Master penetration testing methodologies",
      "Learn advanced exploitation techniques",
      "Hands-on experience with real environments",
      "Prepare for CEH and OSCP certifications",
      "Build comprehensive penetration testing reports"
    ],

    duration: "8 Weeks",
    level: "Beginner to Advanced",
    price: "₹20,000",
    originalPrice: "₹35,000",

    batchInfo: {
      date: "20th November 2025",
      time: "10:00 AM TO 07:00 PM"
    },

    highlights: [
      {
        icon: Sword,
        title: "Penetration Testing",
        description: "Master comprehensive penetration testing methodologies and frameworks"
      },
      {
        icon: Target,
        title: "Vulnerability Assessment",
        description: "Learn systematic vulnerability identification and exploitation techniques"
      },
      {
        icon: Shield,
        title: "Red Team Operations",
        description: "Advanced persistent threat simulation and adversarial tactics"
      },
      {
        icon: Eye,
        title: "Social Engineering",
        description: "Understand human factor exploitation and awareness techniques"
      }
    ],

    features: [
      {
        title: "Ethical Hacking Fundamentals",
        description: "Comprehensive foundation in ethical hacking principles and legal frameworks"
      },
      {
        title: "Web Application Security",
        description: "Advanced web application penetration testing and OWASP Top 10 exploitation"
      },
      {
        title: "Network Penetration Testing",
        description: "Internal and external network security assessment methodologies"
      },
      {
        title: "Wireless Security Testing",
        description: "WiFi, Bluetooth, and wireless protocol security assessment"
      },
      {
        title: "Mobile Application Security",
        description: "Android and iOS application security testing techniques"
      },
      {
        title: "Report Writing & Communication",
        description: "Professional penetration testing report writing and client communication"
      }
    ],

    skills: [
      "Penetration Testing",
      "Vulnerability Assessment",
      "Web Application Security",
      "Network Security Testing",
      "Wireless Security",
      "Social Engineering",
      "Exploit Development",
      "Post-Exploitation",
      "Red Team Operations",
      "Security Assessment",
      "Risk Analysis",
      "Report Writing"
    ],

    curriculum: [
      {
        title: "Ethical Hacking Fundamentals",
        topics: [
          "Ethics and Legal Framework",
          "Hacking Methodologies",
          "Information Gathering",
          "Footprinting and Reconnaissance"
        ]
      },
      {
        title: "Reconnaissance & Enumeration",
        topics: [
          "Passive Information Gathering",
          "Active Reconnaissance",
          "Network Enumeration",
          "Service Identification"
        ]
      },
      {
        title: "Vulnerability Assessment",
        topics: [
          "Vulnerability Scanning",
          "Manual Testing Techniques",
          "Vulnerability Prioritization",
          "Risk Assessment"
        ]
      },
      {
        title: "Web Application Security",
        topics: [
          "OWASP Top 10 Vulnerabilities",
          "SQL Injection Techniques",
          "Cross-Site Scripting (XSS)",
          "Authentication Bypass"
        ]
      },
      {
        title: "Network Penetration Testing",
        topics: [
          "Network Mapping",
          "Service Exploitation",
          "Privilege Escalation",
          "Lateral Movement"
        ]
      },
      {
        title: "Wireless Security",
        topics: [
          "WiFi Security Assessment",
          "WPA/WPA2 Cracking",
          "Bluetooth Security",
          "Wireless Attack Vectors"
        ]
      },
      {
        title: "Social Engineering",
        topics: [
          "Human Psychology Exploitation",
          "Phishing Campaigns",
          "Physical Security Testing",
          "Security Awareness"
        ]
      },
      {
        title: "Post-Exploitation & Reporting",
        topics: [
          "Maintaining Access",
          "Data Exfiltration",
          "Evidence Collection",
          "Professional Reporting"
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
          "Hands-on Lab Environment",
          "Real-world Penetration Testing",
          "Industry Expert Instructors",
          "CEH/OSCP Preparation",
          "Job Placement Assistance",
          "Lifetime Lab Access"
        ]
      },
      {
        name: "Advanced Red Team",
        price: "₹35,000",
        type: "advanced",
        features: [
          "12 Weeks Extended Program",
          "Advanced Persistent Threats",
          "Custom Exploit Development",
          "Red Team Simulation",
          "1-on-1 Mentoring",
          "Industry Internship",
          "Advanced Certifications"
        ]
      }
    ],

    prerequisites: "Basic understanding of computer networks, operating systems (Windows/Linux), and programming concepts is recommended. Some exposure to command-line interface would be beneficial but not mandatory. Strong analytical thinking and problem-solving skills are essential.",

    eligibility: [
      "Any Graduate - B.Tech, BSc, B.Com, BBA, etc.",
      "All IT & Non-IT Branches - CSE, EEE, Civil, Mech, Bio, etc.",
      "Cybersecurity professionals seeking specialization",
      "System administrators and network engineers",
      "Basic networking knowledge preferred but not required"
    ],

    testimonials: [
      {
        name: "Arjun Kumar",
        role: "Penetration Tester at Deloitte",
        content: "The offensive security training at Agnidhra was exceptional. The hands-on approach and real-world scenarios prepared me perfectly for my role as a penetration tester. I cleared my CEH certification within a month!"
      },
      {
        name: "Meera Iyer",
        role: "Security Consultant",
        content: "Outstanding course content and delivery. The instructors are industry experts who provide practical insights. I'm now working as an independent security consultant, thanks to the comprehensive training."
      },
      {
        name: "Vikram Singh",
        role: "Red Team Specialist at IBM",
        content: "The red team operations module was incredibly detailed. I learned advanced techniques that I use daily in my current role. The course gave me the confidence to pursue advanced certifications like OSCP."
      }
    ],

    faqs: [
      {
        question: "What career paths are available after completing this course?",
        answer: "Graduates can pursue roles as Penetration Tester, Ethical Hacker, Security Consultant, Red Team Specialist, Vulnerability Assessment Analyst, and Security Researcher. Starting salaries range from ₹5-12 LPA."
      },
      {
        question: "Is this course suitable for beginners?",
        answer: "Yes, the course is designed to take beginners from fundamentals to advanced level. We start with basics and progressively build to advanced penetration testing techniques."
      },
      {
        question: "What tools and environments will I work with?",
        answer: "You'll gain expertise in Kali Linux, Metasploit, Burp Suite, Nmap, Wireshark, Aircrack-ng, Social Engineering Toolkit, and various custom exploitation tools in our dedicated lab environment."
      },
      {
        question: "How does this prepare me for certifications?",
        answer: "The course curriculum is aligned with CEH (Certified Ethical Hacker), OSCP (Offensive Security Certified Professional), and other industry certifications with dedicated preparation modules."
      },
      {
        question: "What kind of hands-on experience will I get?",
        answer: "You'll perform real penetration tests on our lab environment, create professional reports, and work on simulated red team exercises that mirror real-world scenarios."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default OffensiveSecurityMastery;