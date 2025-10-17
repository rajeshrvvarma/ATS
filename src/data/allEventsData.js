// ---
// Centralized data for all events: batches, bootcamps, and workshops
// Used by AnnouncementBanner to rotate through all upcoming events
// Now supports both static data and Firestore data
//
// [UPDATE LOG: 2025-10-17]
// Recent changes:
// - getAllEvents() now merges Firestore and static data
// - Null safety for all event fields
// - Fallback logic for missing fields
//
// TODO for tomorrow:
// - Data double population (events appear twice)
// - Upcoming batches not populated from Firestore
//
// Refactor event merging logic, deduplicate events, ensure batches tab is populated.

import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '@/config/firebase';

const db = getFirestore(app);

// Static fallback data (used when Firestore is unavailable or for initial load)

export const upcomingBatches = [
  {
    id: 'defensive-mastery-nov2025',
    type: 'batch',
    courseId: 'defensive-mastery',
    title: '2-Month Defensive Security Mastery',
    startDate: '2025-11-01',
    endDate: '2025-12-31',
    location: 'Hyderabad & Online',
    maxStudents: 15,
    currentEnrolled: 5,
    price: '₹2,999',
    urgency: 'medium'
  },
  {
    id: 'offensive-mastery-dec2025',
    type: 'batch',
    courseId: 'offensive-mastery',
    title: '2-Month Offensive Security Mastery',
    startDate: '2025-12-15',
    endDate: '2026-02-15',
    location: 'Online Live',
    maxStudents: 20,
    currentEnrolled: 8,
    price: '₹3,499',
    urgency: 'low'
  },
  {
    id: 'soc-analyst-oct2025',
    type: 'batch',
    courseId: 'defensive-bootcamp',
    title: 'SOC Analyst Intensive Training',
    startDate: '2025-10-25',
    endDate: '2025-11-25',
    location: 'Hyderabad & Online',
    maxStudents: 25,
    currentEnrolled: 18,
    price: '₹1,999',
    urgency: 'high'
  }
];

