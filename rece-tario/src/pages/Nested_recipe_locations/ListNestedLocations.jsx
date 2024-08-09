import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const ListNestedLocations = ({ recipe_pk }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/reciperover/recipes/${recipe_pk}/locations/`)
      .then(response => {
        setLocations(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
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

export default ListNestedLocations;
