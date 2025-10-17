import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { Brain, Cpu, Eye, MessageCircle, BarChart, Code, Zap, Target } from 'lucide-react';

const AIMLEngineer = () => {
  const courseData = {
    title: "AI & Machine Learning Engineer",
    subtitle: "Advanced AI Development with Deep Learning & Neural Networks",
    description: "Become an advanced AI/ML engineer with comprehensive training in machine learning, deep learning, computer vision, and natural language processing. Master cutting-edge AI technologies and build intelligent systems that solve real-world problems.",
    category: "technology",
    courseId: "ai-ml-engineer",

    keyBenefits: [
      "Master advanced AI and ML algorithms",
      "Learn deep learning and neural networks",
      "Build computer vision applications",
      "Develop NLP and chatbot systems",
      "High-paying AI engineer career opportunities"
    ],

    duration: "6 Months",
    level: "Intermediate to Advanced",
    price: "₹35,000",
    originalPrice: "₹50,000",

    batchInfo: {
      date: "10th January 2026",
      time: "10:00 AM TO 7:00 PM"
    },

    highlights: [
      {
        icon: Brain,
        title: "Advanced Machine Learning",
        description: "Master ensemble methods, feature engineering, and advanced algorithms"
      },
      {
        icon: Cpu,
        title: "Deep Learning",
        description: "Neural networks, CNNs, RNNs, and modern architectures"
      },
      {
        icon: Eye,
        title: "Computer Vision",
        description: "OpenCV applications, image processing, and vision AI"
      },
      {
        icon: MessageCircle,
        title: "Natural Language Processing",
        description: "Text analytics, sentiment analysis, and language models"
      }
    ],

    features: [
      {
        title: "Advanced Machine Learning",
        description: "Ensemble methods, feature engineering, model optimization, and advanced algorithms"
      },
      {
        title: "Deep Neural Networks",
        description: "Build and train neural networks, CNNs, RNNs, and modern architectures like Transformers"
      },
      {
        title: "Computer Vision",
        description: "OpenCV applications, image processing, object detection, and vision AI systems"
      },
      {
        title: "Natural Language Processing",
        description: "Text analytics, sentiment analysis, chatbots, and large language models"
      },
      {
        title: "MLOps & Deployment",
        description: "Model deployment, MLOps pipelines, and production AI system management"
      },
      {
        title: "AI Ethics & Research",
        description: "Responsible AI development, ethics, bias detection, and research methodologies"
      }
    ],

    skills: [
      "Advanced Machine Learning",
      "Deep Learning",
      "TensorFlow/PyTorch",
      "Computer Vision",
      "OpenCV",
      "Natural Language Processing",
      "Neural Networks",
      "Model Deployment",
      "MLOps",
      "Python Advanced",
      "Research Methodologies",
      "AI Ethics"
    ],

    curriculum: [
      {
        title: "Advanced Machine Learning",
        topics: [
          "Ensemble Methods (Random Forest, XGBoost)",
          "Feature Engineering & Selection",
          "Model Optimization & Tuning",
          "Advanced Algorithms"
        ]
      },
      {
        title: "Deep Learning Fundamentals",
        topics: [
          "Neural Networks Architecture",
          "Backpropagation & Optimization",
          "TensorFlow & PyTorch",
          "Regularization Techniques"
        ]
      },
      {
        title: "Convolutional Neural Networks",
        topics: [
          "CNN Architecture",
          "Image Classification",
          "Object Detection (YOLO, R-CNN)",
          "Transfer Learning"
        ]
      },
      {
        title: "Recurrent Neural Networks",
        topics: [
          "RNN & LSTM Architecture",
          "Sequence Modeling",
          "Time Series Prediction",
          "Attention Mechanisms"
        ]
      },
      {
        title: "Computer Vision",
        topics: [
          "OpenCV Fundamentals",
          "Image Processing Techniques",
          "Feature Detection",
          "Vision AI Applications"
        ]
      },
      {
        title: "Natural Language Processing",
        topics: [
          "Text Preprocessing",
          "Sentiment Analysis",
          "Named Entity Recognition",
          "Language Models (BERT, GPT)"
        ]
      },
      {
        title: "Advanced AI Topics",
        topics: [
          "Generative Adversarial Networks",
          "Reinforcement Learning",
          "Transformer Architecture",
          "AI Research Methods"
        ]
      },
      {
        title: "MLOps & Production",
        topics: [
          "Model Deployment Strategies",
          "MLOps Pipelines",
          "Model Monitoring",
          "AI Ethics & Bias Detection"
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
          "6 Months Intensive Training",
          "10+ AI Research Projects",
          "TensorFlow/PyTorch Mastery",
          "Computer Vision & NLP Focus",
          "Job Placement Assistance",
          "Industry Mentorship",
          "Advanced Certification"
        ]
      },
      {
        name: "AI Research Specialist",
        price: "₹60,000",
        type: "advanced",
        features: [
          "8 Months Extended Program",
          "Research Project Publication",
          "PhD-level Mentoring",
          "Industry Research Internship",
          "1-on-1 AI Expert Guidance",
          "Guaranteed Research Position",
          "Conference Presentation Opportunity"
        ]
      }
    ],

    prerequisites: "Strong Python programming skills and mathematics/statistics background. Basic machine learning knowledge is required. Linear algebra, calculus, and probability concepts should be familiar. Experience with data analysis is helpful.",

    eligibility: [
      "Engineering Graduates - CSE, IT, ECE, etc.",
      "Mathematics/Statistics Background",
      "Data Science professionals seeking advancement",
      "Software developers with ML interest",
      "Research-oriented individuals"
    ],

    testimonials: [
      {
        name: "Dr. Arjun Singh",
        role: "AI Research Scientist at Google",
        content: "The AI/ML engineering course provided deep insights into cutting-edge AI technologies. The research-oriented approach and advanced projects helped me transition to a research scientist role at Google. Highly recommended for serious AI aspirants!"
      },
      {
        name: "Sneha Rajesh",
        role: "ML Engineer at Microsoft",
        content: "Exceptional course covering the latest in AI and deep learning. The computer vision and NLP modules were particularly advanced. I developed expertise in neural networks and landed my dream job at Microsoft as ML engineer."
      },
      {
        name: "Karthik Menon",
        role: "AI Consultant at IBM",
        content: "The course transformed my understanding of AI from basic to advanced level. The hands-on approach with TensorFlow and real-world projects gave me confidence to work on complex AI systems. Now consulting for Fortune 500 companies!"
      }
    ],

    faqs: [
      {
        question: "What career opportunities are available for AI/ML engineers?",
        answer: "AI/ML engineers are in high demand with roles like ML Engineer, AI Researcher, Computer Vision Engineer, NLP Specialist, and AI Architect. Starting salaries range from ₹8-20 LPA with exceptional growth potential."
      },
      {
        question: "Do I need a strong mathematics background?",
        answer: "Yes, a solid foundation in linear algebra, calculus, and statistics is important for advanced AI/ML. We provide refresher sessions, but prior mathematical knowledge helps significantly."
      },
      {
        question: "What makes this course different from basic ML courses?",
        answer: "This is an advanced course focusing on cutting-edge AI technologies, research methodologies, and production-grade AI systems. It's designed for serious AI practitioners, not beginners."
      },
      {
        question: "Will I work on real AI research projects?",
        answer: "Absolutely! You'll work on research-level projects in computer vision, NLP, and deep learning. Some projects may be suitable for publication or presentation at conferences."
      },
      {
        question: "What programming languages and frameworks will be covered?",
        answer: "Primarily Python with advanced usage of TensorFlow, PyTorch, OpenCV, NLTK, and other specialized AI libraries. We also cover deployment frameworks and MLOps tools."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default AIMLEngineer;