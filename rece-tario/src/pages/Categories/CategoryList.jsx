import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCategories = async () => {
      let allCategories = [];
      let nextPage = '/reciperover/categories/';
      
      try {
        while (nextPage) {
          const response = await axiosInstance.get(nextPage);
          if (response.data && response.data.results) {
            allCategories = allCategories.concat(response.data.results);
            nextPage = response.data.next;  // Verifica si hay una página siguiente
          } else {
            break;
          }
        }
        setCategories(allCategories);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  const handleCategoryClick = (id) => {
    navigate(`/category/${id}/recipes`);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <div className="container">
        <h1 className="title has-text-centered">Categorías</h1>
        <div className="buttons is-centered">
          <Link to="/add-category" className="button is-primary">Añadir Categoría</Link>
        </div>
        <div className="columns is-multiline">
          {categories.length > 0 ? (
            categories.map(category => (
              <div key={category.id} className="column is-one-third">
                <div 
                  className="card has-background-link-light" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="card-content has-text-centered">
                    <p className="title is-4 has-text-link has-text-weight-bold">
                      {category.name}
                    </p>
                    <p className="subtitle is-6 has-text-link-dark">
                      Haga clic para ver recetas
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No hay categorías disponibles.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryList;
