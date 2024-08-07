import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`https://sandbox.academiadevelopers.com/reciperover/recipes/${id}/`)
      .then(response => {
        setRecipe(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="notification is-info">Loading...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;
  if (!recipe) return <div className="notification is-warning">No recipe found</div>;

  return (
    <div className="container">
      <h1 className="title">{recipe.title}</h1>
      <p>{recipe.description}</p>
    </div>
  );
};

export default RecipeDetail;
