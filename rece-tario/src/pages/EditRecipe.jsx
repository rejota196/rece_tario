import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import Layout from './Layout';
import { useAuth } from '../contexts/AuthContext';

const EditRecipe = () => {
  const { id } = useParams();
  const { state: { token } } = useAuth();  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [servings, setServings] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Efecto para cargar los datos de la receta
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axiosInstance.get(`/reciperover/recipes/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data) {
          setTitle(response.data.title || '');
          setDescription(response.data.description || '');
          setPreparationTime(response.data.preparation_time || 0);
          setCookingTime(response.data.cooking_time || 0);
          setServings(response.data.servings || 0);
        } else {
          setError('Recipe not found.');
        }
      } catch (error) {
        console.error('Error fetching the recipe:', error);
        setError('Error fetching the recipe.');
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchRecipe();
    } else {
      setError('Token de autenticación no encontrado.');
      setLoading(false);
    }
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Token de autenticación no encontrado.');
      return;
    }

    try {
      await axiosInstance.put(`/reciperover/recipes/${id}/`, 
      { 
        title, 
        description,
        preparation_time: preparationTime,
        cooking_time: cookingTime,
        servings 
      }, 
      { headers: { Authorization: `Bearer ${token}` } });
      alert('Recipe updated successfully');
      navigate('/');
    } catch (error) {
      if (error.response) {
        console.error('Error de respuesta:', error.response.data);
        setError(`Failed to update recipe: ${error.response.data.detail || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Error de solicitud:', error.request);
        setError('No response from server.');
      } else {
        console.error('Error:', error.message);
        setError('Error in the request setup.');
      }
    }
  };

  return (
    <Layout>
      <div className="container">
        <h2 className="title">Editar Receta</h2>
        {error && <div className="notification is-danger">Error: {error}</div>}
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Titulo</label>
              <div className="control">
                <input 
                  className="input" 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Descripcion</label>
              <div className="control">
                <textarea 
                  className="textarea" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Tiempo de Preparación (minutos)</label>
              <div className="control">
                <input 
                  className="input" 
                  type="number" 
                  value={preparationTime} 
                  onChange={(e) => setPreparationTime(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Tiempo de Cocción (minutos)</label>
              <div className="control">
                <input 
                  className="input" 
                  type="number" 
                  value={cookingTime} 
                  onChange={(e) => setCookingTime(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Porciones</label>
              <div className="control">
                <input 
                  className="input" 
                  type="number" 
                  value={servings} 
                  onChange={(e) => setServings(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="control">
              <button className="button is-primary" type="submit">Actualizar Receta</button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default EditRecipe;
