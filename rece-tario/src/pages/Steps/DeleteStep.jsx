import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const DeleteStep = () => {
  const { id } = useParams();
  const [step, setStep] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/reciperover/steps/${id}/`)
      .then(response => {
        setStep(response.data);
      })
      .catch(error => {
        setError(error.message);
      });
  }, [id]);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/reciperover/steps/${id}/`);
      navigate('/steps');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Eliminar Paso</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <div className="content">
          {step ? (
            <>
              <p>¿Estás seguro de que quieres eliminar este paso?</p>
              <div>
                <strong>Título:</strong> {step.title}
              </div>
              <div>
                <strong>Descripción:</strong> {step.description}
              </div>
            </>
          ) : (
            <p>Cargando...</p>
          )}
        </div>
        <div className="control">
          <button className="button is-danger" onClick={handleDelete}>Eliminar</button>
        </div>
      </div>
    </Layout>
  );
};

export default DeleteStep;
