import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const DeleteNestedComment = () => {
  const { id, nestedId } = useParams(); // Parámetros de URL
  const [comment, setComment] = useState(null);
  const [recipePk, setRecipePk] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`ID: ${id}, Nested ID: ${nestedId}`); // Registro de los parámetros

    if (id && nestedId) {
      // Solicita los detalles del comentario anidado
      axiosInstance.get(`/reciperover/comments/${id}/nested/${nestedId}/`)
        .then(response => {
          if (response.data) {
            setComment(response.data); // Establece el comentario
            setRecipePk(response.data.recipe_pk); // Establece recipe_pk si está en la respuesta
          } else {
            setError('Comentario no encontrado.');
          }
        })
        .catch(error => {
          setError(error.message);
        });
    } else {
      setError('ID o Nested ID no proporcionado.');
    }
  }, [id, nestedId]);

  const handleDelete = async () => {
    if (!recipePk) {
      setError('Recipe PK no encontrado.');
      return;
    }

    try {
      // Usa recipe_pk y nestedId para la eliminación
      await axiosInstance.delete(`/reciperover/recipes/${recipePk}/locations/${nestedId}/`);
      navigate(`/comments/${id}`); // Redirige a la página de comentarios principales
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Eliminar Comentario Anidado</h1>
        {error && <div className="notification is-danger">{error}</div>}
        {comment ? (
          <div className="content">
            <p>¿Estás seguro de que quieres eliminar el siguiente comentario anidado?</p>
            <div className="box">
              <h2 className="subtitle">Comentario</h2>
              <blockquote>
                <p><strong>ID:</strong> {comment.id}</p>
                <p><strong>Contenido:</strong> {comment.content}</p>
                {/* Agrega más campos según la respuesta del API */}
              </blockquote>
            </div>
            <div className="control">
              <button className="button is-danger" onClick={handleDelete}>Eliminar</button>
              <button className="button is-light" onClick={() => navigate(`/comments/${id}`)}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="notification is-info">Cargando comentario...</div>
        )}
      </div>
    </Layout>
  );
};

export default DeleteNestedComment;
