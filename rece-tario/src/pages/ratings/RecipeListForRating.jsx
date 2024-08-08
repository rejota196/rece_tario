import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const RecipeListForRating = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axiosInstance.get('/reciperover/recipes/');
        if (response.data && Array.isArray(response.data.results)) {
          setRecipes(response.data.results);
        } else {
          setError('Unexpected response format');
        }
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch recipes');
        setLoading(false);
      }
    };

    fetchRecipes();
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
