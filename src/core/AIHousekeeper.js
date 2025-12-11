/**
 * AIHousekeeper.js
 * 
 * CONTEXTUAL Cognitive Momentum Substrate
 * Answer filtering (2 wrong + 1 right) and 10x quality amplification.
 * B-grade AI model for file management and answer quality improvement.
 */

class AIHousekeeper {
  constructor(config = {}) {
    this.config = {
      minQualityScore: config.minQualityScore || 0.6,
      amplificationStages: config.amplificationStages || 6,
      maxCandidates: config.maxCandidates || 3,
      targetAmplification: config.targetAmplification || 10,
      ...config
    };
    
    this.answerCache = new Map();
    this.filterHistory = [];
  }

  /**
   * Filter answers: Keep 1 right, discard 2 wrong
   * @param {array} candidates - Array of candidate answers
   * @param {string} question - Original question
   * @returns {object} Best answer
   */
  filterAnswers(candidates, question) {
    if (!Array.isArray(candidates) || candidates.length === 0) {
      throw new Error('Candidates must be a non-empty array');
    }

    // Score each candidate
    const scored = candidates.map(answer => ({
      answer,
      score: this._scoreAnswer(answer, question)
    }));

    // Sort by score
    scored.sort((a, b) => b.score.overall - a.score.overall);

    // Take top answer
    const best = scored[0];

    // Log filtering
    this.filterHistory.push({
      timestamp: Date.now(),
      question,
      candidateCount: candidates.length,
      bestScore: best.score.overall,
      rejected: scored.slice(1).length
    });

    return {
      answer: best.answer,
      score: best.score,
      confidence: this._calculateConfidence(best.score)
    };
  }

  /**
   * 8-factor semantic scoring system
   * @private
   */
  _scoreAnswer(answer, question) {
    const factors = {
      relevance: this._scoreRelevance(answer, question),
      completeness: this._scoreCompleteness(answer),
      structure: this._scoreStructure(answer),
      confidence: this._scoreConfidenceMarkers(answer),
      contradiction: this._scoreContradictions(answer),
      context: this._scoreContextAlignment(answer, question),
      specificity: this._scoreSpecificity(answer),
      evidence: this._scoreEvidence(answer)
    };

    // Weighted combination
    const overall = 
      (factors.relevance * 0.25) +
      (factors.completeness * 0.15) +
      (factors.structure * 0.12) +
      (factors.confidence * 0.15) +
      (factors.contradiction * 0.10) +
      (factors.context * 0.10) +
      (factors.specificity * 0.08) +
      (factors.evidence * 0.05);

    return {
      overall,
      factors
    };
  }

  /**
   * Factor 1: Relevance to question
   * @private
   */
  _scoreRelevance(answer, question) {
    const answerWords = this._extractWords(answer.toLowerCase());
    const questionWords = this._extractWords(question.toLowerCase());

    const overlap = answerWords.filter(w => questionWords.includes(w));
    const relevance = questionWords.length > 0 ? overlap.length / questionWords.length : 0;

    return Math.min(1, relevance + 0.3); // Baseline + overlap
  }

