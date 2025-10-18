// Minimal stub for course pricing service used during cleanup.
// Returns static pricing data to keep pages functional when original service was removed.

export async function getAllCoursePricing() {
  return {
    'college-cybersecurity-standard': { finalPrice: 399, originalPrice: 599 },
    'college-cybersecurity-premium': { finalPrice: 299, originalPrice: 499 },
    'college-cybersecurity-elite': { finalPrice: 199, originalPrice: 399 }
  };
}

export async function getCoursePricing(courseId) {
  const all = await getAllCoursePricing();
  return all[courseId] || null;
}
