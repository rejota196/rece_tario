import { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import Modal from 'react-modal';
import Layout from '../Layout';
import { AuthContext } from '../../contexts/AuthContext';

const RatingsList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const { state: { user } } = useContext(AuthContext);

  useEffect(() => {
    axiosInstance.get('/reciperover/recipes/?expand=ratings')
      .then(response => {
        if (response.data && Array.isArray(response.data.results)) {
          setRecipes(response.data.results);
        } else {
          setError('Unexpected response format');
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

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
      setRecipes(recipes.map(recipe => ({
        ...recipe,
        ratings: recipe.ratings.filter(rating => rating.id !== id)
      })));
    } catch (error) {
      console.error('Failed to delete rating:', error);
    }
  };

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
                    <img src={recipe.image} alt={recipe.title} />
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
                          <p className="title is-6">{rating.comment}</p>
                          <p className="subtitle is-6">Rating: {rating.rating}</p>
                          <div className="buttons">
                            <button className="button is-info" onClick={() => openModal(rating)}>Ver Detalles</button>
                            {user && rating.author === user.id && (
                              <button className="button is-danger" onClick={() => handleDeleteRating(rating.id)}>Eliminar</button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No hay valoraciones disponibles</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
            <p><strong>Comentario:</strong> {selectedRating.comment}</p>
            <p><strong>Valoración:</strong> {selectedRating.rating}</p>
            <p><strong>Autor:</strong> {selectedRating.author}</p>
            <button className="button is-light" onClick={closeModal}>Cerrar</button>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default RatingsList;
