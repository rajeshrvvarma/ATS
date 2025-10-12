import { courses as seedCourses } from '@/data/courses';

const STORAGE_KEY = 'courses_store_v1';

export function loadCourses() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed;
    } catch {}
  }
  return seedCourses;
}

export function saveCourses(courses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}

export function addCourse(course) {
  const all = loadCourses();
  const id = course.id || `${course.category}-${Date.now()}`;
  const newCourse = { id, lessons: [], thumbnail: '/logo.png', price: 'Free', difficulty: 'Beginner', ...course };
  const updated = [newCourse, ...all];
  saveCourses(updated);
  return newCourse;
}

export function updateCourse(courseId, updates) {
  const all = loadCourses();
  const updated = all.map(c => c.id === courseId ? { ...c, ...updates } : c);
  saveCourses(updated);
}

export function deleteCourse(courseId) {
  const all = loadCourses();
  const updated = all.filter(c => c.id !== courseId);
  saveCourses(updated);
}

export function addLesson(courseId, lesson) {
  const all = loadCourses();
  const idx = all.findIndex(c => c.id === courseId);
  if (idx === -1) return;
  const newLesson = { id: lesson.id || `lesson-${Date.now()}`, type: 'youtube', duration: '10:00', ...lesson };
  all[idx] = { ...all[idx], lessons: [ ...all[idx].lessons, newLesson ] };
  saveCourses(all);
  return newLesson;
}

export function updateLesson(courseId, lessonId, updates) {
  const all = loadCourses();
  const idx = all.findIndex(c => c.id === courseId);
  if (idx === -1) return;
  all[idx] = {
    ...all[idx],
    lessons: all[idx].lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
  };
  saveCourses(all);
}

export function deleteLesson(courseId, lessonId) {
  const all = loadCourses();
  const idx = all.findIndex(c => c.id === courseId);
  if (idx === -1) return;
  all[idx] = {
    ...all[idx],
    lessons: all[idx].lessons.filter(l => l.id !== lessonId)
  };
  saveCourses(all);
}

export function moveLesson(courseId, fromIndex, toIndex) {
  const all = loadCourses();
  const idx = all.findIndex(c => c.id === courseId);
  if (idx === -1) return;
  const lessons = [...all[idx].lessons];
  const [moved] = lessons.splice(fromIndex, 1);
  lessons.splice(toIndex, 0, moved);
  all[idx] = { ...all[idx], lessons };
  saveCourses(all);
}

export function exportCourses() {
  const all = loadCourses();
  return JSON.stringify(all, null, 2);
}

export function importCourses(json) {
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed)) throw new Error('Invalid format');
  saveCourses(parsed);
}

// Admin approval system for course deletions
const DELETION_REQUESTS_KEY = 'course_deletion_requests_v1';

export function requestCourseDeletion(courseId, instructorId, instructorName, courseName) {
  const requests = getDeletionRequests();
  const newRequest = {
    id: `del_req_${Date.now()}`,
    courseId,
    instructorId,
    instructorName,
    courseName,
    requestedAt: new Date().toISOString(),
    status: 'pending', // pending, approved, rejected
    reason: ''
  };
  
  // Check if request already exists
  const existingRequest = requests.find(req => 
    req.courseId === courseId && req.status === 'pending'
  );
  
  if (existingRequest) {
    throw new Error('A deletion request for this course is already pending');
  }
  
  requests.push(newRequest);
  localStorage.setItem(DELETION_REQUESTS_KEY, JSON.stringify(requests));
  return newRequest;
}

export function getDeletionRequests() {
  const stored = localStorage.getItem(DELETION_REQUESTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function approveDeletionRequest(requestId) {
  const requests = getDeletionRequests();
  const request = requests.find(req => req.id === requestId);
  if (!request) throw new Error('Request not found');
  
  // Delete the course
  deleteCourse(request.courseId);
  
  // Update request status
  request.status = 'approved';
  request.approvedAt = new Date().toISOString();
  localStorage.setItem(DELETION_REQUESTS_KEY, JSON.stringify(requests));
  
  return request;
}

export function rejectDeletionRequest(requestId, reason = '') {
  const requests = getDeletionRequests();
  const request = requests.find(req => req.id === requestId);
  if (!request) throw new Error('Request not found');
  
  request.status = 'rejected';
  request.rejectedAt = new Date().toISOString();
  request.rejectionReason = reason;
  localStorage.setItem(DELETION_REQUESTS_KEY, JSON.stringify(requests));
  
  return request;
}


