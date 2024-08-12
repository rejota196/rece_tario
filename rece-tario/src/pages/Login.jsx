import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logologin.png'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { actions: { login } } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/api-auth/', { username, password });
      const data = response.data;

      const user = {
        id: data.user_id,
        username: username,
      };

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(user));

      login(data.token, user);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="columns is-centered is-vcentered min-vh-100" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="column is-narrow">
        <div className="columns is-gapless is-vcentered">
          <div className="column is-narrow">
            <figure className="image" style={{ width: '350px', height: '350px', display: 'flex', alignItems: 'flex', justifyContent: 'center' }}>
              <img src={logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </figure>
          </div>
          <div className="column">
            <div className="box" style={{ marginLeft: '20px' }}>
              <h2 className="title has-text-centered">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label" htmlFor="username">Username</label>
                  <div className="control">
                    <input className="input" id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </div>
                </div>
                <div className="field">
                  <label className="label" htmlFor="password">Password</label>
                  <div className="control">
                    <input className="input" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <button className="button is-primary is-fullwidth" type="submit" disabled={isLoading}>Login</button>
                  </div>
                </div>
                {isError && <p className="has-text-danger has-text-centered">Error al iniciar sesión. Por favor, revisa tus credenciales.</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
