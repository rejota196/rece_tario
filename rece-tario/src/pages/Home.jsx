import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://sandbox.academiadevelopers.com/reciperover/recipes/')
      .then(response => {
        if (response.data && Array.isArray(response.data.results)) {
          setRecipes(response.data.results);
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

  const handleAddRecipe = () => {
    navigate('/add-recipe');
  };

  const handleDeleteRecipe = (id) => {
    axios.delete(`https://sandbox.academiadevelopers.com/reciperover/recipes/${id}/`)
      .then(() => {
        setRecipes(recipes.filter(recipe => recipe.id !== id));
      })
      .catch(error => {
        console.error('Hubo un error al eliminar la receta!', error);
      });
  };

  if (loading) return <div className="notification is-info">Cargando...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;

  return (
    <div className="section">
      <div className="container">
        <h1 className="title has-text-centered">Bienvenido a Recipe Rover</h1>
        <h2 className="subtitle has-text-centered">Descubre y comparte recetas increíbles</h2>
        <div className="buttons is-centered">
          <button className="button is-primary" onClick={handleAddRecipe}>Agregar Receta</button>
        </div>
        <h2 className="title is-4 has-text-centered">Recetas Populares</h2>
        <div className="columns is-multiline">
          {recipes.map(recipe => (
            <div key={recipe.id} className="column is-one-third">
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src={recipe.image} alt={recipe.title} />
                  </figure>
                </div>
                <div className="card-content">
                  <p className="title is-4">{recipe.title}</p>
                  <div className="buttons">
                    <Link className="button is-info" to={`/recipe/${recipe.id}`}>Ver Detalles</Link>
                    <button className="button is-warning" onClick={() => navigate(`/edit-recipe/${recipe.id}`)}>Editar</button>
                    <button className="button is-danger" onClick={() => handleDeleteRecipe(recipe.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
