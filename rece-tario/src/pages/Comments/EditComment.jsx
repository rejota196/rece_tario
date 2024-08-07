import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const EditComment = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/reciperover/comments/${id}/`, { content });
      navigate('/comments');
    } catch (error) {
      setError(error.message);
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

