import styled, { keyframes } from 'styled-components';

const appearFromBottom = keyframes`
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }

`;

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 2rem;
`;

export const AnimationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  animation: ${appearFromBottom} 0.5s;

  form {
    display: flex;
    justify-content: center;
    flex-direction: column;

    .input-box {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      background: var(--light-background);
      max-width: 20rem;
      padding: 0 0.5rem;

      input {
        flex: 1;
        appearance: textfield;
      }
    }

    .time-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      input {
        width: 2rem;
        margin: 0 0.4rem;
        appearance: textfield;
      }
    }
  }

  input {
    background: var(--light-background);
    height: 2rem;
    width: 20rem;
    padding: 0;
    color: var(--text);
    text-align: center;
  }

  button[type='submit'] {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--purple);
    height: 2rem;
    width: 20rem;
    border: 2px solid var(--purple);
    color: var(--button-text);

    & svg {
      margin-right: 0.5rem;
    }
  }

  .video-container {
    max-width: 60rem;
    margin-top: 2rem;
  }
`;
