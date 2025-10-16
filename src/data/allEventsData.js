// Centralized data for all events: batches, bootcamps, and workshops
// Used by AnnouncementBanner to rotate through all upcoming events

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
    startDate: '2025-11-15',
    endDate: '2025-11-21',
    location: 'Hyderabad & Online',
    maxStudents: 25,
    currentEnrolled: 12,
    price: '₹499',
    urgency: 'medium'
  },
  {
    id: 'offensive-bootcamp-dec2025',
    type: 'bootcamp',
    courseId: 'offensive-bootcamp',
    title: '7-Day Ethical Hacking Bootcamp',
    startDate: '2025-12-10',
    endDate: '2025-12-16',
    location: 'Online',
    maxStudents: 20,
    currentEnrolled: 8,
    price: '₹599',
    urgency: 'low'
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

// Get all events combined and sorted by start date
export const getAllEvents = () => {
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
export const getUpcomingEvents = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return getAllEvents().filter(event => {
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
