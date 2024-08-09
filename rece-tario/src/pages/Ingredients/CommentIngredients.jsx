import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

export const CommentIngredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get('/reciperover/ingredients/')
      .then(response => {
        setIngredients(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Ingredients</h1>
        <ul>
          {ingredients.map(ingredient => (
            <li key={ingredient.id}>{ingredient.name}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default CommentIngredients;
