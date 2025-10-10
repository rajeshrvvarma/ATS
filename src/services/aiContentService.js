/**
 * AI Content Generation Service
 * Handles content generation using AI models for educational content
 */

class AIContentService {
  constructor() {
    this.apiKey = null; // Will be set by user in config
    this.baseUrl = 'https://api.openai.com/v1';
    this.model = 'gpt-3.5-turbo';
    this.requestQueue = [];
    this.processing = false;
    this.rateLimitDelay = 1000; // 1 second between requests
  }

  /**
   * Set API configuration
   */
  setConfig(config) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gpt-3.5-turbo';
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
  }

  /**
   * Check if AI service is configured
   */
  isConfigured() {
    return !!this.apiKey;
  }

  /**
   * Rate-limited API request queue
   */
  async queueRequest(prompt, options = {}) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        prompt,
        options,
        resolve,
        reject
      });
      this.processQueue();
    });
  }

  /**
   * Process request queue with rate limiting
   */
  async processQueue() {
    if (this.processing || this.requestQueue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      
      try {
        const result = await this.makeAPIRequest(request.prompt, request.options);
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }

      // Rate limiting delay
      if (this.requestQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
      }
    }

    this.processing = false;
  }

  /**
   * Make direct API request to AI service
   */
  async makeAPIRequest(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('AI service not configured. Please set API key.');
    }

    const requestBody = {
      model: options.model || this.model,
      messages: [
        {
          role: "system",
          content: options.systemPrompt || "You are an educational content expert helping to create high-quality learning materials."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1,
      frequency_penalty: options.frequencyPenalty || 0,
      presence_penalty: options.presencePenalty || 0
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`AI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0]?.message?.content?.trim() || '',
        usage: data.usage,
        model: data.model
      };
    } catch (error) {
      console.error('AI API Request failed:', error);
      throw error;
    }
  }

  /**
   * Generate quiz questions from transcript content
   */
  async generateQuiz(transcript, options = {}) {
    const systemPrompt = `You are an expert educational content creator. Generate high-quality quiz questions from video transcript content. 
    Create questions that test understanding, application, and critical thinking.
    Format your response as valid JSON with this structure:
    {
      "questions": [
        {
          "type": "multiple_choice",
          "question": "Question text",
          "options": ["A", "B", "C", "D"],
          "correct": 0,
          "explanation": "Why this is correct",
          "difficulty": "easy|medium|hard",
          "topic": "Main topic"
        },
        {
          "type": "true_false",
          "question": "Statement to evaluate",
          "correct": true,
          "explanation": "Explanation",
          "difficulty": "easy|medium|hard",
          "topic": "Main topic"
        },
        {
          "type": "short_answer",
          "question": "Open-ended question",
          "sample_answer": "Example answer",
          "key_points": ["point1", "point2"],
          "difficulty": "easy|medium|hard",
          "topic": "Main topic"
        }
      ]
    }`;

    const prompt = `Create ${options.questionCount || 5} quiz questions from this video transcript. 
    Include a mix of question types (multiple choice, true/false, short answer).
    Difficulty level: ${options.difficulty || 'mixed'}
    Focus on: ${options.focus || 'key concepts and practical application'}
    
    Transcript:
    ${transcript}`;

    try {
      const response = await this.queueRequest(prompt, {
        systemPrompt,
        maxTokens: 1500,
        temperature: 0.3
      });

      return JSON.parse(response.content);
    } catch (error) {
      console.error('Quiz generation failed:', error);
      throw new Error(`Failed to generate quiz: ${error.message}`);
    }
  }

  /**
   * Generate discussion questions for forum engagement
   */
  async generateDiscussionSeeds(transcript, options = {}) {
    const systemPrompt = `You are an expert educational facilitator. Create engaging discussion questions and conversation starters from video content.
    Generate questions that encourage critical thinking, real-world application, and peer interaction.
    Format your response as valid JSON with this structure:
    {
      "discussion_seeds": [
        {
          "question": "Discussion question",
          "type": "critical_thinking|application|debate|reflection|case_study",
          "context": "Brief context or scenario",
          "follow_ups": ["follow-up question 1", "follow-up question 2"],
          "tags": ["tag1", "tag2"]
        }
      ]
    }`;

    const prompt = `Generate ${options.questionCount || 3} discussion questions from this video transcript.
    Create questions that would spark meaningful conversations and help students connect concepts to real-world scenarios.
    Include different types: critical thinking, practical application, and reflective questions.
    
    Transcript:
    ${transcript}`;

    try {
      const response = await this.queueRequest(prompt, {
        systemPrompt,
        maxTokens: 1000,
        temperature: 0.7
      });

      return JSON.parse(response.content);
    } catch (error) {
      console.error('Discussion generation failed:', error);
      throw new Error(`Failed to generate discussion seeds: ${error.message}`);
    }
  }

  /**
   * Generate course description and metadata
   */
  async generateCourseDescription(transcript, options = {}) {
    const systemPrompt = `You are an expert course designer and marketing copywriter. Create compelling course descriptions and educational metadata from video content.
    Focus on learning outcomes, target audience, and value proposition.
    Format your response as valid JSON with this structure:
    {
      "title": "Engaging course title",
      "short_description": "Brief 1-2 sentence overview",
      "detailed_description": "Comprehensive description with benefits and outcomes",
      "learning_objectives": ["objective 1", "objective 2", "objective 3"],
      "prerequisites": ["prerequisite 1", "prerequisite 2"],
      "target_audience": "Who should take this course",
      "duration_estimate": "Estimated completion time",
      "difficulty_level": "beginner|intermediate|advanced",
      "key_topics": ["topic1", "topic2", "topic3"],
      "skills_gained": ["skill1", "skill2", "skill3"],
      "tags": ["tag1", "tag2", "tag3"]
    }`;

    const prompt = `Analyze this video transcript and create a comprehensive course description with all metadata.
    Focus on the value proposition and what learners will achieve.
    ${options.courseType ? `Course type: ${options.courseType}` : ''}
    ${options.targetAudience ? `Target audience: ${options.targetAudience}` : ''}
    
    Transcript:
    ${transcript}`;

    try {
      const response = await this.queueRequest(prompt, {
        systemPrompt,
        maxTokens: 1200,
        temperature: 0.5
      });

      return JSON.parse(response.content);
    } catch (error) {
      console.error('Course description generation failed:', error);
      throw new Error(`Failed to generate course description: ${error.message}`);
    }
  }

  /**
   * Extract key concepts and topics from transcript
   */
  async extractConcepts(transcript, options = {}) {
    const systemPrompt = `You are an expert content analyst. Extract key concepts, topics, and learning points from educational content.
    Format your response as valid JSON with this structure:
    {
      "main_topics": ["topic1", "topic2"],
      "key_concepts": [
        {
          "concept": "Concept name",
          "definition": "Brief definition",
          "importance": "Why it matters",
          "timestamp": "approximate time in video if identifiable"
        }
      ],
      "learning_points": ["point1", "point2"],
      "technical_terms": [
        {
          "term": "Technical term",
          "definition": "Definition",
          "context": "How it's used"
        }
      ],
      "summary": "One paragraph summary of content"
    }`;

    const prompt = `Analyze this video transcript and extract all key educational elements.
    Focus on concepts that learners need to understand and remember.
    
    Transcript:
    ${transcript}`;

    try {
      const response = await this.queueRequest(prompt, {
        systemPrompt,
        maxTokens: 1000,
        temperature: 0.3
      });

      return JSON.parse(response.content);
    } catch (error) {
      console.error('Concept extraction failed:', error);
      throw new Error(`Failed to extract concepts: ${error.message}`);
    }
  }

  /**
   * Generate study guide from transcript
   */
  async generateStudyGuide(transcript, options = {}) {
    const systemPrompt = `You are an expert educational content creator. Create a comprehensive study guide from video content.
    Format your response as valid JSON with this structure:
    {
      "title": "Study Guide Title",
      "overview": "Brief overview",
      "sections": [
        {
          "title": "Section title",
          "content": "Section content",
          "key_points": ["point1", "point2"],
          "examples": ["example1", "example2"]
        }
      ],
      "review_questions": ["question1", "question2"],
      "practice_exercises": ["exercise1", "exercise2"],
      "additional_resources": ["resource1", "resource2"]
    }`;

    const prompt = `Create a comprehensive study guide from this video transcript.
    Include organized sections, key points, examples, and review materials.
    Make it useful for both immediate learning and future reference.
    
    Transcript:
    ${transcript}`;

    try {
      const response = await this.queueRequest(prompt, {
        systemPrompt,
        maxTokens: 1500,
        temperature: 0.4
      });

      return JSON.parse(response.content);
    } catch (error) {
      console.error('Study guide generation failed:', error);
      throw new Error(`Failed to generate study guide: ${error.message}`);
    }
  }

  /**
   * Get service status and configuration
   */
  getStatus() {
    return {
      configured: this.isConfigured(),
      model: this.model,
      queueLength: this.requestQueue.length,
      processing: this.processing,
      rateLimitDelay: this.rateLimitDelay
    };
  }
}

// Create singleton instance
const aiContentService = new AIContentService();

export default aiContentService;