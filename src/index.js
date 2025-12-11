/**
 * index.js
 * 
 * CONTEXTUAL - Cognitive Momentum Substrate
 * Main entry point and orchestration layer.
 * 
 * The cognitive I/O built accord between threads on unlike applications or systems,
 * so that momentum is never lost in transition.
 */

const ContextBridge = require('./core/ContextBridge');
const MomentumEngine = require('./core/MomentumEngine');
const AIHousekeeper = require('./core/AIHousekeeper');
const StateVault = require('./core/StateVault');

class CONTEXTUAL {
  constructor(config = {}) {
    this.config = {
      storagePath: config.storagePath || './contextual_data',
      encryptionEnabled: config.encryptionEnabled !== false,
      autoBackup: config.autoBackup !== false,
      momentumHalfLife: config.momentumHalfLife || 30000,
      ...config
    };

    // Initialize core modules
    this.vault = new StateVault({
      storagePath: this.config.storagePath,
      encryptionEnabled: this.config.encryptionEnabled,
      backupEnabled: this.config.autoBackup
    });

    this.momentumEngine = new MomentumEngine({
      halfLife: this.config.momentumHalfLife
    });

    this.housekeeper = new AIHousekeeper();

    this.bridge = new ContextBridge({
      maxContexts: config.maxContexts || 100
    });

    // Wire up dependencies
    this.bridge.momentumEngine = this.momentumEngine;
    this.bridge.stateVault = this.vault;

    // Restore state from vault
    this._restoreState();

    console.log('✓ CONTEXTUAL initialized');
  }

  /**
   * Create a new context for an application
   * @param {string} appId - Application identifier
   * @param {object} initialState - Initial state
   * @returns {string} Context ID
   */
  createContext(appId, initialState = {}) {
    const contextId = this.bridge.createContext(appId, initialState);
    console.log(`✓ Context created: ${contextId}`);
    return contextId;
  }

  /**
   * Transition between contexts (application switches)
   * @param {string} targetContextId - Target context
   * @param {object} transitionData - Data to carry
   * @returns {boolean} Success
   */
  transition(targetContextId, transitionData = {}) {
    const success = this.bridge.transition(targetContextId, transitionData);
    
    if (success) {
      const context = this.bridge.getActiveContext();
      const momentum = this.momentumEngine.calculateMomentum(context);
      console.log(`✓ Transitioned to ${targetContextId} | Momentum: ${(momentum.overall * 100).toFixed(1)}%`);
    }
    
    return success;
  }

  /**
   * Update state in active context
   * @param {object} stateUpdate - State updates
   */
  updateState(stateUpdate) {
    this.bridge.updateState(stateUpdate);
  }

  /**
   * Get current state
   * @returns {object} Current state
   */
  getState() {
    return this.bridge.getState();
  }

  /**
   * Filter and select best answer from candidates
   * @param {array} candidates - Candidate answers
   * @param {string} question - Question
   * @returns {object} Best answer
   */
  filterAnswers(candidates, question) {
    return this.housekeeper.filterAnswers(candidates, question);
  }

  /**
   * Amplify answer quality by 10x
   * @param {string} answer - Answer to amplify
   * @param {string} question - Question
   * @returns {string} Amplified answer
   */
  amplifyAnswer(answer, question) {
    return this.housekeeper.amplify(answer, question);
  }

  /**
   * Get comprehensive statistics
   * @returns {object} Stats across all modules
   */
  getStats() {
    return {
      contexts: {
        active: this.bridge.activeContext,
        total: this.bridge.contexts.size,
        transitions: this.bridge.transitionLog.length
      },
      momentum: this.momentumEngine.getStats(),
      housekeeper: this.housekeeper.getStats(),
      vault: this.vault.getStats()
    };
  }

  /**
   * Backup all state
   * @returns {number} Backup timestamp
   */
  backup() {
    return this.vault.backup();
  }

  /**
   * Restore from backup
   * @param {number} timestamp - Backup timestamp (null for latest)
   * @returns {boolean} Success
   */
  restore(timestamp = null) {
    return this.vault.restore(timestamp);
  }

  /**
   * Restore state from vault on startup
   * @private
   */
  _restoreState() {
    const contextIds = this.vault.getAllContextIds();
    
    contextIds.forEach(id => {
      const context = this.vault.loadContext(id);
      if (context) {
        this.bridge.contexts.set(id, context);
      }
    });

    if (contextIds.length > 0) {
      console.log(`✓ Restored ${contextIds.length} context(s) from vault`);
    }
  }

  /**
   * Shutdown gracefully
   */
  shutdown() {
    console.log('Shutting down CONTEXTUAL...');
    this.vault.shutdown();
    console.log('✓ CONTEXTUAL shutdown complete');
  }
}

// Export as singleton if needed
let instance = null;

module.exports = {
  CONTEXTUAL,
  getInstance: (config) => {
    if (!instance) {
      instance = new CONTEXTUAL(config);
    }
    return instance;
  },
  createInstance: (config) => new CONTEXTUAL(config)
};

// CLI/Direct execution
if (require.main === module) {
  console.log('\n=== CONTEXTUAL Cognitive Momentum Substrate ===\n');
  
  const contextual = new CONTEXTUAL();
  
  // Example usage
  const ctx1 = contextual.createContext('app1', { task: 'research' });
  contextual.updateState({ progress: 50, findings: ['fact1', 'fact2'] });
  
  const ctx2 = contextual.createContext('app2', { task: 'writing' });
  contextual.transition(ctx1, { reason: 'continue research' });
  
  console.log('\nStats:', JSON.stringify(contextual.getStats(), null, 2));
  
  // Cleanup
  process.on('SIGINT', () => {
    contextual.shutdown();
    process.exit(0);
  });
}
