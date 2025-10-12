/**
 * Test script to create sample courses for demonstration
 * This shows how the CMS courses appear in the Student Dashboard
 */

import { addCourse } from './courseService.js';

// Sample published course
const publishedCourse = {
  title: 'Cybersecurity Fundamentals',
  description: 'Learn the essential concepts of cybersecurity including threat analysis, risk management, and security protocols. This comprehensive course covers network security, encryption, and incident response.',
  shortDescription: 'Master cybersecurity basics with hands-on exercises and real-world scenarios.',
  category: 'cybersecurity',
  level: 'beginner',
  duration: '6 weeks',
  price: 2999,
  thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop',
  status: 'published',
  tags: ['security', 'networking', 'encryption'],
  objectives: [
    'Understand fundamental cybersecurity concepts',
    'Identify common security threats and vulnerabilities',
    'Implement basic security measures',
    'Develop incident response skills'
  ],
  prerequisites: [
    'Basic computer knowledge',
    'Understanding of networking concepts'
  ],
  targetAudience: 'IT professionals, students, and anyone interested in cybersecurity',
  certificate: true,
  lessons: [
    {
      id: 'lesson_1',
      title: 'Introduction to Cybersecurity',
      description: 'Overview of cybersecurity landscape and core concepts',
      type: 'video',
      content: 'https://example.com/videos/intro-cybersecurity.mp4',
      duration: '15 mins',
      order: 1,
      isPreview: true
    },
    {
      id: 'lesson_2',
      title: 'Network Security Basics',
      description: 'Understanding network vulnerabilities and protection methods',
      type: 'video',
      content: 'https://example.com/videos/network-security.mp4',
      duration: '20 mins',
      order: 2,
      isPreview: false
    }
  ]
};

// Sample coming soon course
const comingSoonCourse = {
  title: 'Advanced Penetration Testing',
  description: 'Deep dive into advanced penetration testing techniques, tools, and methodologies. Learn to conduct comprehensive security assessments and write professional reports.',
  shortDescription: 'Master advanced pen-testing with industry-standard tools and techniques.',
  category: 'cybersecurity',
  level: 'advanced',
  duration: '12 weeks',
  price: 5999,
  thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop',
  status: 'coming-soon',
  tags: ['penetration-testing', 'ethical-hacking', 'security-assessment'],
  objectives: [
    'Master advanced penetration testing methodologies',
    'Use professional pen-testing tools effectively',
    'Conduct comprehensive security assessments',
    'Write professional penetration testing reports'
  ],
  prerequisites: [
    'Cybersecurity fundamentals',
    'Basic networking knowledge',
    'Linux command line experience'
  ],
  targetAudience: 'Security professionals, ethical hackers, and IT auditors',
  certificate: true,
  lessons: []
};

// Sample draft course (won't appear in student dashboard)
const draftCourse = {
  title: 'Cloud Security Architecture',
  description: 'Comprehensive guide to securing cloud environments including AWS, Azure, and GCP.',
  shortDescription: 'Learn to design and implement secure cloud architectures.',
  category: 'cloud',
  level: 'intermediate',
  duration: '8 weeks',
  price: 4499,
  thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=200&fit=crop',
  status: 'draft',
  tags: ['cloud-security', 'aws', 'azure', 'gcp'],
  objectives: [
    'Design secure cloud architectures',
    'Implement cloud security controls',
    'Monitor cloud environments for threats',
    'Ensure compliance in cloud deployments'
  ],
  prerequisites: [
    'Cloud computing basics',
    'Security fundamentals'
  ],
  targetAudience: 'Cloud architects, security engineers, DevOps professionals',
  certificate: true,
  lessons: []
};

// Function to initialize sample courses
export function initializeSampleCourses() {
  try {
    console.log('Adding sample courses...');
    
    // Add published course
    addCourse(publishedCourse);
    console.log('✅ Added published course: Cybersecurity Fundamentals');
    
    // Add coming soon course
    addCourse(comingSoonCourse);
    console.log('✅ Added coming soon course: Advanced Penetration Testing');
    
    // Add draft course
    addCourse(draftCourse);
    console.log('✅ Added draft course: Cloud Security Architecture');
    
    console.log('🎉 Sample courses initialized successfully!');
    console.log('📝 Note: Only published and coming-soon courses will appear in Student Dashboard');
    
    return true;
  } catch (error) {
    console.error('❌ Error initializing sample courses:', error);
    return false;
  }
}

// Auto-run if this script is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - add to window for manual execution
  window.initializeSampleCourses = initializeSampleCourses;
  console.log('💡 Run initializeSampleCourses() in console to add sample courses');
}