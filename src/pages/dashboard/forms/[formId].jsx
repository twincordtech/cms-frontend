import React from 'react';
import { useParams } from 'react-router-dom';
import FormRenderer from '../../../components/dynamic/FormRenderer';

const FormIdPage = () => {
  const { formId } = useParams();
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <FormRenderer formId={formId} />
    </div>
  );
};

export default FormIdPage; 