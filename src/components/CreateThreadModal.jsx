/**
 * CreateThreadModal Component - Thread Creation Interface
 * Allows users to create new forum threads with rich content and categorization
 */

import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Tag, 
  Type, 
  Hash, 
  AlertCircle,
  Send,
  Image,
  Link,
  Bold,
  Italic,
  List
} from 'lucide-react';
import { createForumThread, FORUM_CATEGORIES, POST_TYPES } from '@/services/forumService.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { useToast } from '@/context/ToastContext.jsx';
import { NotificationService } from '@/services/notificationService.js';

const CreateThreadModal = ({ isOpen, onClose, preselectedType = null, onThreadCreated }) => {
  // State management
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    type: preselectedType || POST_TYPES.DISCUSSION,
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Context hooks
  const { user } = useAuth();
  const { addToast } = useToast();

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        content: '',
        category: '',
        type: preselectedType || POST_TYPES.DISCUSSION,
        tags: []
      });
      setTagInput('');
      setErrors({});
    }
  }, [isOpen, preselectedType]);

  /**
   * Handle form input changes
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  /**
   * Add tag to the thread
   */
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  /**
   * Remove tag from the thread
   */
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  /**
   * Handle tag input key press
   */
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    } else if (formData.content.length > 5000) {
      newErrors.content = 'Content must be less than 5000 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createForumThread(
        user.uid,
        user.displayName || 'Anonymous',
        {
          ...formData,
          authorLevel: user.courseAccess?.level || 'Student'
        }
      );

      if (result.success) {
        addToast('Thread created successfully!', 'success');
        
        // 🚀 NEW: Send notification for new thread (if it's a question or announcement)
        if (formData.type === POST_TYPES.QUESTION || formData.type === POST_TYPES.ANNOUNCEMENT) {
          try {
            // For now, just log the notification (you could extend this to notify relevant users)
            console.log('📢 New thread notification could be sent:', {
              type: 'new_thread',
              threadTitle: formData.title,
              threadType: formData.type,
              category: formData.category,
              author: user.displayName || 'Anonymous'
            });
            
            // Optional: Send system announcement for important threads
            if (formData.type === POST_TYPES.ANNOUNCEMENT) {
              await NotificationService.sendNotification(
                user.uid, // For now, just notify the creator as confirmation
                'thread_published',
                {
                  threadTitle: formData.title,
                  threadType: formData.type,
                  category: formData.category,
                  threadId: result.data.id
                }
              );
              console.log('✅ Thread publication notification sent');
            }
          } catch (notificationError) {
            console.error('❌ Failed to send thread notification:', notificationError);
            // Don't fail thread creation if notification fails
          }
        }
        
        onThreadCreated(result.data);
        onClose();
      } else {
        throw new Error(result.error || 'Failed to create thread');
      }
    } catch (error) {
      console.error('Error creating thread:', error);
      addToast('Failed to create thread. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Get category display name
   */
  const getCategoryName = (category) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  /**
   * Get post type display name
   */
  const getPostTypeName = (type) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Create New Thread</h2>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Thread Type and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Type className="inline h-4 w-4 mr-1" />
                  Thread Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(POST_TYPES).map(([key, value]) => (
                    <option key={value} value={value}>
                      {getPostTypeName(value)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="inline h-4 w-4 mr-1" />
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {Object.entries(FORUM_CATEGORIES).map(([key, value]) => (
                    <option key={value} value={value}>
                      {getCategoryName(value)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            {/* Thread Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thread Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter a descriptive title for your thread..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.title ? (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.title}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Make your title clear and specific
                  </p>
                )}
                <span className="text-sm text-gray-400">
                  {formData.title.length}/200
                </span>
              </div>
            </div>

            {/* Thread Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              
              {/* Content Editor Toolbar */}
              <div className="border border-gray-300 rounded-t-lg bg-gray-50 px-3 py-2 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="Bold"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="Italic"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="List"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="h-4 w-px bg-gray-300"></div>
                
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="Add Link"
                  >
                    <Link className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="Add Image"
                  >
                    <Image className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                className={`w-full px-3 py-3 border-l border-r border-b rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
                rows={8}
                maxLength={5000}
              />
              
              <div className="flex justify-between items-center mt-1">
                {errors.content ? (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.content}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Provide details, context, and any relevant information
                  </p>
                )}
                <span className="text-sm text-gray-400">
                  {formData.content.length}/5000
                </span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline h-4 w-4 mr-1" />
                Tags (Optional)
              </label>
              
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add tags to help others find your thread..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={20}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim() || formData.tags.length >= 5}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              
              {/* Display Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-1">
                Press Enter or comma to add tags. Maximum 5 tags.
              </p>
            </div>

            {/* Community Guidelines Reminder */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Community Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be respectful and constructive in your discussions</li>
                <li>• Search existing threads before creating new ones</li>
                <li>• Use clear, descriptive titles</li>
                <li>• Choose the most appropriate category</li>
                <li>• Add relevant tags to help others find your content</li>
              </ul>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Create Thread
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateThreadModal;