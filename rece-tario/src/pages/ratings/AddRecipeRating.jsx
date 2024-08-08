import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const AddRecipeRating = () => {
  const { id: recipeId } = useParams(); 
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ratingData = {
      rating: parseInt(rating, 10),
      comment,
      recipe: parseInt(recipeId, 10) 
    };

    try {
      const response = await axiosInstance.post('/reciperover/ratings/', ratingData);

      if (response.status !== 201) {
        const errorData = response.data;
        console.error('Error data:', errorData);
        throw new Error(`Failed to add rating: ${response.statusText}`);
      }

      alert('Valoración añadida con éxito');
      navigate(`/recipe/${recipeId}`); // Redirige a la página de detalles de la receta
    } catch (error) {
      console.error('Failed to add rating:', error);
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="section">
        <h1 className="title has-text-centered">Añadir Valoración</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="rating">Valoración</label>
            <div className="control">
              <input className="input" id="rating" type="number" value={rating} onChange={(e) => setRating(e.target.value)} required />
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
