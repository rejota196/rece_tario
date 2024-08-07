import { createContext, useReducer, useContext, useMemo } from 'react';
import PropTypes from 'prop-types'; 
import { useLocation, useNavigate } from 'react-router-dom';

const AuthContext = createContext({
  state: {},
  actions: {},
});

const ACTIONS = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
      };
    case ACTIONS.LOGOUT:
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    user: localStorage.getItem("user__id"),
    token: localStorage.getItem("authToken"),
    isAuthenticated: !!localStorage.getItem("authToken"),
  });
  const navigate = useNavigate();
  const location = useLocation();

  const actions = useMemo(() => ({
    login: (token, user) => {
      dispatch({ type: ACTIONS.LOGIN, payload: { token, user } });
      localStorage.setItem("authToken", token);
      localStorage.setItem("user__id", user);
      const origin = location.state?.from?.pathname || "/";
      navigate(origin);
    },
    logout: () => {
      dispatch({ type: ACTIONS.LOGOUT });
      localStorage.removeItem("authToken");
      localStorage.removeItem("user__id");
      navigate('/');
    },
  }), [navigate, location]);

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse con AuthProvider alGueis beibi");
  }
  return context;
}

export { AuthContext, AuthProvider, useAuth };
