import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preparationTime, setPreparationTime] = useState(0);
  const [cookingTime, setCookingTime] = useState(0);
  const [servings, setServings] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recipeData = {
      title,
      description,
      preparation_time: preparationTime,
      cooking_time: cookingTime,
      servings
    };

    try {
      const response = await axiosInstance.post('/reciperover/recipes/', recipeData);

      if (response.status !== 201) {
        const errorData = response.data;
        console.error('Datos de error:', errorData);
        throw new Error(`Failed to add recipe: ${response.statusText}`);
      }

      const data = response.data;
      console.log('Datos de respuesta:', data);

      alert('Recipe added successfully');
      setTitle('');
      setDescription('');
      setPreparationTime(0);
      setCookingTime(0);
      setServings(0);
      navigate('/');
    } catch (error) {
      console.error('Failed to add recipe:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Add Recipe</h2>
      {error && <div className="notification is-danger">Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="title">Title</label>
          <div className="control">
            <input className="input" id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="description">Description</label>
          <div className="control">
            <textarea className="textarea" id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="preparationTime">Preparation Time</label>
          <div className="control">
            <input className="input" id="preparationTime" type="number" value={preparationTime} onChange={(e) => setPreparationTime(Number(e.target.value))} required />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="cookingTime">Cooking Time</label>
          <div className="control">
            <input className="input" id="cookingTime" type="number" value={cookingTime} onChange={(e) => setCookingTime(Number(e.target.value))} required />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="servings">Servings</label>
          <div className="control">
            <input className="input" id="servings" type="number" value={servings} onChange={(e) => setServings(Number(e.target.value))} />
          </div>
        </div>
        <div className="control">
          <button className="button is-primary" type="submit">Add Recipe</button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;
