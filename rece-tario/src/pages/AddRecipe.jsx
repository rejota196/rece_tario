import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import Layout from './Layout';
import PropTypes from 'prop-types';

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [preparationTimeUnit, setPreparationTimeUnit] = useState('minutes');
  const [cookingTime, setCookingTime] = useState('');
  const [cookingTimeUnit, setCookingTimeUnit] = useState('minutes');
  const [servings, setServings] = useState(0);
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientAmount, setNewIngredientAmount] = useState('');
  const [measures, setMeasures] = useState([]);
  const [selectedMeasure, setSelectedMeasure] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar las medidas disponibles para los ingredientes y las categorías
  useEffect(() => {
    const fetchMeasuresAndCategories = async () => {
      try {
        const [measuresResponse, categoriesResponse] = await Promise.all([
          axiosInstance.get('/reciperover/measures/'),
          axiosInstance.get('/reciperover/categories/')
        ]);

        if (measuresResponse.data && Array.isArray(measuresResponse.data)) {
          setMeasures(measuresResponse.data);
        }

        if (categoriesResponse.data && Array.isArray(categoriesResponse.data.results)) {
          setCategories(categoriesResponse.data.results);
        }

      } catch (error) {
        setError(`Error al cargar datos: ${error.message}`);
      }
    };

    fetchMeasuresAndCategories();
  }, []);

  const handleAddIngredient = () => {
    if (newIngredientName.trim() && selectedMeasure && newIngredientAmount) {
      const newIngredientObj = {
        id: Date.now(),
        name: newIngredientName,
        amount: newIngredientAmount,
        measure: selectedMeasure,
      };
      setIngredients(prev => [...prev, newIngredientObj]);
      setNewIngredientName('');
      setNewIngredientAmount('');
      setSelectedMeasure('');
    }
  };

  const handleRemoveIngredient = (id) => {
    setIngredients(prev => prev.filter(ingredient => ingredient.id !== id));
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setSelectedCategory(newCategory);
      setNewCategory('');
    }
  };

  const handleLocationSearch = async () => {
    try {
      // Llamada a una API de geocodificación o autocompletado de ubicación
      const response = await axiosInstance.get(`/geocode-api/?query=${locationQuery}`);
      setLocationSuggestions(response.data || []);
    } catch (error) {
      console.error('Error al buscar ubicaciones:', error.message);
    }
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setLocationSuggestions([]);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const ingredientIds = [];
      for (const ingredient of ingredients) {
        const response = await axiosInstance.post('/reciperover/ingredients/', {
          name: ingredient.name,
          amount: ingredient.amount,
          measure: ingredient.measure,
        });
        ingredientIds.push(response.data.id);
      }

      const convertTimeToMinutes = (time, unit) => {
        switch (unit) {
          case 'hours':
            return time * 60;
          case 'days':
            return time * 60 * 24;
          default:
            return time;
        }
      };

      const recipeData = {
        title,
        description,
        preparation_time: convertTimeToMinutes(Number(preparationTime), preparationTimeUnit),
        cooking_time: convertTimeToMinutes(Number(cookingTime), cookingTimeUnit),
        servings,
        ingredients: ingredientIds,
        location_name: selectedLocation.name,
        categories: selectedCategory ? [selectedCategory] : [],
      };

      const recipeResponse = await axiosInstance.post('/reciperover/recipes/', recipeData);

      if (recipeResponse.status !== 201) {
        throw new Error(`Failed to add recipe: ${recipeResponse.statusText}`);
      }

      alert('Receta añadida con éxito');
      navigate('/');
    } catch (error) {
      console.error('Failed to add recipe:', error.response?.data || error.message);
      setError(`Failed to add recipe: ${JSON.stringify(error.response?.data || error.message)}`);
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
                <input
                  className="input"
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="description">Descripción</label>
              <div className="control">
                <textarea
                  className="textarea"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="field">
              <label className="label">Tiempo de Preparación</label>
              <div className="field has-addons">
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={preparationTime}
                    onChange={(e) => setPreparationTime(e.target.value)}
                    required
                  />
                </div>
                <div className="control">
                  <div className="select">
                    <select
                      value={preparationTimeUnit}
                      onChange={(e) => setPreparationTimeUnit(e.target.value)}
                    >
                      <option value="minutes">Minutos</option>
                      <option value="hours">Horas</option>
                      <option value="days">Días</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Tiempo de Cocción</label>
              <div className="field has-addons">
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value)}
                    required
                  />
                </div>
                <div className="control">
                  <div className="select">
                    <select
                      value={cookingTimeUnit}
                      onChange={(e) => setCookingTimeUnit(e.target.value)}
                    >
                      <option value="minutes">Minutos</option>
                      <option value="hours">Horas</option>
                      <option value="days">Días</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="servings">Porciones</label>
              <div className="control">
                <input
                  className="input"
                  id="servings"
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="ingredients">Ingredientes</label>
              <div className="control">
                <input
                  className="input mt-2"
                  type="text"
                  value={newIngredientName}
                  onChange={(e) => setNewIngredientName(e.target.value)}
                  placeholder="Añadir nuevo ingrediente"
                />
                <input
                  className="input mt-2"
                  type="text"
                  value={newIngredientAmount}
                  onChange={(e) => setNewIngredientAmount(e.target.value)}
                  placeholder="Cantidad del ingrediente"
                />
                <div className="select mt-2">
                  <select
                    id="measure"
                    value={selectedMeasure}
                    onChange={(e) => setSelectedMeasure(e.target.value)}
                    required
                  >
                    <option value="">Seleccione una medida</option>
                    {measures.map((measure) => (
                      <option key={measure.key} value={measure.key}>
                        {measure.value}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="button is-link mt-2"
                  onClick={handleAddIngredient}
                >
                  Agregar Ingrediente
                </button>
                <div className="mt-2">
                  <ul>
                    {ingredients.map((ingredient) => (
                      <li key={ingredient.id}>
                        {ingredient.name}: {ingredient.amount} {ingredient.measure}
                        <button
                          type="button"
                          className="delete"
                          onClick={() => handleRemoveIngredient(ingredient.id)}
                        ></button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="location">Ubicación</label>
              <div className="control">
                <input
                  className="input mt-2"
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Buscar ubicación"
                  onBlur={handleLocationSearch}
                />
                <ul className="mt-2">
                  {locationSuggestions.map((location, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectLocation(location)}
                      style={{ cursor: 'pointer', marginBottom: '5px' }}
                    >
                      {location.name}
                    </li>
                  ))}
                </ul>
                {selectedLocation && (
                  <p className="mt-2">Ubicación seleccionada: {selectedLocation.name}</p>
                )}
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="categories">Categorías</label>
              <div className="control">
                <div className="select">
                  <select
                    id="categories"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  className="input mt-2"
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Añadir nueva categoría"
                />
                <button
                  type="button"
                  className="button is-link mt-2"
                  onClick={handleAddCategory}
                >
                  Agregar Categoría
                </button>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="image">Imagen</label>
              <div className="control">
                <input
                  className="input"
                  id="image"
                  type="file"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="field is-grouped is-grouped-centered">
              <div className="control">
                <button className="button is-primary" type="submit">
                  Añadir Receta
                </button>
              </div>
              <div className="control">
                <button className="button is-light" type="button" onClick={() => navigate('/')}>
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddRecipe;
