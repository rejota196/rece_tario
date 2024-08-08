import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import Layout from './Layout';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';


const LocationMarker = ({ setLatitude, setLongitude }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLatitude(e.latlng.lat);
      setLongitude(e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
};

LocationMarker.propTypes = {
  setLatitude: PropTypes.func.isRequired,
  setLongitude: PropTypes.func.isRequired,
};

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preparationTime, setPreparationTime] = useState(0);
  const [cookingTime, setCookingTime] = useState(0);
  const [servings, setServings] = useState(0);
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/reciperover/categories/');
        setCategories(response.data.results);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipeData = new FormData();
    recipeData.append('title', title);
    recipeData.append('description', description);
    recipeData.append('preparation_time', preparationTime);
    recipeData.append('cooking_time', cookingTime);
    recipeData.append('servings', servings);
    recipeData.append('ingredients', ingredients);
    recipeData.append('latitude', latitude);
    recipeData.append('longitude', longitude);
    if (selectedCategory) {
      recipeData.append('categories', selectedCategory);
    }
    if (newCategory) {
      recipeData.append('categories', newCategory);
    }
    if (image) {
      recipeData.append('image', image);
    }

    try {
      const response = await axiosInstance.post('/reciperover/recipes/', recipeData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 201) {
        const errorData = response.data;
        console.error('Datos de error:', errorData);
        throw new Error(`Failed to add recipe: ${response.statusText}`);
      }

      const data = response.data;
      console.log('Datos de respuesta:', data);

      alert('Receta añadida con éxito');
      setTitle('');
      setDescription('');
      setPreparationTime(0);
      setCookingTime(0);
      setServings(0);
      setIngredients('');
      setLatitude(null);
      setLongitude(null);
      setSelectedCategory('');
      setNewCategory('');
      setImage(null);
      navigate('/');
    } catch (error) {
      console.error('Failed to add recipe:', error);
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="section">
        <div className="container">
          <h2 className="title has-text-centered">Añadir Receta</h2>
          {error && <div className="notification is-danger has-text-centered">{error}</div>}
          <form onSubmit={handleSubmit} className="box">
            <div className="field">
              <label className="label" htmlFor="title">Título</label>
              <div className="control">
                <input className="input" id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="description">Descripción</label>
              <div className="control">
                <textarea className="textarea" id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
            </div>
            <div className="field is-horizontal">
              <div className="field-body">
                <div className="field">
                  <label className="label" htmlFor="preparationTime">Tiempo de Preparación (minutos)</label>
                  <div className="control">
                    <input className="input" id="preparationTime" type="number" value={preparationTime} onChange={(e) => setPreparationTime(Number(e.target.value))} required />
                  </div>
                </div>
                <div className="field">
                  <label className="label" htmlFor="cookingTime">Tiempo de Cocción (minutos)</label>
                  <div className="control">
                    <input className="input" id="cookingTime" type="number" value={cookingTime} onChange={(e) => setCookingTime(Number(e.target.value))} required />
                  </div>
                </div>
                <div className="field">
                  <label className="label" htmlFor="servings">Porciones</label>
                  <div className="control">
                    <input className="input" id="servings" type="number" value={servings} onChange={(e) => setServings(Number(e.target.value))} required />
                  </div>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="ingredients">Ingredientes</label>
              <div className="control">
                <textarea className="textarea" id="ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)}></textarea>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="location">Ubicación</label>
              <div className="control">
                <MapContainer center={[0, 0]} zoom={2} style={{ height: "400px", width: "100%" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker setLatitude={setLatitude} setLongitude={setLongitude} />
                </MapContainer>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="categories">Categorías</label>
              <div className="control">
                <div className="select">
                  <select id="categories" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">Seleccione una categoría</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="control">
                <label className="label" htmlFor="newCategory">O añadir nueva categoría</label>
                <input className="input" id="newCategory" type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="image">Imagen</label>
              <div className="control">
                <input className="input" id="image" type="file" onChange={handleImageChange} />
              </div>
            </div>
            <div className="field is-grouped is-grouped-centered">
              <div className="control">
                <button className="button is-primary" type="submit">Añadir Receta</button>
              </div>
              <div className="control">
                <button className="button is-light" type="button" onClick={() => navigate('/')}>Cancelar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddRecipe;
