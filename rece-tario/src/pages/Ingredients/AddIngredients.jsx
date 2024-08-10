import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const AddIngredients = () => {
  const [name, setName] = useState('');
  const [measures, setMeasures] = useState([]);
  const [selectedMeasure, setSelectedMeasure] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar las opciones de medidas disponibles
  useEffect(() => {
    const fetchMeasures = async () => {
      try {
        const response = await axiosInstance.get('/reciperover/measures/');
        if (response.data && Array.isArray(response.data)) {
          setMeasures(response.data);
        } else {
          setError('Error al cargar las medidas.');
        }
      } catch (error) {
        setError(`Error al cargar medidas: ${error.message}`);
      }
    };

    fetchMeasures();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/reciperover/ingredients/', {
        name,
        measure: selectedMeasure || null,  // Incluye la medida seleccionada, si aplica
      });
      
      if (response.status === 201) {
        navigate('/ingredients');
      } else {
        throw new Error('Error al agregar el ingrediente.');
      }
    } catch (error) {
      setError(`Error al agregar el ingrediente: ${error.message}`);
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
            <label className="label" htmlFor="measure">Medida</label>
            <div className="control">
              <div className="select">
                <select
                  id="measure"
                  value={selectedMeasure}
                  onChange={(e) => setSelectedMeasure(e.target.value)}
                >
                  <option value="">Seleccione una medida</option>
                  {measures.map(measure => (
                    <option key={measure.key} value={measure.key}>
                      {measure.value}
                    </option>
                  ))}
                </select>
              </div>
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
