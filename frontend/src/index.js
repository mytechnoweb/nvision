import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './components/Dashboard.js';

// Function to initialize React dashboard
function initDashboard() {
  const container = document.getElementById('react-dashboard');
  if (container) {
    const root = createRoot(container);
    root.render(<Dashboard />);
  }
}

// Make function globally available so it can be called from index.html
window.initDashboard = initDashboard;

// Auto-initialize if container exists (for direct access)
if (document.getElementById('react-dashboard')) {
  initDashboard();
}