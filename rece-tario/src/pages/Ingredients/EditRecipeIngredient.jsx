import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const EditRecipeIngredient = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [measure, setMeasure] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/reciperover/recipe-ingredients/${id}/`)
      .then(response => {
        setRecipe(response.data.recipe);
        setIngredient(response.data.ingredient);
        setQuantity(response.data.quantity);
        setMeasure(response.data.measure);
      })
      .catch(error => {
        setError(error.message);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/reciperover/recipe-ingredients/${id}/`, { recipe, ingredient, quantity, measure });
      navigate('/recipe-ingredients');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Edit Recipe Ingredient</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="recipe">Recipe</label>
            <div className="control">
              <input className="input" id="recipe" type="text" value={recipe} onChange={(e) => setRecipe(e.target.value)} required />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="ingredient">Ingredient</label>
            <div className="control">
              <input className="input" id="ingredient" type="text" value={ingredient} onChange={(e) => setIngredient(e.target.value)} required />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="quantity">Quantity</label>
            <div className="control">
              <input className="input" id="quantity" type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="measure">Measure</label>
            <div className="control">
              <input className="input" id="measure" type="text" value={measure} onChange={(e) => setMeasure(e.target.value)} required />
            </div>
          </div>
          <div className="control">
            <button className="button is-primary" type="submit">Update Recipe Ingredient</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditRecipeIngredient;
