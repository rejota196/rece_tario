import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';
import noRecipesImage from '../../assets/404.png';  // Importa la imagen 404.png

const RecipeListByCategory = () => {
  const { id } = useParams();  // Obtiene el ID de la categoría desde la URL
  const [category, setCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        // Obtén los detalles de la categoría
        const categoryResponse = await axiosInstance.get(`/reciperover/categories/${id}/`);
        setCategory(categoryResponse.data);

        if (categoryResponse.data.recipes && categoryResponse.data.recipes.length > 0) {
          const fetchedRecipes = [];

          // Para cada ID de receta en la categoría, obtén los detalles de la receta
          for (const recipeId of categoryResponse.data.recipes) {
            const recipeResponse = await axiosInstance.get(`/reciperover/recipes/${recipeId}`);
            if (recipeResponse.data) {
              fetchedRecipes.push(recipeResponse.data);
            }
          }

          setRecipes(fetchedRecipes);
        } else {
          // Si no hay recetas, no se establece un error, sino que simplemente dejamos el array de recetas vacío
          setRecipes([]);
        }
      } catch (error) {
        setError('Hubo un problema al obtener los detalles de la categoría.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [id]); // Asegúrate de que `id` está incluido en las dependencias del useEffect

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <div className="container">
        <h1 className="title has-text-centered">Recetas en la Categoría {category?.name}</h1>
        {recipes.length > 0 ? (
          <div className="columns is-multiline">
            {recipes.map((recipe, index) => (
              <div key={`${recipe.id}-${index}`} className="column is-one-third">
                <div className="card">
                  <div className="card-image">
                    <figure className="image is-4by3">
                      <img src={recipe.image} alt={recipe.title} />
                    </figure>
                  </div>
                  <div className="card-content">
                    <p className="title is-4">{recipe.title}</p>
                    <Link className="button is-link" to={`/recipe/${recipe.id}`}>
                      Ver Receta
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="has-text-centered" style={{ marginTop: '50px' }}>
            <img src={noRecipesImage} alt="No hay recetas" style={{ maxWidth: '300px' }} />
            <h2 className="title is-1" style={{ marginTop: '20px', color: '#ff6b6b' }}>NO HAY RECETAS PARA ESTA CATEGORÍA</h2>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RecipeListByCategory;
