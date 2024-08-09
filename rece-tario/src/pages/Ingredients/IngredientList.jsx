import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';
import './IngredientList.css';

const IngredientList = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/reciperover/ingredients/')
      .then(response => {
        if (response.data && Array.isArray(response.data.results)) {
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
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/reciperover/ingredients/${id}/`);
      setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="notification is-info">Cargando...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Ingredientes</h1>
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha de Creación</th>
              <th>Fecha de Actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.length > 0 ? ingredients.map(ingredient => (
              <tr key={ingredient.id}>
                <td>{ingredient.name}</td>
                <td>{ingredient.description || 'N/A'}</td>
                <td>{new Date(ingredient.created_at).toLocaleDateString()}</td>
                <td>{new Date(ingredient.updated_at).toLocaleDateString()}</td>
                <td>
                  <button className="button is-small is-warning" onClick={() => navigate(`/edit-ingredient/${ingredient.id}`)}>Editar</button>
                  <button className="button is-small is-danger" onClick={() => handleDelete(ingredient.id)}>Eliminar</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5">No hay ingredientes disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default IngredientList;
