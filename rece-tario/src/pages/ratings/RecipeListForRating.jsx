import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const RecipeListForRating = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingsMap, setRatingsMap] = useState({});

  useEffect(() => {
    const fetchRecipesAndRatings = async () => {
      try {
        // Obtener todas las recetas
        const response = await axiosInstance.get('/reciperover/recipes/');
        if (response.data && Array.isArray(response.data.results)) {
          setRecipes(response.data.results);

          // Crear un mapa de recetas con sus valoraciones
          const newRatingsMap = {};
          for (const recipe of response.data.results) {
            const ratingResponse = await axiosInstance.get(`/reciperover/ratings/?recipe=${recipe.id}`);
            if (ratingResponse.data && Array.isArray(ratingResponse.data.results)) {
              const ratings = ratingResponse.data.results;
              const averageRating = ratings.length > 0
                ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
                : 0;
              newRatingsMap[recipe.id] = averageRating;
            } else {
              newRatingsMap[recipe.id] = 0;
            }
          }
          setRatingsMap(newRatingsMap);
        } else {
          setError('Unexpected response format');
        }
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch recipes');
        setLoading(false);
      }
    };

    fetchRecipesAndRatings();
  }, []);

  if (loading) return <div className="notification is-info">Cargando...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;

  return (
    <Layout>
      <div className="section">
        <h1 className="title has-text-centered">Lista de Recetas</h1>
        <div className="columns is-multiline">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="column is-one-third">
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src={recipe.image} alt={recipe.title} />
                  </figure>
                </div>
                <div className="card-content">
                  <p className="title is-4">{recipe.title}</p>
                  {/* Mostrar las estrellitas */}
                  <div className="rating">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} className={`star ${index < Math.round(ratingsMap[recipe.id]) ? 'is-primary' : 'is-light'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="buttons">
                    <Link className="button is-info" to={`/recipe/${recipe.id}`}>Ver Detalles</Link>
                    <Link className="button is-primary" to={`/recipe/${recipe.id}/add-rating`}>Valorar</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RecipeListForRating;
