import React, { useState } from 'react';
import CoreDemo from './CoreDemo';

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
          <div className="card">
            <h2>Parser UI Demo</h2>
            <p>This section will be implemented after the Core Demo is working.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;