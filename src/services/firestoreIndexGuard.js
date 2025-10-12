// Unified helper to guard Firestore queries that may require composite indexes.
// Usage:
//   const { docs, indexRequired, indexLink } = await getDocsWithIndexFallback(
//     () => getDocs(query(collection(db, 'col'), where(...), orderBy(...))),
//     () => getDocs(query(collection(db, 'col'), where(...))),
//     { sortBy: 'createdAt', sortDir: 'desc' }
//   );

import { recordIndexAlert } from './indexAlertService.js';

export const getDocsWithIndexFallback = async (primaryFn, fallbackFn, options = {}) => {
  const { sortBy, sortDir = 'desc', mapFn, alertSource = '', alertPath = '' } = options;

  try {
    const snap = await primaryFn();
    return {
      docs: snap.docs,
      indexRequired: false,
      indexLink: ''
    };
  } catch (err) {
    const message = (err && err.message) || '';
    const linkMatch = message.match(/https?:\/\/[^\s)]+/);
    const indexLink = linkMatch ? linkMatch[0] : '';
    const isIndexIssue = message.toLowerCase().includes('requires an index') || (err && err.code === 'failed-precondition');
    if (!isIndexIssue) throw err;

    // Run fallback query without orderBy
    const fbSnap = await fallbackFn();
    let rows = fbSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Optional in-memory sorting
    if (sortBy) {
      rows = rows.sort((a, b) => {
        const av = a?.[sortBy]?.toDate ? a[sortBy].toDate() : a?.[sortBy];
        const bv = b?.[sortBy]?.toDate ? b[sortBy].toDate() : b?.[sortBy];
        const an = av instanceof Date ? av.getTime() : (typeof av === 'number' ? av : 0);
        const bn = bv instanceof Date ? bv.getTime() : (typeof bv === 'number' ? bv : 0);
        return sortDir === 'asc' ? (an - bn) : (bn - an);
      });
    }

    // Allow mapper to shape results if provided
    const mapped = mapFn ? rows.map(mapFn) : rows;

    const result = {
      docs: mapped,
      indexRequired: true,
      indexLink
    };
    // Record an index alert for admin visibility
    try {
      recordIndexAlert({ source: alertSource || 'firestore-query', indexLink, path: alertPath, details: { sortBy, sortDir } });
    } catch (_) {}
    return result;
  }
};
