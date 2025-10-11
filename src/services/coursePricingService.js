// Course Pricing Service - Centralized price management
import { collection, doc, getDocs, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/config/firebase.js';

const COLLECTION = 'course_pricing';

// Default course pricing structure
const defaultPricing = {
  // Defensive Security Courses
  'defensive-bootcamp': {
    id: 'defensive-bootcamp',
    name: '7-Day Defensive Security Bootcamp',
    originalPrice: 2999,
    discountPrice: 499,
    finalPrice: 499,
    isActive: true,
    duration: '7 days',
    category: 'defensive',
    description: 'From Zero to SOC Analyst Ready',
    lastUpdated: new Date().toISOString()
  },
  'defensive-mastery': {
    id: 'defensive-mastery',
    name: '2-Month Defensive Security Mastery',
    originalPrice: 15999,
    discountPrice: 5999,
    finalPrice: 5999,
    isActive: true,
    duration: '2 months',
    category: 'defensive',
    description: 'Advanced Professional Certification Program',
    lastUpdated: new Date().toISOString()
  },
  
  // Offensive Security Courses
  'offensive-bootcamp': {
    id: 'offensive-bootcamp',
    name: '7-Day Ethical Hacking Bootcamp',
    originalPrice: 3999,
    discountPrice: 599,
    finalPrice: 599,
    isActive: true,
    duration: '7 days',
    category: 'offensive',
    description: 'Master Penetration Testing & Offensive Security',
    lastUpdated: new Date().toISOString()
  },
  'offensive-mastery': {
    id: 'offensive-mastery',
    name: '2-Month Offensive Security Mastery',
    originalPrice: 19999,
    discountPrice: 7999,
    finalPrice: 7999,
    isActive: true,
    duration: '2 months',
    category: 'offensive',
    description: 'Advanced Red Team Operations Training',
    lastUpdated: new Date().toISOString()
  },
  
  // Technology Training Courses
  'cloud-security': {
    id: 'cloud-security',
    name: 'Cloud Security Specialist',
    originalPrice: 7999,
    discountPrice: 3999,
    finalPrice: 3999,
    isActive: true,
    duration: '4-6 weeks',
    category: 'technology',
    description: 'AWS, Azure, and multi-cloud security',
    lastUpdated: new Date().toISOString()
  },
  // Detailed Specialized Courses (Cloud, Forensics, Malware, Compliance, IR, Threat Hunting)
  'aws-security-specialist': {
    id: 'aws-security-specialist',
    name: 'AWS Security Specialist',
    originalPrice: 5999,
    discountPrice: 3999,
    finalPrice: 3999,
    isActive: true,
    duration: '4 weeks',
    category: 'specialized',
    description: 'AWS security services, IAM, and cloud-native tools',
    lastUpdated: new Date().toISOString()
  },
  'azure-security-engineer': {
    id: 'azure-security-engineer',
    name: 'Azure Security Engineer',
    originalPrice: 5999,
    discountPrice: 3999,
    finalPrice: 3999,
    isActive: true,
    duration: '4 weeks',
    category: 'specialized',
    description: 'Azure security implementation and management',
    lastUpdated: new Date().toISOString()
  },
  'multi-cloud-security-architect': {
    id: 'multi-cloud-security-architect',
    name: 'Multi-Cloud Security Architect',
    originalPrice: 8999,
    discountPrice: 5999,
    finalPrice: 5999,
    isActive: true,
    duration: '6 weeks',
    category: 'specialized',
    description: 'Advanced multi-cloud security architecture and governance',
    lastUpdated: new Date().toISOString()
  },
  'digital-forensics-investigator': {
    id: 'digital-forensics-investigator',
    name: 'Digital Forensics Investigator',
    originalPrice: 7999,
    discountPrice: 4999,
    finalPrice: 4999,
    isActive: true,
    duration: '5 weeks',
    category: 'specialized',
    description: 'Comprehensive digital forensics investigation techniques',
    lastUpdated: new Date().toISOString()
  },
  'advanced-malware-forensics': {
    id: 'advanced-malware-forensics',
    name: 'Advanced Malware Forensics',
    originalPrice: 6999,
    discountPrice: 4499,
    finalPrice: 4499,
    isActive: true,
    duration: '4 weeks',
    category: 'specialized',
    description: 'Advanced malware analysis and reverse engineering techniques',
    lastUpdated: new Date().toISOString()
  },
  'malware-analysis-fundamentals': {
    id: 'malware-analysis-fundamentals',
    name: 'Malware Analysis Fundamentals',
    originalPrice: 4999,
    discountPrice: 2999,
    finalPrice: 2999,
    isActive: true,
    duration: '3 weeks',
    category: 'specialized',
    description: 'Introduction to malware analysis and reverse engineering',
    lastUpdated: new Date().toISOString()
  },
  'advanced-reverse-engineering': {
    id: 'advanced-reverse-engineering',
    name: 'Advanced Reverse Engineering',
    originalPrice: 8499,
    discountPrice: 5499,
    finalPrice: 5499,
    isActive: true,
    duration: '6 weeks',
    category: 'specialized',
    description: 'Advanced reverse engineering and exploit analysis',
    lastUpdated: new Date().toISOString()
  },
  'iso-27001-lead-implementer': {
    id: 'iso-27001-lead-implementer',
    name: 'ISO 27001 Lead Implementer',
    originalPrice: 5499,
    discountPrice: 3499,
    finalPrice: 3499,
    isActive: true,
    duration: '4 weeks',
    category: 'specialized',
    description: 'Complete ISO 27001 implementation and audit preparation',
    lastUpdated: new Date().toISOString()
  },
  'grc-analyst-professional': {
    id: 'grc-analyst-professional',
    name: 'GRC Analyst Professional',
    originalPrice: 6499,
    discountPrice: 4299,
    finalPrice: 4299,
    isActive: true,
    duration: '5 weeks',
    category: 'specialized',
    description: 'Governance, risk, and compliance management expertise',
    lastUpdated: new Date().toISOString()
  },
  'incident-response-specialist': {
    id: 'incident-response-specialist',
    name: 'Incident Response Specialist',
    originalPrice: 5999,
    discountPrice: 3999,
    finalPrice: 3999,
    isActive: true,
    duration: '4 weeks',
    category: 'specialized',
    description: 'Comprehensive incident response and crisis management',
    lastUpdated: new Date().toISOString()
  },
  'advanced-threat-hunting': {
    id: 'advanced-threat-hunting',
    name: 'Advanced Threat Hunting',
    originalPrice: 7299,
    discountPrice: 4799,
    finalPrice: 4799,
    isActive: true,
    duration: '5 weeks',
    category: 'specialized',
    description: 'Advanced threat hunting and proactive detection',
    lastUpdated: new Date().toISOString()
  },
  'devops-security': {
    id: 'devops-security',
    name: 'DevOps & Automation Security',
      originalPrice: 35000,
      discountPrice: 25000,
      finalPrice: 25000,
    isActive: true,
    duration: '6 weeks',
    category: 'technology',
    description: 'Secure CI/CD and infrastructure automation',
    lastUpdated: new Date().toISOString()
  },
  'full-stack-development': {
    id: 'full-stack-development',
    name: 'Full Stack Development',
      originalPrice: 45000,
      discountPrice: 30000,
      finalPrice: 30000,
    isActive: true,
      duration: 'Flexible',
    category: 'technology',
    description: 'Modern web development with security focus',
    lastUpdated: new Date().toISOString()
  },
  'data-science-ai': {
    id: 'data-science-ai',
    name: 'AI & Data Science',
      originalPrice: 30000,
      discountPrice: 20000,
      finalPrice: 20000,
    isActive: true,
    duration: '6 weeks',
    category: 'technology',
    description: 'Machine learning and data analysis',
    lastUpdated: new Date().toISOString()
  },
  // Detailed Technology Training Programs
  'mern-stack-developer': {
    id: 'mern-stack-developer',
    name: 'MERN Stack Developer',
    originalPrice: 45000,
    discountPrice: 30000,
    finalPrice: 30000,
    isActive: true,
    duration: '6 months',
    category: 'technology',
    description: 'MongoDB, Express.js, React, Node.js full-stack development',
    lastUpdated: new Date().toISOString()
  },
  'full-stack-python-developer': {
    id: 'full-stack-python-developer',
    name: 'Full Stack Python Developer',
    originalPrice: 42000,
    discountPrice: 28000,
    finalPrice: 28000,
    isActive: true,
    duration: '6 months',
    category: 'technology',
    description: 'Python web development with Django/Flask',
    lastUpdated: new Date().toISOString()
  },
  'java-full-stack-developer': {
    id: 'java-full-stack-developer',
    name: 'Java Full Stack Developer',
    originalPrice: 48000,
    discountPrice: 32000,
    finalPrice: 32000,
    isActive: true,
    duration: '7 months',
    category: 'technology',
    description: 'Enterprise Java with Spring Boot and modern frontend',
    lastUpdated: new Date().toISOString()
  },
  'aws-cloud-architect': {
    id: 'aws-cloud-architect',
    name: 'AWS Cloud Architect',
    originalPrice: 35000,
    discountPrice: 25000,
    finalPrice: 25000,
    isActive: true,
    duration: '4 months',
    category: 'technology',
    description: 'AWS cloud services and architecture patterns',
    lastUpdated: new Date().toISOString()
  },
  'devops-engineer-bootcamp': {
    id: 'devops-engineer-bootcamp',
    name: 'DevOps Engineer Bootcamp',
    originalPrice: 40000,
    discountPrice: 27000,
    finalPrice: 27000,
    isActive: true,
    duration: '5 months',
    category: 'technology',
    description: 'Complete DevOps pipeline automation and infrastructure',
    lastUpdated: new Date().toISOString()
  },
  'azure-cloud-solutions': {
    id: 'azure-cloud-solutions',
    name: 'Azure Cloud Solutions',
    originalPrice: 36000,
    discountPrice: 24000,
    finalPrice: 24000,
    isActive: true,
    duration: '4 months',
    category: 'technology',
    description: 'Microsoft Azure services and enterprise solutions',
    lastUpdated: new Date().toISOString()
  },
  'data-science-with-python': {
    id: 'data-science-with-python',
    name: 'Data Science with Python',
    originalPrice: 30000,
    discountPrice: 20000,
    finalPrice: 20000,
    isActive: true,
    duration: '5 months',
    category: 'technology',
    description: 'Comprehensive data science with machine learning',
    lastUpdated: new Date().toISOString()
  },
  'ai-ml-engineer': {
    id: 'ai-ml-engineer',
    name: 'AI & Machine Learning Engineer',
    originalPrice: 50000,
    discountPrice: 35000,
    finalPrice: 35000,
    isActive: true,
    duration: '6 months',
    category: 'technology',
    description: 'Advanced AI development with deep learning',
    lastUpdated: new Date().toISOString()
  },
  'business-intelligence-analyst': {
    id: 'business-intelligence-analyst',
    name: 'Business Intelligence Analyst',
    originalPrice: 25000,
    discountPrice: 18000,
    finalPrice: 18000,
    isActive: true,
    duration: '3 months',
    category: 'technology',
    description: 'Power BI, Tableau, SQL for business analytics',
    lastUpdated: new Date().toISOString()
  },
  'automation-testing-engineer': {
    id: 'automation-testing-engineer',
    name: 'Automation Testing Engineer',
    originalPrice: 28000,
    discountPrice: 18000,
    finalPrice: 18000,
    isActive: true,
    duration: '4 months',
    category: 'technology',
    description: 'Comprehensive test automation with modern frameworks',
    lastUpdated: new Date().toISOString()
  },
  'manual-testing-specialist': {
    id: 'manual-testing-specialist',
    name: 'Manual Testing Specialist',
    originalPrice: 18000,
    discountPrice: 12000,
    finalPrice: 12000,
    isActive: true,
    duration: '2 months',
    category: 'technology',
    description: 'Foundation in manual testing methodologies',
    lastUpdated: new Date().toISOString()
  },
  'react-native-developer': {
    id: 'react-native-developer',
    name: 'React Native Developer',
    originalPrice: 32000,
    discountPrice: 22000,
    finalPrice: 22000,
    isActive: true,
    duration: '4 months',
    category: 'technology',
    description: 'Cross-platform mobile app development',
    lastUpdated: new Date().toISOString()
  },
  'flutter-app-developer': {
    id: 'flutter-app-developer',
    name: 'Flutter App Developer',
    originalPrice: 30000,
    discountPrice: 20000,
    finalPrice: 20000,
    isActive: true,
    duration: '4 months',
    category: 'technology',
    description: 'Flutter & Dart based mobile app development',
    lastUpdated: new Date().toISOString()
  },
  
  // Foundation & Workshop Courses
  'foundation-workshop': {
    id: 'foundation-workshop',
    name: 'Cybersecurity Foundation Workshop',
    originalPrice: 499,
    discountPrice: 99,
    finalPrice: 99,
    isActive: true,
    duration: '2 days',
    category: 'foundation',
    description: 'Introduction to cybersecurity landscape',
    lastUpdated: new Date().toISOString()
  },
  
  // Specialized Courses
  'digital-forensics': {
    id: 'digital-forensics',
      name: 'Digital Forensics Expert',
    originalPrice: 6999,
    discountPrice: 4999,
    finalPrice: 4999,
    isActive: true,
      duration: '5 weeks',
    category: 'specialized',
      description: 'Digital evidence and malware forensics',
    lastUpdated: new Date().toISOString()
  },
  'compliance-governance': {
    id: 'compliance-governance',
      name: 'GRC & Compliance',
    originalPrice: 5999,
      discountPrice: 3499,
      finalPrice: 3499,
    isActive: true,
      duration: '4-5 weeks',
    category: 'specialized',
      description: 'ISO 27001 and risk management',
      lastUpdated: new Date().toISOString()
    },
    'software-testing': {
      id: 'software-testing',
      name: 'Software Testing',
      originalPrice: 25000,
      discountPrice: 18000,
      finalPrice: 18000,
      isActive: true,
      duration: 'Flexible',
      category: 'technology',
      description: 'Manual and automation testing',
    lastUpdated: new Date().toISOString()
  },
  
  // College/Enterprise Training
  'college-training': {
    id: 'college-training',
    name: 'College Bulk Training Program',
    originalPrice: 999,
    discountPrice: 299,
    finalPrice: 299,
    isActive: true,
    duration: 'Custom',
    category: 'enterprise',
    description: 'Customized training for educational institutions',
    lastUpdated: new Date().toISOString()
  },
  
  // College Cybersecurity Training Variants
  'college-cybersecurity-standard': {
    id: 'college-cybersecurity-standard',
    name: 'College Cybersecurity Training - Standard Batch (50-99 Students)',
    originalPrice: 599,
    discountPrice: 399,
    finalPrice: 399,
    isActive: true,
    duration: '8 weeks',
    category: 'college',
    description: 'Cybersecurity training for 50-99 engineering students',
    lastUpdated: new Date().toISOString()
  },
  'college-cybersecurity-premium': {
    id: 'college-cybersecurity-premium',
    name: 'College Cybersecurity Training - Premium Batch (100-149 Students)',
    originalPrice: 499,
    discountPrice: 299,
    finalPrice: 299,
    isActive: true,
    duration: '8 weeks',
    category: 'college',
    description: 'Cybersecurity training for 100-149 engineering students',
    lastUpdated: new Date().toISOString()
  },
  'college-cybersecurity-elite': {
    id: 'college-cybersecurity-elite',
    name: 'College Cybersecurity Training - Elite Batch (150+ Students)',
    originalPrice: 399,
    discountPrice: 199,
    finalPrice: 199,
    isActive: true,
    duration: '8 weeks',
    category: 'college',
    description: 'Cybersecurity training for 150+ engineering students',
    lastUpdated: new Date().toISOString()
  },
  
  // College Technology Training Variants
  'college-technology-standard': {
    id: 'college-technology-standard',
    name: 'College Technology Training - Standard Batch (50-99 Students)',
    originalPrice: 899,
    discountPrice: 599,
    finalPrice: 599,
    isActive: true,
    duration: '12 weeks',
    category: 'college',
    description: 'Multi-technology training for 50-99 engineering students',
    lastUpdated: new Date().toISOString()
  },
  'college-technology-premium': {
    id: 'college-technology-premium',
    name: 'College Technology Training - Premium Batch (100-149 Students)',
    originalPrice: 799,
    discountPrice: 499,
    finalPrice: 499,
    isActive: true,
    duration: '12 weeks',
    category: 'college',
    description: 'Multi-technology training for 100-149 engineering students',
    lastUpdated: new Date().toISOString()
  },
  'college-technology-elite': {
    id: 'college-technology-elite',
    name: 'College Technology Training - Elite Batch (150+ Students)',
    originalPrice: 699,
    discountPrice: 399,
    finalPrice: 399,
    isActive: true,
    duration: '12 weeks',
    category: 'college',
    description: 'Multi-technology training for 150+ engineering students',
    lastUpdated: new Date().toISOString()
  },
  
  'team-skill-development': {
    id: 'team-skill-development',
    name: 'Team Skill Development',
    originalPrice: 0,
    discountPrice: 0,
    finalPrice: 0,
    isActive: true,
    duration: 'Customizable',
    category: 'enterprise',
    description: 'Multi-technology training solutions',
    lastUpdated: new Date().toISOString()
  }
};

export async function getAllCoursePricing() {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    const pricing = {};
    
    // Filter out old duplicate course IDs to prevent duplicates in admin
    const legacyIds = [
      '7-Day Cybersecurity Bootcamp',
      '2-Month Premium Cybersecurity Program'
    ];
    // Also filter by legacy names in case IDs differ
    const legacyNames = [
      '7-Day Cybersecurity Bootcamp',
      '2-Month Premium Cybersecurity Program'
    ];
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      // Skip legacy duplicate IDs
      if (legacyIds.includes(doc.id)) return;
      // Skip by name match too (covers cases where id != display name)
      if (data?.name && legacyNames.includes(String(data.name).trim())) return;

      pricing[doc.id] = { id: doc.id, ...data };
    });

    // Only return what's in Firestore to avoid admin duplicates
    // If no pricing exists, use defaults
    if (Object.keys(pricing).length === 0) {
      return defaultPricing;
    }
    
    return pricing;
  } catch (error) {
    console.error('Failed to fetch course pricing:', error);
    return defaultPricing;
  }
}

