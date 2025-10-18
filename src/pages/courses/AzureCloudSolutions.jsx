import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { Cloud, Shield, Settings, Database } from 'lucide-react';

const AzureCloudSolutions = () => {
  const courseData = {
    title: "Azure Cloud Solutions",
    subtitle: "Microsoft Azure Cloud Services & Enterprise Solutions",
    description: "Master Microsoft Azure cloud platform with comprehensive training in Azure services, Active Directory, DevOps, and enterprise solutions. Learn to design, deploy, and manage scalable cloud applications on Azure.",
    category: "technology",
    courseId: "azure-cloud-solutions",

    keyBenefits: [
      "Master Microsoft Azure cloud platform",
      "Learn Azure Active Directory and security",
      "Build enterprise cloud solutions",
      "Prepare for Azure certifications",
      "High-demand Azure specialist career"
    ],

    duration: "4 Months",
    level: "Intermediate",
    price: "₹24,000",
    originalPrice: "₹36,000",

    batchInfo: {
      date: "5th January 2026",
      time: "10:00 AM TO 7:00 PM"
    },

    highlights: [
      {
        icon: Cloud,
        title: "Azure Core Services",
        description: "Master virtual machines, storage, networking, and compute services"
      },
      {
        icon: Shield,
        title: "Identity & Security",
        description: "Azure Active Directory, security center, and access management"
      },
      {
        icon: Settings,
        title: "DevOps Integration",
        description: "Azure DevOps services and CI/CD pipeline implementation"
      },
      {
        icon: Database,
        title: "Data & Analytics",
        description: "Azure SQL, Cosmos DB, and data analytics services"
      }
    ],

    features: [
      {
        title: "Azure Fundamentals",
        description: "Complete understanding of Azure portal, CLI, and core cloud computing concepts"
      },
      {
        title: "Compute & Networking",
        description: "Virtual machines, app services, virtual networks, and load balancing"
      },
      {
        title: "Identity Management",
        description: "Azure Active Directory, role-based access control, and enterprise identity solutions"
      },
      {
        title: "Data Services",
        description: "Azure SQL Database, Cosmos DB, and modern data storage solutions"
      },
      {
        title: "DevOps & Automation",
        description: "Azure DevOps, pipelines, and infrastructure automation"
      },
      {
        title: "Security & Compliance",
        description: "Azure Security Center, Key Vault, and enterprise compliance features"
      }
    ],

    skills: [
      "Azure Portal & CLI",
      "Virtual Machines",
      "Azure Active Directory",
      "App Services",
      "Virtual Networks",
      "Azure SQL Database",
      "Azure DevOps",
      "Security Center",
      "Key Vault",
      "Power Platform",
      "ARM Templates",
      "Azure Functions"
    ],

    curriculum: [
      {
        title: "Azure Cloud Fundamentals",
        topics: [
          "Azure Overview & Services",
          "Azure Portal & Management",
          "Azure CLI & PowerShell",
          "Resource Groups & Management"
        ]
      },
      {
        title: "Compute Services",
        topics: [
          "Virtual Machines",
          "App Services",
          "Container Instances",
          "Azure Functions"
        ]
      },
      {
        title: "Networking Services",
        topics: [
          "Virtual Networks",
          "Load Balancers",
          "Application Gateway",
          "VPN & ExpressRoute"
        ]
      },
      {
        title: "Storage & Databases",
        topics: [
          "Azure Storage Accounts",
          "Azure SQL Database",
          "Cosmos DB",
          "Database Migration"
        ]
      },
      {
        title: "Identity & Security",
        topics: [
          "Azure Active Directory",
          "Role-based Access Control",
          "Azure Security Center",
          "Key Vault Management"
        ]
      },
      {
        title: "DevOps & Automation",
        topics: [
          "Azure DevOps Services",
          "CI/CD Pipelines",
          "ARM Templates",
          "Infrastructure as Code"
        ]
      },
      {
        title: "Monitoring & Management",
        topics: [
          "Azure Monitor",
          "Log Analytics",
          "Application Insights",
          "Cost Management"
        ]
      },
      {
        title: "Enterprise Solutions",
        topics: [
          "Power Platform Integration",
          "Hybrid Cloud Solutions",
          "Migration Strategies",
          "Best Practices"
        ]
      }
    ],

    programs: [
      {
        name: "Standard Training",
        price: "₹24,000",
        type: "standard",
        popular: true,
        features: [
          "4 Months Comprehensive Training",
          "6+ Real Azure Projects",
          "AZ-900/104 Certification Prep",
          "Microsoft Partnership Benefits",
          "Job Placement Assistance",
          "Enterprise Focus Training",
          "Lifetime Resources Access"
        ]
      },
      {
        name: "Azure Solutions Architect",
        price: "₹42,000",
        type: "advanced",
        features: [
          "6 Months Extended Program",
          "Advanced Architecture Patterns",
          "Multi-Cloud Integration",
          "Enterprise Project Work",
          "AZ-303/304 Certification",
          "Guaranteed High-Paying Job",
          "1-on-1 Azure Expert Mentoring"
        ]
      }
    ],

    prerequisites: "Basic understanding of cloud computing concepts and Windows/Linux administration. Networking fundamentals are helpful. No prior Azure experience required as we cover everything from basics. Interest in Microsoft technologies is beneficial.",

    eligibility: [
      "Any Graduate - B.Tech, BSc, B.Com, BBA, etc.",
      "IT Professionals and System Administrators",
      "Software developers and architects",
      "Fresh graduates interested in cloud computing",
      "Microsoft technology enthusiasts"
    ],

    testimonials: [
      {
        name: "Ananya Gupta",
        role: "Azure Developer at Microsoft",
        content: "The Azure course was comprehensive and perfectly structured. The hands-on labs and enterprise focus helped me understand real-world Azure implementations. Now working at Microsoft as an Azure developer!"
      },
      {
        name: "Vikram Sharma",
        role: "Cloud Architect at Accenture",
        content: "Excellent course covering the entire Azure ecosystem. The identity and security modules were particularly valuable. I cleared my Azure certifications and got promoted to cloud architect role."
      },
      {
        name: "Deepika Patel",
        role: "Azure Consultant at Deloitte",
        content: "The practical approach and industry partnerships made this course outstanding. I learned to design enterprise Azure solutions and now work as a consultant with excellent growth prospects."
      }
    ],

    faqs: [
      {
        question: "What career opportunities are available in Azure?",
        answer: "Azure offers excellent opportunities including Azure Developer, Solutions Architect, Cloud Engineer, and Azure Consultant roles. Starting salaries range from ₹5-12 LPA with strong growth in enterprise markets."
      },
      {
        question: "How does Azure compare to AWS?",
        answer: "Azure is Microsoft's cloud platform with strong enterprise integration, especially with Microsoft technologies. It's particularly valuable for organizations using Windows, Office 365, and .NET technologies."
      },
      {
        question: "Will this course help me get Azure certified?",
        answer: "Yes, our course specifically prepares you for Azure certifications including AZ-900 (Fundamentals), AZ-104 (Administrator), and advanced architect certifications."
      },
      {
        question: "Do I need Microsoft technology background?",
        answer: "While Microsoft technology background is helpful, it's not required. We cover Azure from fundamentals and provide context for Microsoft ecosystem integration."
      },
      {
        question: "What kind of projects will I work on?",
        answer: "You'll work on enterprise projects like web application deployment, identity management systems, data analytics solutions, and hybrid cloud implementations using Azure services."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default AzureCloudSolutions;