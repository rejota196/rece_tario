import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const RatingDetail = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/reciperover/ratings/${id}/`)
      .then(response => {
        setRating(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="notification is-info">Cargando...</div>;
  if (error) return <div className="notification is-danger">Error: {error}</div>;

  return (
    <Layout>
      <div className="section">
        <h1 className="title has-text-centered">Detalle de Valoración</h1>
        {rating && (
          <div className="card">
            <div className="card-content">
              <p className="title is-4">Comentario: {rating.comment}</p>
              <p className="subtitle is-6">Valoración: {rating.rating}</p>
              <p className="subtitle is-6">Receta: {rating.recipe}</p>
              <p className="subtitle is-6">Autor: {rating.author}</p>
              <p className="subtitle is-6">Creado en: {rating.created_at}</p>
              <p className="subtitle is-6">Actualizado en: {rating.updated_at}</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RatingDetail;
