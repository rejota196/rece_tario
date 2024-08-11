import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../Layout';

const RecipeIngredients = () => {
  const { id } = useParams();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIngredients();
  }, [id]);

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://sandbox.academiadevelopers.com/reciperover/recipes/${id}/ingredients/`);
      if (response.data && Array.isArray(response.data.results)) {
        const ingredientsDetails = await Promise.all(
          response.data.results.map(async (item) => {
            const ingredientResponse = await axios.get(`https://sandbox.academiadevelopers.com/reciperover/ingredients/${item.ingredient}/`);
            return {
              name: ingredientResponse.data.name,
              description: ingredientResponse.data.description,
              quantity: item.quantity,
              measure: item.measure,
            };
          })
        );
        setIngredients(ingredientsDetails);
      } else {
        setError('Unexpected response format');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="notification is-info">Cargando...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return <div className="notification is-warning">No se encontraron ingredientes para esta receta</div>;
  }

  return (
    <Layout>
      <div className="section">
        <h1 className="title has-text-centered">Ingredientes de la Receta</h1>
        <table className="table is-striped is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Medida</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient, index) => (
              <tr key={index}>
                <td>{ingredient.name || 'Nombre no disponible'}</td>
                <td>{ingredient.description || 'Descripción no disponible'}</td>
                <td>{ingredient.quantity || 'Cantidad no disponible'}</td>
                <td>{ingredient.measure || 'Medida no disponible'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default RecipeIngredients;
