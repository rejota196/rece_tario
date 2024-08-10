import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const IngredientList = () => {
  const [ingredients, setIngredients] = useState([]);
  const [recipesMap, setRecipesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState({});
  const navigate = useNavigate();

  const fetchAllIngredients = async (page = 1, accumulatedIngredients = []) => {
    try {
      const response = await axiosInstance.get(`/reciperover/ingredients/?page=${page}`);
      const newIngredients = response.data.results || [];

      const allIngredients = accumulatedIngredients.concat(newIngredients);

      if (response.data.next) {
        // Si hay más páginas, continúa la paginación.
        return fetchAllIngredients(page + 1, allIngredients);
      } else {
        return allIngredients;
      }
    } catch (error) {
      throw new Error(`Error al cargar ingredientes: ${error.response?.data || error.message}`);
    }
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const allIngredients = await fetchAllIngredients();
        setIngredients(allIngredients);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      const newRecipesMap = {};
      try {
        for (const ingredient of ingredients) {
          for (const recipeId of ingredient.recipes) {
            if (!newRecipesMap[recipeId]) {
              const response = await axiosInstance.get(`/reciperover/recipes/${recipeId}`);
              if (response.data) {
                newRecipesMap[recipeId] = response.data.title;
              }
            }
          }
        }
        setRecipesMap(newRecipesMap);
      } catch (error) {
        setError(`Error al cargar recetas: ${error.response?.data || error.message}`);
      }
    };

    if (ingredients.length > 0) {
      fetchRecipes();
    }
  }, [ingredients]);

  const handleRecipeChange = (ingredientId, recipeId) => {
    setSelectedRecipe(prev => ({ ...prev, [ingredientId]: recipeId }));
  };

  if (loading) return <div className="notification is-info">Cargando...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Ingredientes</h1>
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Recetas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.length === 0 ? (
              <tr>
                <td colSpan="3" className="has-text-centered">No hay ingredientes disponibles.</td>
              </tr>
            ) : (
              ingredients.map(ingredient => (
                <tr key={ingredient.id}>
                  <td>{ingredient.name}</td>
                  <td>
                    <select
                      name={ingredient.name}
                      onChange={(e) => handleRecipeChange(ingredient.id, e.target.value)}
                      value={selectedRecipe[ingredient.id] || ''}
                    >
                      <option value="" disabled>
                        Selecciona una receta
                      </option>
                      {ingredient.recipes.map(recipeId => (
                        <option key={recipeId} value={recipeId}>
                          {recipesMap[recipeId] || 'Cargando...'}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="button is-small is-warning"
                      onClick={() => {
                        if (selectedRecipe[ingredient.id]) {
                          navigate(`/recipe/${selectedRecipe[ingredient.id]}`);
                        } else {
                          alert("Por favor, selecciona una receta.");
                        }
                      }}
                    >
                      Ver Receta
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

export default IngredientList;
