// Active batches configuration
export const activeBatches = [
    {
        id: 'defensive-bootcamp-jan-15',
        courseId: 'defensiveBootcamp',
        courseName: '7-Day Defensive Security Bootcamp',
        batchName: 'January Intensive Batch',
        title: '🚀 SOC Analyst Bootcamp',
        startDate: 'January 15th, 2025',
        endDate: 'January 22nd, 2025',
        schedule: 'Mon-Sun, 7PM-10PM IST',
        totalSeats: 50,
        bookedSeats: 38,
        seatsLeft: 12,
        price: '₹499',
        originalPrice: '₹2,999',
        instructor: 'Santosh M',
        urgency: 'high', // high, medium, low
        enrollmentDeadline: 'January 12th, 2025',
        status: 'active',
        features: [
            'Live interactive sessions',
            'Hands-on SOC labs',
            'Industry certificate',
            'Job placement assistance'
        ]
    },
    {
        id: 'cloud-security-feb-01',
        courseId: 'cloudSecurity',
        courseName: 'Cloud Security Specialist',
        batchName: 'February AWS/Azure Batch',
        title: '☁️ Cloud Security Specialist',
        startDate: 'February 1st, 2025',
        endDate: 'February 28th, 2025',
        schedule: 'Weekends, 10AM-6PM IST',
        totalSeats: 30,
        bookedSeats: 5,
        seatsLeft: 25,
        price: '₹3,999',
        originalPrice: '₹5,999',
        instructor: 'Cloud Security Expert',
        urgency: 'medium',
        enrollmentDeadline: 'January 25th, 2025',
        status: 'active',
        features: [
            'AWS Security Deep Dive',
            'Azure Security Center',
            'Cloud Compliance (SOC2, PCI)',
            'Hands-on Cloud Labs'
        ]
    },
    {
        id: 'offensive-bootcamp-mar-01',
        courseId: 'offensiveBootcamp',
        courseName: '7-Day Ethical Hacking Bootcamp',
        batchName: 'March Hacker Batch',
        title: '🔥 Ethical Hacking Bootcamp',
        startDate: 'March 1st, 2025',
        endDate: 'March 8th, 2025',
        schedule: 'Daily, 8PM-11PM IST',
        totalSeats: 40,
        bookedSeats: 15,
        seatsLeft: 25,
        price: '₹599',
        originalPrice: '₹3,999',
        instructor: 'Ethical Hacking Expert',
        urgency: 'medium',
        enrollmentDeadline: 'February 25th, 2025',
        status: 'active',
        features: [
            'Kali Linux mastery',
            'Web App Pentesting',
            'Network Exploitation',
            'Ethical Hacker Certificate'
        ]
    },
    {
        id: 'college-training-feb-15',
        courseId: 'collegeTraining',
        courseName: 'College Bulk Training Program',
        batchName: 'February Engineering Batch',
        title: '🎓 College Bulk Training',
        startDate: 'February 15th, 2025',
        endDate: 'April 10th, 2025',
        schedule: 'Flexible - College Schedule',
        totalSeats: 200,
        bookedSeats: 45,
        seatsLeft: 155,
        price: '₹299',
        originalPrice: '₹499',
        instructor: 'College Training Team',
        urgency: 'medium',
        enrollmentDeadline: 'February 10th, 2025',
        status: 'active',
        features: [
            '8-week comprehensive program',
            'Engineering student focused',
            'Placement assistance included',
            'Industry certificates for all'
        ]
    },
    // Example: Adding a new batch
    /*
    {
        id: 'incident-response-apr-01',
        courseId: 'incidentResponse',
        courseName: 'Incident Response & Recovery',
        batchName: 'April Crisis Management Batch',
        title: '🚨 Incident Response Expert',
        startDate: 'April 1st, 2025',
        endDate: 'April 30th, 2025',
        schedule: 'Weekends, 9AM-5PM IST',
        totalSeats: 25,
        bookedSeats: 3,
        seatsLeft: 22,
        price: '₹3,499',
        originalPrice: '₹4,999',
        instructor: 'Crisis Response Expert',
        urgency: 'low',
        enrollmentDeadline: 'March 25th, 2025',
        status: 'active',
        features: [
            'Real incident simulations',
            'Crisis communication',
            'Recovery procedures',
            'Compliance reporting'
        ]
    }
    */
];

// Helper functions
export const getActiveBatches = () => {
    return activeBatches.filter(batch => batch.status === 'active');
};

export const getBatchById = (id) => {
    return activeBatches.find(batch => batch.id === id);
};

export const getBatchesByCourse = (courseId) => {
    return activeBatches.filter(batch => batch.courseId === courseId && batch.status === 'active');
};

export const getUrgencyColor = (urgency) => {
    switch (urgency) {
        case 'high': return 'text-red-300 bg-red-900/30 border-red-500';
        case 'medium': return 'text-yellow-300 bg-yellow-900/30 border-yellow-500';
        case 'low': return 'text-green-300 bg-green-900/30 border-green-500';
        default: return 'text-blue-300 bg-blue-900/30 border-blue-500';
    }
};