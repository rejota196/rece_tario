import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';


export const EditIngredients = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    axiosInstance.get(`/reciperover/ingredients/${id}/`)
      .then(response => {
        setName(response.data.name);
      })
      .catch(error => {
        setError(error.message);
      });
  }, [id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/reciperover/ingredients/${id}/`, { name });
      navigate('/ingredients');
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <Layout>
      <div className="section">
        <h1 className="title">Editar Ingrediente</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="name">Nombre</label>
            <div className="control">
              <input className="input" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <div className="control">
            <button className="button is-primary" type="submit">Actualizar Ingrediente</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditIngredients;
