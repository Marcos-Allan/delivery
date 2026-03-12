import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// --- Animações ---
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); opacity: 0.3; }
  50% { transform: translateY(-8px); opacity: 1; }
`;

const pulse = keyframes`
  50% { opacity: 0.4; }
`;

// --- Estilização ---
const Container = styled.div`
  /* Ocupa 100% da tela e centraliza tudo */
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0faff; /* Fundo leve para combinar com o SVG */
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const WashingMachineSVG = styled.svg`
  width: 200px; /* Aumentei um pouco para preencher melhor a tela */
  height: 200px;

  .drum {
    /* Origem da transformação baseada no viewBox (50, 60) */
    transform-origin: 50px 60px;
    animation: ${spin} 2s linear infinite;
  }

  .bubble {
    animation: ${float} 1.5s ease-in-out infinite;
  }

  .b2 {
    animation-delay: 0.7s;
  }
`;

const LoadingText = styled.p`
  color: #282252;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 25px;
  letter-spacing: 1px;
  animation: ${pulse} 1.5s infinite;
  text-align: center;
`;

// --- Componente Principal ---
const LaundryLoader = () => {
  const [statusIndex, setStatusIndex] = useState(0);
  const statusMessages = [
    "Lavando suas roupas...",
    "Quase pronto...",
    "Enxaguando...",
    "Centrifugando..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [statusMessages.length]);

  return (
    <Container>
      <WashingMachineSVG viewBox="0 0 100 100">
        {/* Corpo da Máquina */}
        <rect 
          x="20" y="20" 
          width="60" height="70" 
          rx="5" 
          fill="white" 
          stroke="#282252" 
          strokeWidth="4"
        />
        
        {/* Painel de Controle */}
        <line x1="25" y1="30" x2="55" y2="30" stroke="#282252" strokeWidth="2" />
        <circle cx="70" cy="30" r="2" fill="#282252" />

        {/* Tambor (Centralizado no viewBox) */}
        <circle 
          className="drum" 
          cx="50" cy="60" 
          r="20" 
          fill="none" 
          stroke="#282252" 
          strokeWidth="3" 
          strokeDasharray="10 5"
        />
        
        {/* Bolhas */}
        <circle className="bubble b1" cx="42" cy="58" r="3" fill="#4A4094" />
        <circle className="bubble b2" cx="58" cy="65" r="4" fill="#4A4094" />
      </WashingMachineSVG>
      
      <LoadingText>{statusMessages[statusIndex]}</LoadingText>
    </Container>
  );
};

export default LaundryLoader;