export const bootcamps = [
  {
    id: 'defensive-bootcamp-nov2025',
    type: 'bootcamp',
    courseId: 'defensive-bootcamp',
    title: '7-Day Defensive Security Bootcamp',
    subtitle: 'From Zero to SOC Analyst Ready',
    description: 'Join 100+ aspiring cybersecurity professionals in this intensive bootcamp designed to fast-track your career into defensive security roles',
    startDate: '2025-11-15',
    endDate: '2025-11-21',
    location: 'Hyderabad & Online',
    maxStudents: 100,
    currentEnrolled: 23,
    price: '₹499',
    originalPrice: '₹999',
    urgency: 'medium',
    duration: '7 days (21+ hours)',
    schedule: 'Daily 3-4 hours',
    level: 'Beginner to Intermediate',
    includes: [
      'Live interactive sessions (21+ hours)',
      'All sessions recorded for lifetime access',
      'Comprehensive course materials (PDFs)',
      'Hands-on lab exercises and tools',
      'Industry-recognized certificate of completion',
      'Resume review and optimization',
      'Job placement assistance and referrals',
      'Access to exclusive alumni network',
      'Monthly career guidance sessions (6 months)',
      '24/7 doubt clearing support group'
    ],
    curriculum: [
      {
        day: 1,
        title: 'Cybersecurity Fundamentals',
        sessions: ['Threat Landscape Overview', 'Career Paths & Opportunities'],
        duration: '3 hours',
        highlights: ['Live Q&A with industry expert', 'Career roadmap session']
      },
      {
        day: 2,
        title: 'Network Security Essentials',
        sessions: ['Network Security Basics', 'Hands-on with Security Tools'],
        duration: '3 hours',
        highlights: ['Wireshark demonstration', 'Network monitoring setup']
      },
      {
        day: 3,
        title: 'Incident Response & SIEM',
        sessions: ['Incident Response Process', 'SIEM Tools Introduction'],
        duration: '3 hours',
        highlights: ['Real incident case studies', 'SIEM dashboard walkthrough']
      },
      {
        day: 4,
        title: 'Vulnerability Management',
        sessions: ['Vulnerability Assessment', 'Patch Management'],
        duration: '3 hours',
        highlights: ['Hands-on vulnerability scanning', 'Remediation planning']
      },
      {
        day: 5,
        title: 'Security Operations Center',
        sessions: ['SOC Operations', 'Monitoring & Alerting'],
        duration: '3 hours',
        highlights: ['SOC analyst daily routine', 'Alert triage techniques']
      },
      {
        day: 6,
        title: 'Compliance & Risk Management',
        sessions: ['Security Frameworks', 'Risk Assessment'],
        duration: '3 hours',
        highlights: ['ISO 27001 overview', 'Risk calculation methods']
      },
      {
        day: 7,
        title: 'Career Launch & Certification',
        sessions: ['Resume Building', 'Interview Preparation', 'Certification Exam'],
        duration: '4 hours',
        highlights: ['Mock interviews', 'Job application strategy', 'Certificate ceremony']
      }
    ],
    outcomes: ['SOC Analyst positions', 'Security consultant roles', 'Cybersecurity career foundation']
  },
  {
    id: 'offensive-bootcamp-dec2025',
    type: 'bootcamp',
    courseId: 'offensive-bootcamp',
    title: '7-Day Ethical Hacking Bootcamp',
    subtitle: 'Master Penetration Testing & Offensive Security',
    description: 'Join 80+ aspiring ethical hackers in this intensive bootcamp designed to master penetration testing skills',
    startDate: '2025-12-10',
    endDate: '2025-12-16',
    location: 'Online',
    maxStudents: 80,
    currentEnrolled: 18,
    price: '₹599',
    originalPrice: '₹999',
    urgency: 'low',
    duration: '7 days (23+ hours)',
    schedule: 'Daily 3-4 hours',
    level: 'Intermediate',
    includes: [
      'Live interactive sessions (23+ hours)',
      'All sessions recorded for lifetime access',
      'Kali Linux VM setup and tools',
      'Hands-on lab exercises with real targets',
      'Industry-recognized ethical hacker certificate',
      'Professional penetration testing toolkit',
      'Resume review for cybersecurity roles',
      'Job placement assistance in pentesting',
      'Access to exclusive hacker community',
      'Monthly advanced technique workshops (6 months)',
      '24/7 technical support and mentorship'
    ],
    curriculum: [
      {
        day: 1,
        title: 'Ethical Hacking Fundamentals',
        sessions: ['Introduction to Penetration Testing', 'Legal & Ethical Framework'],
        duration: '3 hours',
        highlights: ['Hacker mindset development', 'Legal compliance essentials']
      },
      {
        day: 2,
        title: 'Information Gathering & Reconnaissance',
        sessions: ['OSINT Techniques', 'Footprinting & Scanning'],
        duration: '3 hours',
        highlights: ['Advanced Google dorking', 'Network enumeration techniques']
      },
      {
        day: 3,
        title: 'Vulnerability Assessment',
        sessions: ['Vulnerability Scanning', 'Manual Testing Techniques'],
        duration: '3 hours',
        highlights: ['Nessus & OpenVAS hands-on', 'Custom vulnerability validation']
      },
      {
        day: 4,
        title: 'Web Application Penetration Testing',
        sessions: ['OWASP Top 10', 'SQL Injection & XSS'],
        duration: '4 hours',
        highlights: ['Burp Suite mastery', 'Real-world web app exploitation']
      },
      {
        day: 5,
        title: 'Network Penetration Testing',
        sessions: ['Network Exploitation', 'Post-Exploitation Techniques'],
        duration: '4 hours',
        highlights: ['Metasploit framework', 'Lateral movement strategies']
      },
      {
        day: 6,
        title: 'Wireless Security & Social Engineering',
        sessions: ['WiFi Penetration Testing', 'Social Engineering Attacks'],
        duration: '3 hours',
        highlights: ['Aircrack-ng usage', 'Phishing campaign creation']
      },
      {
        day: 7,
        title: 'Report Writing & Career Guidance',
        sessions: ['Penetration Testing Reports', 'Career in Ethical Hacking'],
        duration: '3 hours',
        highlights: ['Professional report templates', 'Industry job opportunities']
      }
    ],
    outcomes: ['Penetration tester roles', 'Ethical hacker positions', 'Security consultant opportunities']
  }
];

