import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Fetching locations...');
    axiosInstance.get('/reciperover/locations/')
      .then(response => {
        console.log('Response received:', response);
        if (response.data && Array.isArray(response.data.results)) {
          console.log('Locations data:', response.data.results);
          setLocations(response.data.results);
        } else {
          console.error('Formato de respuesta inesperado:', response.data);
          setError('Formato de respuesta inesperado');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching locations:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    console.log(`Deleting location with id: ${id}`);
    try {
      await axiosInstance.delete(`/reciperover/locations/${id}/`);
      setLocations(locations.filter(location => location.id !== id));
      console.log(`Location with id: ${id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting location:', error);
      setError(error.message);
    }
  };

  if (loading) return <div className="notification is-info">Cargando...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Ubicaciones</h1>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Sitio Web</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {locations.length === 0 ? (
              <tr>
                <td colSpan="5" className="has-text-centered">No hay ubicaciones disponibles</td>
              </tr>
            ) : (
              locations.map(location => (
                <tr key={location.id}>
                  <td>{location.name}</td>
                  <td>{location.address}</td>
                  <td>{location.phone_number || 'N/A'}</td>
                  <td>{location.website ? <a href={location.website} target="_blank" rel="noopener noreferrer">Sitio Web</a> : 'N/A'}</td>
                  <td>
                    <button
                      className="button is-small is-warning"
                      onClick={() => {
                        console.log(`Navigating to edit location with id: ${location.id}`);
                        navigate(`/edit-location/${location.id}`);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="button is-small is-danger"
                      onClick={() => handleDelete(location.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default LocationList;
