// Course Pricing Service - Centralized price management
import { collection, doc, getDocs, setDoc, getDoc } from 'firebase/firestore';
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
  'devops-security': {
    id: 'devops-security',
    name: 'DevOps & Automation Security',
    originalPrice: 8999,
    discountPrice: 5499,
    finalPrice: 5499,
    isActive: true,
    duration: '6 weeks',
    category: 'technology',
    description: 'Secure CI/CD and infrastructure automation',
    lastUpdated: new Date().toISOString()
  },
  'full-stack-development': {
    id: 'full-stack-development',
    name: 'Full Stack Development',
    originalPrice: 9999,
    discountPrice: 4999,
    finalPrice: 4999,
    isActive: true,
    duration: '8 weeks',
    category: 'technology',
    description: 'Modern web development with security focus',
    lastUpdated: new Date().toISOString()
  },
  'data-science-ai': {
    id: 'data-science-ai',
    name: 'AI & Data Science',
    originalPrice: 8999,
    discountPrice: 3999,
    finalPrice: 3999,
    isActive: true,
    duration: '6 weeks',
    category: 'technology',
    description: 'Machine learning and data analysis',
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
    name: 'Digital Forensics & Investigation',
    originalPrice: 6999,
    discountPrice: 4999,
    finalPrice: 4999,
    isActive: true,
    duration: '4 weeks',
    category: 'specialized',
    description: 'Incident investigation and digital evidence',
    lastUpdated: new Date().toISOString()
  },
  'compliance-governance': {
    id: 'compliance-governance',
    name: 'Compliance & Governance',
    originalPrice: 5999,
    discountPrice: 3999,
    finalPrice: 3999,
    isActive: true,
    duration: '3 weeks',
    category: 'specialized',
    description: 'ISO 27001, NIST, and regulatory compliance',
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
  }
};

export async function getAllCoursePricing() {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    const pricing = {};
    
    snapshot.docs.forEach(doc => {
      pricing[doc.id] = { id: doc.id, ...doc.data() };
    });

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