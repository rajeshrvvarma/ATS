// Firestore UPI reference service
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase.js';

const COLLECTION = 'upi_references';

export async function saveUPIReference(refData) {
  // refData: { enrollmentId, studentName, studentEmail, courseType, amount, paymentId, timestamp }
  try {
    await addDoc(collection(db, COLLECTION), {
      ...refData,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to save UPI reference to Firestore:', error);
    return { success: false, error: error.message };
  }
}

export async function getAllUPIReferences() {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Failed to fetch UPI references:', error);
    return [];
  }
}
