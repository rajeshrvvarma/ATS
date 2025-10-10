/**
 * Course Description Generator Component
 * Generates comprehensive course descriptions, learning objectives, and metadata from video content
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Brain, 
  Target, 
  Users, 
  Clock, 
  Award, 
  Save, 
  Copy, 
  Eye, 
  Edit,
  FileText,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Loader,
  Download,
  Wand2
} from 'lucide-react';
import aiContentService from '../../services/aiContentService';
import transcriptManagementService from '../../services/transcriptManagementService';

const CourseDescriptionGenerator = ({ videoId, transcript, existingCourseData, onDescriptionGenerated = () => {} }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState(null);
  const [editingDescription, setEditingDescription] = useState(null);
  const [generationOptions, setGenerationOptions] = useState({
    courseType: 'professional',
    targetAudience: 'beginners',
    focusArea: 'practical_skills',
    tone: 'professional',
    includePrerequisites: true,
    includeDuration: true,
    includeSkills: true
  });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [savedDescriptions, setSavedDescriptions] = useState([]);

  const courseTypes = {
    professional: 'Professional Development',
    academic: 'Academic Course',
    certification: 'Certification Training',
    workshop: 'Workshop/Seminar',
    tutorial: 'Tutorial Series',
    bootcamp: 'Intensive Bootcamp'
  };

  const targetAudiences = {
    beginners: 'Complete Beginners',
    intermediate: 'Intermediate Learners',
    advanced: 'Advanced Practitioners',
    professionals: 'Working Professionals',
    students: 'Students',
    mixed: 'Mixed Skill Levels'
  };

  const focusAreas = {
    practical_skills: 'Practical Skills & Application',
    theoretical_knowledge: 'Theoretical Knowledge',
    problem_solving: 'Problem Solving',
    career_development: 'Career Development',
    certification_prep: 'Certification Preparation',
    industry_insights: 'Industry Insights'
  };

  const tones = {
    professional: 'Professional & Formal',
    conversational: 'Conversational & Friendly',
    academic: 'Academic & Scholarly',
    motivational: 'Motivational & Inspiring',
    technical: 'Technical & Precise'
  };

  useEffect(() => {
    loadSavedDescriptions();
    if (existingCourseData) {
      prefillFromExisting();
    }
  }, [videoId, existingCourseData]);

  const loadSavedDescriptions = async () => {
    try {
      const descriptions = await transcriptManagementService.getVideoDescriptions(videoId);
      setSavedDescriptions(descriptions || []);
    } catch (error) {
      console.error('Failed to load saved descriptions:', error);
    }
  };

  const prefillFromExisting = () => {
    if (existingCourseData) {
      const prefilled = {
        title: existingCourseData.title || '',
        short_description: existingCourseData.description || '',
        detailed_description: '',
        learning_objectives: existingCourseData.learningOutcomes || [],
        prerequisites: existingCourseData.prerequisites || [],
        target_audience: '',
        duration_estimate: existingCourseData.duration || '',
        difficulty_level: existingCourseData.level || 'intermediate',
        key_topics: [],
        skills_gained: [],
        tags: existingCourseData.tags || []
      };
      setGeneratedDescription({ ...prefilled, isPrefilled: true });
      setEditingDescription(JSON.parse(JSON.stringify(prefilled)));
    }
  };

  const generateDescription = async () => {
    if (!aiContentService.isConfigured()) {
      setError('AI service not configured. Please set up your API key first.');
      return;
    }

    if (!transcript) {
      setError('No transcript available for description generation.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const description = await aiContentService.generateCourseDescription(transcript, {
        ...generationOptions,
        existingData: existingCourseData
      });
      
      // Add metadata
      description.metadata = {
        videoId,
        generatedAt: new Date().toISOString(),
        options: generationOptions,
        transcriptLength: transcript.length
      };

      setGeneratedDescription(description);
      setEditingDescription(JSON.parse(JSON.stringify(description)));
    } catch (error) {
      console.error('Description generation failed:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveDescription = async (description, name) => {
    try {
      const descriptionData = {
        ...description,
        name: name || `Course Description ${new Date().toLocaleDateString()}`,
        id: Date.now().toString(),
        savedAt: new Date().toISOString()
      };

      await transcriptManagementService.saveVideoDescription(videoId, descriptionData);
      await loadSavedDescriptions();
      onDescriptionGenerated(descriptionData);
      
      return descriptionData;
    } catch (error) {
      console.error('Failed to save description:', error);
      setError('Failed to save description: ' + error.message);
    }
  };

  const exportDescription = (description) => {
    const content = JSON.stringify(description, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `course-description-${description.name || 'generated'}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const updateDescription = (field, value) => {
    setEditingDescription(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addArrayItem = (field, item = '') => {
    setEditingDescription(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), item]
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setEditingDescription(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (field, index) => {
    setEditingDescription(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const DescriptionEditor = () => {
    if (!editingDescription) return null;

    return (
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Course Title
            </label>
            <input
              type="text"
              value={editingDescription.title || ''}
              onChange={(e) => updateDescription('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter course title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Difficulty Level
            </label>
            <select
              value={editingDescription.difficulty_level || 'intermediate'}
              onChange={(e) => updateDescription('difficulty_level', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Short Description
          </label>
          <textarea
            value={editingDescription.short_description || ''}
            onChange={(e) => updateDescription('short_description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder="Brief 1-2 sentence overview..."
          />
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description
          </label>
          <textarea
            value={editingDescription.detailed_description || ''}
            onChange={(e) => updateDescription('detailed_description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder="Comprehensive description with benefits and outcomes..."
          />
        </div>

        {/* Learning Objectives */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              <Target className="w-4 h-4 inline mr-1" />
              Learning Objectives
            </label>
            <button
              onClick={() => addArrayItem('learning_objectives')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3" />
              Add Objective
            </button>
          </div>
          <div className="space-y-2">
            {editingDescription.learning_objectives?.map((objective, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => updateArrayItem('learning_objectives', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Learning objective..."
                />
                <button
                  onClick={() => removeArrayItem('learning_objectives', index)}
                  className="text-red-600 hover:text-red-700 px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Target Audience & Duration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Target Audience
            </label>
            <input
              type="text"
              value={editingDescription.target_audience || ''}
              onChange={(e) => updateDescription('target_audience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Who should take this course..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Duration Estimate
            </label>
            <input
              type="text"
              value={editingDescription.duration_estimate || ''}
              onChange={(e) => updateDescription('duration_estimate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., 4 weeks, 20 hours..."
            />
          </div>
        </div>

        {/* Prerequisites */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Prerequisites
            </label>
            <button
              onClick={() => addArrayItem('prerequisites')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              Add Prerequisite
            </button>
          </div>
          <div className="space-y-2">
            {editingDescription.prerequisites?.map((prereq, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={prereq}
                  onChange={(e) => updateArrayItem('prerequisites', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Prerequisite..."
                />
                <button
                  onClick={() => removeArrayItem('prerequisites', index)}
                  className="text-red-600 hover:text-red-700 px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Key Topics */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Key Topics
            </label>
            <button
              onClick={() => addArrayItem('key_topics')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3" />
              Add Topic
            </button>
          </div>
          <div className="space-y-2">
            {editingDescription.key_topics?.map((topic, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => updateArrayItem('key_topics', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Key topic..."
                />
                <button
                  onClick={() => removeArrayItem('key_topics', index)}
                  className="text-red-600 hover:text-red-700 px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Gained */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              <Award className="w-4 h-4 inline mr-1" />
              Skills Gained
            </label>
            <button
              onClick={() => addArrayItem('skills_gained')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Award className="w-3 h-3" />
              Add Skill
            </button>
          </div>
          <div className="space-y-2">
            {editingDescription.skills_gained?.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateArrayItem('skills_gained', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Skill gained..."
                />
                <button
                  onClick={() => removeArrayItem('skills_gained', index)}
                  className="text-red-600 hover:text-red-700 px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={editingDescription.tags?.join(', ') || ''}
            onChange={(e) => updateDescription('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="programming, web development, react, etc."
          />
        </div>
      </div>
    );
  };

  const DescriptionPreview = () => {
    if (!generatedDescription) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {generatedDescription.title}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(generatedDescription.title)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {generatedDescription.difficulty_level?.charAt(0).toUpperCase() + generatedDescription.difficulty_level?.slice(1)}
            </span>
            {generatedDescription.duration_estimate && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {generatedDescription.duration_estimate}
              </span>
            )}
          </div>
        </div>

        {/* Short Description */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Overview</h3>
          <p className="text-gray-700">{generatedDescription.short_description}</p>
        </div>

        {/* Detailed Description */}
        {generatedDescription.detailed_description && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">About This Course</h3>
            <div className="prose prose-sm max-w-none text-gray-700">
              {generatedDescription.detailed_description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3">{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {/* Learning Objectives */}
        {generatedDescription.learning_objectives && generatedDescription.learning_objectives.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              What You'll Learn
            </h3>
            <ul className="space-y-2">
              {generatedDescription.learning_objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Target Audience */}
        {generatedDescription.target_audience && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Who This Course Is For
            </h3>
            <p className="text-gray-700">{generatedDescription.target_audience}</p>
          </div>
        )}

        {/* Prerequisites */}
        {generatedDescription.prerequisites && generatedDescription.prerequisites.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Prerequisites</h3>
            <ul className="space-y-1">
              {generatedDescription.prerequisites.map((prereq, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  {prereq}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Topics */}
        {generatedDescription.key_topics && generatedDescription.key_topics.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Key Topics Covered</h3>
            <div className="flex flex-wrap gap-2">
              {generatedDescription.key_topics.map((topic, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills Gained */}
        {generatedDescription.skills_gained && generatedDescription.skills_gained.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Skills You'll Gain
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {generatedDescription.skills_gained.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700">
                  <Award className="w-4 h-4 text-purple-500" />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {generatedDescription.tags && generatedDescription.tags.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {generatedDescription.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Course Description Generator</h2>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Generation Options */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Generation Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Type
            </label>
            <select
              value={generationOptions.courseType}
              onChange={(e) => setGenerationOptions({
                ...generationOptions,
                courseType: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {Object.entries(courseTypes).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience
            </label>
            <select
              value={generationOptions.targetAudience}
              onChange={(e) => setGenerationOptions({
                ...generationOptions,
                targetAudience: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {Object.entries(targetAudiences).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Focus Area
            </label>
            <select
              value={generationOptions.focusArea}
              onChange={(e) => setGenerationOptions({
                ...generationOptions,
                focusArea: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {Object.entries(focusAreas).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Writing Tone
            </label>
            <select
              value={generationOptions.tone}
              onChange={(e) => setGenerationOptions({
                ...generationOptions,
                tone: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {Object.entries(tones).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="flex gap-4">
              {[
                { key: 'includePrerequisites', label: 'Prerequisites' },
                { key: 'includeDuration', label: 'Duration' },
                { key: 'includeSkills', label: 'Skills' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={generationOptions[key]}
                    onChange={(e) => setGenerationOptions({
                      ...generationOptions,
                      [key]: e.target.checked
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={generateDescription}
          disabled={isGenerating || !transcript}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          {isGenerating ? 'Generating Description...' : 'Generate Course Description'}
        </button>
      </div>

      {/* Generated Description */}
      {generatedDescription && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">
              {generatedDescription.isPrefilled ? 'Current Course Data' : 'Generated Course Description'}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                {editMode ? <Eye className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                {editMode ? 'Preview' : 'Edit'}
              </button>
              <button
                onClick={() => exportDescription(generatedDescription)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => {
                  const name = prompt('Enter description name:');
                  if (name) saveDescription(editingDescription || generatedDescription, name);
                }}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>

          {editMode ? <DescriptionEditor /> : <DescriptionPreview />}
        </div>
      )}

      {/* Saved Descriptions */}
      {savedDescriptions.length > 0 && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Saved Descriptions</h3>
          <div className="space-y-3">
            {savedDescriptions.map((description) => (
              <div key={description.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                <div>
                  <h4 className="font-medium text-gray-900">{description.name}</h4>
                  <p className="text-sm text-gray-600">
                    {description.title} • 
                    Saved {new Date(description.savedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setGeneratedDescription(description);
                      setEditingDescription(JSON.parse(JSON.stringify(description)));
                      setEditMode(false);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  <button
                    onClick={() => exportDescription(description)}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDescriptionGenerator;