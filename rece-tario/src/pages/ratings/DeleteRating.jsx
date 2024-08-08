import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const DeleteRating = () => {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const deleteRating = async () => {
      try {
        await axiosInstance.delete(`/reciperover/ratings/${id}/`);
        navigate('/ratings');
      } catch (error) {
        setError(error.message);
      }
    };

    deleteRating();
  }, [id, navigate]);

  return (
    <Layout>
      <div className="section">
        <h1 className="title has-text-centered">Eliminar Valoración</h1>
        {error && <div className="notification is-danger">{error}</div>}
        {!error && <div className="notification is-info">Eliminando valoración...</div>}
      </div>
    </Layout>
  );
};

export default DeleteRating;
