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
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setError('Error al cargar los datos.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchIngredients = async () => {
      const newIngredientsMap = {};
      try {
        for (const ingredientId of recipe.ingredients) {
          console.log(ingredientId)
          const response = await axios.get(`https://sandbox.academiadevelopers.com/reciperover/ingredients/${ingredientId}/`);
          if (response.data) {
            newIngredientsMap[response.data.id] = response.data.name;
          }
          
        }
        setIngredients(newIngredientsMap);
      } catch (error) {
        setError(error.message);
      }
    };

    if (recipe && recipe.ingredients) {
      fetchIngredients();
    }
  }, [recipe]);

  const handleCommentAdded = (newComment) => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      comments: prevRecipe.comments ? [...prevRecipe.comments, newComment] : [newComment],
    }));
  };

  if (loading) return <div className="notification is-info">Cargando...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;
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
                      {recipe.ingredients.map(ingredientId => (
                        <li key={ingredientId}>{ingredients[ingredientId] || 'Cargando...'}</li>
                      ))}
                    </ul>
                    <h2 className="title is-5">Comentarios</h2>
                    {recipe && recipe.id ? (
                      <AddComment recipeId={recipe.id} onCommentAdded={handleCommentAdded} />
                    ) : (
                      <div>Cargando comentarios...</div>
                    )}
                    <CommentsRecipeId recipeId={recipe.id} />
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
