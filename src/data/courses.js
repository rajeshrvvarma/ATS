/**
 * Course Data Configuration
 * 
 * This file contains all your course data including video lessons.
 * You can easily add new courses and videos by updating this file.
 * 
 * Video Types Supported:
 * - 'youtube': YouTube videos (use videoId)
 * - 'vimeo': Vimeo videos (use videoId) 
 * - 'direct': Direct video files (use videoUrl)
 */

export const courses = [
  {
    id: 'defensive-bootcamp-video',
    title: 'Defensive Security Bootcamp - Video Series',
    description: 'Complete video-based training for SOC Analyst role with hands-on labs and real-world scenarios.',
    duration: '7 days',
    difficulty: 'Beginner to Intermediate',
    price: 'Free',
    thumbnail: '/logo.png',
    category: 'defensive',
    lessons: [
      {
        id: 'intro-cybersecurity',
        title: 'Introduction to Cybersecurity',
        description: 'Understanding the cybersecurity landscape and career opportunities',
        duration: '15:30',
        type: 'youtube',
        videoId: 'KV7K5plJcsI', // Replace with your actual YouTube video ID
        videoUrl: 'https://www.youtube.com/watch?v=KV7K5plJcsI', // Full URL for transcript extraction
        difficulty: 'Beginner',
        transcript: null, // Will be auto-populated by transcript service
        transcriptStatus: 'pending', // 'pending', 'loading', 'loaded', 'failed'
        resources: [
          { name: 'Course Syllabus PDF', url: '#' },
          { name: 'Additional Reading', url: '#' }
        ]
      },
      {
        id: 'networking-fundamentals',
        title: 'Networking Fundamentals',
        description: 'Essential networking concepts for security professionals',
        duration: '22:45',
        type: 'youtube',
        videoId: 'KV7K5plJcsI', // Replace with your actual YouTube video ID
        videoUrl: 'https://www.youtube.com/watch?v=KV7K5plJcsI', // Full URL for transcript extraction
        difficulty: 'Beginner',
        transcript: null, // Will be auto-populated by transcript service
        transcriptStatus: 'pending', // 'pending', 'loading', 'loaded', 'failed'
        resources: [
          { name: 'Network Diagram', url: '#' },
          { name: 'Protocol Cheat Sheet', url: '#' }
        ]
      },
      {
        id: 'os-hardening',
        title: 'Operating System Hardening',
        description: 'Securing Windows and Linux systems against common attacks',
        duration: '28:15',
        type: 'vimeo',
        videoId: 'YOUR_VIMEO_VIDEO_ID_1', // Replace with your actual Vimeo video ID
        difficulty: 'Intermediate',
        resources: [
          { name: 'Hardening Checklist', url: '#' },
          { name: 'Lab Setup Guide', url: '#' }
        ]
      },
      {
        id: 'siem-basics',
        title: 'SIEM Fundamentals',
        description: 'Introduction to Security Information and Event Management',
        duration: '25:00',
        type: 'direct',
        videoUrl: 'https://your-domain.com/videos/siem-basics.mp4', // Replace with your actual video URL
        difficulty: 'Intermediate',
        resources: [
          { name: 'SIEM Configuration Guide', url: '#' },
          { name: 'Sample Logs', url: '#' }
        ]
      },
      {
        id: 'incident-response',
        title: 'Incident Response Process',
        description: 'Step-by-step guide to handling security incidents',
        duration: '32:20',
        type: 'youtube',
        videoId: 'KV7K5plJcsI', // Replace with your actual YouTube video ID
        difficulty: 'Advanced',
        resources: [
          { name: 'Incident Response Playbook', url: '#' },
          { name: 'Communication Templates', url: '#' }
        ]
      }
    ]
  },
  {
    id: 'offensive-bootcamp-video',
    title: 'Ethical Hacking Bootcamp - Video Series',
    description: 'Comprehensive video training for ethical hacking and penetration testing.',
    duration: '7 days',
    difficulty: 'Intermediate to Advanced',
    price: 'Free',
    thumbnail: '/logo.png',
    category: 'offensive',
    lessons: [
      {
        id: 'hacking-ethics',
        title: 'Ethics and Legal Framework',
        description: 'Understanding the legal and ethical aspects of ethical hacking',
        duration: '18:45',
        type: 'youtube',
        videoId: 'KV7K5plJcsI', // Replace with your actual YouTube video ID
        difficulty: 'Beginner',
        resources: [
          { name: 'Legal Guidelines', url: '#' },
          { name: 'Ethics Code', url: '#' }
        ]
      },
      {
        id: 'reconnaissance',
        title: 'Reconnaissance Techniques',
        description: 'Passive and active information gathering methods',
        duration: '26:30',
        type: 'vimeo',
        videoId: 'YOUR_VIMEO_VIDEO_ID_2', // Replace with your actual Vimeo video ID
        difficulty: 'Intermediate',
        resources: [
          { name: 'Recon Tools List', url: '#' },
          { name: 'OSINT Resources', url: '#' }
        ]
      },
      {
        id: 'vulnerability-assessment',
        title: 'Vulnerability Assessment',
        description: 'Identifying and assessing security vulnerabilities',
        duration: '30:15',
        type: 'direct',
        videoUrl: 'https://your-domain.com/videos/vuln-assessment.mp4', // Replace with your actual video URL
        difficulty: 'Intermediate',
        resources: [
          { name: 'Vulnerability Database', url: '#' },
          { name: 'Assessment Checklist', url: '#' }
        ]
      },
      {
        id: 'exploitation-basics',
        title: 'Exploitation Fundamentals',
        description: 'Basic exploitation techniques and tools',
        duration: '35:20',
        type: 'youtube',
        videoId: 'KV7K5plJcsI', // Replace with your actual YouTube video ID
        difficulty: 'Advanced',
        resources: [
          { name: 'Exploit Database', url: '#' },
          { name: 'Practice Labs', url: '#' }
        ]
      }
    ]
  },
  {
    id: 'free-workshop-video',
    title: 'Free Cybersecurity Workshop - Video Series',
    description: 'Get started with cybersecurity through our free introductory video series.',
    duration: '1 hour',
    difficulty: 'Beginner',
    price: 'Free',
    thumbnail: '/logo.png',
    category: 'workshop',
    lessons: [
      {
        id: 'cybersecurity-overview',
        title: 'Cybersecurity Overview',
        description: 'Introduction to the world of cybersecurity',
        duration: '12:30',
        type: 'youtube',
        videoId: 'KV7K5plJcsI', // Replace with your actual YouTube video ID
        difficulty: 'Beginner',
        resources: [
          { name: 'Workshop Slides', url: '#' },
          { name: 'Quick Reference', url: '#' }
        ]
      },
      {
        id: 'career-paths',
        title: 'Cybersecurity Career Paths',
        description: 'Explore different career opportunities in cybersecurity',
        duration: '18:15',
        type: 'youtube',
        videoId: 'KV7K5plJcsI', // Replace with your actual YouTube video ID
        difficulty: 'Beginner',
        resources: [
          { name: 'Career Guide PDF', url: '#' },
          { name: 'Salary Information', url: '#' }
        ]
      },
      {
        id: 'getting-started',
        title: 'Getting Started in Cybersecurity',
        description: 'Practical steps to begin your cybersecurity journey',
        duration: '15:45',
        type: 'youtube',
        videoId: 'KV7K5plJcsI', // Replace with your actual YouTube video ID
        difficulty: 'Beginner',
        resources: [
          { name: 'Learning Roadmap', url: '#' },
          { name: 'Recommended Resources', url: '#' }
        ]
      }
    ]
  }
];

/**
 * Helper function to get course by ID
 */
export const getCourseById = (courseId) => {
  return courses.find(course => course.id === courseId);
};

/**
 * Helper function to get courses by category
 */
export const getCoursesByCategory = (category) => {
  return courses.filter(course => course.category === category);
};

/**
 * Helper function to get all course categories
 */
export const getCourseCategories = () => {
  const categories = [...new Set(courses.map(course => course.category))];
  return categories;
};