export async function getCoursePricing(courseId) {
  try {
    // Handle legacy course types/IDs used by older flows (e.g., payment page)
    // 1) If called with legacy type keys, prefer the legacy Firestore doc the user edited
    // 2) Else, map to canonical IDs
    const legacyTypeToLegacyDocId = {
      '7-day-bootcamp': '7-Day Cybersecurity Bootcamp',
      '2-month-premium': '2-Month Premium Cybersecurity Program'
    };
    const legacyDocIds = ['7-Day Cybersecurity Bootcamp', '2-Month Premium Cybersecurity Program'];
    const legacyTypeToCanonical = {
      '7-day-bootcamp': 'defensive-bootcamp',
      '2-month-premium': 'defensive-mastery'
    };

    // If the request comes with a legacy type (slug), try returning the legacy doc first
    if (legacyTypeToLegacyDocId[courseId]) {
      const legacyDocRef = doc(db, COLLECTION, legacyTypeToLegacyDocId[courseId]);
      const legacySnap = await getDoc(legacyDocRef);
      if (legacySnap.exists()) {
        return { id: legacySnap.id, ...legacySnap.data() };
      }
      // Fall back to canonical if legacy not present
      courseId = legacyTypeToCanonical[courseId] || courseId;
    }

    // If the request directly references a legacy display-name ID, return it
    if (legacyDocIds.includes(courseId)) {
      const legacyByNameRef = doc(db, COLLECTION, courseId);
      const legacyByNameSnap = await getDoc(legacyByNameRef);
      if (legacyByNameSnap.exists()) {
        return { id: legacyByNameSnap.id, ...legacyByNameSnap.data() };
      }
      // If not found, try mapping to canonical
      const mapped = courseId === '7-Day Cybersecurity Bootcamp' ? 'defensive-bootcamp' : 'defensive-mastery';
      courseId = mapped;
    }

    const docRef = doc(db, COLLECTION, courseId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return defaultPricing[courseId] || null;
    }
  } catch (error) {
    console.error('Failed to fetch course pricing:', error);
    return defaultPricing[courseId] || null;
  }
}

