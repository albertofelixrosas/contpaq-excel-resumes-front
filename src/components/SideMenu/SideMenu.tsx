import './SideMenu.css';
import { useNavigate } from 'react-router';

interface SideMenuProps {
  isActive: boolean;
}

export default function SideMenu({ isActive }: SideMenuProps) {
  const navigate = useNavigate();

  return (
    <aside className={`sidebar ${isActive ? 'sidebar--active' : ''}`}>
      <div className="sidebar__logo-container">
        {/*
          <img className="sidebar__logo" src={logo} alt="Texto alternativo" />
          */}
      </div>
      <div className="sidebar__title">Sistema de registro de movimientos contables</div>
      <ul className="sidebar__sections">
        <li
          className="sidebar__section"
          onClick={() => {
            navigate('/');
          }}
        >
          Inicio
        </li>
        <li
          className="sidebar__section"
          onClick={() => {
            navigate('/data-verification');
          }}
        >
          Verificación de datos
        </li>
        <li
          className="sidebar__section"
          onClick={() => {
            navigate('/reports');
          }}
        >
          Reportes
        </li>
        <li
          className="sidebar__section"
          onClick={() => {
            navigate('/masive-change');
          }}
        >
          Cambios masivos
        </li>
      </ul>
    </aside>
  );
}
