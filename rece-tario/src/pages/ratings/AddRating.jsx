import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const AddRating = () => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [recipe, setRecipe] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axiosInstance.get('/reciperover/recipes/');
        if (response.data && Array.isArray(response.data.results)) {
          setRecipes(response.data.results);
        } else {
          setError('Unexpected response format');
        }
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ratingData = {
      rating: parseInt(rating, 10),
      comment,
      recipe: parseInt(recipe, 10)
    };

    try {
      const response = await axiosInstance.post('/reciperover/ratings/', ratingData);

      if (response.status !== 201) {
        const errorData = response.data;
        console.error('Error data:', errorData);
        throw new Error(`Failed to add rating: ${response.statusText}`);
      }

      alert('Rating added successfully');
      navigate('/ratings');
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
          <div className="field">
            <label className="label" htmlFor="recipe">Receta</label>
            <div className="control">
              <div className="select">
                <select id="recipe" value={recipe} onChange={(e) => setRecipe(e.target.value)} required>
                  <option value="">Seleccione una receta</option>
                  {recipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
                  ))}
                </select>
              </div>
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

export default AddRating;
