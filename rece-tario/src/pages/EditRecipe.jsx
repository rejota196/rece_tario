import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditRecipe = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await axios.get(`https://sandbox.academiadevelopers.com/reciperover/recipes/${id}/`);
      setTitle(response.data.title);
      setDescription(response.data.description);
    };
    fetchRecipe();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.put(`https://sandbox.academiadevelopers.com/reciperover/recipes/${id}/`, 
      { title, description }, 
      { headers: { Authorization: `Bearer ${token}` } });
      alert('Recipe updated successfully');
      navigate('/');
    } catch (error) {
      console.error('Failed to update recipe:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Editar Receta</h2>
      {error && <div className="notification is-danger">Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Titulo</label>
          <div className="control">
            <input className="input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
        </div>
        <div className="field">
          <label className="label">Descripcion</label>
          <div className="control">
            <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          </div>
        </div>
        <div className="control">
          <button className="button is-primary" type="submit">Actualizar Receta</button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe;
