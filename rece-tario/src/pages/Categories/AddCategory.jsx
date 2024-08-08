import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';  

const AddCategory = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/reciperover/categories/', { name });
      navigate('/categories');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1 className="title">Add Category</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="name">Name</label>
            <div className="control">
              <input className="input" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <div className="control">
            <button className="button is-primary" type="submit">Add Category</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddCategory;
