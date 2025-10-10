/**
 * DOM Utilities to prevent early layout calculations
 * These utilities delay DOM access until after initial render
 */

// Flag to track if DOM is ready for measurements
let isDOMReady = false;

// Initialize DOM readiness after a short delay
setTimeout(() => {
  isDOMReady = true;
}, 200);

// Safe DOM measurement functions
export const safeDOMAccess = (callback, fallback = null) => {
  if (typeof window === 'undefined') return fallback;
  
  if (isDOMReady) {
    return callback();
  } else {
    // Delay DOM access until ready
    setTimeout(() => callback(), 250);
    return fallback;
  }
};

export const safeScrollMeasurement = () => {
  return safeDOMAccess(() => ({
    scrollTop: window.pageYOffset,
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight
  }), {
    scrollTop: 0,
    scrollHeight: 1000,
    clientHeight: 800
  });
};

export const safeWindowSize = () => {
  return safeDOMAccess(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }), {
    width: 1200,
    height: 800
  });
};

// Mark DOM as ready when page is fully loaded
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    isDOMReady = true;
  } else {
    window.addEventListener('load', () => {
      isDOMReady = true;
    });
  }
}