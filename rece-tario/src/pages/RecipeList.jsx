import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Layout from './Layout';  

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://sandbox.academiadevelopers.com/reciperover/recipes/')
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

  if (loading) return <div className="notification is-info">Loading...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;

  return (
    <Layout>
      <div className="section">
        <h1 className="title has-text-centered">Recipes</h1>
        <div className="columns is-multiline">
          {recipes.map(recipe => (
            <div key={recipe.id} className="column is-one-third">
              <div className="card">
                <div className="card-content">
                  <p className="title is-4">{recipe.title}</p>
                  <div className="buttons">
                    <Link className="button is-info" to={`/recipe/${recipe.id}`}>View Details</Link>
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

export default RecipeList;
