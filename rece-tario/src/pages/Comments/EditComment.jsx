import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';
import { useAuth } from '../../contexts/AuthContext'; // Importa el contexto de autenticación

const EditComment = () => {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [recipeId, setRecipeId] = useState(null); // Para almacenar el ID de la receta
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { state: { token } } = useAuth();  // Obtener el token del contexto de autenticación

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await axiosInstance.get(`/reciperover/comments/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }  // Usar el token para autenticación
        });
        setContent(response.data.content);
        setRecipeId(response.data.recipe);  // Guardar el ID de la receta
      } catch (error) {
        setError('Error al cargar el comentario.');
      }
    };

    if (token) {
      fetchComment();
    } else {
      setError('Token de autenticación no encontrado.');
    }
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Token de autenticación no encontrado.');
      return;
    }

    try {
      await axiosInstance.put(`/reciperover/comments/${id}/`, { 
        content: content, 
        recipe: recipeId  // Usar el ID de la receta almacenado en el estado
      }, {
        headers: { Authorization: `Bearer ${token}` }  // Usar el token para autenticación
      });
      alert('Comentario actualizado con éxito');
      navigate(`/recipe/${recipeId}`);  // Redirigir a la receta correspondiente
    } catch (error) {
      setError('Error al actualizar el comentario.');
    }
  };

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Editar Comentario</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Comentario</label>
            <div className="control">
              <textarea
                className="textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>
          </div>
          <div className="control">
            <button className="button is-primary" type="submit">Actualizar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditComment;
