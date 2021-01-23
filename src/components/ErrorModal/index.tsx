import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

import { Container } from './styles';

interface ErrorProps {
  message: string;
}

const ErrorModal: React.FC<ErrorProps> = ({ message }) => {
  return (
    <Container>
      <FiAlertCircle size={36} />
      {{ message } ? <span>{message}</span> : <span>Something went wrong</span>}
    </Container>
  );
};

export default ErrorModal;
