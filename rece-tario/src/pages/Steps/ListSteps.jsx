import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import Layout from '../Layout';

const StepList = () => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get('/reciperover/steps/')
      .then(response => {
        setSteps(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <div className="section">
        <h1 className="title">Pasos</h1>
        <ul>
          {steps.map(step => (
            <li key={step.id}>
              <strong>Título:</strong> {step.title} <br />
              <strong>Descripción:</strong> {step.description}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default StepList;
