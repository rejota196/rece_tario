import { useEffect, useState } from 'react';
import axios from 'axios';

const CommentsRecipeId = ({ recipeId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/reciperover/comments/?recipe=${recipeId}`)
      .then(response => {
        setComments(response.data.results || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar los comentarios:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [recipeId]);

  if (loading) return <div>Cargando comentarios...</div>;
  if (error) return <div>Error al cargar comentarios: {error}</div>;

  return (
    <div className="section">
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
    </div>
  );
};

export default CommentsRecipeId;
