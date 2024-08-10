import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Layout from './Layout'; 
import defaultImage from '../assets/sin-foto.png'; 
import AddComment from './Comments/AddComment';
import CommentsRecipeId from './Comments/CommentsRecipeId';

const RecipeDetail = () => {
  const { id } = useParams(); 
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentAdded, setCommentAdded] = useState(0);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipeResponse = await axios.get(`https://sandbox.academiadevelopers.com/reciperover/recipes/${id}/`);
        const recipeData = recipeResponse.data;

        if (!recipeData.comments) {
          recipeData.comments = [];
        }
        setRecipe(recipeData);
        
        // Obtener los detalles de los ingredientes basados en los IDs
        const ingredientDetails = await Promise.all(
          recipeData.ingredients.map(async (ingredientId) => {
            const ingredientResponse = await axios.get(`https://sandbox.academiadevelopers.com/reciperover/ingredients/${ingredientId}/`);
            return ingredientResponse.data;
          })
        );
        setIngredients(ingredientDetails);

        // Obtener las medidas disponibles
        const measuresResponse = await axios.get('https://sandbox.academiadevelopers.com/reciperover/measures/');
        setMeasures(measuresResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setError('Error al cargar los datos.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCommentAdded = (newComment) => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      comments: [...(prevRecipe.comments || []), newComment],
    }));
    setCommentAdded(prev => prev + 1);  
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

                    <h2 className="title is-5">Comentarios</h2>

                    <CommentsRecipeId key={commentAdded} recipeId={recipe.id} />
                    <AddComment recipeId={recipe.id} onCommentAdded={handleCommentAdded} />
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
