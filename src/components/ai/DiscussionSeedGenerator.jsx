/**
 * Discussion Seed Generator Component
 * Generates discussion questions and conversation starters from video content
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Brain, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Copy, 
  Users, 
  Lightbulb,
  Target,
  MessageCircle,
  AlertCircle,
  Loader,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import aiContentService from '../../services/aiContentService';
import transcriptManagementService from '../../services/transcriptManagementService';

const DiscussionSeedGenerator = ({ videoId, transcript, onDiscussionGenerated = () => {} }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDiscussions, setGeneratedDiscussions] = useState(null);
  const [editingDiscussions, setEditingDiscussions] = useState(null);
  const [generationOptions, setGenerationOptions] = useState({
    questionCount: 3,
    types: {
      critical_thinking: true,
      application: true,
      debate: false,
      reflection: true,
      case_study: false
    },
    engagement_level: 'moderate',
    target_audience: 'students'
  });
  const [error, setError] = useState(null);
  const [savedDiscussions, setSavedDiscussions] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // Discussion types configuration
  const discussionTypes = {
    critical_thinking: {
      label: 'Critical Thinking',
      description: 'Questions that require analysis and evaluation',
      icon: Brain,
      color: 'blue'
    },
    application: {
      label: 'Practical Application',
      description: 'Connect concepts to real-world scenarios',
      icon: Target,
      color: 'green'
    },
    debate: {
      label: 'Debate & Discussion',
      description: 'Controversial topics that spark healthy debate',
      icon: MessageSquare,
      color: 'orange'
    },
    reflection: {
      label: 'Personal Reflection',
      description: 'Questions for self-assessment and introspection',
      icon: Lightbulb,
      color: 'purple'
    },
    case_study: {
      label: 'Case Study Analysis',
      description: 'Scenario-based problem solving',
      icon: Users,
      color: 'indigo'
    }
  };

  useEffect(() => {
    loadSavedDiscussions();
  }, [videoId]);

  const loadSavedDiscussions = async () => {
    try {
      const discussions = await transcriptManagementService.getVideoDiscussions(videoId);
      setSavedDiscussions(discussions || []);
    } catch (error) {
      console.error('Failed to load saved discussions:', error);
    }
  };

  const generateDiscussions = async () => {
    if (!aiContentService.isConfigured()) {
      setError('AI service not configured. Please set up your API key first.');
      return;
    }

    if (!transcript) {
      setError('No transcript available for discussion generation.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const discussions = await aiContentService.generateDiscussionSeeds(transcript, {
        ...generationOptions,
        types: Object.keys(generationOptions.types).filter(type => generationOptions.types[type])
      });
      
      // Add metadata
      discussions.metadata = {
        videoId,
        generatedAt: new Date().toISOString(),
        options: generationOptions,
        transcriptLength: transcript.length
      };

      setGeneratedDiscussions(discussions);
      setEditingDiscussions(JSON.parse(JSON.stringify(discussions)));
    } catch (error) {
      console.error('Discussion generation failed:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveDiscussions = async (discussions, name) => {
    try {
      const discussionData = {
        ...discussions,
        name: name || `Discussion Seeds ${new Date().toLocaleDateString()}`,
        id: Date.now().toString(),
        savedAt: new Date().toISOString()
      };

      await transcriptManagementService.saveVideoDiscussions(videoId, discussionData);
      await loadSavedDiscussions();
      onDiscussionGenerated(discussionData);
      
      return discussionData;
    } catch (error) {
      console.error('Failed to save discussions:', error);
      setError('Failed to save discussions: ' + error.message);
    }
  };

  const deleteDiscussions = async (discussionId) => {
    if (!confirm('Are you sure you want to delete these discussion seeds?')) return;

    try {
      await transcriptManagementService.deleteVideoDiscussions(videoId, discussionId);
      await loadSavedDiscussions();
    } catch (error) {
      console.error('Failed to delete discussions:', error);
      setError('Failed to delete discussions: ' + error.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log('Copied to clipboard');
    });
  };

  const updateDiscussion = (index, field, value) => {
    const newDiscussions = { ...editingDiscussions };
    newDiscussions.discussion_seeds[index][field] = value;
    setEditingDiscussions(newDiscussions);
  };

  const addFollowUp = (discussionIndex) => {
    const newDiscussions = { ...editingDiscussions };
    newDiscussions.discussion_seeds[discussionIndex].follow_ups.push('');
    setEditingDiscussions(newDiscussions);
  };

  const updateFollowUp = (discussionIndex, followUpIndex, value) => {
    const newDiscussions = { ...editingDiscussions };
    newDiscussions.discussion_seeds[discussionIndex].follow_ups[followUpIndex] = value;
    setEditingDiscussions(newDiscussions);
  };

  const removeFollowUp = (discussionIndex, followUpIndex) => {
    const newDiscussions = { ...editingDiscussions };
    newDiscussions.discussion_seeds[discussionIndex].follow_ups.splice(followUpIndex, 1);
    setEditingDiscussions(newDiscussions);
  };

  const addNewDiscussion = () => {
    const newDiscussions = { ...editingDiscussions };
    newDiscussions.discussion_seeds.push({
      question: '',
      type: 'critical_thinking',
      context: '',
      follow_ups: [],
      tags: []
    });
    setEditingDiscussions(newDiscussions);
  };

  const removeDiscussion = (index) => {
    const newDiscussions = { ...editingDiscussions };
    newDiscussions.discussion_seeds.splice(index, 1);
    setEditingDiscussions(newDiscussions);
  };

  const toggleExpanded = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const DiscussionEditor = ({ discussion, index }) => {
    const typeConfig = discussionTypes[discussion.type] || discussionTypes.critical_thinking;
    const IconComponent = typeConfig.icon;

    return (
      <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <IconComponent className={`w-5 h-5 text-${typeConfig.color}-600`} />
            <h4 className="font-medium text-gray-900">Discussion {index + 1}</h4>
          </div>
          <div className="flex gap-2">
            <select
              value={discussion.type}
              onChange={(e) => updateDiscussion(index, 'type', e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              {Object.entries(discussionTypes).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
            <button
              onClick={() => removeDiscussion(index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discussion Question
            </label>
            <textarea
              value={discussion.question}
              onChange={(e) => updateDiscussion(index, 'question', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter the main discussion question..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Context/Scenario
            </label>
            <textarea
              value={discussion.context || ''}
              onChange={(e) => updateDiscussion(index, 'context', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Provide background context or a scenario..."
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Follow-up Questions
              </label>
              <button
                onClick={() => addFollowUp(index)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Follow-up
              </button>
            </div>
            <div className="space-y-2">
              {discussion.follow_ups?.map((followUp, followIndex) => (
                <div key={followIndex} className="flex gap-2">
                  <input
                    type="text"
                    value={followUp}
                    onChange={(e) => updateFollowUp(index, followIndex, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Follow-up question..."
                  />
                  <button
                    onClick={() => removeFollowUp(index, followIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={discussion.tags?.join(', ') || ''}
              onChange={(e) => updateDiscussion(index, 'tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="concept, theory, practical, etc."
            />
          </div>
        </div>
      </div>
    );
  };

  const DiscussionPreview = ({ discussions }) => {
    return (
      <div className="space-y-4">
        {discussions.discussion_seeds?.map((discussion, index) => {
          const typeConfig = discussionTypes[discussion.type] || discussionTypes.critical_thinking;
          const IconComponent = typeConfig.icon;
          const isExpanded = expandedQuestions[index];

          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className={`w-5 h-5 text-${typeConfig.color}-600`} />
                  <span className={`text-sm px-2 py-1 rounded bg-${typeConfig.color}-100 text-${typeConfig.color}-700`}>
                    {typeConfig.label}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyToClipboard(discussion.question)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Copy question"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <h4 className="font-medium text-gray-900 mb-2">
                {discussion.question}
              </h4>

              {discussion.context && (
                <div className="mb-3 p-3 bg-gray-50 rounded border-l-4 border-gray-300">
                  <p className="text-sm text-gray-700">
                    <strong>Context:</strong> {discussion.context}
                  </p>
                </div>
              )}

              {isExpanded && (
                <div className="space-y-3">
                  {discussion.follow_ups && discussion.follow_ups.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Follow-up Questions:</h5>
                      <ul className="space-y-1">
                        {discussion.follow_ups.map((followUp, followIndex) => (
                          <li key={followIndex} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-gray-400 mt-1">•</span>
                            <span>{followUp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {discussion.tags && discussion.tags.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Tags:</h5>
                      <div className="flex flex-wrap gap-1">
                        {discussion.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Discussion Seed Generator</h2>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Discussion Questions
            </label>
            <select
              value={generationOptions.questionCount}
              onChange={(e) => setGenerationOptions({
                ...generationOptions,
                questionCount: parseInt(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {[2, 3, 4, 5, 6].map(count => (
                <option key={count} value={count}>{count} questions</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Engagement Level
            </label>
            <select
              value={generationOptions.engagement_level}
              onChange={(e) => setGenerationOptions({
                ...generationOptions,
                engagement_level: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="light">Light - Easy discussion starters</option>
              <option value="moderate">Moderate - Thoughtful questions</option>
              <option value="deep">Deep - Challenging critical thinking</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discussion Types
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(discussionTypes).map(([key, config]) => {
              const IconComponent = config.icon;
              return (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors ${
                    generationOptions.types[key]
                      ? `border-${config.color}-300 bg-${config.color}-50`
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={generationOptions.types[key]}
                    onChange={(e) => setGenerationOptions({
                      ...generationOptions,
                      types: {
                        ...generationOptions.types,
                        [key]: e.target.checked
                      }
                    })}
                    className={`rounded border-gray-300 text-${config.color}-600 focus:ring-${config.color}-500`}
                  />
                  <IconComponent className={`w-4 h-4 text-${config.color}-600`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{config.label}</div>
                    <div className="text-xs text-gray-500">{config.description}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <button
          onClick={generateDiscussions}
          disabled={isGenerating || !transcript || Object.values(generationOptions.types).every(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isGenerating ? 'Generating Discussions...' : 'Generate Discussion Seeds'}
        </button>
      </div>

      {/* Generated Discussions */}
      {generatedDiscussions && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Generated Discussion Seeds</h3>
            <div className="flex gap-2">
              <button
                onClick={addNewDiscussion}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
              <button
                onClick={() => {
                  const name = prompt('Enter discussion set name:');
                  if (name) saveDiscussions(editingDiscussions || generatedDiscussions, name);
                }}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setEditingDiscussions(null)}
                className={`px-3 py-1 text-sm rounded ${
                  !editingDiscussions ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setEditingDiscussions(editingDiscussions || JSON.parse(JSON.stringify(generatedDiscussions)))}
                className={`px-3 py-1 text-sm rounded ${
                  editingDiscussions ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Edit
              </button>
            </div>
          </div>

          {editingDiscussions ? (
            <div>
              {editingDiscussions.discussion_seeds?.map((discussion, index) => (
                <DiscussionEditor key={index} discussion={discussion} index={index} />
              ))}
            </div>
          ) : (
            <DiscussionPreview discussions={generatedDiscussions} />
          )}
        </div>
      )}

      {/* Saved Discussions */}
      {savedDiscussions.length > 0 && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Saved Discussion Sets</h3>
          <div className="space-y-3">
            {savedDiscussions.map((discussions) => (
              <div key={discussions.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                <div>
                  <h4 className="font-medium text-gray-900">{discussions.name}</h4>
                  <p className="text-sm text-gray-600">
                    {discussions.discussion_seeds?.length || 0} questions • 
                    Saved {new Date(discussions.savedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setGeneratedDiscussions(discussions);
                      setEditingDiscussions(null);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  <button
                    onClick={() => deleteDiscussions(discussions.id)}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
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

export default DiscussionSeedGenerator;