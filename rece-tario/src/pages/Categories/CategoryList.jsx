import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout'; 

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useNavigate();

  useEffect(() => {
    axiosInstance.get('/reciperover/categories/')
      .then(response => {
        setCategories(response.data.results);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDeleteCategory = async (id) => {
    try {
      await axiosInstance.delete(`/reciperover/categories/${id}/`);
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <div className="container">
        <h1 className="title">Categories</h1>
        <Link to="/add-category" className="button is-primary">Add Category</Link>
        <div className="columns is-multiline">
          {categories.map(category => (
            <div key={category.id} className="column is-one-third">
              <div className="card">
                <div className="card-content">
                  <p className="title">{category.name}</p>
                  <div className="buttons">
                    <Link className="button is-info" to={`/edit-category/${category.id}`}>Edit</Link>
                    <button className="button is-danger" onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryList;
