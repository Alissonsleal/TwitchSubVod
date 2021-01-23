import React from 'react';
import { FiLoader } from 'react-icons/fi';

import { Container } from './styles';

const LoadingModal: React.FC = () => {
  return (
    <Container>
      <FiLoader size={32} />
    </Container>
  );
};

export default LoadingModal;
