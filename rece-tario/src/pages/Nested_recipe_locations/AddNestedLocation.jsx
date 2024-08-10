import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

// Componente para manejar el evento de clic en el mapa
const LocationMap = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>
        {position.lat}, {position.lng}
      </Popup>
    </Marker>
  ) : null;
};

const AddNestedLocation = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const locationData = {
        name,
        address,
        latitude: position?.lat,
        longitude: position?.lng,
      };
      await axiosInstance.post('/nested_recipe_locations/locations/', locationData);
      navigate('/locations');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Agregar Ubicación</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
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
            <label className="label" htmlFor="address">Dirección</label>
            <div className="control">
              <input
                className="input"
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Ubicación en el Mapa</label>
            <div className="control" style={{ height: '400px' }}>
              <MapContainer center={position || [51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMap position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
          </div>
          <div className="control">
            <button className="button is-primary" type="submit">Agregar Ubicación</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddNestedLocation;
