import { Link } from 'react-router-dom';
import notFoundImage from '../assets/404.png'; 

const NotFound = () => {
  return (
    <div className="section">
      <div className="container has-text-centered">
        <h1 className="title">No Mi rey por Aqui no es...</h1>
        <p>Lo sentimos, pero la página que buscas no existe... como el amor de ella</p>
        <figure className="image is-256x256 is-inline-block">
          <img src={notFoundImage} alt="404 Not Found" style={{ width: '500px', height: '500px' }} />
        </figure>
        <div className="buttons is-centered mt-4">
          <Link className="button is-primary" to="/">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
