/**
 * MomentumEngine.js
 * 
 * CONTEXTUAL Cognitive Momentum Substrate
 * Multi-dimensional momentum tracking with exponential decay physics.
 * Monitors cognitive continuity and prevents momentum loss during transitions.
 */

class MomentumEngine {
  constructor(config = {}) {
    this.momentumVectors = new Map();
    this.transitionHistory = [];
    this.config = {
      halfLife: config.halfLife || 30000, // 30 seconds
      minMomentum: config.minMomentum || 0.1,
      maxHistory: config.maxHistory || 1000,
      factors: {
        temporal: config.temporalWeight || 0.25,
        semantic: config.semanticWeight || 0.30,
        operational: config.operationalWeight || 0.20,
        depth: config.depthWeight || 0.15,
        confidence: config.confidenceWeight || 0.10
      },
      ...config
    };
  }

  /**
   * Calculate multi-dimensional momentum for a context
   * @param {object} context - Context object from ContextBridge
   * @param {object} previousContext - Previous context (if any)
   * @returns {object} Momentum vector with 5 factors
   */
  calculateMomentum(context, previousContext = null) {
    const vector = {
      timestamp: Date.now(),
      contextId: context.id,
      factors: {
        temporal: this._calculateTemporalMomentum(context),
        semantic: this._calculateSemanticMomentum(context, previousContext),
        operational: this._calculateOperationalMomentum(context, previousContext),
        depth: this._calculateDepthMomentum(context),
        confidence: this._calculateConfidenceMomentum(context)
      },
      overall: 0
    };

    // Weighted combination
    vector.overall = this._combineFactors(vector.factors);

    // Store vector
    this.momentumVectors.set(context.id, vector);

    return vector;
  }

  /**
   * Factor 1: Temporal Momentum (exponential decay based on time)
   * M(t) = M_0 * e^(-λt) where λ = ln(2) / halfLife
   * @private
   */
  _calculateTemporalMomentum(context) {
    const timeSinceAccess = Date.now() - context.lastAccess;
    const decayConstant = Math.log(2) / this.config.halfLife;
    const momentum = Math.exp(-decayConstant * timeSinceAccess);

    return Math.max(this.config.minMomentum, momentum);
  }

  /**
   * Factor 2: Semantic Momentum (context similarity)
   * Uses Jaccard similarity + keyword overlap
   * @private
   */
  _calculateSemanticMomentum(context, previousContext) {
    if (!previousContext) return 1.0;

    const state1 = context.state;
    const state2 = previousContext.state;

    // Jaccard similarity on keys
    const keys1 = new Set(Object.keys(state1));
    const keys2 = new Set(Object.keys(state2));
    const intersection = new Set([...keys1].filter(k => keys2.has(k)));
    const union = new Set([...keys1, ...keys2]);
    const jaccard = union.size > 0 ? intersection.size / union.size : 0;

    // Keyword overlap (simplified NLP)
    const keywords1 = this._extractKeywords(state1);
    const keywords2 = this._extractKeywords(state2);
    const keywordOverlap = this._calculateOverlap(keywords1, keywords2);

    // Combine
    return (0.6 * jaccard) + (0.4 * keywordOverlap);
  }

  /**
   * Factor 3: Operational Momentum (task continuity)
   * Measures if operations are related
   * @private
   */
  _calculateOperationalMomentum(context, previousContext) {
    if (!previousContext) return 1.0;

    // Check if same application
    if (context.appId === previousContext.appId) {
      return 0.9; // High momentum for same app
    }

    // Check transition patterns
    const hasCommonTransitions = this._checkTransitionPattern(
      context.transitions,
      previousContext.transitions
    );

    return hasCommonTransitions ? 0.7 : 0.3;
  }

  /**
   * Factor 4: Depth Momentum (reasoning chain continuity)
   * Analyzes cognitive depth and continuity markers
   * @private
   */
  _calculateDepthMomentum(context) {
    const state = context.state;

    // Count reasoning steps
    const reasoningSteps = this._countReasoningSteps(state);

    // Check for continuity markers
    const hasContinuity = this._hasContinuityMarkers(state);

    // Depth score (normalized 0-1)
    const depthScore = Math.min(1, reasoningSteps / 10);
    const continuityBonus = hasContinuity ? 0.2 : 0;

    return Math.min(1, depthScore + continuityBonus);
  }

