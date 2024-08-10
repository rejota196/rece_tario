import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import RecipeDetail from './pages/RecipeDetail';
import CategoryList from './pages/Categories/CategoryList';
import AddCategory from './pages/Categories/AddCategory';
import EditCategory from './pages/Categories/EditCategory';
import CommentList from './pages/Comments/CommentList';
import AddComment from './pages/Comments/AddComment';
import EditComment from './pages/Comments/EditComment';
import AddIngredients from './pages/Ingredients/AddIngredients';
import EditIngredients from './pages/Ingredients/EditIngredients';
import IngredientList from './pages/Ingredients/IngredientList';
import RecipeList from './pages/RecipeList';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import RatingsList from './pages/ratings/RatingsList';
import AddRating from './pages/ratings/AddRating';
import EditRating from './pages/ratings/EditRating';
import DeleteRating from './pages/ratings/DeleteRating';
import RatingDetail from './pages/ratings/RatingDetail';
import AddRecipeRating from './pages/ratings/AddRecipeRating';
import RecipeListForRating from './pages/ratings/RecipeListForRating';
import RecipeIngredients from './pages/Ingredients/RecipeIngredients';
import LocationList from './pages/Locations/LocationList'; 
import NestedIngredientsList from './pages/Nested/Ingredients/NestedIngredientsList'
import Step from './pages/Steps/AddSteps'
import AddStep from './pages/Steps/AddSteps';

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
            <Route path="/add-rating" element={<ProtectedRoute element={<AddRating />} />} />
            <Route path="/ratings/edit/:id" element={<ProtectedRoute element={<EditRating />} />} />
            <Route path="/ratings/delete/:id" element={<ProtectedRoute element={<DeleteRating />} />} />
            <Route path="/category/:id/recipes" element={<RecipeList />} />
            <Route path="/ratings/:id" element={<ProtectedRoute element={<RatingDetail />} />} />
            <Route path="/recipe/:id/add-rating" element={<ProtectedRoute element={<AddRecipeRating />} />} />
            <Route path="/recipes/for-rating" element={<ProtectedRoute element={<RecipeListForRating />} />} />
            <Route path="/recipe/:id/ingredients" element={<ProtectedRoute element={<RecipeIngredients />} />} />
            <Route path="/locations" element={<ProtectedRoute element={<LocationList />} />} />
            <Route path="/nested-ingredients-list" element={<ProtectedRoute element={<NestedIngredientsList />} />} />
            <Route path="/steps" element={<ProtectedRoute element={<AddStep/>} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
