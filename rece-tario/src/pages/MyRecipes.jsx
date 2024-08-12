import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { AuthContext } from '../contexts/AuthContext';
import defaultImage from '../assets/sin-foto.png';

const MyRecipes = () => {
  const { state: { token } } = useContext(AuthContext); // Extrae el token del contexto
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  useEffect(() => {
    const fetchMyRecipes = async (page) => {
      if (!token) {
        setError('No se ha podido obtener el token del usuario.');
        return;
      }

      setLoading(true);

      try {
        // Obtener todas las recetas del usuario autenticado
        const recipesResponse = await axiosInstance.get(`/reciperover/recipes/?page=${page}`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        const allRecipes = recipesResponse.data.results;
        const totalRecipes = recipesResponse.data.count;

        if (allRecipes.length > 0) {
          setMyRecipes(allRecipes);
          setTotalPages(Math.ceil(totalRecipes / 10));
          setError(null);
        } else {
          setError('No se encontraron recetas para este usuario.');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error.response?.data || error.message);
        setError(`Error al cargar las recetas del usuario: ${error.response?.data?.detail || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyRecipes(currentPage); // Llama a la API para obtener las recetas del usuario autenticado
    }
  }, [token, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteRecipe = async (id) => {
    setRecipeToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDeleteRecipe = async () => {
    try {
      await axiosInstance.delete(`/reciperover/recipes/${recipeToDelete}/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setMyRecipes(myRecipes.filter(recipe => recipe.id !== recipeToDelete));
    } catch (error) {
      setError(`Error al eliminar la receta: ${error.response?.data?.detail || error.message}`);
      setShowErrorModal(true);
    } finally {
      setShowConfirmModal(false);
      setRecipeToDelete(null);
    }
  };

  return (
    <div className="section">
      <h2 className="title is-4 has-text-centered">Recetas Recomendadas</h2>
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
                    <button className="button is-danger" onClick={() => handleDeleteRecipe(recipe.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="has-text-centered">No se encontraron recetas para este usuario.</p>
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

      {/* Modal de Confirmación de Eliminación */}
      {showConfirmModal && (
        <div className={`modal ${showConfirmModal ? 'is-active' : ''}`}>
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="box">
              <h4 className="title is-4">Confirmar Eliminación</h4>
              <p>¿Estás seguro de que deseas eliminar esta receta?</p>
              <div className="buttons mt-3">
                <button className="button is-danger" onClick={confirmDeleteRecipe}>Eliminar</button>
                <button className="button" onClick={() => setShowConfirmModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => setShowConfirmModal(false)}></button>
        </div>
      )}

      {/* Modal de Error de Propietario */}
      {showErrorModal && (
        <div className={`modal ${showErrorModal ? 'is-active' : ''}`}>
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="box">
              <h4 className="title is-4">Error</h4>
              <p>No mi Rey esta receta no es tusha.</p>
              <button className="button is-primary mt-3" onClick={() => setShowErrorModal(false)}>Cerrar</button>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => setShowErrorModal(false)}></button>
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
