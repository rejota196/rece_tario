import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { AuthContext } from '../contexts/AuthContext';
import Layout from './Layout';

const DeleteRecipe = () => {
  const { id } = useParams();
  const { state: { user } } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axiosInstance.get(`/reciperover/recipes/${id}/`);
        if (response.data) {
          setRecipe(response.data);
        } else {
          throw new Error('Receta no encontrada');
        }
      } catch (error) {
        setError(`Error al cargar la receta: ${error.response?.data || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (recipe && recipe.owner !== user.id) {
      setError('No tienes permisos para eliminar esta receta.');
      return;
    }

    try {
      const response = await axiosInstance.delete(`/reciperover/recipes/${id}/`);
      if (response.status === 204) {
        alert('Receta eliminada con éxito.');
        navigate('/'); 
      } else {
        setError('No se pudo eliminar la receta.');
      }
    } catch (error) {
      setError(`Error al eliminar la receta: ${error.response?.data || error.message}`);
    }
  };

  if (loading) return <div className="notification is-info">Cargando receta...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;

  return (
    <Layout>
      <div className="section">
        <h1 className="title has-text-centered">Eliminar Receta</h1>
        <div className="box">
          <p className="subtitle is-5 has-text-centered">
            ¿Estás seguro de que quieres eliminar la receta "{recipe.title}"?
          </p>
          <div className="buttons is-centered">
            <button className="button is-danger" onClick={handleDelete}>Eliminar</button>
            <button className="button is-light" onClick={() => navigate(-1)}>Cancelar</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeleteRecipe;
