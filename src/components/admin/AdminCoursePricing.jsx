// Admin Course Pricing Management Component
import React, { useState, useEffect } from 'react';
import { DollarSign, Edit2, Save, X, RefreshCw, Trash2 } from 'lucide-react';
import { getAllCoursePricing, updateCoursePricing, initializeDefaultPricing, cleanupLegacyPricing } from '@/services/coursePricingService.js';

export default function AdminCoursePricing() {
  const [pricing, setPricing] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    setLoading(true);
    const data = await getAllCoursePricing();
    setPricing(data);
    setLoading(false);
  };

  const handleEdit = (courseId) => {
    setEditingCourse(courseId);
    setEditData({ ...pricing[courseId] });
  };

  const handleSave = async (courseId) => {
    setSaving(true);
    const result = await updateCoursePricing(courseId, editData);
    
    if (result.success) {
      setPricing(prev => ({ ...prev, [courseId]: editData }));
      setEditingCourse(null);
      setMessage('Course pricing updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`Error: ${result.error}`);
      setTimeout(() => setMessage(''), 5000);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setEditingCourse(null);
    setEditData({});
  };

  const handleCleanup = async () => {
    setSaving(true);
    const result = await cleanupLegacyPricing();
    if (result.success) {
      await loadPricing();
      setMessage('Legacy duplicate courses cleaned up successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`Error: ${result.error}`);
      setTimeout(() => setMessage(''), 5000);
    }
    setSaving(false);
  };

  const handleInitialize = async () => {
    setSaving(true);
    const result = await initializeDefaultPricing();
    if (result.success) {
      await loadPricing();
      setMessage('Default pricing initialized successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`Error: ${result.error}`);
      setTimeout(() => setMessage(''), 5000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
        <span className="ml-2 text-slate-300">Loading course pricing...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <DollarSign className="w-6 h-6 text-sky-500 mr-3" />
          <h2 className="text-2xl font-bold text-white">Course Pricing Management</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCleanup}
            disabled={saving}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Cleanup Duplicates
          </button>
          <button
            onClick={handleInitialize}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Initialize Defaults
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('Error') ? 'bg-red-600/20 text-red-300' : 'bg-green-600/20 text-green-300'}`}>
          {message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-slate-800 text-white rounded-lg">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Duration</th>
              <th className="px-4 py-3 text-right">Original Price</th>
              <th className="px-4 py-3 text-right">Discount Price</th>
              <th className="px-4 py-3 text-right">Final Price</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(pricing).map((course) => (
              <tr key={course.id} className="border-b border-slate-700">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium">{course.name}</div>
                    <div className="text-xs text-slate-400">{course.description}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300">{course.duration}</td>
                
                {editingCourse === course.id ? (
                  <>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={editData.originalPrice || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, originalPrice: parseInt(e.target.value) || 0 }))}
                        className="w-full px-2 py-1 bg-slate-700 text-white rounded text-right"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={editData.discountPrice || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, discountPrice: parseInt(e.target.value) || 0 }))}
                        className="w-full px-2 py-1 bg-slate-700 text-white rounded text-right"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={editData.finalPrice || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, finalPrice: parseInt(e.target.value) || 0 }))}
                        className="w-full px-2 py-1 bg-slate-700 text-white rounded text-right"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-right">
                      <span className="line-through text-slate-400">₹{course.originalPrice?.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-yellow-400">₹{course.discountPrice?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-green-400">₹{course.finalPrice?.toLocaleString()}</span>
                    </td>
                  </>
                )}

                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${course.isActive ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'}`}>
                    {course.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  {editingCourse === course.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleSave(course.id)}
                        disabled={saving}
                        className="p-1 text-green-400 hover:text-green-300 disabled:opacity-50"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="p-1 text-red-400 hover:text-red-300 disabled:opacity-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(course.id)}
                      className="p-1 text-sky-400 hover:text-sky-300"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-slate-400">
        <p>• Original Price: The full price before any discounts</p>
        <p>• Discount Price: The discounted price (shown with strikethrough on original)</p>
        <p>• Final Price: The actual price students pay (used in payment processing)</p>
        <p>• Last updated: {pricing[Object.keys(pricing)[0]]?.lastUpdated ? new Date(pricing[Object.keys(pricing)[0]].lastUpdated).toLocaleString() : 'Never'}</p>
      </div>
    </div>
  );
}