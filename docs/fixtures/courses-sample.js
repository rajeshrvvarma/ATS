/**
 * Archived sample course fixture.
 * This file is an archive of the original `src/data/courses.js` used for testing.
 * It is kept for reference only and is not imported by the application.
 */

export const coursesSample = [
  {
    id: 'defensive-bootcamp-video',
    title: 'Defensive Security Bootcamp - Video Series',
    description: 'Complete video-based training for SOC Analyst role with hands-on labs and real-world scenarios.',
    duration: '7 days',
    difficulty: 'Beginner to Intermediate',
    price: 'Free',
    thumbnail: '/logo.png',
    category: 'defensive',
    lessons: [
      {
        id: 'intro-cybersecurity',
        title: 'Introduction to Cybersecurity',
        description: 'Understanding the cybersecurity landscape and career opportunities',
        duration: '15:30',
        type: 'youtube',
        videoId: 'KV7K5plJcsI',
        videoUrl: 'https://www.youtube.com/watch?v=KV7K5plJcsI',
        difficulty: 'Beginner',
        transcript: null,
        transcriptStatus: 'pending',
        resources: [
          { name: 'Course Syllabus PDF', url: '#' },
          { name: 'Additional Reading', url: '#' }
        ]
      },
      // ... (lessons omitted for brevity)
    ]
  },
  // ... (other archived courses)
];

export const getCourseByIdSample = (id) => coursesSample.find(c => c.id === id);
