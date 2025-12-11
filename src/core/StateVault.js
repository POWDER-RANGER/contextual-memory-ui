/**
 * StateVault.js
 * 
 * CONTEXTUAL Cognitive Momentum Substrate
 * Persistent storage layer with encryption and automatic backup.
 * Manages state persistence across sessions and system restarts.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class StateVault {
  constructor(config = {}) {
    this.config = {
      storagePath: config.storagePath || './contextual_data',
      encryptionEnabled: config.encryptionEnabled !== false, // Default true
      encryptionKey: config.encryptionKey || this._generateKey(),
      backupEnabled: config.backupEnabled !== false,
      backupInterval: config.backupInterval || 300000, // 5 minutes
      maxBackups: config.maxBackups || 10,
      ...config
    };

    this.contexts = new Map();
    this.backupTimer = null;

    // Initialize storage
    this._initStorage();

    // Start auto-backup if enabled
    if (this.config.backupEnabled) {
      this._startAutoBackup();
    }
  }

  /**
   * Initialize storage directory
   * @private
   */
  _initStorage() {
    try {
      if (typeof fs !== 'undefined' && fs.mkdirSync) {
        if (!fs.existsSync(this.config.storagePath)) {
          fs.mkdirSync(this.config.storagePath, { recursive: true });
        }

        const backupPath = path.join(this.config.storagePath, 'backups');
        if (!fs.existsSync(backupPath)) {
          fs.mkdirSync(backupPath, { recursive: true });
        }
      } else {
        // Browser environment - use localStorage
        this.storage = window.localStorage;
      }
    } catch (error) {
      console.warn('Failed to initialize file storage, using memory only:', error.message);
      this.memoryOnly = true;
    }
  }

  /**
   * Save context to vault
   * @param {object} context - Context object
   */
  saveContext(context) {
    if (!context || !context.id) {
      throw new Error('Context must have an id');
    }

    // Store in memory
    this.contexts.set(context.id, context);

    // Persist to storage
    if (!this.memoryOnly) {
      this._persistContext(context);
    }
  }

  /**
   * Load context from vault
   * @param {string} contextId - Context ID
   * @returns {object} Context object
   */
  loadContext(contextId) {
    // Check memory first
    if (this.contexts.has(contextId)) {
      return this.contexts.get(contextId);
    }

    // Try to load from storage
    if (!this.memoryOnly) {
      const context = this._loadContextFromDisk(contextId);
      if (context) {
        this.contexts.set(contextId, context);
        return context;
      }
    }

    return null;
  }

  /**
   * Persist context to disk/storage
   * @private
   */
  _persistContext(context) {
    try {
      const data = JSON.stringify(context);
      const encrypted = this.config.encryptionEnabled
        ? this._encrypt(data)
        : data;

      if (typeof fs !== 'undefined' && fs.writeFileSync) {
        // Node.js file system
        const filename = `${context.id}.ctx`;
        const filepath = path.join(this.config.storagePath, filename);
        fs.writeFileSync(filepath, encrypted, 'utf8');
      } else if (this.storage) {
        // Browser localStorage
        this.storage.setItem(`ctx_${context.id}`, encrypted);
      }
    } catch (error) {
      console.error('Failed to persist context:', error.message);
    }
  }

  /**
   * Load context from disk
   * @private
   */
  _loadContextFromDisk(contextId) {
    try {
      let data;

      if (typeof fs !== 'undefined' && fs.readFileSync) {
        const filename = `${contextId}.ctx`;
        const filepath = path.join(this.config.storagePath, filename);
        if (fs.existsSync(filepath)) {
          data = fs.readFileSync(filepath, 'utf8');
        }
      } else if (this.storage) {
        data = this.storage.getItem(`ctx_${contextId}`);
      }

      if (!data) return null;

      const decrypted = this.config.encryptionEnabled
        ? this._decrypt(data)
        : data;

      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to load context:', error.message);
      return null;
    }
  }

  /**
   * Encrypt data using AES-256
   * @private
   */
  _encrypt(data) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(this.config.encryptionKey, 'hex'),
        iv
      );

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      return JSON.stringify({
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      });
    } catch (error) {
      console.error('Encryption failed:', error.message);
      return data; // Fallback to unencrypted
    }
  }

  /**
   * Decrypt data
   * @private
   */
  _decrypt(encryptedData) {
    try {
      const { encrypted, iv, authTag } = JSON.parse(encryptedData);

      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(this.config.encryptionKey, 'hex'),
        Buffer.from(iv, 'hex')
      );

      decipher.setAuthTag(Buffer.from(authTag, 'hex'));

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error.message);
      return encryptedData; // Hope it's unencrypted
    }
  }

  /**
   * Generate encryption key
   * @private
   */
  _generateKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create backup of all contexts
   */
  backup() {
    if (this.memoryOnly) return;

    try {
      const timestamp = Date.now();
      const backupData = {
        timestamp,
        contexts: Array.from(this.contexts.values())
      };

      const data = JSON.stringify(backupData);
      const encrypted = this.config.encryptionEnabled
        ? this._encrypt(data)
        : data;

      if (typeof fs !== 'undefined' && fs.writeFileSync) {
        const backupFile = `backup_${timestamp}.bak`;
        const backupPath = path.join(this.config.storagePath, 'backups', backupFile);
        fs.writeFileSync(backupPath, encrypted, 'utf8');

        // Clean old backups
        this._cleanOldBackups();
      } else if (this.storage) {
        this.storage.setItem(`backup_${timestamp}`, encrypted);
      }

      return timestamp;
    } catch (error) {
      console.error('Backup failed:', error.message);
      return null;
    }
  }

  /**
   * Restore from backup
   * @param {number} timestamp - Backup timestamp (or null for latest)
   */
  restore(timestamp = null) {
    if (this.memoryOnly) return false;

    try {
      let backupData;

      if (typeof fs !== 'undefined' && fs.readFileSync) {
        const backupsDir = path.join(this.config.storagePath, 'backups');
        const files = fs.readdirSync(backupsDir).filter(f => f.endsWith('.bak'));

        if (files.length === 0) return false;

        const backupFile = timestamp
          ? `backup_${timestamp}.bak`
          : files[files.length - 1]; // Latest

        const backupPath = path.join(backupsDir, backupFile);
        backupData = fs.readFileSync(backupPath, 'utf8');
      } else if (this.storage) {
        const key = timestamp
          ? `backup_${timestamp}`
          : this._getLatestBackupKey();
        backupData = this.storage.getItem(key);
      }

      if (!backupData) return false;

      const decrypted = this.config.encryptionEnabled
        ? this._decrypt(backupData)
        : backupData;

      const { contexts } = JSON.parse(decrypted);

      // Restore contexts
      this.contexts.clear();
      contexts.forEach(ctx => {
        this.contexts.set(ctx.id, ctx);
      });

      return true;
    } catch (error) {
      console.error('Restore failed:', error.message);
      return false;
    }
  }

  /**
   * Clean old backups
   * @private
   */
  _cleanOldBackups() {
    try {
      if (typeof fs !== 'undefined' && fs.readdirSync) {
        const backupsDir = path.join(this.config.storagePath, 'backups');
        const files = fs.readdirSync(backupsDir)
          .filter(f => f.endsWith('.bak'))
          .sort();

        while (files.length > this.config.maxBackups) {
          const oldFile = files.shift();
          fs.unlinkSync(path.join(backupsDir, oldFile));
        }
      }
    } catch (error) {
      console.error('Failed to clean old backups:', error.message);
    }
  }

  /**
   * Start automatic backup timer
   * @private
   */
  _startAutoBackup() {
    this.backupTimer = setInterval(() => {
      this.backup();
    }, this.config.backupInterval);
  }

  /**
   * Stop automatic backup
   */
  stopAutoBackup() {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
      this.backupTimer = null;
    }
  }

  /**
   * Delete context
   * @param {string} contextId - Context ID
   */
  deleteContext(contextId) {
    this.contexts.delete(contextId);

    if (!this.memoryOnly && typeof fs !== 'undefined' && fs.unlinkSync) {
      try {
        const filename = `${contextId}.ctx`;
        const filepath = path.join(this.config.storagePath, filename);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      } catch (error) {
        console.error('Failed to delete context file:', error.message);
      }
    }
  }

  /**
   * Get all context IDs
   * @returns {array} Context IDs
   */
  getAllContextIds() {
    return Array.from(this.contexts.keys());
  }

  /**
   * Get storage statistics
   * @returns {object} Stats
   */
  getStats() {
    return {
      contextCount: this.contexts.size,
      encrypted: this.config.encryptionEnabled,
      memoryOnly: this.memoryOnly,
      autoBackup: this.backupTimer !== null
    };
  }

  /**
   * Clear all data (use with caution)
   */
  clearAll() {
    this.contexts.clear();

    if (!this.memoryOnly && typeof fs !== 'undefined') {
      try {
        const files = fs.readdirSync(this.config.storagePath)
          .filter(f => f.endsWith('.ctx'));
        files.forEach(f => {
          fs.unlinkSync(path.join(this.config.storagePath, f));
        });
      } catch (error) {
        console.error('Failed to clear storage:', error.message);
      }
    }
  }

  /**
   * Cleanup and shutdown
   */
  shutdown() {
    this.stopAutoBackup();
    this.backup(); // Final backup
  }
}

module.exports = StateVault;