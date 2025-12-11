/**
 * ContextBridge.js
 * Bridges conversations across different AI platforms (ChatGPT, Claude, Perplexity, Gemini)
 * Handles context switching, data normalization, and cross-platform communication
 */

class ContextBridge {
  constructor() {
    this.platforms = {
      chatgpt: { name: 'ChatGPT', connected: false, contextId: null },
      claude: { name: 'Claude', connected: false, contextId: null },
      perplexity: { name: 'Perplexity', connected: false, contextId: null },
      gemini: { name: 'Gemini', connected: false, contextId: null }
    };
    this.activeContext = null;
    this.contextHistory = [];
    this.bridgeCallbacks = new Map();
  }

  /**
   * Connect to a specific AI platform
   * @param {string} platform - Platform identifier (chatgpt, claude, etc.)
   * @param {object} config - Platform-specific configuration
   * @returns {Promise<boolean>} Connection success status
   */
  async connect(platform, config = {}) {
    if (!this.platforms[platform]) {
      throw new Error(`Unknown platform: ${platform}`);
    }

    try {
      // Platform-specific connection logic
      const contextId = this._generateContextId(platform);
      this.platforms[platform].connected = true;
      this.platforms[platform].contextId = contextId;
      this.platforms[platform].config = config;

      console.log(`✓ Connected to ${this.platforms[platform].name}`);
      return true;
    } catch (error) {
      console.error(`Failed to connect to ${platform}:`, error);
      return false;
    }
  }

  /**
   * Switch active context to a different platform
   * @param {string} platform - Target platform
   * @param {boolean} transferContext - Whether to transfer current context
   * @returns {Promise<object>} Switch result with status and context
   */
  async switchContext(platform, transferContext = true) {
    if (!this.platforms[platform]?.connected) {
      throw new Error(`Platform ${platform} is not connected`);
    }

    const previousContext = this.activeContext;
    
    if (transferContext && previousContext) {
      // Transfer context data to new platform
      await this._transferContextData(previousContext, platform);
    }

    this.activeContext = platform;
    this.contextHistory.push({
      timestamp: new Date().toISOString(),
      from: previousContext,
      to: platform,
      transferred: transferContext
    });

    return {
      success: true,
      platform,
      previousContext,
      contextId: this.platforms[platform].contextId
    };
  }

  /**
   * Normalize conversation data across different platforms
   * @param {object} data - Raw platform-specific data
   * @param {string} sourcePlatform - Source platform identifier
   * @returns {object} Normalized conversation data
   */
  normalizeConversation(data, sourcePlatform) {
    const normalized = {
      id: data.id || this._generateId(),
      platform: sourcePlatform,
      timestamp: data.timestamp || new Date().toISOString(),
      messages: [],
      metadata: {}
    };

    // Platform-specific normalization
    switch (sourcePlatform) {
      case 'chatgpt':
        normalized.messages = this._normalizeChatGPT(data);
        break;
      case 'claude':
        normalized.messages = this._normalizeClaude(data);
        break;
      case 'perplexity':
        normalized.messages = this._normalizePerplexity(data);
        break;
      case 'gemini':
        normalized.messages = this._normalizeGemini(data);
        break;
      default:
        normalized.messages = data.messages || [];
    }

    return normalized;
  }

  /**
   * Bridge a message from one platform to another
   * @param {object} message - Message to bridge
   * @param {string} targetPlatform - Target platform
   * @returns {Promise<object>} Bridge result
   */
  async bridgeMessage(message, targetPlatform) {
    if (!this.platforms[targetPlatform]?.connected) {
      throw new Error(`Target platform ${targetPlatform} is not connected`);
    }

    const normalized = this.normalizeConversation(
      { messages: [message] },
      this.activeContext
    );

    // Execute bridge callbacks
    const callbacks = this.bridgeCallbacks.get(targetPlatform) || [];
    for (const callback of callbacks) {
      await callback(normalized);
    }

    return {
      success: true,
      message: normalized.messages[0],
      targetPlatform,
      bridgedAt: new Date().toISOString()
    };
  }

  /**
   * Register a callback for bridge events
   * @param {string} platform - Platform to listen for
   * @param {Function} callback - Callback function
   */
  onBridge(platform, callback) {
    if (!this.bridgeCallbacks.has(platform)) {
      this.bridgeCallbacks.set(platform, []);
    }
    this.bridgeCallbacks.get(platform).push(callback);
  }

  /**
   * Get bridge statistics
   * @returns {object} Statistics about bridge usage
   */
  getStats() {
    return {
      connectedPlatforms: Object.keys(this.platforms).filter(
        k => this.platforms[k].connected
      ),
      activeContext: this.activeContext,
      totalSwitches: this.contextHistory.length,
      history: this.contextHistory
    };
  }

  /**
   * Disconnect from a platform
   * @param {string} platform - Platform to disconnect
   * @returns {boolean} Disconnect success status
   */
  disconnect(platform) {
    if (this.platforms[platform]) {
      this.platforms[platform].connected = false;
      this.platforms[platform].contextId = null;
      
      if (this.activeContext === platform) {
        this.activeContext = null;
      }
      
      return true;
    }
    return false;
  }

  /**
   * Disconnect all platforms
   */
  disconnectAll() {
    Object.keys(this.platforms).forEach(platform => {
      this.disconnect(platform);
    });
    this.activeContext = null;
    this.contextHistory = [];
  }

  // Private helper methods
  
  _generateContextId(platform) {
    return `${platform}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  _generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async _transferContextData(fromPlatform, toPlatform) {
    // Simulate context transfer
    console.log(`Transferring context from ${fromPlatform} to ${toPlatform}`);
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  _normalizeChatGPT(data) {
    return (data.messages || []).map(msg => ({
      role: msg.role || 'user',
      content: msg.content || '',
      timestamp: msg.create_time || new Date().toISOString()
    }));
  }

  _normalizeClaude(data) {
    return (data.messages || []).map(msg => ({
      role: msg.sender || 'user',
      content: msg.text || '',
      timestamp: msg.created_at || new Date().toISOString()
    }));
  }

  _normalizePerplexity(data) {
    return (data.messages || []).map(msg => ({
      role: msg.author || 'user',
      content: msg.text || '',
      timestamp: msg.timestamp || new Date().toISOString()
    }));
  }

  _normalizeGemini(data) {
    return (data.messages || []).map(msg => ({
      role: msg.role || 'user',
      content: msg.parts?.[0]?.text || '',
      timestamp: msg.timestamp || new Date().toISOString()
    }));
  }
}

module.exports = ContextBridge;