export const freeWorkshops = [
  {
    id: 'free-cyber-workshop-oct2025',
    type: 'workshop',
    courseId: 'free-workshop',
    title: 'Introduction to Cybersecurity Careers',
    startDate: '2025-10-25',
    time: '6:00 PM - 8:00 PM',
    location: 'Online (Zoom)',
    price: 'FREE',
    urgency: 'low',
    maxStudents: 100,
    currentEnrolled: 45
  },
  {
    id: 'free-siem-workshop-nov2025',
    type: 'workshop',
    courseId: 'free-workshop',
    title: 'Free SIEM Workshop: Splunk Basics',
    startDate: '2025-11-10',
    time: '5:00 PM - 7:00 PM',
    location: 'Online (Zoom)',
    price: 'FREE',
    urgency: 'low',
    maxStudents: 100,
    currentEnrolled: 32
  },
  {
    id: 'free-webapp-workshop-dec2025',
    type: 'workshop',
    courseId: 'free-workshop',
    title: 'Web Application Security 101',
    startDate: '2025-12-05',
    time: '6:30 PM - 8:30 PM',
    location: 'Online (Zoom)',
    price: 'FREE',
    urgency: 'low',
    maxStudents: 100,
    currentEnrolled: 28
  }
];

// Fetch events from Firestore
export const fetchEventsFromFirestore = async () => {
  try {
    const eventsCol = collection(db, 'events');
    const snapshot = await getDocs(eventsCol);
    const firestoreEvents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return firestoreEvents;
  } catch (error) {
    console.error('Error fetching events from Firestore:', error);
    return [];
  }
};

// Get all events combined (static + Firestore) and sorted by start date
export const getAllEvents = async () => {
  // Fetch from Firestore
  const firestoreEvents = await fetchEventsFromFirestore();

  // Combine static and Firestore events
  const allEvents = [
    ...upcomingBatches,
    ...bootcamps,
    ...freeWorkshops,
    ...firestoreEvents
  ];

  // Remove duplicates based on id
  const uniqueEvents = allEvents.reduce((acc, event) => {
    if (!acc.find(e => e.id === event.id)) {
      acc.push(event);
    }
    return acc;
  }, []);

  // Sort by start date (earliest first)
  return uniqueEvents.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateA - dateB;
  });
};

// Get all events synchronously (static data only - for initial render)
export const getAllEventsSync = () => {
  const allEvents = [
    ...upcomingBatches,
    ...bootcamps,
    ...freeWorkshops
  ];

  // Sort by start date (earliest first)
  return allEvents.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateA - dateB;
  });
};

// Get only upcoming events (not started yet)
export const getUpcomingEvents = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allEvents = await getAllEvents();

  return allEvents.filter(event => {
    const startDate = new Date(event.startDate);
    return startDate >= today;
  });
};

// Get upcoming events synchronously (static data only - for initial render)
export const getUpcomingEventsSync = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return getAllEventsSync().filter(event => {
    const startDate = new Date(event.startDate);
    return startDate >= today;
  });
};

// Calculate seats left
export const getSeatsLeft = (event) => {
  return event.maxStudents - event.currentEnrolled;
};

// Calculate urgency based on seats and date
export const calculateUrgency = (event) => {
  const seatsLeft = getSeatsLeft(event);
  const percentFilled = (event.currentEnrolled / event.maxStudents) * 100;

  const today = new Date();
  const startDate = new Date(event.startDate);
  const daysUntilStart = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));

  // High urgency if almost full or starting very soon
  if (percentFilled >= 75 || (daysUntilStart <= 7 && daysUntilStart > 0)) {
    return 'high';
  }

  // Medium urgency if moderately full
  if (percentFilled >= 50) {
    return 'medium';
  }

  return 'low';
};
