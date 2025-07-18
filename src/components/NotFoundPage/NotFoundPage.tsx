import './NotFoundPage.css';
import { useLocation } from 'react-router';

export default function NotFoundPage() {

  const { pathname } = useLocation();

  return (
    <div className="not-found">
      <div className='not-found__card'
      >
        <p className="not-found__title not-found__title--red">Error 404</p>
        <p className="not-found__description">La pagina "{pathname}" que buscas no se encuentra disponible</p>
      </div>
    </div>
  );
}
