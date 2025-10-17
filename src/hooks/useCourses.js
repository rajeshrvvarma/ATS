import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase.js';

/**
 * useCourses hook
 * - Loads `courses` collection from Firestore.
 * - Falls back to empty array if Firestore isn't available or on error.
 * - Subscribes to realtime updates when possible.
 */
export default function useCourses(options = { realtime: true }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsub = null;
    const load = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'courses'), orderBy('title'));
        if (options.realtime && typeof onSnapshot === 'function') {
          unsub = onSnapshot(q, snapshot => {
            const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setCourses(docs);
            setLoading(false);
          }, err => {
            console.warn('Realtime courses snapshot error:', err);
            setError(err);
            setLoading(false);
          });
        } else {
          const snap = await getDocs(q);
          const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setCourses(docs);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Failed to load courses from Firestore, returning empty list:', err);
        setError(err);
        setCourses([]);
        setLoading(false);
      }
    };

    load();

    return () => {
      if (unsub) unsub();
    };
  }, [options.realtime]);

  return { courses, loading, error };
}
