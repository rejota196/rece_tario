import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const EditStep = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/reciperover/steps/${id}/`)
      .then(response => {
        setTitle(response.data.title);
        setDescription(response.data.description);
      })
      .catch(error => {
        setError(error.message);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/reciperover/steps/${id}/`, { title, description });
      navigate('/steps');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Editar Paso</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="title">Título</label>
            <div className="control">
              <input
                className="input"
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="description">Descripción</label>
            <div className="control">
              <textarea
                className="textarea"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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

export default EditStep;
