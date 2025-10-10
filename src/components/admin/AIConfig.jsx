/**
 * AI Configuration Component
 * Allows users to configure AI service settings and API keys
 */

import React, { useState, useEffect } from 'react';
import { Brain, Key, Settings, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import aiContentService from '../../services/aiContentService';

const AIConfig = ({ onConfigUpdate = () => {} }) => {
  const [config, setConfig] = useState({
    apiKey: '',
    model: 'gpt-3.5-turbo',
    provider: 'openai'
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Available models
  const models = {
    openai: [
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Recommended)', cost: 'Low' },
      { value: 'gpt-4', label: 'GPT-4 (Higher Quality)', cost: 'High' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', cost: 'Medium' }
    ]
  };

  useEffect(() => {
    // Load saved configuration
    const savedConfig = localStorage.getItem('ai_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
        aiContentService.setConfig(parsed);
      } catch (error) {
        console.error('Failed to load AI config:', error);
      }
    }
  }, []);

  const handleConfigChange = (field, value) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    setConnectionStatus(null);
    setErrors({});
  };

  const validateConfig = () => {
    const newErrors = {};
    
    if (!config.apiKey.trim()) {
      newErrors.apiKey = 'API key is required';
    }
    
    if (!config.model) {
      newErrors.model = 'Model selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const testConnection = async () => {
    if (!validateConfig()) return;

    setTestingConnection(true);
    setConnectionStatus(null);

    try {
      // Set temporary config for testing
      aiContentService.setConfig(config);
      
      // Make a simple test request
      const response = await aiContentService.makeAPIRequest(
        'Respond with "Connection successful" if you can read this message.',
        { maxTokens: 20, temperature: 0 }
      );

      if (response.content.toLowerCase().includes('connection successful')) {
        setConnectionStatus({ type: 'success', message: 'Connection successful!' });
      } else {
        setConnectionStatus({ type: 'success', message: 'API responded correctly' });
      }
    } catch (error) {
      setConnectionStatus({ 
        type: 'error', 
        message: `Connection failed: ${error.message}` 
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const saveConfiguration = () => {
    if (!validateConfig()) return;

    try {
      // Save to localStorage
      localStorage.setItem('ai_config', JSON.stringify(config));
      
      // Update service
      aiContentService.setConfig(config);
      
      // Notify parent component
      onConfigUpdate(config);
      
      setConnectionStatus({ 
        type: 'success', 
        message: 'Configuration saved successfully!' 
      });
    } catch (error) {
      setConnectionStatus({ 
        type: 'error', 
        message: `Failed to save configuration: ${error.message}` 
      });
    }
  };

  const clearConfiguration = () => {
    if (confirm('Are you sure you want to clear the AI configuration?')) {
      localStorage.removeItem('ai_config');
      setConfig({
        apiKey: '',
        model: 'gpt-3.5-turbo',
        provider: 'openai'
      });
      setConnectionStatus(null);
      aiContentService.setConfig({ apiKey: null });
      onConfigUpdate(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">AI Content Generation Setup</h2>
      </div>

      <div className="space-y-6">
        {/* API Provider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Provider
          </label>
          <select
            value={config.provider}
            onChange={(e) => handleConfigChange('provider', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="openai">OpenAI</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Currently supporting OpenAI. More providers coming soon.
          </p>
        </div>

        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Key className="w-4 h-4 inline mr-1" />
            API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={config.apiKey}
              onChange={(e) => handleConfigChange('apiKey', e.target.value)}
              placeholder="sk-..."
              className={`w-full px-3 py-2 pr-20 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.apiKey ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:text-blue-700"
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.apiKey && (
            <p className="text-red-500 text-xs mt-1">{errors.apiKey}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              OpenAI Platform
            </a>
          </p>
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          <select
            value={config.model}
            onChange={(e) => handleConfigChange('model', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.model ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            {models[config.provider]?.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label} - {model.cost} Cost
              </option>
            ))}
          </select>
          {errors.model && (
            <p className="text-red-500 text-xs mt-1">{errors.model}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            GPT-3.5 Turbo is recommended for most use cases and offers the best cost-performance ratio.
          </p>
        </div>

        {/* Connection Status */}
        {connectionStatus && (
          <div className={`flex items-center gap-2 p-3 rounded-md ${
            connectionStatus.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {connectionStatus.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{connectionStatus.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={testConnection}
            disabled={testingConnection || !config.apiKey}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testingConnection ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Settings className="w-4 h-4" />
            )}
            {testingConnection ? 'Testing...' : 'Test Connection'}
          </button>

          <button
            onClick={saveConfiguration}
            disabled={!config.apiKey}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Configuration
          </button>

          <button
            onClick={clearConfiguration}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Clear
          </button>
        </div>

        {/* Usage Guidelines */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Usage Guidelines</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Your API key is stored locally and never sent to our servers</li>
            <li>• Content generation costs depend on your chosen model and usage</li>
            <li>• Generated content should be reviewed before publishing</li>
            <li>• Rate limiting is applied to prevent excessive API usage</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIConfig;