import { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import Modal from 'react-modal';
import Layout from '../Layout';
import { AuthContext } from '../../contexts/AuthContext';
import defaultImage from '../../assets/sin-foto.png';

const RatingsList = ({ refresh }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
  const { state: { user, isAuthenticated } } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipes = async (page) => {
      try {
        const response = await axiosInstance.get(`/reciperover/recipes/?expand=ratings&page=${page}&page_size=10`);
        if (response.data && Array.isArray(response.data.results)) {
          setRecipes(response.data.results);
          setTotalPages(Math.ceil(response.data.count / 10));
        } else {
          setError('Formato de respuesta inesperado');
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRecipes(currentPage);
  }, [currentPage, refresh]); // Dependencia 'refresh' para actualizar al añadir/eliminar valoraciones

  const openModal = (rating) => {
    setSelectedRating(rating);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedRating(null);
  };

  const handleDeleteRating = async (id) => {
    try {
      await axiosInstance.delete(`/reciperover/ratings/${id}/`);
      setRecipes(prevRecipes => 
        prevRecipes.map(recipe => ({
          ...recipe,
          ratings: recipe.ratings.filter(rating => rating.id !== id)
        }))
      );
    } catch (error) {
      console.error('Failed to delete rating:', error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const renderRatingButtons = (rating) => (
    <div className="rating-buttons">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          className={`button ${rating === value ? 'is-primary' : 'is-light'}`}
          disabled
        >
          {value} ★
        </button>
      ))}
    </div>
  );

  if (loading) return <div className="notification is-info">Cargando...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;

  return (
    <Layout>
      <div className="section">
        <h1 className="title has-text-centered">Valoraciones de Recetas</h1>
        <div className="columns is-multiline">
          {recipes.map(recipe => (
            <div key={recipe.id} className="column is-one-third">
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src={recipe.image || defaultImage} alt={recipe.title} />
                  </figure>
                </div>
                <div className="card-content">
                  <p className="title is-4">{recipe.title}</p>
                  <div className="content">
                    <p>{recipe.description}</p>
                    <h2 className="title is-5">Valoraciones</h2>
                    {recipe.ratings && recipe.ratings.length > 0 ? (
                      recipe.ratings.map(rating => (
                        <div key={rating.id} className="box">
                          <div className="subtitle is-6">{renderRatingButtons(rating.rating)}</div>
                          <div className="buttons">
                            <button className="button is-info" onClick={() => openModal(rating)}>Ver Detalles</button>
                            {isAuthenticated && user && rating.author === user.id && (
                              <button className="button is-danger" onClick={() => handleDeleteRating(rating.id)}>Eliminar</button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No hay valoraciones disponibles para esta receta</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <nav className="pagination is-centered" role="navigation" aria-label="pagination">
          <button
            className="pagination-previous"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <button
            className="pagination-next"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </nav>
      </div>

      {selectedRating && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Detalles de Valoración"
          className="Modal"
          overlayClassName="Overlay"
        >
          <div className="box">
            <h2 className="title has-text-centered">Detalle de Valoración</h2>
            <div><strong>Valoración:</strong> {renderRatingButtons(selectedRating.rating)}</div>
            <p><strong>Autor (ID):</strong> {selectedRating.author}</p>
            <button className="button is-light" onClick={closeModal}>Cerrar</button>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default RatingsList;
