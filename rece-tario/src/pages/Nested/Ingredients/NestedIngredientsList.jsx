import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosConfig";
import Layout from "../../Layout";

const NestedIngredientsList = () => {
  const [ingredients, setIngredients] = useState([]);
  const [recipesMap, setRecipesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState({}); // Estado para manejar la receta seleccionada
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/reciperover/ingredients/')
      .then(response => {
        if (response.data && Array.isArray(response.data.results)) {
          setIngredients(response.data.results);
        } else {
          setError('Formato de respuesta inesperado');
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      const newRecipesMap = {};
      try {
        for (const ingredient of ingredients) {
          for (const recipeId of ingredient.recipes) {
            const response = await axiosInstance.get(`/reciperover/recipes/${recipeId}`);
            if (response.data) {
              newRecipesMap[recipeId] = response.data.title;
            }
          }
        }
        setRecipesMap(newRecipesMap);
      } catch (error) {
        setError(error.message);
      }
    };

    if (ingredients.length > 0) {
      fetchRecipes();
    }
  }, [ingredients]);

  const handleRecipeChange = (ingredientId, recipeId) => {
    setSelectedRecipe(prev => ({ ...prev, [ingredientId]: recipeId }));
  };

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Ingredientes</h1>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Recetas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="has-text-centered">Cargando...</td>
              </tr>
            ) : ingredients.length === 0 ? (
              <tr>
                <td colSpan="5" className="has-text-centered">No hay ingredientes disponibles</td>
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
                      Ver
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

export default NestedIngredientsList;
