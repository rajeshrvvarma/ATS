/**
 * AdminEventsManagement - Manage upcoming batches, bootcamps, and workshops
 * Allows admin to add, edit, and delete events that appear in the banner and events page
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Sparkles,
  Zap,
  BookOpen,
  DollarSign,
  Clock
} from 'lucide-react';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import app from '@/config/firebase';

const db = getFirestore(app);

export default function AdminEventsManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // all, batch, bootcamp, workshop
  const [formData, setFormData] = useState({
    type: 'batch',
    courseId: '',
    title: '',
    startDate: '',
    endDate: '',
    location: '',
    maxStudents: 20,
    currentEnrolled: 0,
    price: '',
    time: '',
    urgency: 'low'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const eventsCol = collection(db, 'events');
      const snapshot = await getDocs(eventsCol);
      const eventsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by start date
      eventsList.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      setEvents(eventsList);
    } catch (err) {
      setError('Failed to load events: ' + err.message);
      console.error('Error fetching events:', err);
    }
    setLoading(false);
  };

  const handleAddEvent = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.startDate || !formData.type) {
        alert('Please fill in all required fields');
        return;
      }

      const newEvent = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'events'), newEvent);
      setShowAddModal(false);
      resetForm();
      fetchEvents();
    } catch (err) {
      alert('Failed to add event: ' + err.message);
      console.error('Error adding event:', err);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      if (!editingEvent?.id) return;

      const eventRef = doc(db, 'events', editingEvent.id);
      await updateDoc(eventRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      });

      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (err) {
      alert('Failed to update event: ' + err.message);
      console.error('Error updating event:', err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await deleteDoc(doc(db, 'events', eventId));
      fetchEvents();
    } catch (err) {
      alert('Failed to delete event: ' + err.message);
      console.error('Error deleting event:', err);
    }
  };

  const startEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      type: event.type || 'batch',
      courseId: event.courseId || '',
      title: event.title || '',
      startDate: event.startDate || '',
      endDate: event.endDate || '',
      location: event.location || '',
      maxStudents: event.maxStudents || 20,
      currentEnrolled: event.currentEnrolled || 0,
      price: event.price || '',
      time: event.time || '',
      urgency: event.urgency || 'low'
    });
  };

  const resetForm = () => {
    setFormData({
      type: 'batch',
      courseId: '',
      title: '',
      startDate: '',
      endDate: '',
      location: '',
      maxStudents: 20,
      currentEnrolled: 0,
      price: '',
      time: '',
      urgency: 'low'
    });
  };

  const filteredEvents = events.filter(event => {
    if (activeFilter === 'all') return true;
    return event.type === activeFilter;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'workshop':
        return <BookOpen className="w-5 h-5 text-green-400" />;
      case 'bootcamp':
        return <Zap className="w-5 h-5 text-purple-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTypeBadge = (type) => {
    const styles = {
      batch: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      bootcamp: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      workshop: 'bg-green-500/20 text-green-300 border-green-500/30'
    };
    return styles[type] || styles.batch;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Events Management</h2>
          <p className="text-slate-400 mt-1">Manage batches, bootcamps, and workshops</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Event
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'batch', 'bootcamp', 'workshop'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === filter
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
            {filter === 'all' ? ` (${events.length})` : ` (${events.filter(e => e.type === filter).length})`}
          </button>
        ))}
      </div>

      {/* Events List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading events...</div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4">
          {error}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No {activeFilter !== 'all' ? activeFilter + 's' : 'events'} found. Add one to get started!
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map(event => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getTypeIcon(event.type)}
                    <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeBadge(event.type)}`}>
                      {event.type.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.startDate).toLocaleDateString()}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>{event.currentEnrolled || 0}/{event.maxStudents}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">{event.price}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => startEdit(event)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingEvent) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingEvent(null);
                  resetForm();
                }}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Event Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="batch">Batch</option>
                  <option value="bootcamp">Bootcamp</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 2-Month Defensive Security Mastery"
                />
              </div>

              {/* Course ID */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Course ID</label>
                <input
                  type="text"
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., defensive-mastery"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Time (for workshops) */}
              {formData.type === 'workshop' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., 6:00 PM - 8:00 PM"
                  />
                </div>
              )}

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Hyderabad & Online"
                />
              </div>

              {/* Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Max Students</label>
                  <input
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Current Enrolled</label>
                  <input
                    type="number"
                    value={formData.currentEnrolled}
                    onChange={(e) => setFormData({ ...formData, currentEnrolled: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Price</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., ₹2,999 or FREE"
                />
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Urgency Level</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (Filling Fast)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingEvent(null);
                    resetForm();
                  }}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
