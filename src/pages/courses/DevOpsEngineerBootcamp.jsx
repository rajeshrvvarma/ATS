import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { GitBranch, Container, Monitor, Settings } from 'lucide-react';

const DevOpsEngineerBootcamp = () => {
  const courseData = {
    title: "DevOps Engineer Bootcamp",
    subtitle: "Complete DevOps Pipeline Automation & Infrastructure Management",
    description: "Become a skilled DevOps engineer with comprehensive training in CI/CD pipelines, containerization, and infrastructure automation. Master the tools and practices that enable continuous delivery and scalable infrastructure management.",
    category: "technology",
    courseId: "devops-engineer-bootcamp",

    keyBenefits: [
      "Master CI/CD pipeline automation",
      "Learn Docker and Kubernetes",
      "Build infrastructure as code",
      "Automate deployment processes",
      "High-demand DevOps career opportunities"
    ],

    duration: "5 Months",
    level: "Intermediate",
    price: "₹27,000",
    originalPrice: "₹40,000",

    batchInfo: {
      date: "30th December 2025",
      time: "10:00 AM TO 7:00 PM"
    },

    highlights: [
      {
        icon: GitBranch,
        title: "CI/CD Pipelines",
        description: "Master Jenkins, GitLab CI, and automated deployment strategies"
      },
      {
        icon: Container,
        title: "Containerization",
        description: "Docker fundamentals and Kubernetes orchestration"
      },
      {
        icon: Settings,
        title: "Infrastructure as Code",
        description: "Terraform, Ansible, and automated infrastructure management"
      },
      {
        icon: Monitor,
        title: "Monitoring & Logging",
        description: "Implement comprehensive monitoring and alerting systems"
      }
    ],

    features: [
      {
        title: "CI/CD Pipeline Development",
        description: "Design and implement automated CI/CD pipelines using Jenkins, GitLab CI, and GitHub Actions"
      },
      {
        title: "Container Orchestration",
        description: "Master Docker containers and Kubernetes orchestration for scalable deployments"
      },
      {
        title: "Infrastructure Automation",
        description: "Implement Infrastructure as Code using Terraform and Ansible for automated provisioning"
      },
      {
        title: "Cloud Platform Integration",
        description: "Deploy and manage applications across AWS, Azure, and Google Cloud platforms"
      },
      {
        title: "Monitoring & Security",
        description: "Implement monitoring, logging, and security best practices in DevOps workflows"
      },
      {
        title: "Version Control Advanced",
        description: "Advanced Git workflows, branching strategies, and collaborative development practices"
      }
    ],

    skills: [
      "Jenkins CI/CD",
      "Docker & Kubernetes",
      "Terraform",
      "Ansible",
      "Git Advanced",
      "Linux Administration",
      "Shell Scripting",
      "AWS/Azure/GCP",
      "Monitoring Tools",
      "Security Practices",
      "Pipeline Automation",
      "Infrastructure as Code"
    ],

    curriculum: [
      {
        title: "DevOps Fundamentals",
        topics: [
          "DevOps Culture & Practices",
          "Agile & Lean Principles",
          "Continuous Integration Concepts",
          "Development Lifecycle"
        ]
      },
      {
        title: "Version Control & Collaboration",
        topics: [
          "Git Advanced Workflows",
          "Branching Strategies",
          "Code Review Processes",
          "Collaborative Development"
        ]
      },
      {
        title: "Linux & Scripting",
        topics: [
          "Linux System Administration",
          "Shell Scripting (Bash)",
          "Process Management",
          "Network Configuration"
        ]
      },
      {
        title: "CI/CD Pipeline Development",
        topics: [
          "Jenkins Setup & Configuration",
          "Pipeline as Code",
          "Automated Testing Integration",
          "Deployment Strategies"
        ]
      },
      {
        title: "Containerization",
        topics: [
          "Docker Fundamentals",
          "Container Images & Registries",
          "Docker Compose",
          "Container Security"
        ]
      },
      {
        title: "Container Orchestration",
        topics: [
          "Kubernetes Architecture",
          "Pods, Services & Deployments",
          "ConfigMaps & Secrets",
          "Kubernetes Networking"
        ]
      },
      {
        title: "Infrastructure as Code",
        topics: [
          "Terraform Basics & Advanced",
          "Ansible Automation",
          "Configuration Management",
          "Infrastructure Provisioning"
        ]
      },
      {
        title: "Monitoring & Security",
        topics: [
          "Monitoring Tools (Prometheus, Grafana)",
          "Log Management (ELK Stack)",
          "Security Best Practices",
          "Incident Response"
        ]
      }
    ],

    programs: [
      {
        name: "Standard Training",
        price: "₹27,000",
        type: "standard",
        popular: true,
        features: [
          "5 Months Comprehensive Training",
          "6+ Real Pipeline Projects",
          "Industry-Standard Tools",
          "Hands-on Lab Environment",
          "Job Placement Assistance",
          "DevOps Certification Preparation",
          "Lifetime Resources Access"
        ]
      },
      {
        name: "DevOps Specialist",
        price: "₹45,000",
        type: "advanced",
        features: [
          "7 Months Extended Program",
          "Advanced Cloud Architecture",
          "Site Reliability Engineering",
          "Industry Internship",
          "1-on-1 Senior DevOps Mentoring",
          "Guaranteed High-Paying Job",
          "Multiple Cloud Certifications"
        ]
      }
    ],

    prerequisites: "Basic Linux knowledge and understanding of software development lifecycle. Networking fundamentals are helpful. No prior DevOps experience required as we cover everything from basics. Strong problem-solving skills and willingness to learn automation are essential.",

    eligibility: [
      "Any Graduate - B.Tech, BSc, B.Com, BBA, etc.",
      "IT & Software Development Professionals",
      "System administrators and developers",
      "Fresh graduates interested in DevOps",
      "Working professionals seeking DevOps transition"
    ],

    testimonials: [
      {
        name: "Suresh Reddy",
        role: "DevOps Engineer at Amazon",
        content: "The DevOps bootcamp was transformative for my career. The hands-on approach with real CI/CD pipelines and Kubernetes gave me the confidence to handle enterprise environments. Now working at Amazon with amazing growth!"
      },
      {
        name: "Kavitha Singh",
        role: "Site Reliability Engineer at Google",
        content: "Excellent course covering the entire DevOps spectrum. The Infrastructure as Code modules were particularly valuable. I learned to automate complex deployments and landed my dream job at Google as SRE."
      },
      {
        name: "Rajesh Kumar",
        role: "DevOps Lead at Microsoft",
        content: "The practical projects and industry-standard tools training made all the difference. I went from a traditional sysadmin role to DevOps lead at Microsoft with 70% salary increase after this course!"
      }
    ],

    faqs: [
      {
        question: "What career opportunities are available in DevOps?",
        answer: "DevOps offers excellent opportunities including DevOps Engineer, Site Reliability Engineer, Cloud Infrastructure Engineer, and DevOps Architect roles. Starting salaries range from ₹6-15 LPA with rapid growth potential."
      },
      {
        question: "Do I need programming experience for DevOps?",
        answer: "Basic programming knowledge is helpful but not mandatory. We teach scripting from basics. More important are system administration skills, logical thinking, and willingness to learn automation tools."
      },
      {
        question: "Which cloud platforms will be covered?",
        answer: "We cover all major cloud platforms - AWS, Azure, and Google Cloud. You'll learn to deploy and manage applications across multiple cloud environments using DevOps practices."
      },
      {
        question: "What makes DevOps engineers so valuable?",
        answer: "DevOps engineers bridge development and operations, enabling faster releases, improved reliability, and reduced costs. They're essential for modern software delivery and digital transformation."
      },
      {
        question: "Will I get hands-on experience with real projects?",
        answer: "Absolutely! Our course is 70% hands-on with real CI/CD pipelines, container deployments, and infrastructure automation projects using industry-standard tools and practices."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default DevOpsEngineerBootcamp;