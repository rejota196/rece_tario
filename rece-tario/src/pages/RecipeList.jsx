import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import defaultImage from '../assets/sin-foto.png';
import Layout from './Layout';

const RecipeList = () => {
  const { id } = useParams();  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRecipes(currentPage);
  }, [currentPage, id]);

  const fetchRecipes = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://sandbox.academiadevelopers.com/reciperover/recipes/?category_id=${id}&ordering=-created_at&page=${page}`);
      if (response.data && Array.isArray(response.data.results)) {
        setRecipes(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10)); 
      } else {
        setError('Unexpected response format');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="notification is-info">Cargando...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;

  return (
    <Layout>
      <div className="section">
        <h1 className="title has-text-centered">Recetas</h1>
        {recipes.length === 0 ? (
          <p className="has-text-centered">No hay recetas disponibles en esta categoría.</p>
        ) : (
          <div className="columns is-multiline">
            {recipes.map(recipe => (
              <div key={recipe.id} className="column is-one-third">
                <div className="card">
                  <div className="card-image">
                    <figure className="image is-4by3">
                      <img src={recipe.image || defaultImage} alt={recipe.title} />
                    </figure>
                  </div>
                  <div className="card-content">
                    <p className="title is-4">{recipe.title}</p>
                    <div className="buttons">
                      <Link className="button is-info" to={`/recipe/${recipe.id}`}>Ver Detalles</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <nav className="pagination is-centered" role="navigation" aria-label="pagination">
          <ul className="pagination-list">
            {[...Array(totalPages).keys()].map(page => (
              <li key={page}>
                <button
                  className={`pagination-link ${page + 1 === currentPage ? 'is-current' : ''}`}
                  onClick={() => handlePageChange(page + 1)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Layout>
  );
};

export default RecipeList;
