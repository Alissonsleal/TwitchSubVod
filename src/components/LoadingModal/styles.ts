import styled, { keyframes } from 'styled-components';

export const spin = keyframes`
  100% {
    transform: rotate(360deg)
  }
`;

export const Container = styled.span`
  padding: 1rem;
  svg {
    animation: ${spin} 4s linear infinite;
  }
`;
