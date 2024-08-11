import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import Layout from './Layout';

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [image, setImage] = useState(null);
  const [measures, setMeasures] = useState([]);
  const [selectedMeasure, setSelectedMeasure] = useState('');
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [stepDescription, setStepDescription] = useState('');
  const [servings, setServing] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/reciperover/categories/');
        if (response.data && Array.isArray(response.data.results)) {
          setCategories(response.data.results);
        } else {
          setError('Error al cargar las categorías.');
        }
      } catch (error) {
        setError(`Error al cargar categorías: ${error.message}`);
      }
    };

    fetchMeasures();
    fetchCategories();
  }, []);

  const handleAddIngredient = async () => {
    if (ingredientName && ingredientQuantity && selectedMeasure) {
      try {
        // Primero creamos el ingrediente en el backend y obtenemos su ID real
        const ingredientResponse = await axiosInstance.post('/reciperover/ingredients/', {
          name: ingredientName,
        });
        const ingredientId = ingredientResponse.data.id;

        // Luego, lo agregamos a la lista de ingredientes en el frontend usando el ID real
        setIngredients(prev => [
          ...prev,
          { id: ingredientId, name: ingredientName, quantity: ingredientQuantity, measure: selectedMeasure },
        ]);

        setIngredientName('');
        setIngredientQuantity('');
        setSelectedMeasure('');
      } catch (error) {
        console.error('Error al agregar ingrediente:', error.response?.data || error.message);
        alert(`Error al agregar ingrediente: ${JSON.stringify(error.response?.data || error.message)}`);
      }
    } else {
      alert('Por favor, complete todos los campos de ingredientes.');
    }
  };

  const handleRemoveIngredient = (id) => {
    setIngredients(prev => prev.filter(ingredient => ingredient.id !== id));
  };

  const handleAddStep = () => {
    if (stepDescription) {
      setSteps(prev => [...prev, { id: Date.now(), instruction: stepDescription }]);
      setStepDescription('');
    } else {
      alert('Por favor, escriba un paso para la receta.');
    }
  };

  const handleRemoveStep = (id) => {
    setSteps(prev => prev.filter(step => step.id !== id));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !preparationTime || !cookingTime || !selectedCategory) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    try {
      const recipeData = new FormData();
      recipeData.append('title', title);
      recipeData.append('description', description);
      recipeData.append('preparation_time', preparationTime);
      recipeData.append('cooking_time', cookingTime);
      recipeData.append('servings', servings);
      recipeData.append('category', selectedCategory);

      if (image) {
        recipeData.append('image', image);
      }

      const recipeResponse = await axiosInstance.post('/reciperover/recipes/', recipeData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (recipeResponse.status !== 201) {
        throw new Error(`Failed to add recipe: ${recipeResponse.statusText}`);
      }

      const recipeId = recipeResponse.data.id;

      // Asociar los ingredientes con el ID de la receta
      for (const ingredient of ingredients) {
        await axiosInstance.post(`/reciperover/recipes/${recipeId}/ingredients/`, {
          quantity: ingredient.quantity,
          measure: ingredient.measure,
          ingredient: ingredient.id,
        });
      }

      // Asociar los pasos con el ID de la receta
      for (const [index, step] of steps.entries()) {
        await axiosInstance.post('/reciperover/steps/', {
          instruction: step.instruction,
          order: index + 1,
          recipe: recipeId,
        });
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
              <label className="label" htmlFor="title">Nombre de la Receta</label>
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
                  required
                ></textarea>
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="preparationTime">Tiempo de Preparación (en minutos)</label>
              <div className="control">
                <input
                  className="input"
                  id="preparationTime"
                  type="number"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="cookingTime">Tiempo de Cocción (en minutos)</label>
              <div className="control">
                <input
                  className="input"
                  id="cookingTime"
                  type="number"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="servings">Porciones (en cantidad)</label>
              <div className="control">
                <input
                  className="input"
                  id="servings"
                  type="number"
                  value={servings}
                  onChange={(e) => setServing(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="category">Categoría</label>
              <div className="control">
                <div className="select">
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <h3 className="title is-4">Agregar Ingrediente</h3>
              <div className="field is-grouped">
                <div className="control is-expanded">
                  <input
                    className="input"
                    id="ingredientName"
                    type="text"
                    placeholder="Nombre del ingrediente"
                    value={ingredientName}
                    onChange={(e) => setIngredientName(e.target.value)}
                  />
                </div>
                <div className="control">
                  <input
                    className="input"
                    id="ingredientAmount"
                    type="text"
                    placeholder="Cantidad"
                    value={ingredientQuantity}
                    onChange={(e) => setIngredientQuantity(e.target.value)}
                  />
                </div>
                <div className="control">
                  <div className="select">
                    <select
                      id="ingredientMeasure"
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
                <div className="control">
                  <button type="button" className="button is-primary" onClick={handleAddIngredient}>
                    Agregar
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table className="table is-fullwidth is-striped">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Cantidad</th>
                      <th>Medida</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ingredient) => (
                      <tr key={ingredient.id}>
                        <td>{ingredient.name}</td>
                        <td>{ingredient.quantity}</td>
                        <td>{ingredient.measure}</td>
                        <td>
                          <button
                            className="button is-danger is-small"
                            onClick={() => handleRemoveIngredient(ingredient.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="field">
              <h3 className="title is-4">Agregar Paso</h3>
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input
                    className="input"
                    id="stepDescription"
                    type="text"
                    placeholder="Descripción del paso"
                    value={stepDescription}
                    onChange={(e) => setStepDescription(e.target.value)}
                  />
                </div>
                <div className="control">
                  <button type="button" className="button is-primary" onClick={handleAddStep}>
                    Agregar
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table className="table is-fullwidth is-striped">
                  <thead>
                    <tr>
                      <th>Orden</th>
                      <th>Descripción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {steps.map((step, index) => (
                      <tr key={step.id}>
                        <td>{index + 1}</td>
                        <td>{step.instruction}</td>
                        <td>
                          <button
                            className="button is-danger is-small"
                            onClick={() => handleRemoveStep(step.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
