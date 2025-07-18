import { useState } from 'react';
import './Layout.css';
import '../../styles/global.css';
import Header from '../Header/Header';
import SideMenu from '../SideMenu/SideMenu';
import { Outlet } from 'react-router';

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`layout ${isMenuOpen ? 'layout--active-menu' : ''}`}>
      <SideMenu isActive={isMenuOpen} />

      {/* Overlay detrás del menú */}
      {isMenuOpen && <div className="layout__overlay" onClick={() => setIsMenuOpen(false)}></div>}

      <div className="main-content">
        <Header active={isMenuOpen} onMenuClick={setIsMenuOpen} />
        <main style={{
          display: 'grid'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
