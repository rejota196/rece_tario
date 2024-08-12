import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const AddStep = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/reciperover/steps/', { title, description });
      navigate('/steps');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="card">
              <div className="card-content">
                <h1 className="title has-text-centered">Agregar Nuevo Paso</h1>
                {error && <div className="notification is-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="label" htmlFor="title">Título del Paso</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        id="title"
                        type="text"
                        placeholder="Ingrese el título del paso"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-heading"></i>
                      </span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="description">Descripción del Paso</label>
                    <div className="control has-icons-left">
                      <textarea
                        className="textarea"
                        id="description"
                        placeholder="Describa los detalles del paso"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      ></textarea>
                      <span className="icon is-small is-left">
                        <i className="fas fa-align-left"></i>
                      </span>
                    </div>
                  </div>
                  <div className="field is-grouped is-grouped-right">
                    <div className="control">
                      <button className="button is-link" type="submit">Agregar</button>
                    </div>
                    <div className="control">
                      <button className="button is-light" type="button" onClick={() => navigate('/steps')}>Cancelar</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddStep;