  /**
   * Factor 5: Confidence Momentum (preservation tracking)
   * Measures how well confidence is maintained
   * @private
   */
  _calculateConfidenceMomentum(context) {
    const state = context.state;

    // Check if state has confidence metadata
    if (!state.confidence && !state.certainty) {
      return 0.5; // Neutral if no confidence data
    }

    const confidence = state.confidence || state.certainty || 0.5;

    // Access frequency bonus
    const accessBonus = Math.min(0.3, context.accessCount * 0.05);

    return Math.min(1, confidence + accessBonus);
  }

  /**
   * Combine factors using weighted sum
   * @private
   */
  _combineFactors(factors) {
    const weights = this.config.factors;
    const overall = 
      (factors.temporal * weights.temporal) +
      (factors.semantic * weights.semantic) +
      (factors.operational * weights.operational) +
      (factors.depth * weights.depth) +
      (factors.confidence * weights.confidence);

    return Math.max(this.config.minMomentum, Math.min(1, overall));
  }

  /**
   * Extract keywords from state object (simplified NLP)
   * @private
   */
  _extractKeywords(state) {
    const keywords = new Set();
    const text = JSON.stringify(state).toLowerCase();

    // Simple keyword extraction (would use NLP in production)
    const words = text.match(/\b\w{4,}\b/g) || [];
    words.forEach(word => {
      if (!this._isStopWord(word)) {
        keywords.add(word);
      }
    });

    return keywords;
  }

  /**
   * Calculate overlap between two sets
   * @private
   */
  _calculateOverlap(set1, set2) {
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Check for common transition patterns
   * @private
   */
  _checkTransitionPattern(transitions1, transitions2) {
    if (!transitions1.length || !transitions2.length) return false;

    // Check if contexts have been connected before
    const targets1 = new Set(transitions1.map(t => t.target || t.source));
    const targets2 = new Set(transitions2.map(t => t.target || t.source));

    return this._calculateOverlap(targets1, targets2) > 0.3;
  }

  /**
   * Count reasoning steps in state
   * @private
   */
  _countReasoningSteps(state) {
    let steps = 0;

    // Check for reasoning markers
    const reasoningKeys = ['steps', 'reasoning', 'chain', 'analysis', 'conclusions'];
    reasoningKeys.forEach(key => {
      if (state[key]) {
        if (Array.isArray(state[key])) {
          steps += state[key].length;
        } else if (typeof state[key] === 'object') {
          steps += Object.keys(state[key]).length;
        } else {
          steps += 1;
        }
      }
    });

    return steps;
  }

  /**
   * Check for continuity markers
   * @private
   */
  _hasContinuityMarkers(state) {
    const markers = [
      'therefore', 'thus', 'consequently', 'following',
      'building on', 'extending', 'continuing', 'next'
    ];

    const text = JSON.stringify(state).toLowerCase();
    return markers.some(marker => text.includes(marker));
  }

  /**
   * Simple stop word filter
   * @private
   */
  _isStopWord(word) {
    const stopWords = new Set([
      'this', 'that', 'with', 'from', 'have', 'been',
      'were', 'what', 'when', 'where', 'which', 'while'
    ]);
    return stopWords.has(word);
  }

  /**
   * Record a transition for momentum analysis
   * @param {object} transition - Transition object from ContextBridge
   */
  recordTransition(transition) {
    this.transitionHistory.push({
      ...transition,
      recordedAt: Date.now()
    });

    // Maintain history limit
    if (this.transitionHistory.length > this.config.maxHistory) {
      this.transitionHistory.shift();
    }
  }

  /**
   * Get momentum vector for a context
   * @param {string} contextId - Context ID
   * @returns {object} Momentum vector
   */
  getMomentumVector(contextId) {
    return this.momentumVectors.get(contextId) || null;
  }

  /**
   * Get current momentum statistics
   * @returns {object} Stats object
   */
  getStats() {
    const vectors = Array.from(this.momentumVectors.values());

    if (vectors.length === 0) {
      return {
        count: 0,
        averageMomentum: 0,
        factors: {}
      };
    }

    const totalMomentum = vectors.reduce((sum, v) => sum + v.overall, 0);
    const avgFactors = {
      temporal: 0,
      semantic: 0,
      operational: 0,
      depth: 0,
      confidence: 0
    };

    vectors.forEach(v => {
      Object.keys(avgFactors).forEach(key => {
        avgFactors[key] += v.factors[key];
      });
    });

    Object.keys(avgFactors).forEach(key => {
      avgFactors[key] /= vectors.length;
    });

    return {
      count: vectors.length,
      averageMomentum: totalMomentum / vectors.length,
      factors: avgFactors,
      transitions: this.transitionHistory.length
    };
  }

  /**
   * Clear all momentum data
   */
  clear() {
    this.momentumVectors.clear();
    this.transitionHistory = [];
  }
}

module.exports = MomentumEngine;