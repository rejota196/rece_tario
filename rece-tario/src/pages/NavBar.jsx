import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logologin.png'; 
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { state: { isAuthenticated }, actions: { logout } } = useAuth();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleNavbar = () => {
    const navbarMenu = document.getElementById('navbarMenuHeroA');
    navbarMenu.classList.toggle('is-active');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  return (
    <nav className="navbar is-light">
      <div className="container">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <img src={logo} alt="Inicio" style={{ maxHeight: '60px' }} />
          </Link>
          <div className="navbar-burger" onClick={toggleNavbar} data-target="navbarMenuHeroA">
            <span></span>
          </div>
        </div>
        <div id="navbarMenuHeroA" className="navbar-menu">
          <div className="navbar-start">
            {isAuthenticated && (
              <>
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
                    <Link className="navbar-item" to="/comments">Ver Comentarios</Link>
                  </div>
                </div>
                <div className="navbar-item has-dropdown is-hoverable">
                  <Link className="navbar-link" to="/ingredients">Ingredientes</Link>
                  <div className="navbar-dropdown">
                    <Link className="navbar-item" to="/ingredients">Ver Ingredientes</Link>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="navbar-end">
            {isAuthenticated && (
              <>
                <div className="navbar-item">
                  <button className="button is-light" onClick={toggleDarkMode}>
                    <FontAwesomeIcon 
                      icon={isDarkMode ? faSun : faMoon} 
                      style={{ color: isDarkMode ? '#FFD700' : '#4B0082', fontSize: '1.5rem' }} 
                    />
                  </button>
                </div>
                <div className="navbar-item">
                  <button className="button is-light" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
              </>
            )}
            {!isAuthenticated && (
              <div className="navbar-item">
                <Link className="button is-light" to="/login">Iniciar Sesión</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

