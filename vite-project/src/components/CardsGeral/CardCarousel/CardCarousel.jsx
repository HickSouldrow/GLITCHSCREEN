import React, { useState, useEffect } from 'react';
import CardJogo from '../Card/Card';
import axios from 'axios';

const CardCarousel = () => {
  const [jogos, setJogos] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/jogos')
      .then(response => setJogos(response.data))
      .catch(error => console.error('Erro ao buscar os dados:', error));
  }, []);

  const animateCards = (newStartIndex, dir) => {
    setIsAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setStartIndex(newStartIndex);
      setIsAnimating(false);
    }, 300); // mesma duração da animação
  };

  const anteCards = () => {
    const newIndex = Math.max(startIndex - 5, 0);
    if (newIndex !== startIndex) {
      animateCards(newIndex, 'left');
    }
  };

  const proxCards = () => {
    const newIndex = Math.min(startIndex + 5, jogos.length - 5);
    if (newIndex !== startIndex) {
      animateCards(newIndex, 'right');
    }
  };

  const mostrarCards = jogos.slice(startIndex, startIndex + 5);

  const getAnimationClass = () => {
    if (!isAnimating) return '';
    return direction === 'right' 
      ? 'animate-slideOutLeft' 
      : 'animate-slideOutRight';
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Animações inline (ou mova para Tailwind config) */}
      <style jsx>{`
        @keyframes slideOutLeft {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideOutLeft {
          animation: slideOutLeft 0.3s forwards;
        }
        .animate-slideOutRight {
          animation: slideOutRight 0.3s forwards;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s forwards;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s forwards;
        }
      `}</style>

      <div className="flex items-center justify-between">
        {/* Botão Esquerda */}
        <button
          onClick={anteCards}
          disabled={isAnimating || startIndex === 0}
          className={`p-3 bg-stone-700 text-lime-500 rounded-full hover:bg-stone-600 transition-transform duration-200 transform hover:scale-110 ${
            isAnimating || startIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
       <svg width="15" height="15" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="10" height="10" fill="#44403c" rx="25" />
    <path d="M30 10L15 25L30 40" stroke="#84cc16" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
        </button>

        {/* Container de cards */}
        <div className="flex overflow-hidden w-full h-90 py-2 relative">
          {mostrarCards.map((jogo, index) => (
            <div
              key={`${startIndex}-${index}`}
              className={`flex-shrink-0 w-1/5 px-2 ${
                isAnimating ? getAnimationClass() :
                direction === 'right' ? 'animate-slideInLeft' : 'animate-slideInRight'
              }`}
            >
              <CardJogo jogo={jogo} />
            </div>
          ))}
        </div>

        {/* Botão Direita */}
        <button
          onClick={proxCards}
          disabled={isAnimating || startIndex + 5 >= jogos.length}
          className={`p-3 bg-stone-700 text-lime-500 rounded-full hover:bg-stone-600 transition-transform duration-200 transform hover:scale-110 ${
            isAnimating || startIndex + 5 >= jogos.length ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
     <svg width="15" height="15" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
         <rect width="10" height="10" fill="#44403c" rx="25" />
         <path d="M20 10L35 25L20 40" stroke="#84cc16" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
         </svg>
        </button>
      </div>
    </div>
  );
};

export { CardCarousel };
