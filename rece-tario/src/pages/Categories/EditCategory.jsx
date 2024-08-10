import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';  

const EditCategory = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/reciperover/categories/${id}/`)
      .then(response => {
        setName(response.data.name);
      })
      .catch(error => {
        setError(error.message);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/reciperover/categories/${id}/`, { name });
      navigate('/categories');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1 className="title">Edit Category</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="name">Name</label>
            <div className="control">
              <input className="input" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <div className="control">
            <button className="button is-primary" type="submit">Update Category</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditCategory;
