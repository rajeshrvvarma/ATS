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


