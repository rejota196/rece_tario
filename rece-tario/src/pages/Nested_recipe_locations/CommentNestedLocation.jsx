import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const CommentNestedLocations = () => {
  const { recipe_pk } = useParams();  // Obtiene el parámetro de la URL
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(`Valor de recipe_pk obtenido: ${recipe_pk}`);  // Log para verificar recipe_pk
    
    // Verificar si recipe_pk es válido antes de hacer la solicitud
    if (!recipe_pk || recipe_pk === ':recipe_pk') {
      setError('El parámetro recipe_pk no está definido o es inválido');
      setLoading(false);
      return;
    }

    const url = `/reciperover/recipes/${recipe_pk}/locations/`;
    console.log(`Solicitando datos desde: ${url}`);

    axiosInstance.get(url)
      .then(response => {
        console.log('Datos recibidos:', response.data); // Log para ver los datos de respuesta
        if (response.status === 200) {
          setLocations(Array.isArray(response.data.results) ? response.data.results : []);
        } else {
          setError(`Error: ${response.status} - ${response.statusText}`);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener las ubicaciones:', error);  // Log del error
        setError(`Error al obtener las ubicaciones: ${error.message}`);
        setLoading(false);
      });
  }, [recipe_pk]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Ubicaciones Anidadas</h1>
        <ul>
          {locations.map(location => (
            <li key={location.id}>{location.name} - {location.address}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default CommentNestedLocations;
