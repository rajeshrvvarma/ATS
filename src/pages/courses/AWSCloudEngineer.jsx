import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { Cloud, Server, Shield, Database, Settings, GitBranch, Layers, Zap } from 'lucide-react';

const AWSCloudEngineer = () => {
  const courseData = {
    title: "AWS Cloud Engineer",
    subtitle: "Master Amazon Web Services & Cloud Architecture",
    description: "Become a certified AWS Cloud Engineer with comprehensive training in cloud infrastructure, services, and architecture. Learn to design, deploy, and manage scalable cloud solutions using Amazon Web Services. Master DevOps practices, automation, and cloud security for enterprise-grade applications.",
    category: "technology",
    courseId: "aws-cloud-engineer",

    keyBenefits: [
      "Master AWS cloud services and architecture",
      "Learn cloud infrastructure and automation",
      "Prepare for AWS certifications",
      "Build scalable and secure cloud solutions",
      "High-demand cloud engineer career opportunities"
    ],

    duration: "6 Months",
    level: "Beginner to Advanced",
    price: "₹30,000",
    originalPrice: "₹45,000",

    batchInfo: {
      date: "15th December 2025",
      time: "10:00 AM TO 7:00 PM"
    },

    highlights: [
      {
        icon: Cloud,
        title: "AWS Core Services",
        description: "Master EC2, S3, RDS, Lambda, and other essential AWS services"
      },
      {
        icon: Server,
        title: "Cloud Architecture",
        description: "Design scalable and resilient cloud infrastructure solutions"
      },
      {
        icon: Shield,
        title: "Cloud Security",
        description: "Implement security best practices and compliance in cloud environments"
      },
      {
        icon: Settings,
        title: "Automation & DevOps",
        description: "Automate deployments using Infrastructure as Code and CI/CD pipelines"
      }
    ],

    features: [
      {
        title: "AWS Core Services",
        description: "Comprehensive training on EC2, S3, VPC, RDS, Lambda, and other essential AWS services"
      },
      {
        title: "Cloud Architecture",
        description: "Learn to design highly available, scalable, and cost-effective cloud solutions"
      },
      {
        title: "Infrastructure as Code",
        description: "Master CloudFormation, Terraform, and CDK for automated infrastructure management"
      },
      {
        title: "Container Services",
        description: "Deploy and manage applications using ECS, EKS, and container orchestration"
      },
      {
        title: "Monitoring & Logging",
        description: "Implement comprehensive monitoring using CloudWatch, X-Ray, and other tools"
      },
      {
        title: "Cost Optimization",
        description: "Learn strategies to optimize AWS costs and implement cost governance"
      }
    ],

    skills: [
      "AWS Core Services",
      "Cloud Architecture",
      "Infrastructure as Code",
      "Docker & Kubernetes",
      "CI/CD Pipelines",
      "Cloud Security",
      "Monitoring & Logging",
      "Cost Optimization",
      "Terraform",
      "CloudFormation",
      "DevOps Practices",
      "Linux Administration"
    ],

    curriculum: [
      {
        title: "Cloud Computing Fundamentals",
        topics: [
          "Introduction to Cloud Computing",
          "AWS Global Infrastructure",
          "Core AWS Services Overview",
          "AWS Management Console"
        ]
      },
      {
        title: "Compute Services",
        topics: [
          "Amazon EC2 - Virtual Servers",
          "Auto Scaling & Load Balancing",
          "AWS Lambda - Serverless Computing",
          "Elastic Beanstalk"
        ]
      },
      {
        title: "Storage & Database Services",
        topics: [
          "Amazon S3 - Object Storage",
          "EBS - Block Storage",
          "Amazon RDS - Relational Database",
          "DynamoDB - NoSQL Database"
        ]
      },
      {
        title: "Networking & Security",
        topics: [
          "Amazon VPC - Virtual Private Cloud",
          "Security Groups & NACLs",
          "IAM - Identity & Access Management",
          "AWS Security Best Practices"
        ]
      },
      {
        title: "DevOps & Automation",
        topics: [
          "Infrastructure as Code",
          "AWS CloudFormation",
          "AWS CodePipeline & CodeBuild",
          "Configuration Management"
        ]
      },
      {
        title: "Container Services",
        topics: [
          "Docker Fundamentals",
          "Amazon ECS - Container Service",
          "Amazon EKS - Kubernetes Service",
          "Container Orchestration"
        ]
      },
      {
        title: "Monitoring & Operations",
        topics: [
          "Amazon CloudWatch",
          "AWS X-Ray - Application Tracing",
          "AWS Systems Manager",
          "Troubleshooting & Optimization"
        ]
      },
      {
        title: "Advanced Topics & Certification",
        topics: [
          "Disaster Recovery Strategies",
          "Multi-Region Deployments",
          "Cost Optimization Techniques",
          "AWS Certification Preparation"
        ]
      }
    ],

    programs: [
      {
        name: "Standard Training",
        price: "₹30,000",
        type: "standard",
        popular: true,
        features: [
          "6 Months Comprehensive Training",
          "8+ Real AWS Projects",
          "AWS Certification Preparation",
          "Hands-on Lab Sessions",
          "Job Placement Assistance",
          "Industry Mentorship",
          "Lifetime AWS Resources Access"
        ]
      },
      {
        name: "AWS Solutions Architect",
        price: "₹50,000",
        type: "advanced",
        features: [
          "8 Months Extended Program",
          "Advanced Architecture Patterns",
          "Multi-Cloud Integration",
          "Enterprise Project Work",
          "AWS Professional Certification",
          "Guaranteed High-Paying Job",
          "1-on-1 Architect Mentoring"
        ]
      }
    ],

    prerequisites: "Basic understanding of operating systems and networking concepts. Familiarity with Linux command line is helpful but not mandatory. No prior cloud experience required as we cover everything from fundamentals. Strong problem-solving skills and willingness to learn new technologies.",

    eligibility: [
      "Any Graduate - B.Tech, BSc, B.Com, BBA, etc.",
      "IT & Non-IT Professionals",
      "System administrators and developers",
      "Fresh graduates interested in cloud computing",
      "Working professionals seeking cloud skills"
    ],

    testimonials: [
      {
        name: "Rahul Kumar",
        role: "Cloud Engineer at TCS",
        content: "The AWS course was exactly what I needed to transition to cloud computing. The hands-on projects and real-world scenarios prepared me perfectly for my cloud engineer role at TCS. Highly recommended!"
      },
      {
        name: "Priya Patel",
        role: "DevOps Engineer at Infosys",
        content: "Excellent course structure covering all aspects of AWS. The Infrastructure as Code modules were particularly valuable. I cleared my AWS certification and got promoted to DevOps engineer position."
      },
      {
        name: "Amit Sharma",
        role: "Solutions Architect at Wipro",
        content: "The practical approach and industry-relevant projects made this course outstanding. I learned to design enterprise-grade cloud solutions and now work as a solutions architect with 40% salary increase."
      }
    ],

    faqs: [
      {
        question: "What career opportunities are available in AWS cloud computing?",
        answer: "AWS skills open doors to roles like Cloud Engineer, Solutions Architect, DevOps Engineer, Cloud Security Specialist, and Site Reliability Engineer. Starting salaries range from ₹5-12 LPA with excellent growth prospects."
      },
      {
        question: "Do I need prior cloud experience for this course?",
        answer: "No prior cloud experience is required. We start from cloud computing fundamentals and gradually progress to advanced AWS services and architecture patterns."
      },
      {
        question: "Will this course help me get AWS certified?",
        answer: "Yes, our course specifically prepares you for AWS certifications including Cloud Practitioner, Solutions Architect Associate, and Developer Associate exams."
      },
      {
        question: "What makes AWS skills so valuable in the job market?",
        answer: "AWS is the leading cloud platform with massive enterprise adoption. Cloud engineers are in high demand with excellent salary packages and growth opportunities across all industries."
      },
      {
        question: "How much hands-on practice will I get?",
        answer: "Our course is heavily practical with 70% hands-on labs and projects. You'll work on real AWS environments, deploy applications, and build complete cloud solutions."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default AWSCloudEngineer;