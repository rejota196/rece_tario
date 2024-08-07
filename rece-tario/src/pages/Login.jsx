import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { actions: { login } } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/api-auth/', { username, password });
      const data = response.data;
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user__id', data.user_id);
      login(data.token, data.user_id);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Login</h2>
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
        <div className="control">
          <button className="button is-primary" type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
