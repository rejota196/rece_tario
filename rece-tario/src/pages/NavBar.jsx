import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css'; // Asegúrate de que el archivo existe en el mismo directorio

const Navbar = () => {
  const { state: { isAuthenticated }, actions: { logout } } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar is-light">
      <div className="container">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">Recipe Rover</Link>
          <div className="navbar-burger" data-target="navbarMenuHeroA">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        {isAuthenticated && (
          <div id="navbarMenuHeroA" className="navbar-menu">
            <div className="navbar-start">
              <Link className="navbar-item" to="/">Inicio</Link>
              <div className="navbar-item has-dropdown is-hoverable">
                <Link className="navbar-link" to="/recipes">Recetas</Link>
                <div className="navbar-dropdown">
                  <Link className="navbar-item" to="/add-recipe">Añadir Receta</Link>
                  <Link className="navbar-item" to="/recipes">Ver Recetas</Link>
                </div>
              </div>
              <div className="navbar-item has-dropdown is-hoverable">
                <Link className="navbar-link" to="/categories">Categorías</Link>
                <div className="navbar-dropdown">
                  <Link className="navbar-item" to="/add-category">Añadir Categoría</Link>
                  <Link className="navbar-item" to="/categories">Ver Categorías</Link>
                </div>
              </div>
              <div className="navbar-item has-dropdown is-hoverable">
                <Link className="navbar-link" to="/comments">Comentarios</Link>
                <div className="navbar-dropdown">
                  <Link className="navbar-item" to="/add-comment">Añadir Comentario</Link>
                  <Link className="navbar-item" to="/comments">Ver Comentarios</Link>
                </div>
              </div>
              <div className="navbar-item has-dropdown is-hoverable">
                <Link className="navbar-link" to="/ingredients">Ingredientes</Link>
                <div className="navbar-dropdown">
                  <Link className="navbar-item" to="/add-ingredients">Añadir Ingredientes</Link>
                  <Link className="navbar-item" to="/ingredients">Ver Ingredientes</Link>
                </div>
              </div>
              <div className="navbar-item has-dropdown is-hoverable">
                <Link className="navbar-link" to="/ratings">Valoraciones</Link>
                <div className="navbar-dropdown">
                  <Link className="navbar-item" to="/add-rating">Añadir Valoración</Link>
                  <Link className="navbar-item" to="/ratings">Ver Valoraciones</Link>
                </div>
              </div>
            </div>
            <div className="navbar-end">
              <div className="navbar-item">
                <button className="button is-light" onClick={handleLogout}>Cerrar Sesión</button>
              </div>
            </div>
          </div>
        )}
        {!isAuthenticated && (
          <div className="navbar-end">
            <div className="navbar-item">
              <Link className="button is-light" to="/login">Iniciar Sesión</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
