/**
 * Auto-Quiz Generator Component
 * Generates quizzes from video transcripts using AI
 */

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  FileText, 
  Plus, 
  Download, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Loader,
  Play,
  Save,
  Eye
} from 'lucide-react';
import aiContentService from '../../services/aiContentService';
import transcriptManagementService from '../../services/transcriptManagementService';

const AutoQuizGenerator = ({ videoId, transcript, onQuizGenerated = () => {} }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [generationOptions, setGenerationOptions] = useState({
    questionCount: 5,
    difficulty: 'mixed',
    focus: 'key concepts',
    includeTypes: {
      multiple_choice: true,
      true_false: true,
      short_answer: true
    }
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState(null);
  const [savedQuizzes, setSavedQuizzes] = useState([]);

  useEffect(() => {
    loadSavedQuizzes();
  }, [videoId]);

  const loadSavedQuizzes = async () => {
    try {
      const quizzes = await transcriptManagementService.getVideoQuizzes(videoId);
      setSavedQuizzes(quizzes || []);
    } catch (error) {
      console.error('Failed to load saved quizzes:', error);
    }
  };

  const generateQuiz = async () => {
    if (!aiContentService.isConfigured()) {
      setError('AI service not configured. Please set up your API key first.');
      return;
    }

    if (!transcript) {
      setError('No transcript available for quiz generation.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const quiz = await aiContentService.generateQuiz(transcript, generationOptions);
      
      // Add metadata
      quiz.metadata = {
        videoId,
        generatedAt: new Date().toISOString(),
        options: generationOptions,
        transcriptLength: transcript.length
      };

      setGeneratedQuiz(quiz);
      setEditingQuiz(JSON.parse(JSON.stringify(quiz))); // Deep copy for editing
    } catch (error) {
      console.error('Quiz generation failed:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveQuiz = async (quiz, quizName) => {
    try {
      const quizData = {
        ...quiz,
        name: quizName || `Quiz ${new Date().toLocaleDateString()}`,
        id: Date.now().toString(),
        savedAt: new Date().toISOString()
      };

      await transcriptManagementService.saveVideoQuiz(videoId, quizData);
      await loadSavedQuizzes();
      onQuizGenerated(quizData);
      
      return quizData;
    } catch (error) {
      console.error('Failed to save quiz:', error);
      setError('Failed to save quiz: ' + error.message);
    }
  };

  const deleteQuiz = async (quizId) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      await transcriptManagementService.deleteVideoQuiz(videoId, quizId);
      await loadSavedQuizzes();
    } catch (error) {
      console.error('Failed to delete quiz:', error);
      setError('Failed to delete quiz: ' + error.message);
    }
  };

  const exportQuiz = (quiz) => {
    const content = JSON.stringify(quiz, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-${quiz.name || 'generated'}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const QuestionEditor = ({ question, index, onChange }) => {
    const updateQuestion = (field, value) => {
      onChange(index, { ...question, [field]: value });
    };

    return (
      <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
          <select
            value={question.type}
            onChange={(e) => updateQuestion('type', e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True/False</option>
            <option value="short_answer">Short Answer</option>
          </select>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
            <textarea
              value={question.question}
              onChange={(e) => updateQuestion('question', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>

          {question.type === 'multiple_choice' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={question.correct === optIndex}
                    onChange={() => updateQuestion('correct', optIndex)}
                    className="text-blue-600"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...question.options];
                      newOptions[optIndex] = e.target.value;
                      updateQuestion('options', newOptions);
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          {question.type === 'true_false' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
              <select
                value={question.correct}
                onChange={(e) => updateQuestion('correct', e.target.value === 'true')}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          )}

          {question.type === 'short_answer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sample Answer</label>
              <textarea
                value={question.sample_answer || ''}
                onChange={(e) => updateQuestion('sample_answer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={question.difficulty}
                onChange={(e) => updateQuestion('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <input
                type="text"
                value={question.topic || ''}
                onChange={(e) => updateQuestion('topic', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
            <textarea
              value={question.explanation || ''}
              onChange={(e) => updateQuestion('explanation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
        </div>
      </div>
    );
  };

  const QuizPreview = ({ quiz }) => {
    return (
      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
              <div className="flex gap-2 text-xs">
                <span className={`px-2 py-1 rounded ${
                  question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {question.difficulty}
                </span>
                {question.topic && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {question.topic}
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-800 mb-4">{question.question}</p>

            {question.type === 'multiple_choice' && (
              <div className="space-y-2 mb-4">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-2 rounded border ${
                      question.correct === optIndex
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {String.fromCharCode(65 + optIndex)}. {option}
                    {question.correct === optIndex && (
                      <CheckCircle className="w-4 h-4 inline ml-2 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {question.type === 'true_false' && (
              <div className="mb-4">
                <span className={`px-3 py-1 rounded ${
                  question.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  Correct Answer: {question.correct ? 'True' : 'False'}
                </span>
              </div>
            )}

            {question.type === 'short_answer' && question.sample_answer && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm font-medium text-blue-700 mb-1">Sample Answer:</p>
                <p className="text-blue-800">{question.sample_answer}</p>
              </div>
            )}

            {question.explanation && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                <p className="text-sm font-medium text-gray-700 mb-1">Explanation:</p>
                <p className="text-gray-600">{question.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Auto-Quiz Generator</h2>
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
              Number of Questions
            </label>
            <select
              value={generationOptions.questionCount}
              onChange={(e) => setGenerationOptions({
                ...generationOptions,
                questionCount: parseInt(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {[3, 5, 7, 10, 15].map(count => (
                <option key={count} value={count}>{count} questions</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              value={generationOptions.difficulty}
              onChange={(e) => setGenerationOptions({
                ...generationOptions,
                difficulty: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="mixed">Mixed Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Focus Area
            </label>
            <select
              value={generationOptions.focus}
              onChange={(e) => setGenerationOptions({
                ...generationOptions,
                focus: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="key concepts">Key Concepts</option>
              <option value="practical application">Practical Application</option>
              <option value="critical thinking">Critical Thinking</option>
              <option value="factual recall">Factual Recall</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Types
          </label>
          <div className="flex gap-4">
            {Object.entries(generationOptions.includeTypes).map(([type, enabled]) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setGenerationOptions({
                    ...generationOptions,
                    includeTypes: {
                      ...generationOptions.includeTypes,
                      [type]: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={generateQuiz}
          disabled={isGenerating || !transcript}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isGenerating ? 'Generating Quiz...' : 'Generate Quiz'}
        </button>
      </div>

      {/* Generated Quiz */}
      {generatedQuiz && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Generated Quiz</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={() => exportQuiz(generatedQuiz)}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => {
                  const name = prompt('Enter quiz name:');
                  if (name) saveQuiz(editingQuiz || generatedQuiz, name);
                }}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>

          {previewMode ? (
            <QuizPreview quiz={editingQuiz || generatedQuiz} />
          ) : (
            <div>
              {editingQuiz?.questions.map((question, index) => (
                <QuestionEditor
                  key={index}
                  question={question}
                  index={index}
                  onChange={(questionIndex, updatedQuestion) => {
                    const newQuestions = [...editingQuiz.questions];
                    newQuestions[questionIndex] = updatedQuestion;
                    setEditingQuiz({
                      ...editingQuiz,
                      questions: newQuestions
                    });
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved Quizzes */}
      {savedQuizzes.length > 0 && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Saved Quizzes</h3>
          <div className="space-y-3">
            {savedQuizzes.map((quiz) => (
              <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                <div>
                  <h4 className="font-medium text-gray-900">{quiz.name}</h4>
                  <p className="text-sm text-gray-600">
                    {quiz.questions?.length || 0} questions • 
                    Saved {new Date(quiz.savedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setGeneratedQuiz(quiz);
                      setEditingQuiz(JSON.parse(JSON.stringify(quiz)));
                      setPreviewMode(true);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  <button
                    onClick={() => exportQuiz(quiz)}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                  <button
                    onClick={() => deleteQuiz(quiz.id)}
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

export default AutoQuizGenerator;