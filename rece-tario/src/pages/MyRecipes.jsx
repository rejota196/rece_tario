import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { AuthContext } from '../contexts/AuthContext';
import defaultImage from '../assets/sin-foto.png';

const MyRecipes = () => {
  const { state: { user, isAuthenticated } } = useContext(AuthContext);
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMyRecipes = async (page) => {
      console.log('User state:', user, 'Is authenticated:', isAuthenticated);
      
      if (!isAuthenticated || !user || !user.id) {
        console.log('User is not authenticated or user ID is missing');
        setError('Usuario no autenticado o información de usuario incompleta.');
        setLoading(false);
        return;
      }
  
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/reciperover/recipes/?owner=${user.id}&page=${page}`);
        console.log('API Response:', response.data);
        if (response.data && Array.isArray(response.data.results)) {
          setMyRecipes(response.data.results);
          setTotalPages(Math.ceil(response.data.count / 10));
          setError(null);
        } else {
          setError('Formato de respuesta inesperado');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error.response?.data || error.message);
        setError(`Error al cargar tus recetas: ${error.response?.data?.detail || error.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMyRecipes(currentPage);
  }, [user, isAuthenticated, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteRecipe = async (id) => {
    try {
      await axiosInstance.delete(`/reciperover/recipes/${id}/`);
      setMyRecipes(myRecipes.filter(recipe => recipe.id !== id));
    } catch (error) {
      setError(`Error al eliminar la receta: ${error.response?.data?.detail || error.message}`);
    }
  };

  if (loading) return <div className="notification is-info">Cargando tus recetas...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;

  return (
    <div className="section">
      <h2 className="title is-4 has-text-centered">Mis Recetas</h2>
      <div className="columns is-multiline">
        {myRecipes.length > 0 ? (
          myRecipes.map(recipe => (
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
                    <Link className="button is-warning" to={`/edit-recipe/${recipe.id}`}>Editar</Link>
                    {recipe.owner === user?.id && (
                      <button className="button is-danger" onClick={() => handleDeleteRecipe(recipe.id)}>Eliminar</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="has-text-centered">No has agregado ninguna receta aún.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination is-centered">
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
      )}
    </div>
  );
};

export default MyRecipes;
