import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get('/reciperover/comments/')
      .then(response => {
        setComments(response.data.results || []);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
    <div className="section">
      <h1 className="title">Comentarios</h1>
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Comentario</th>
            <th>Receta</th>
          </tr>
        </thead>
        <tbody>
          {comments.map(comment => (
            <tr key={comment.id}>
              <td>{comment.content || comment.comment}</td>
              <td>{comment.recipe?.title || 'Sin receta'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </Layout>
  );
};

export default CommentList;
