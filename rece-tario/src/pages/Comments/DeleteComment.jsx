import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const DeleteComment = () => {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/reciperover/comments/${id}/`)
      .then(response => {
        setContent(response.data.content);
      })
      .catch(error => {
        setError(error.message);
      });
  }, [id]);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/reciperover/comments/${id}/`);
      navigate('/comments');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Eliminar Comentario</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <div className="content">
          <p>¿Estás seguro de que quieres eliminar este comentario?</p>
          <blockquote>{content}</blockquote>
        </div>
        <div className="control">
          <button className="button is-danger" onClick={handleDelete}>Eliminar</button>
        </div>
      </div>
    </Layout>
  );
};

export default DeleteComment;
