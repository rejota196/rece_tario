import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const EditRating = () => {
  const { id } = useParams();
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [recipe, setRecipe] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await axiosInstance.get(`/reciperover/ratings/${id}/`);
        setRating(response.data.rating);
        setComment(response.data.comment);
        setRecipe(response.data.recipe);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRating();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ratingData = {
      rating,
      comment,
      recipe,
    };

    try {
      await axiosInstance.patch(`/reciperover/ratings/${id}/`, ratingData);
      navigate('/ratings');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="section">
        <h1 className="title has-text-centered">Editar Valoración</h1>
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
          <div className="field">
            <label className="label" htmlFor="recipe">Receta</label>
            <div className="control">
              <input className="input" id="recipe" type="text" value={recipe} onChange={(e) => setRecipe(e.target.value)} required />
            </div>
          </div>
          <div className="control">
            <button className="button is-primary" type="submit">Actualizar Valoración</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditRating;
