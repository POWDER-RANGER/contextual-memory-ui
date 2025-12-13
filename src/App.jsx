// src/App.jsx
import React, { useState, useEffect } from 'react';
import { CONTEXTUAL } from './core/index.js';
import Dashboard from './components/Dashboard';
import PlatformConnector from './components/PlatformConnector';
import MemoryVisualizer from './components/MemoryVisualizer';
import './App.css';

function App() {
  const [contextual, setContextual] = useState(null);
  const [memoryData, setMemoryData] = useState([]);
  const [platforms, setPlatforms] = useState({
    openai: { connected: false, status: 'disconnected' },
    perplexity: { connected: false, status: 'disconnected' }
  });

  useEffect(() => {
    // Initialize CONTEXTUAL system
    const initContextual = async () => {
      try {
        const system = new CONTEXTUAL({
          platforms: ['openai', 'perplexity'],
          apiKeys: {
            openai: import.meta.env.VITE_OPENAI_API_KEY,
            perplexity: import.meta.env.VITE_PERPLEXITY_API_KEY
          }
        });
        
        await system.initialize();
        setContextual(system);
        
        // Update platform status
        const status = system.getPlatformStatus();
        setPlatforms(status);
      } catch (error) {
        console.error('Failed to initialize CONTEXTUAL:', error);
      }
    };

    initContextual();
  }, []);

  const handleQuery = async (query) => {
    if (!contextual) return;
    
    try {
      const result = await contextual.query(query);
      setMemoryData(prev => [...prev, result]);
    } catch (error) {
      console.error('Query failed:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧠 CONTEXTUAL Memory System</h1>
        <p>AI Memory Infrastructure Platform</p>
      </header>
      
      <div className="app-content">
        <PlatformConnector 
          platforms={platforms} 
          onConnect={(platform) => console.log(`Connect ${platform}`)}
        />
        
        <Dashboard 
          memoryData={memoryData}
          onQuery={handleQuery}
          isReady={!!contextual}
        />
        
        <MemoryVisualizer 
          data={memoryData}
        />
      </div>
    </div>
  );
}

export default App;