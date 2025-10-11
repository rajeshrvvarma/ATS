// Custom hook for course pricing
import { useState, useEffect } from 'react';
import { getAllCoursePricing, getCoursePricing } from '@/services/coursePricingService.js';

export function useCoursePricing(courseId = null) {
  const [pricing, setPricing] = useState(courseId ? null : {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPricing = async () => {
      try {
        setLoading(true);
        if (courseId) {
          const data = await getCoursePricing(courseId);
          setPricing(data);
        } else {
          const data = await getAllCoursePricing();
          setPricing(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPricing();
  }, [courseId]);

  return { pricing, loading, error, refetch: () => window.location.reload() };
}

export function formatPrice(price) {
  return `₹${price?.toLocaleString() || '0'}`;
}

export function calculateDiscount(originalPrice, finalPrice) {
  if (!originalPrice || !finalPrice || originalPrice <= finalPrice) return 0;
  return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
}