import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import AddRecipe from './pages/AddRecipe';
import AddCategory from './pages/Categories/AddCategory';
import CategoryList from './pages/Categories/CategoryList';
import EditCategory from './pages/Categories/EditCategory';
import AddComment from './pages/Comments/AddComment';
import CommentList from './pages/Comments/CommentList';
import EditComment from './pages/Comments/EditComment';
import EditRecipe from './pages/EditRecipe';
import Home from './pages/Home';
import AddIngredients from './pages/Ingredients/AddIngredients';
import EditIngredients from './pages/Ingredients/EditIngredients';
import IngredientList from './pages/Ingredients/IngredientList';
//import RecipeIngredients from './pages/Ingredients/RecipeIngredients';
import Layout from './pages/Layout';
import LocationList from './pages/Locations/LocationList';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import AddRating from './pages/ratings/AddRating';
import AddRecipeRating from './pages/ratings/AddRecipeRating';
import DeleteRating from './pages/ratings/DeleteRating';
import EditRating from './pages/ratings/EditRating';
import RatingDetail from './pages/ratings/RatingDetail';
import RatingsList from './pages/ratings/RatingsList';
import RecipeListForRating from './pages/ratings/RecipeListForRating';
import RecipeDetail from './pages/RecipeDetail';
import RecipeList from './pages/RecipeList';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/add-recipe" element={<ProtectedRoute element={<AddRecipe />} />} />
          <Route path="/edit-recipe/:id" element={<ProtectedRoute element={<EditRecipe />} />} />
          <Route path="/recipe/:id" element={<ProtectedRoute element={<RecipeDetail />} />} />
          <Route path="/categories" element={<ProtectedRoute element={<CategoryList />} />} />
          <Route path="/add-category" element={<ProtectedRoute element={<AddCategory />} />} />
          <Route path="/edit-category/:id" element={<ProtectedRoute element={<EditCategory />} />} />
          <Route path="/comments" element={<ProtectedRoute element={<CommentList />} />} />
          <Route path="/add-comment" element={<ProtectedRoute element={<AddComment />} />} />
          <Route path="/edit-comment/:id" element={<ProtectedRoute element={<EditComment />} />} />
          <Route path="/ingredients" element={<ProtectedRoute element={<IngredientList />} />} />
          <Route path="/add-ingredients" element={<ProtectedRoute element={<AddIngredients />} />} />
          <Route path="/edit-ingredients/:id" element={<ProtectedRoute element={<EditIngredients />} />} />
          <Route path="/recipes" element={<ProtectedRoute element={<RecipeList />} />} />
          <Route path="/ratings" element={<ProtectedRoute element={<RatingsList />} />} />
          <Route path="/ratings/add" element={<ProtectedRoute element={<AddRating />} />} />
          <Route path="/ratings/edit/:id" element={<ProtectedRoute element={<EditRating />} />} />
          <Route path="/ratings/delete/:id" element={<ProtectedRoute element={<DeleteRating />} />} />
          <Route path="/ratings/:id" element={<ProtectedRoute element={<RatingDetail />} />} />
          <Route path="/recipe/:id/add-rating" element={<ProtectedRoute element={<AddRecipeRating />} />} />
          <Route path="/recipes/for-rating" element={<ProtectedRoute element={<RecipeListForRating />} />} />
          
          <Route path="/locations" element={<ProtectedRoute element={<LocationList />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
      </AuthProvider>
    </Router>
  );
};

export default App;