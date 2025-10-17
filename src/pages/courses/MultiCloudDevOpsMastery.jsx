import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { Cloud, Server, Database, Code, Shield, Globe, Settings, Target } from 'lucide-react';

const MultiCloudDevOpsMastery = () => {
  const courseData = {
    title: "MultiCloud DevOps Mastery",
    subtitle: "Master AWS, Azure, GCP & DevSecOps Engineering",
    description: "Become a multi-cloud DevOps engineer with comprehensive training across AWS, Azure, and Google Cloud Platform. Learn infrastructure automation, containerization, CI/CD pipelines, and cloud security practices. This program prepares you for high-demand cloud engineering roles with hands-on experience across all major cloud platforms.",
    category: "cybersecurity",
    courseId: "multicloud-devops-mastery",

    keyBenefits: [
      "Master AWS, Azure, and Google Cloud Platform",
      "Learn infrastructure as code and automation",
      "Hands-on experience with Docker and Kubernetes",
      "Implement secure CI/CD pipelines",
      "Prepare for cloud certifications (AWS, Azure, GCP)"
    ],

    duration: "8 Weeks",
    level: "Beginner to Advanced",
    price: "₹20,000",
    originalPrice: "₹35,000",

    batchInfo: {
      date: "25th November 2025",
      time: "09:30 AM TO 06:30 PM"
    },

    highlights: [
      {
        icon: Cloud,
        title: "Multi-Cloud Expertise",
        description: "Master AWS, Azure, and GCP with hands-on experience across all platforms"
      },
      {
        icon: Server,
        title: "Infrastructure Automation",
        description: "Learn Terraform, CloudFormation, and infrastructure as code practices"
      },
      {
        icon: Database,
        title: "Container Orchestration",
        description: "Master Docker, Kubernetes, and container security best practices"
      },
      {
        icon: Shield,
        title: "DevSecOps Integration",
        description: "Implement security throughout the development and deployment pipeline"
      }
    ],

    features: [
      {
        title: "Multi-Cloud Architecture",
        description: "Design and implement solutions across AWS, Azure, and Google Cloud Platform"
      },
      {
        title: "Infrastructure as Code",
        description: "Master Terraform, ARM templates, and CloudFormation for automated deployments"
      },
      {
        title: "Container Technologies",
        description: "Comprehensive Docker and Kubernetes training with real-world scenarios"
      },
      {
        title: "CI/CD Pipeline Design",
        description: "Build robust continuous integration and deployment pipelines"
      },
      {
        title: "Cloud Security",
        description: "Implement security best practices and compliance across cloud environments"
      },
      {
        title: "Monitoring & Logging",
        description: "Set up comprehensive monitoring, logging, and alerting systems"
      }
    ],

    skills: [
      "AWS Services",
      "Azure Platform",
      "Google Cloud Platform",
      "Terraform",
      "Docker",
      "Kubernetes",
      "CI/CD Pipelines",
      "Infrastructure as Code",
      "Cloud Security",
      "DevSecOps",
      "Monitoring & Logging",
      "Cloud Architecture"
    ],

    curriculum: [
      {
        title: "Cloud Computing Fundamentals",
        topics: [
          "Cloud Service Models (IaaS, PaaS, SaaS)",
          "Multi-Cloud Strategy",
          "Cloud Economics and Cost Optimization",
          "Cloud Security Fundamentals"
        ]
      },
      {
        title: "Amazon Web Services (AWS)",
        topics: [
          "EC2, VPC, and Networking",
          "S3, RDS, and Storage Services",
          "IAM and Security Services",
          "Lambda and Serverless Computing"
        ]
      },
      {
        title: "Microsoft Azure",
        topics: [
          "Azure Virtual Machines and Networking",
          "Azure Storage and Databases",
          "Azure Active Directory",
          "Azure Functions and App Services"
        ]
      },
      {
        title: "Google Cloud Platform",
        topics: [
          "Compute Engine and Networking",
          "Cloud Storage and BigQuery",
          "Identity and Access Management",
          "Cloud Functions and App Engine"
        ]
      },
      {
        title: "Infrastructure as Code",
        topics: [
          "Terraform Fundamentals",
          "AWS CloudFormation",
          "Azure Resource Manager",
          "Version Control and GitOps"
        ]
      },
      {
        title: "Containerization & Orchestration",
        topics: [
          "Docker Fundamentals",
          "Kubernetes Architecture",
          "Container Security",
          "Service Mesh (Istio)"
        ]
      },
      {
        title: "CI/CD and DevOps",
        topics: [
          "Jenkins Pipeline Design",
          "GitHub Actions",
          "Azure DevOps",
          "Deployment Strategies"
        ]
      },
      {
        title: "Cloud Security & Compliance",
        topics: [
          "Cloud Security Best Practices",
          "Identity and Access Management",
          "Compliance Frameworks",
          "Security Monitoring"
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
          "Hands-on Cloud Labs",
          "Multi-Cloud Projects",
          "Industry Expert Instructors",
          "Cloud Certification Prep",
          "Job Placement Assistance",
          "Lifetime Cloud Lab Access"
        ]
      },
      {
        name: "Enterprise Track",
        price: "₹45,000",
        type: "enterprise",
        features: [
          "12 Weeks Extended Program",
          "Advanced Cloud Architecture",
          "Enterprise Security Focus",
          "Real Enterprise Projects",
          "1-on-1 Mentoring",
          "Industry Internship",
          "Multiple Cloud Certifications"
        ]
      }
    ],

    prerequisites: "Basic understanding of computer networks, operating systems (Windows/Linux), and programming concepts. Some experience with command-line interface and version control (Git) would be beneficial. Strong logical thinking and problem-solving skills are essential for cloud engineering.",

    eligibility: [
      "Any Graduate - B.Tech, BSc, B.Com, BBA, etc.",
      "All IT & Non-IT Branches - CSE, EEE, Civil, Mech, Bio, etc.",
      "System administrators and IT professionals",
      "Developers looking to expand into DevOps",
      "Basic programming knowledge preferred"
    ],

    testimonials: [
      {
        name: "Rajesh Gupta",
        role: "DevOps Engineer at Amazon",
        content: "The multi-cloud training at Agnidhra was comprehensive and practical. I learned AWS, Azure, and GCP thoroughly, which helped me land a DevOps engineer role at Amazon. The hands-on labs were exceptional!"
      },
      {
        name: "Kavya Nair",
        role: "Cloud Architect at Microsoft",
        content: "Excellent course structure covering all major cloud platforms. The infrastructure as code training and Kubernetes modules were particularly valuable. I'm now working as a cloud architect, thanks to this program."
      },
      {
        name: "Sanjay Reddy",
        role: "Site Reliability Engineer",
        content: "The DevSecOps focus of this course set it apart. I learned not just cloud technologies but also security best practices. This knowledge helped me transition into a high-paying SRE role."
      }
    ],

    faqs: [
      {
        question: "What job opportunities are available after this course?",
        answer: "Graduates can pursue roles as DevOps Engineer, Cloud Engineer, Site Reliability Engineer, Cloud Architect, Platform Engineer, and Infrastructure Engineer. Starting salaries range from ₹6-15 LPA."
      },
      {
        question: "Do I need prior cloud experience?",
        answer: "No prior cloud experience is required. The course starts with cloud fundamentals and progressively builds to advanced multi-cloud architectures and DevOps practices."
      },
      {
        question: "Which certifications should I pursue after this course?",
        answer: "We prepare you for AWS Solutions Architect, Azure Fundamentals/Administrator, Google Cloud Associate, and Kubernetes certifications. The course includes dedicated certification preparation."
      },
      {
        question: "What hands-on experience will I get?",
        answer: "You'll work with real cloud environments across AWS, Azure, and GCP, build complete CI/CD pipelines, deploy containerized applications, and manage infrastructure as code projects."
      },
      {
        question: "How current is the course content?",
        answer: "Our curriculum is updated regularly to include the latest cloud services, tools, and best practices. We ensure alignment with current industry demands and emerging technologies."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default MultiCloudDevOpsMastery;