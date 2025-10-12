// Firestore UPI reference service
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase.js';
import { getDocsWithIndexFallback } from '@/services/firestoreIndexGuard.js';

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
    const primary = () => getDocs(query(collection(db, COLLECTION), orderBy('createdAt', 'desc')));
    const fallback = () => getDocs(query(collection(db, COLLECTION)));
  const { docs, indexRequired } = await getDocsWithIndexFallback(primary, fallback, { sortBy: 'createdAt', sortDir: 'desc', alertSource: 'upi.getAllUPIReferences', alertPath: 'upi_references' });
    // docs could be QueryDocumentSnapshots (primary) or mapped plain objects (fallback)
    const rows = Array.isArray(docs) && docs.length && typeof docs[0].data === 'function'
      ? docs.map(d => ({ id: d.id, ...d.data() }))
      : docs;
    if (indexRequired) {
      console.warn('Index required for getAllUPIReferences; using fallback without orderBy.');
    }
    return rows;
  } catch (error) {
    console.error('Failed to fetch UPI references:', error);
    return [];
  }
}
