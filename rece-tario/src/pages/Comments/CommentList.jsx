import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [recipesMap, setRecipesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(`/reciperover/comments/?page=${currentPage}`);
        if (response.data && Array.isArray(response.data.results)) {
          setComments(prevComments => [...prevComments, ...response.data.results]);
          setTotalPages(Math.ceil(response.data.count / response.data.results.length));
        } else {
          setError('Formato de respuesta inesperado');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [currentPage]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const newRecipesMap = {};
      try {
        for (const comment of comments) {
          const recipeId = comment.recipe;
          if (recipeId && !newRecipesMap[recipeId]) {
            const response = await axiosInstance.get(`/reciperover/recipes/${recipeId}`);
            if (response.data) {
              newRecipesMap[recipeId] = response.data.title;
            }
          }
        }
        setRecipesMap(prevMap => ({ ...prevMap, ...newRecipesMap }));
      } catch (error) {
        setError(error.message);
      }
    };

    if (comments.length > 0) {
      fetchRecipes();
    }
  }, [comments]);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  if (loading && currentPage === 1) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Comentarios</h1>
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Comentario</th>
              <th>Receta</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment, index) => (
              <tr key={`${comment.id}-${index}-${currentPage}`}>
                <td>{comment.content}</td>
                <td>{recipesMap[comment.recipe] || 'Cargando...'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {currentPage < totalPages && (
          <div className="has-text-centered">
            <button className="button is-link" onClick={handleLoadMore}>
              Cargar más
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CommentList;
