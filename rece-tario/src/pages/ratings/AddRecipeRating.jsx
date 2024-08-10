import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';
import { AuthContext } from '../../contexts/AuthContext';

const AddRecipeRating = () => {
  const { id: recipeId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const { state: { user, isAuthenticated } } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setError('Debe estar autenticado para agregar una valoración.');
    }
  }, [isAuthenticated, user]);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      alert('Debe estar autenticado para agregar una valoración.');
      return;
    }

    const ratingData = {
      rating: rating || 1, // Valor predeterminado
      comment: comment.trim(), // Eliminar espacios en blanco
      recipe: parseInt(recipeId, 10),
      author: user.id  // Se asegura de que el autor sea el usuario autenticado
    };

    console.log('Rating data being sent:', ratingData);

    try {
      const response = await axiosInstance.post('/reciperover/ratings/', ratingData);

      if (response.status === 201) {
        alert('Valoración añadida con éxito');
        navigate(`/recipe/${recipeId}`);
      } else {
        setError(`Error: ${response.statusText}`);
      }
    } catch (error) {
      let errorMessage = 'Ocurrió un error inesperado.';

      if (error.response) {
        // Error en la respuesta del servidor
        console.error('Error response data:', error.response.data);
        errorMessage = 'Error del servidor: ' + (error.response.data.detail || 'Error desconocido');
      } else if (error.request) {
        // No se recibió respuesta del servidor
        console.error('No response received:', error.request);
        errorMessage = 'No se recibió respuesta del servidor.';
      } else {
        // Otro tipo de error
        console.error('Error during setup:', error.message);
        errorMessage = 'Error: ' + error.message;
      }

      // Mostrar el error en un pop-up en español
      alert(errorMessage);

      // Guardar el error para mostrarlo en la interfaz si es necesario
      setError(errorMessage);
    }
  };

  const renderRatingButtons = () => {
    return (
      <div className="rating-buttons">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className={`button ${rating >= value ? 'is-primary' : 'is-light'}`}
            onClick={() => handleRatingClick(value)}
          >
            {value} ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="section">
        <h1 className="title has-text-centered">Añadir Valoración</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Valoración</label>
            <div className="control">
              {renderRatingButtons()}
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="comment">Comentario</label>
            <div className="control">
              <textarea className="textarea" id="comment" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
            </div>
          </div>
          <div className="control">
            <button className="button is-primary" type="submit">Añadir Valoración</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddRecipeRating;
