import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import AddComment from './AddComment';
import Layout from '../Layout';
import { AuthContext } from '../../contexts/AuthContext'; // Asegúrate de importar AuthContext

const CommentsRecipeId = () => {
  const { id } = useParams();  
  const recipeId = parseInt(id, 10); 
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state: { user } } = useContext(AuthContext); // Accede al usuario autenticado
  const [recipeOwner, setRecipeOwner] = useState(null);

  useEffect(() => {
    if (!recipeId || isNaN(recipeId)) {
      setError("recipeId no es válido o no es un número.");
      setLoading(false);
      return;
    }

    const fetchComments = async () => {
      try {
        const url = `/reciperover/comments/?recipe=${recipeId}`;
        const response = await axiosInstance.get(url);
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

    const fetchRecipeOwner = async () => {
      try {
        const response = await axiosInstance.get(`/reciperover/recipes/${recipeId}/`);
        setRecipeOwner(response.data.owner); // Establece el propietario de la receta
      } catch (error) {
        console.error('Error al obtener el propietario de la receta:', error);
      }
    };

    fetchComments();
    fetchRecipeOwner();
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
            {user?.id === recipeOwner && <th>Acciones</th>} {/* Muestra las acciones solo si el usuario es el propietario */}
          </tr>
        </thead>
        <tbody>
          {comments.length === 0 ? (
            <tr>
              <td colSpan="3">No hay comentarios para esta receta.</td>
            </tr>
          ) : (
            comments.map(comment => (
              <tr key={comment.id}>
                <td>{comment.content || comment.comment}</td>
                <td>{new Date(comment.created_at).toLocaleDateString()}</td>
                {user?.id === recipeOwner || user?.id === comment.user && (
                  <td>
                    <Link to={`/edit-comment/${comment.id}`} className="button is-small is-info">Editar</Link>
                    <Link to={`/delete-comment/${comment.id}`} className="button is-small is-danger">Eliminar</Link>
                  </td>
                )}
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
