import { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Link, useNavigate } from 'react-router-dom';
import defaultImage from '../assets/sin-foto.png';
import { AuthContext } from '../contexts/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import Layout from './Layout';
import MyRecipes from './MyRecipes';
import './footer.css'; // Importar los estilos del footer

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { state: { user } } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes(currentPage);
  }, [currentPage]);

  const fetchRecipes = async (page) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/reciperover/recipes/?ordering=-created_at&page=${page}`);
      if (response.data && Array.isArray(response.data.results)) {
        setRecipes(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10)); 
      } else {
        setError('Unexpected response format');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipe = () => {
    navigate('/add-recipe');
  };

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedRecipe(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="notification is-info">Loading...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;

  const popularRecipes = user ? recipes.filter(recipe => recipe.owner !== user.id) : recipes;

  return (
    <Layout>
      <div className="section">
        <div className="container">
          <div className="hero">
          <h1 className="title has-text-centered has-text-weight-bold is-size-1" style={{ 
  background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '4px 4px 10px rgba(255, 255, 255, 0.7)', // Color blanco con opacidad para contrastar con el índigo
  padding: '10px'
}}>
  Bienvenido a SI! Chef
</h1>

            <h2 className="subtitle has-text-centered mb-5">Descubre y comparte recetas increíbles</h2>
          </div>
          <div className="buttons is-centered">
            <button className="button is-primary" onClick={handleAddRecipe}>Agregar Receta</button>
          </div>
          <MyRecipes /> {/* Aquí se integra el componente Mis Recetas */}

          <h2 className="title is-4 has-text-centered">Todas las Recetas</h2>
          <div className="columns is-multiline">
            {popularRecipes.map(recipe => (
              <div key={recipe.id} className="column is-one-third">
                <div className="card">
                  <div className="card-image">
                    <figure className="image is-4by3">
                      <img src={recipe.image || defaultImage} alt={recipe.title} />
                    </figure>
                  </div>
                  <div className="card-content">
                    <p className="title is-4">{recipe.title}</p>
                    <div className="buttons">
                      <Link className="button is-info" to={`/recipe/${recipe.id}`}>Ver Detalles</Link>
                      <button className="button is-primary" onClick={() => openModal(recipe)}>Más Opciones</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination is-centered mb-6">
            <ul className="pagination-list">
              {[...Array(totalPages).keys()].map(page => (
                <li key={page}>
                  <button
                    className={`pagination-link ${page + 1 === currentPage ? 'is-current' : ''}`}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {selectedRecipe && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Opciones de Receta"
            className="Modal"
            overlayClassName="Overlay"
          >
            <h2 className="title has-text-centered" style={{ color: 'black' }}>Opciones para {selectedRecipe.title}</h2>
            <div className="buttons is-centered">
              <Link className="button is-info" to={`/recipe/${selectedRecipe.id}`}>Ver Detalles</Link>
              <Link className="button is-primary" to={`/recipe/${selectedRecipe.id}/ingredients`}>Ver Ingredientes</Link>
              <Link className="button is-link" to={`/recipe/${selectedRecipe.id}/comments`}>Ver Comentarios</Link>
            </div>
            <button className="button is-light" onClick={closeModal}>Cerrar</button>
          </Modal>
        )}

        <footer className="footer" >
          <div className="content has-text-centered">
            <div className="columns is-mobile">
              <div className="column is-half">
                <p>&copy; 2024 Si! chef. Todos los derechos reservados.</p>
              </div>
              <div className="column is-half has-text-right">
                <Link to="/" className="has-text-white">Inicio</Link>
                <span> | </span>
                <Link to="/contact" className="has-text-white">Contacto</Link>
                <span> | </span>
                <Link to="/privacy" className="has-text-white">Privacidad</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
};

export default Home;
