import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const EditNestedLocation = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/nested_recipe_locations/locations/${id}/`)
      .then(response => {
        setName(response.data.name);
        setAddress(response.data.address);
      })
      .catch(error => {
        setError(error.message);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/nested_recipe_locations/locations/${id}/`, { name, address });
      navigate('/nested_recipe_locations');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Editar Ubicación Anidada</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="name">Nombre</label>
            <div className="control">
              <input className="input" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="address">Dirección</label>
            <div className="control">
              <input className="input" id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
          </div>
          <div className="control">
            <button className="button is-primary" type="submit">Actualizar Ubicación</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditNestedLocation;
