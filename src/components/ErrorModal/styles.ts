import styled, { keyframes } from 'styled-components';

const initial = keyframes`
from {
  border: 2px solid #ff0033;
  border-radius: 2px;
  background-color: #ff003360;
}
to {
  border: none;
  border-radius: none;
  background-color: none;
}
`;

export const Container = styled.div`
  animation: ${initial} 2s ease;

  max-width: 20rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
  margin: 1rem 0;

  svg {
    display: flex;
    flex: 1;
    width: 2rem;
    color: #ff0033;
  }

  span {
    display: flex;
    font-size: 2rem;
    flex: 10;
  }
`;
