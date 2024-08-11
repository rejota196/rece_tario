import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const AddRating = () => {
  const { id } = useParams();  // Usar id de receta si se pasa en la URL
  const [rating, setRating] = useState(0); // Inicializar con 0
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ratingData = {
      rating, // Valoración seleccionada
      recipe: parseInt(id, 10)  // Asegurarse de que sea un número
    };

    try {
      const response = await axiosInstance.post('/reciperover/ratings/', ratingData);

      if (response.status === 201) {
        alert('Valoración añadida con éxito');
        navigate(`/recipe/${id}`);
      } else {
        console.error('Error en la respuesta:', response);
        throw new Error(`Fallo al agregar la valoración: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al agregar la valoración:', error);
      setError('Error al agregar la valoración. Por favor, inténtalo de nuevo.');
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  return (
    <Layout>
      <div className="section">
        <h1 className="title has-text-centered">Añadir Valoración</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Valoración</label>
            <div className="control">
              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`button ${rating === value ? 'is-primary' : 'is-light'}`}
                    onClick={() => handleRatingClick(value)}
                  >
                    {value} ★
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="control">
            <button className="button is-primary" type="submit">Añadir Valoración</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddRating;
