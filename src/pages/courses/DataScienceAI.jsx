import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { Database, BarChart, Brain, TrendingUp } from 'lucide-react';

const DataScienceAI = () => {
  const courseData = {
    title: "Data Science & AI Engineer",
    subtitle: "Master Machine Learning, Deep Learning & Data Analytics",
    description: "Become a skilled data scientist and AI engineer with comprehensive training in machine learning, deep learning, data analytics, and artificial intelligence. Learn to extract insights from data, build predictive models, and create intelligent systems using Python, TensorFlow, and advanced analytics tools.",
    category: "technology",
    courseId: "data-science-ai",

    keyBenefits: [
      "Master machine learning and deep learning",
      "Learn data analytics and visualization",
      "Build AI models and intelligent systems",
      "Work with real-world datasets and projects",
      "Prepare for high-paying data science roles"
    ],

    duration: "8 Months",
    level: "Beginner to Advanced",
    price: "₹35,000",
    originalPrice: "₹50,000",

    batchInfo: {
      date: "10th December 2025",
      time: "10:00 AM TO 7:00 PM"
    },

    highlights: [
      {
        icon: Brain,
        title: "AI & Machine Learning",
        description: "Master supervised, unsupervised learning, and deep neural networks"
      },
      {
        icon: Database,
        title: "Data Analytics",
        description: "Learn data manipulation, cleaning, and statistical analysis techniques"
      },
      {
        icon: BarChart,
        title: "Data Visualization",
        description: "Create compelling visualizations using matplotlib, seaborn, and Tableau"
      },
      {
        icon: TrendingUp,
        title: "Predictive Modeling",
        description: "Build and deploy predictive models for business decision making"
      }
    ],

    features: [
      {
        title: "Python for Data Science",
        description: "Master Python libraries like NumPy, Pandas, Scikit-learn for data manipulation and analysis"
      },
      {
        title: "Machine Learning",
        description: "Comprehensive training in supervised, unsupervised, and reinforcement learning algorithms"
      },
      {
        title: "Deep Learning",
        description: "Neural networks, CNN, RNN, and modern architectures using TensorFlow and PyTorch"
      },
      {
        title: "Data Visualization",
        description: "Create interactive dashboards and visualizations using Tableau, Power BI, and Python"
      },
      {
        title: "Big Data Technologies",
        description: "Learn Spark, Hadoop, and cloud-based data processing platforms"
      },
      {
        title: "MLOps & Deployment",
        description: "Deploy machine learning models to production using cloud platforms and containers"
      }
    ],

    skills: [
      "Python Programming",
      "Machine Learning",
      "Deep Learning",
      "Data Analytics",
      "Statistics",
      "SQL & NoSQL",
      "TensorFlow/PyTorch",
      "Tableau/Power BI",
      "Apache Spark",
      "Cloud ML Platforms",
      "Model Deployment",
      "A/B Testing"
    ],

    curriculum: [
      {
        title: "Data Science Fundamentals",
        topics: [
          "Introduction to Data Science",
          "Statistics & Probability",
          "Data Types & Structures",
          "Research Methodology"
        ]
      },
      {
        title: "Python for Data Science",
        topics: [
          "NumPy for Numerical Computing",
          "Pandas for Data Manipulation",
          "Data Cleaning Techniques",
          "Exploratory Data Analysis"
        ]
      },
      {
        title: "Data Visualization",
        topics: [
          "Matplotlib & Seaborn",
          "Plotly for Interactive Plots",
          "Tableau Fundamentals",
          "Dashboard Development"
        ]
      },
      {
        title: "Machine Learning",
        topics: [
          "Supervised Learning Algorithms",
          "Unsupervised Learning",
          "Model Evaluation & Selection",
          "Feature Engineering"
        ]
      },
      {
        title: "Advanced Machine Learning",
        topics: [
          "Ensemble Methods",
          "Time Series Analysis",
          "Natural Language Processing",
          "Computer Vision Basics"
        ]
      },
      {
        title: "Deep Learning",
        topics: [
          "Neural Networks Fundamentals",
          "Convolutional Neural Networks",
          "Recurrent Neural Networks",
          "Transfer Learning"
        ]
      },
      {
        title: "Big Data & Cloud",
        topics: [
          "Apache Spark & PySpark",
          "Hadoop Ecosystem",
          "AWS/Azure ML Services",
          "Data Pipeline Development"
        ]
      },
      {
        title: "MLOps & Production",
        topics: [
          "Model Deployment Strategies",
          "Docker & Kubernetes",
          "Monitoring ML Models",
          "A/B Testing & Experimentation"
        ]
      }
    ],

    programs: [
      {
        name: "Standard Training",
        price: "₹35,000",
        type: "standard",
        popular: true,
        features: [
          "8 Months Comprehensive Training",
          "10+ Real-world Projects",
          "Industry Expert Instructors",
          "Portfolio Development",
          "Job Placement Assistance",
          "Lifetime Resource Access",
          "Industry Mentorship"
        ]
      },
      {
        name: "Advanced AI Specialist",
        price: "₹60,000",
        type: "advanced",
        features: [
          "12 Months Extended Program",
          "Advanced Deep Learning",
          "Research Project",
          "Industry Internship",
          "1-on-1 Mentoring",
          "Guaranteed High-Paying Job",
          "Advanced Certifications"
        ]
      }
    ],

    prerequisites: "Basic mathematics and statistics knowledge. Programming experience is helpful but not mandatory as we cover Python from basics. Strong analytical thinking and problem-solving skills are essential. Interest in working with data and numbers is important.",

    eligibility: [
      "Any Graduate - B.Tech, BSc, B.Com, BBA, etc.",
      "All IT & Non-IT Branches - CSE, EEE, Civil, Mech, Bio, etc.",
      "Working professionals in analytics roles",
      "Fresh graduates interested in data science",
      "Basic mathematics knowledge required"
    ],

    testimonials: [
      {
        name: "Neha Singh",
        role: "Data Scientist at Flipkart",
        content: "The data science course at Agnidhra was comprehensive and practical. I learned everything from Python basics to advanced machine learning. The real-world projects helped me land a data scientist role at Flipkart!"
      },
      {
        name: "Karthik Reddy",
        role: "ML Engineer at Amazon",
        content: "Excellent course covering the entire data science pipeline. The deep learning modules were particularly impressive. I'm now working as an ML engineer at Amazon with an amazing salary package."
      },
      {
        name: "Divya Sharma",
        role: "Analytics Manager at Uber",
        content: "The hands-on approach and industry-relevant projects made all the difference. I learned to work with real datasets and built a strong portfolio. Got promoted to analytics manager after completing the course!"
      }
    ],

    faqs: [
      {
        question: "What career opportunities are available in data science?",
        answer: "Data Science offers roles like Data Scientist, ML Engineer, Data Analyst, AI Engineer, Research Scientist, and Analytics Manager. Starting salaries range from ₹6-15 LPA with rapid growth potential."
      },
      {
        question: "Do I need a mathematics background for this course?",
        answer: "Basic mathematics and statistics knowledge is helpful, but we cover all necessary concepts during the course. Strong analytical thinking is more important than advanced mathematics."
      },
      {
        question: "What makes this course different from others?",
        answer: "Our course focuses heavily on practical application with real-world datasets, industry projects, and hands-on experience with latest tools and technologies used in the industry."
      },
      {
        question: "How much programming experience do I need?",
        answer: "No prior programming experience is required. We start with Python basics and gradually progress to advanced data science libraries and frameworks."
      },
      {
        question: "What kind of projects will I work on?",
        answer: "You'll work on projects like sales forecasting, recommendation systems, sentiment analysis, image classification, fraud detection, and market analysis using real datasets."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default DataScienceAI;