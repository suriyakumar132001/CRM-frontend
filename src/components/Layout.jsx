import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main">
        <header className="mobile-topbar">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="mobile-topbar-title">CRM</span>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}