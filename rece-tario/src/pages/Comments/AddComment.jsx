import { useState } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../../utils/axiosConfig';

const AddComment = ({ recipeId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null); // Para manejar la notificación

  const handleSubmit = async (e) => {
    e.preventDefault();

    const commentData = {
      content: commentText, 
      recipe: recipeId, 
    };

    try {
      const response = await axiosInstance.post('/reciperover/comments/', commentData);
      if (response.status === 201) {
        onCommentAdded(response.data);
        setCommentText('');
        setNotification('Comentario agregado con éxito!');
        setError(null);
      } else {
        setError('No se pudo agregar el comentario. Inténtalo de nuevo.');
        setNotification(null);
      }
    } catch (error) {
      console.error('Error al agregar el comentario:', error.response?.data || error.message);
      setError('Ocurrió un error. Inténtalo de nuevo.');
      setNotification(null);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h2 className="title has-text-centered">Agregar Comentario</h2>

        {/* Notificación de éxito */}
        {notification && (
          <div className="notification is-success">
            <button className="delete" onClick={() => setNotification(null)}></button>
            {notification}
          </div>
        )}

        {/* Notificación de error */}
        {error && (
          <div className="notification is-danger">
            <button className="delete" onClick={() => setError(null)}></button>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="box">
          <div className="field">
            <label className="label">Comentario</label>
            <div className="control">
              <textarea
                className="textarea"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="control">
            <button className="button is-primary" type="submit">
              Añadir Comentario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddComment.propTypes = {
  recipeId: PropTypes.number.isRequired,
  onCommentAdded: PropTypes.func.isRequired,
};

export default AddComment;
