import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import RecipeDetail from './pages/RecipeDetail';
import RecipeList from './pages/RecipeList';
import RecipeListByCategory from './pages/Categories/RecipeListByCategory'; 
import AddRecipeRating from './pages/ratings/AddRecipeRating';
import RecipeListForRating from './pages/ratings/RecipeListForRating';
import RecipeIngredients from './pages/Ingredients/RecipeIngredients';
import CategoryList from './pages/Categories/CategoryList';
import AddCategory from './pages/Categories/AddCategory';
import EditCategory from './pages/Categories/EditCategory';
import CommentList from './pages/Comments/CommentList';
import AddComment from './pages/Comments/AddComment';
import EditComment from './pages/Comments/EditComment';
import DeleteComment from './pages/Comments/DeleteComment'; // Importa DeleteComment
import CommentsRecipeId from './pages/Comments/CommentsRecipeId'; 
import IngredientList from './pages/Ingredients/IngredientList';
import AddIngredients from './pages/Ingredients/AddIngredients';
import EditIngredients from './pages/Ingredients/EditIngredients';
import RatingsList from './pages/ratings/RatingsList';
import AddRating from './pages/ratings/AddRating';
import EditRating from './pages/ratings/EditRating';
import DeleteRating from './pages/ratings/DeleteRating';
import RatingDetail from './pages/ratings/RatingDetail';
import LocationList from './pages/Locations/LocationList'; 
import NestedIngredientsList from './pages/Nested/Ingredients/NestedIngredientsList';
import AddStep from './pages/Steps/AddSteps';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProviderWrapper from './contexts/AuthProviderWrapper'; 

const App = () => {
  return (
    <Router>
      <AuthProviderWrapper>
        <Routes>

          {/* Autenticación */}
          <Route path="/login" element={<Login />} />
          
          {/* Inicio */}
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          
          {/* Recetas */}
          <Route path="/add-recipe" element={<ProtectedRoute element={<AddRecipe />} />} />
          <Route path="/edit-recipe/:id" element={<ProtectedRoute element={<EditRecipe />} />} />
          <Route path="/recipe/:id" element={<ProtectedRoute element={<RecipeDetail />} />} />
          <Route path="/recipes" element={<ProtectedRoute element={<RecipeList />} />} />
          <Route path="/recipe/:id/ingredients" element={<ProtectedRoute element={<RecipeIngredients />} />} />
          <Route path="/recipe/:id/add-rating" element={<ProtectedRoute element={<AddRecipeRating />} />} />
          <Route path="/recipes/for-rating" element={<ProtectedRoute element={<RecipeListForRating />} />} />
          <Route path="/recipe/:id/comments" element={<ProtectedRoute element={<CommentsRecipeId />} />} />
          
          {/* Categorías */}
          <Route path="/categories" element={<ProtectedRoute element={<CategoryList />} />} />
          <Route path="/add-category" element={<ProtectedRoute element={<AddCategory />} />} />
          <Route path="/edit-category/:id" element={<ProtectedRoute element={<EditCategory />} />} />
          <Route path="/category/:id/recipes" element={<ProtectedRoute element={<RecipeListByCategory />} />} />

          {/* Comentarios */}
          <Route path="/comments" element={<ProtectedRoute element={<CommentList />} />} />
          <Route path="/add-comment" element={<ProtectedRoute element={<AddComment />} />} />
          <Route path="/edit-comment/:id" element={<ProtectedRoute element={<EditComment />} />} />
          <Route path="/delete-comment/:id" element={<ProtectedRoute element={<DeleteComment />} />} /> {/* Ruta para eliminar comentario */}
          
          {/* Ingredientes */}
          <Route path="/ingredients" element={<ProtectedRoute element={<IngredientList />} />} />
          <Route path="/add-ingredients" element={<ProtectedRoute element={<AddIngredients />} />} />
          <Route path="/edit-ingredients/:id" element={<ProtectedRoute element={<EditIngredients />} />} />
          <Route path="/nested-ingredients-list" element={<ProtectedRoute element={<NestedIngredientsList />} />} />

          {/* Calificaciones */}
          <Route path="/ratings" element={<ProtectedRoute element={<RatingsList />} />} />
          <Route path="/add-rating" element={<ProtectedRoute element={<AddRating />} />} />
          <Route path="/ratings/edit/:id" element={<ProtectedRoute element={<EditRating />} />} />
          <Route path="/ratings/delete/:id" element={<ProtectedRoute element={<DeleteRating />} />} />
          <Route path="/ratings/:id" element={<ProtectedRoute element={<RatingDetail />} />} />

          {/* Ubicaciones */}
          <Route path="/locations" element={<ProtectedRoute element={<LocationList />} />} />

          {/* Pasos */}
          <Route path="/steps" element={<ProtectedRoute element={<AddStep />} />} />

          {/* Página no encontrada */}
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </AuthProviderWrapper>
    </Router>
  );
};

export default App;
