import React, { useState } from 'react';
import './Index.css';
import App from './App';
import Dashboard from './Dashboard';

interface TabConfig {
  id: string;
  label: string;
  icon: string;
}

const tabs: TabConfig[] = [
  { id: 'form', label: 'Crear Gema', icon: '✨' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
];

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('form');

  return (
    <div className="index-container">
      <header className="index-header">
        <div className="header-content">
          <h1 className="app-title">💎 Gems SIMCE</h1>
          <p className="app-subtitle">Plataforma IA para Educadores</p>
        </div>
      </header>

      <nav className="index-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="index-content">
        {activeTab === 'form' && <App />}
        {activeTab === 'dashboard' && <Dashboard />}
      </main>

      <footer className="index-footer">
        <p>© 2024 Gems SIMCE - Powered by Vertex AI & Gemini</p>
      </footer>
    </div>
  );
};

export default Index;
