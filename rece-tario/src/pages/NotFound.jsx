import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
      <div className="section">
        <div className="container">
          <h1 className="title has-text-centered">404 - Página no encontrada</h1>
          <p className="has-text-centered">Lo sentimos, pero la página que buscas no existe.</p>
          <div className="buttons is-centered">
            <Link className="button is-primary" to="/">Volver al inicio</Link>
          </div>
        </div>
      </div>
    );
  };

  export default NotFound;