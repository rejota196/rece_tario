import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import Layout from './Layout'; 
import defaultImage from '../assets/sin-foto.png'; 
import CommentsRecipeId from './Comments/CommentsRecipeId';

const RecipeDetail = () => {
  const { id } = useParams(); 
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]); 
  const [measures, setMeasures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(null); // Para almacenar la valoración seleccionada
  const [ratingId, setRatingId] = useState(null); // Para almacenar el ID de la valoración del usuario
  const [ratingError, setRatingError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipeResponse = await axiosInstance.get(`/reciperover/recipes/${id}/`);
        const recipeData = recipeResponse.data;

        if (!recipeData.comments) {
          recipeData.comments = [];
        }
        setRecipe(recipeData);
        
        const ingredientDetails = await Promise.all(
          recipeData.ingredients.map(async (ingredientId) => {
            const ingredientResponse = await axiosInstance.get(`/reciperover/ingredients/${ingredientId}/`);
            return ingredientResponse.data;
          })
        );
        setIngredients(ingredientDetails);

        const stepsResponse = await axiosInstance.get(`/reciperover/steps/?recipe=${id}`);
        setSteps(stepsResponse.data.results); 

        const measuresResponse = await axiosInstance.get('/reciperover/measures/');
        setMeasures(measuresResponse.data);

        // Obtener el token del localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
          // Obtener la valoración del usuario actual para esta receta
          const ratingsResponse = await axiosInstance.get(`/reciperover/ratings/`, {
            params: { recipe: id },
            headers: { Authorization: `Bearer ${token}` }
          });

          if (ratingsResponse.data.results.length > 0) {
            setRating(ratingsResponse.data.results[0].rating);
            setRatingId(ratingsResponse.data.results[0].id); // Guardar el ID de la valoración
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setError('Error al cargar los datos.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRatingClick = async (value) => {
    setRating(value);
    setRatingError(null);

    const ratingData = {
      rating: value,
      recipe: parseInt(id, 10)
    };

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticación no encontrado.');
      }

      let response;
      if (ratingId) {
        // Actualizar la valoración existente
        response = await axiosInstance.patch(`/reciperover/ratings/${ratingId}/`, ratingData, {
          headers: { Authorization: `Bearer ${token}`}
        });

        if (response.status !== 200) {
          throw new Error(`Fallo al actualizar la valoración: ${response.statusText}`);
        }
      } else {
        // Crear una nueva valoración
        response = await axiosInstance.post('/reciperover/ratings/', ratingData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status !== 201) {
          throw new Error(`Fallo al agregar la valoración: ${response.statusText}`);
        }

        // Guardar el ID de la nueva valoración
        setRatingId(response.data.id);
      }

      alert('Valoración guardada con éxito');
    } catch (error) {
      console.error('Error al actualizar la valoración:', error);
      setRatingError('Error al actualizar la valoración.');
    }
  };

  if (loading) return <div className="notification is-info">Cargando...</div>;
  if (error) return <div className="notification is-danger">{error}</div>;
  if (!recipe) return <div className="notification is-warning">No se encontró la receta</div>;

  return (
    <Layout>
      <div className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src={recipe.image || defaultImage} alt={recipe.title} />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <p className="title is-4">{recipe.title}</p>
                    </div>
                  </div>
                  <div className="content">
                    <p>{recipe.description}</p>
                    <p><strong>Ingredientes:</strong></p>
                    <ul>
                      {ingredients.length > 0 ? (
                        ingredients.map((ingredient, index) => (
                          <li key={index}>
                            <strong>{ingredient.name || 'Ingrediente desconocido'}</strong>
                            {ingredient.amount && ingredient.measure ? (
                              <>: {ingredient.amount} {ingredient.measure}</>
                            ) : null}
                          </li>
                        ))
                      ) : (
                        <li>No se encontraron detalles de los ingredientes.</li>
                      )}
                    </ul>

                    <h2 className="title is-5">Pasos</h2>
                    <ol>
                      {steps.map((step) => (
                        <li key={step.id}>
                          <strong>Paso {step.order}:</strong> {step.instruction}
                        </li>
                      ))}
                    </ol>

                    <h2 className="title is-5">Comentarios</h2>
                    <CommentsRecipeId recipeId={recipe.id} />

                    <h2 className="title is-5">Añadir o Editar Valoración</h2>
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
                    {ratingError && <div className="notification is-danger">{ratingError}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecipeDetail;