import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import AddComment from './AddComment'; // Importa AddComment

const CommentsRecipeId = ({ recipeId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar comentarios para la receta específica
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(`/reciperover/comments/?recipe=${recipeId}`);
        setComments(response.data.results || []);
      } catch (error) {
        console.error('Error al cargar los comentarios:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (recipeId) {
      fetchComments();
    }
  }, [recipeId]);

  useEffect(() => {
    if (comments.length > 0) {
      console.log('Comentarios actualizados:', comments);
    }
  }, [comments]);

  const handleCommentAdded = (newComment) => {
    setComments(prevComments => [newComment, ...prevComments]);
  };

  if (loading) return <div>Cargando comentarios...</div>;
  if (error) return <div>Error al cargar comentarios: {error}</div>;

  return (
    <div className="section">
      <h2 className="title">Comentarios</h2>
      
      {/* Renderiza AddComment aquí */}


      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Comentario</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {comments.map(comment => (
            <tr key={comment.id}>
              <td>{comment.content || comment.comment}</td>
              <td>{new Date(comment.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
        
      </table>
      <AddComment recipeId={recipeId} onCommentAdded={handleCommentAdded} />
    </div>
  );
};

export default CommentsRecipeId;
