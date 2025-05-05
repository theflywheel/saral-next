import React, { useState } from 'react';
import CoreDemo from './CoreDemo';
import ParserDemo from './ParserDemo';
import './styles.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'core' | 'parser'>('core');

  return (
    <div>
      <header className="header">
        <h1>Saral Toolkit Demo</h1>
      </header>
      <div className="container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'core' ? 'active' : ''}`}
            onClick={() => setActiveTab('core')}
          >
            Core Demo
          </button>
          <button
            className={`tab ${activeTab === 'parser' ? 'active' : ''}`}
            onClick={() => setActiveTab('parser')}
          >
            Parser UI Demo
          </button>
        </div>
        
        {activeTab === 'core' ? (
          <CoreDemo />
        ) : (
          <ParserDemo />
        )}
      </div>
    </div>
  );
};

export default App;