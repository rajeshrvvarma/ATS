// Course Pricing Service - Centralized price management
import { collection, doc, getDocs, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase.js';

const COLLECTION = 'course_pricing';

// Default course pricing structure
const defaultPricing = {
  '7-day-bootcamp': {
    id: '7-day-bootcamp',
    name: '7-Day Cybersecurity Bootcamp',
    originalPrice: 4999,
    discountPrice: 2999,
    finalPrice: 2999,
    isActive: true,
    duration: '7 days',
    description: 'Intensive cybersecurity bootcamp',
    lastUpdated: new Date().toISOString()
  },
  '2-month-premium': {
    id: '2-month-premium', 
    name: '2-Month Premium Cybersecurity Program',
    originalPrice: 9999,
    discountPrice: 5999,
    finalPrice: 5999,
    isActive: true,
    duration: '2 months',
    description: 'Comprehensive cybersecurity program',
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