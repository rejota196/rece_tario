import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';

const AddIngredients = ({ onAddIngredient }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(''); // Nuevo estado para la cantidad
  const [measures, setMeasures] = useState([]);
  const [selectedMeasure, setSelectedMeasure] = useState('');
  const [error, setError] = useState(null);

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

  const handleAddIngredient = () => {
    if (name && amount && selectedMeasure) {
      onAddIngredient({ id: Date.now(), name, amount, measure: selectedMeasure });
      setName('');
      setAmount(''); // Resetea la cantidad
      setSelectedMeasure('');
    }
  };

  return (
    <div>
      <h3 className="title is-4">Agregar Ingrediente</h3>
      {error && <div className="notification is-danger">{error}</div>}
      <div className="field">
        <label className="label" htmlFor="name">Nombre del Ingrediente</label>
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
        <label className="label" htmlFor="amount">Cantidad</label>
        <div className="control">
          <input
            className="input"
            id="amount"
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
              required
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
        <button className="button is-primary" type="button" onClick={handleAddIngredient}>
          Agregar Ingrediente
        </button>
      </div>
    </div>
  );
};

export default AddIngredients;
