import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const AddIngredients = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/reciperover/ingredients/', { name, description });
      navigate('/ingredients');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="section">
        <h1 className="title has-text-centered">Agregar Ingrediente</h1>
        {error && <div className="notification is-danger has-text-centered">{error}</div>}
        <form onSubmit={handleSubmit} className="form-styled">
          <div className="field">
            <label className="label" htmlFor="name">Nombre</label>
            <div className="control">
              <input
                className="input"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              ></textarea>
            </div>
          </div>
          <div className="control">
            <button className="button is-primary" type="submit">Agregar Ingrediente</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddIngredients;
