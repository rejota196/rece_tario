import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/reciperover/categories/', { name });
      navigate('/categories');
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
                <h1 className="title has-text-centered">Añadir Nueva Categoría</h1>
                {error && <div className="notification is-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="label" htmlFor="name">Nombre de la Categoría</label>
                    <div className="control has-icons-left">
                      <input 
                        className="input" 
                        id="name" 
                        type="text" 
                        placeholder="Ingrese el nombre de la categoría"
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-tag"></i>
                      </span>
                    </div>
                  </div>
                  <div className="field is-grouped is-grouped-right">
                    <div className="control">
                      <button className="button is-link" type="submit">Añadir Categoría</button>
                    </div>
                    <div className="control">
                      <button className="button is-light" type="button" onClick={() => navigate('/categories')}>Cancelar</button>
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

export default AddCategory;
