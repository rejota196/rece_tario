import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const AddRating = () => {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const [recipe, setRecipe] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axiosInstance.get('/reciperover/recipes/?page_size=100'); // Ajustamos el page_size para traer más recetas
        if (response.data && Array.isArray(response.data.results)) {
          setRecipes(response.data.results);
        } else {
          setError('Formato de respuesta inesperado');
        }
      } catch (error) {
        console.error('Error al obtener las recetas:', error);
        setError('Error al obtener las recetas');
      }
    };

    fetchRecipes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ratingData = {
      rating,
      comment,
      recipe: parseInt(recipe, 10)
    };

    try {
      const response = await axiosInstance.post('/reciperover/ratings/', ratingData);

      if (response.status !== 201) {
        const errorData = response.data;
        console.error('Datos del error:', errorData);
        throw new Error(`Fallo al agregar la valoración: ${response.statusText}`);
      }

      alert('Valoración añadida con éxito');
      navigate('/ratings');
    } catch (error) {
      console.error('Error al agregar la valoración:', error);
      setError(error.message);
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
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
              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`button ${rating === value ? 'is-primary' : 'is-light'}`}
                    onClick={() => handleRatingClick(value)}
                  >
                    {value} ★
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="comment">Comentario</label>
            <div className="control">
              <textarea 
                className="textarea" 
                id="comment" 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="recipe">Receta</label>
            <div className="control">
              <div className="select">
                <select 
                  id="recipe" 
                  value={recipe} 
                  onChange={(e) => setRecipe(e.target.value)} 
                  required
                >
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
