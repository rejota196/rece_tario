import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const AddRecipeIngredient = () => {
  const [recipe, setRecipe] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [measure, setMeasure] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/reciperover/recipe-ingredients/', { recipe, ingredient, quantity, measure });
      navigate('/recipe-ingredients');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Agregar Ingrediente a Receta</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="recipe">Receta</label>
            <div className="control">
              <input className="input" id="recipe" type="text" value={recipe} onChange={(e) => setRecipe(e.target.value)} required />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="ingredient">Ingrediente</label>
            <div className="control">
              <input className="input" id="ingredient" type="text" value={ingredient} onChange={(e) => setIngredient(e.target.value)} required />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="quantity">Cantidad</label>
            <div className="control">
              <input className="input" id="quantity" type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="measure">Medida</label>
            <div className="control">
              <input className="input" id="measure" type="text" value={measure} onChange={(e) => setMeasure(e.target.value)} required />
            </div>
          </div>
          <div className="control">
            <button className="button is-primary" type="submit">Agregar Ingrediente a Receta</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddRecipeIngredient;
