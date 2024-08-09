import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const RecipeIngredients = () => {
  const { id } = useParams();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/reciperover/recipes/${id}/ingredients/`)
      .then(response => {
        console.log('Response data:', response.data); // Añadir esto para inspeccionar la respuesta completa
        // Verifica que response.data.results es un array antes de asignarlo
        if (Array.isArray(response.data.results)) {
          setIngredients(response.data.results);
        } else {
          setError('Formato de respuesta inesperado');
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="notification is-info">Cargando...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;
  if (!Array.isArray(ingredients) || ingredients.length === 0) return <div className="notification is-warning">No se encontraron ingredientes para esta receta</div>;

  return (
    <Layout>
      <div className="section">
        <h1 className="title has-text-centered">Ingredientes de la Receta</h1>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map(ingredient => (
              <tr key={ingredient.id}>
                <td>{ingredient.name}</td>
                <td>{ingredient.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default RecipeIngredients;