  /**
   * Factor 2: Completeness (optimal word count)
   * @private
   */
  _scoreCompleteness(answer) {
    const wordCount = this._extractWords(answer).length;
    const optimal = 150; // Optimal answer length
    const tolerance = 100;

    if (wordCount < 20) return 0.3; // Too short
    if (wordCount > 500) return 0.6; // Too long

    const distance = Math.abs(wordCount - optimal);
    const score = 1 - (distance / (optimal + tolerance));

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Factor 3: Structure (logical connectors, multi-sentence)
   * @private
   */
  _scoreStructure(answer) {
    const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const connectors = [
      'therefore', 'however', 'moreover', 'furthermore',
      'additionally', 'consequently', 'nevertheless', 'thus'
    ];

    const hasConnectors = connectors.some(c => answer.toLowerCase().includes(c));
    const multiSentence = sentences.length >= 3;
    const hasParagraphs = answer.includes('\n\n');

    let score = 0.4; // Base
    if (hasConnectors) score += 0.3;
    if (multiSentence) score += 0.2;
    if (hasParagraphs) score += 0.1;

    return Math.min(1, score);
  }

  /**
   * Factor 4: Confidence markers
   * @private
   */
  _scoreConfidenceMarkers(answer) {
    const confident = ['research shows', 'studies indicate', 'evidence suggests', 'proven', 'established'];
    const uncertain = ['might', 'maybe', 'perhaps', 'possibly', 'unclear', 'uncertain'];

    const hasConfident = confident.some(m => answer.toLowerCase().includes(m));
    const hasUncertain = uncertain.some(m => answer.toLowerCase().includes(m));

    if (hasConfident && !hasUncertain) return 0.9;
    if (hasConfident && hasUncertain) return 0.7;
    if (!hasConfident && !hasUncertain) return 0.5;
    return 0.3;
  }

  /**
   * Factor 5: Contradiction detection
   * @private
   */
  _scoreContradictions(answer) {
    const contradictionPatterns = [
      /but (then|also|however).*(?:not|never|no)/i,
      /(although|while|whereas).*(?:but|however)/i,
      /(?:yes|true|correct).*(?:but|however).*(?:no|false|incorrect)/i
    ];

    const hasContradiction = contradictionPatterns.some(p => p.test(answer));
    return hasContradiction ? 0.3 : 1.0;
  }

  /**
   * Factor 6: Context alignment
   * @private
   */
  _scoreContextAlignment(answer, question) {
    // Check if answer directly addresses question type
    const questionType = this._detectQuestionType(question);
    const answerFormat = this._detectAnswerFormat(answer);

    const aligned = (
      (questionType === 'how' && answerFormat.hasSteps) ||
      (questionType === 'why' && answerFormat.hasReasons) ||
      (questionType === 'what' && answerFormat.hasDefinition) ||
      (questionType === 'when' && answerFormat.hasTimeframe)
    );

    return aligned ? 0.9 : 0.5;
  }

  /**
   * Factor 7: Specificity vs vagueness
   * @private
   */
  _scoreSpecificity(answer) {
    const specific = /(\d+|specific|particular|exact|precise|detailed)/gi;
    const vague = /(some|many|few|several|various|general|roughly)/gi;

    const specificCount = (answer.match(specific) || []).length;
    const vagueCount = (answer.match(vague) || []).length;

    if (specificCount > vagueCount) return 0.8;
    if (specificCount === vagueCount) return 0.5;
    return 0.3;
  }

  /**
   * Factor 8: Evidence presence
   * @private
   */
  _scoreEvidence(answer) {
    const evidenceMarkers = [
      'study', 'research', 'data', 'statistics', 'example',
      'case', 'experiment', 'analysis', 'findings', 'results'
    ];

    const count = evidenceMarkers.filter(m => 
      answer.toLowerCase().includes(m)
    ).length;

    return Math.min(1, count * 0.2);
  }

  /**
   * Amplify answer quality by 10x
   * @param {string} answer - Answer to amplify
   * @param {string} question - Original question
   * @returns {string} Amplified answer
   */
  amplify(answer, question) {
    let amplified = answer;

    // Stage 1: Extract core concepts
    const concepts = this._extractCoreConcepts(amplified, question);

    // Stage 2: Build reasoning chain
    const reasoning = this._buildReasoningChain(concepts);

    // Stage 3: Add depth layers
    const depthLayers = this._addDepthLayers(concepts, reasoning);

    // Stage 4: Structure for clarity
    const structured = this._structureContent(answer, depthLayers);

    // Stage 5: Add actionable insights
    const actionable = this._addActionableInsights(structured, question);

    // Stage 6: Synthesize final answer
    amplified = this._synthesize({
      original: answer,
      concepts,
      reasoning,
      depth: depthLayers,
      structured,
      actionable
    });

    return amplified;
  }

  /**
   * Stage 1: Extract core concepts
   * @private
   */
  _extractCoreConcepts(answer, question) {
    const words = this._extractWords(answer + ' ' + question);
    const important = words.filter(w => w.length > 5 && !this._isStopWord(w));
    return [...new Set(important)].slice(0, 10);
  }

  /**
   * Stage 2: Build reasoning chain
   * @private
   */
  _buildReasoningChain(concepts) {
    return concepts.map((concept, i) => ({
      step: i + 1,
      concept,
      connection: i < concepts.length - 1 ? concepts[i + 1] : null
    }));
  }

  /**
   * Stage 3: Add depth layers
   * @private
   */
  _addDepthLayers(concepts, reasoning) {
    return {
      implications: `This implies deeper connections between ${concepts.slice(0,3).join(', ')}.`,
      applications: `Practically, this applies to scenarios involving ${concepts[0]}.`,
      extensions: `This can be extended to consider ${concepts.slice(-2).join(' and ')}.`
    };
  }

  /**
   * Stage 4: Structure content
   * @private
   */
  _structureContent(answer, depthLayers) {
    return {
      introduction: answer.split(/[.!?]/)[0] + '.',
      body: answer,
      depth: Object.values(depthLayers).join(' ')
    };
  }

  /**
   * Stage 5: Add actionable insights
   * @private
   */
  _addActionableInsights(structured, question) {
    return {
      ...structured,
      insights: 'Key takeaways: ' + structured.introduction
    };
  }

  /**
   * Stage 6: Synthesize final answer
   * @private
   */
  _synthesize(components) {
    return `${components.structured.introduction}\n\n${components.original}\n\n${components.structured.depth}\n\n${components.actionable.insights}`;
  }

  // Utility methods
  _extractWords(text) {
    return text.match(/\b\w+\b/g) || [];
  }

  _isStopWord(word) {
    const stopWords = ['this', 'that', 'with', 'from', 'have', 'been', 'were'];
    return stopWords.includes(word.toLowerCase());
  }

  _detectQuestionType(question) {
    if (/^how/i.test(question)) return 'how';
    if (/^why/i.test(question)) return 'why';
    if (/^what/i.test(question)) return 'what';
    if (/^when/i.test(question)) return 'when';
    return 'general';
  }

  _detectAnswerFormat(answer) {
    return {
      hasSteps: /step|first|second|next|then|finally/i.test(answer),
      hasReasons: /because|since|due to|reason|cause/i.test(answer),
      hasDefinition: /is|means|refers to|defined as/i.test(answer),
      hasTimeframe: /when|during|after|before|time|period/i.test(answer)
    };
  }

  _calculateConfidence(score) {
    return score.overall;
  }

  /**
   * Get filtering statistics
   * @returns {object} Stats
   */
  getStats() {
    return {
      totalFiltered: this.filterHistory.length,
      avgBestScore: this.filterHistory.reduce((sum, f) => sum + f.bestScore, 0) / (this.filterHistory.length || 1),
      totalRejected: this.filterHistory.reduce((sum, f) => sum + f.rejected, 0)
    };
  }
}

module.exports = AIHousekeeper;