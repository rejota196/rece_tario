import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import AddComment from './AddComment'; // Importa AddComment
import Layout from '../Layout';

const CommentsRecipeId = () => {
  const { id } = useParams();  // Obtiene el `id` desde los parámetros de la URL
  const recipeId = parseInt(id, 10); // Convierte `id` a un número entero
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!recipeId || isNaN(recipeId)) {
      setError("recipeId no es válido o no es un número.");
      setLoading(false);
      return;
    }

    const fetchComments = async () => {
      try {
        const url = `/reciperover/comments/?recipe=${recipeId}`;
        console.log("Request URL:", url); // Verificar la URL completa que se está enviando
        const response = await axiosInstance.get(url);
        console.log("Response:", response); // Verificar la respuesta completa de la API
        if (response.data && Array.isArray(response.data.results)) {
          setComments(response.data.results);
        } else {
          setError('Formato de respuesta inesperado');
        }
      } catch (error) {
        console.error('Error al cargar los comentarios:', error.response?.data || error.message);
        setError(error.response?.data?.detail || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [recipeId]);

  const handleCommentAdded = (newComment) => {
    setComments(prevComments => [newComment, ...prevComments]);
  };

  if (loading) return <div>Cargando comentarios...</div>;
  if (error) return <div>Error al cargar comentarios: {error}</div>;

  return (
    <div className="section">
      <h2 className="title">Comentarios</h2>

      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Comentario</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {comments.length === 0 ? (
            <tr>
              <td colSpan="2">No hay comentarios para esta receta.</td>
            </tr>
          ) : (
            comments.map(comment => (
              <tr key={comment.id}>
                <td>{comment.content || comment.comment}</td>
                <td>{new Date(comment.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      <AddComment recipeId={recipeId} onCommentAdded={handleCommentAdded} />
    </div>
  );
};

export default CommentsRecipeId;
