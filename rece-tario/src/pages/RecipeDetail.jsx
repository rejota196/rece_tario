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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`https://sandbox.academiadevelopers.com/reciperover/recipes/${id}/`)
      .then(response => {
        const recipeData = response.data;
        if (!recipeData.comments) {
            recipeData.comments = [];
        }
        setRecipe(recipeData);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

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
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient.name}: {ingredient.amount}</li>
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