export async function updateCoursePricing(courseId, pricingData) {
  try {
    const docRef = doc(db, COLLECTION, courseId);
    const updateData = {
      ...pricingData,
      lastUpdated: new Date().toISOString()
    };
    
    await setDoc(docRef, updateData, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Failed to update course pricing:', error);
    return { success: false, error: error.message };
  }
}

export async function cleanupLegacyPricing() {
  try {
    const legacyIds = [
      '7-Day Cybersecurity Bootcamp',
      '2-Month Premium Cybersecurity Program'
    ];
    const legacyNames = [
      '7-Day Cybersecurity Bootcamp',
      '2-Month Premium Cybersecurity Program'
    ];

    // Fetch all docs and remove any that match legacy IDs or names
    const snapshot = await getDocs(collection(db, COLLECTION));
    const deletions = [];
    snapshot.docs.forEach(d => {
      const shouldDeleteById = legacyIds.includes(d.id);
      const shouldDeleteByName = legacyNames.includes(String(d.data()?.name || '').trim());
      if (shouldDeleteById || shouldDeleteByName) {
        deletions.push(deleteDoc(doc(db, COLLECTION, d.id)));
      }
    });
    await Promise.all(deletions);
    
    return { success: true, message: 'Legacy pricing documents cleaned up' };
  } catch (error) {
    console.error('Failed to cleanup legacy pricing:', error);
    return { success: false, error: error.message };
  }
}

export async function initializeDefaultPricing() {
  try {
    for (const [courseId, pricing] of Object.entries(defaultPricing)) {
      const docRef = doc(db, COLLECTION, courseId);
      await setDoc(docRef, pricing, { merge: true });
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to initialize default pricing:', error);
    return { success: false, error: error.message };
  }
}