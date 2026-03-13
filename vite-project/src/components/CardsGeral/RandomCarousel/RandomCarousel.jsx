import React, { useState, useEffect } from "react";
import { CardJogo } from "../Card/Card"; // Ajustado para export nomeado
import { db } from "../../../services/firebase";
import { collection, getDocs } from "firebase/firestore";

export const RandomCarousel = () => {
  const [jogos, setJogos] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jogos"));
        const jogosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Embaralha os jogos vindo do Firebase
        const jogosAleatorios = [...jogosData].sort(() => Math.random() - 0.5);
        setJogos(jogosAleatorios);
      } catch (error) {
        console.error("Erro ao buscar jogos no Firebase:", error);
      }
    };

    fetchJogos();
  }, []);

  const animateCards = (newStartIndex, dir) => {
    setIsAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setStartIndex(newStartIndex);
      setIsAnimating(false);
    }, 300);
  };

  const anteCards = () => {
    const newIndex = Math.max(startIndex - 5, 0);
    if (newIndex !== startIndex) {
      animateCards(newIndex, "left");
    }
  };

  const proxCards = () => {
    const newIndex = Math.min(startIndex + 5, jogos.length - 5);
    if (newIndex !== startIndex) {
      animateCards(newIndex, "right");
    }
  };

  const mostrarCards = jogos.slice(startIndex, startIndex + 5);

  const getAnimationClass = () => {
    if (!isAnimating) return "";
    return direction === "right"
      ? "animate-slideOutLeft"
      : "animate-slideOutRight";
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto py-8">
      {/* Correção do erro de atributo 'jsx': Injetando CSS de forma segura no React */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideOutLeft {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-20%); opacity: 0; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(20%); opacity: 0; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(20%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(-20%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideOutLeft { animation: slideOutLeft 0.3s forwards; }
        .animate-slideOutRight { animation: slideOutRight 0.3s forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.3s forwards; }
        .animate-slideInRight { animation: slideInRight 0.3s forwards; }
      `,
        }}
      />

      <div className="flex items-center justify-between gap-4">
        {/* Botão Esquerda */}
        <button
          onClick={anteCards}
          disabled={isAnimating || startIndex === 0}
          className={`p-4 bg-stone-800 border border-stone-700 text-lime-500 rounded-full hover:border-lime-500 transition-all transform hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <svg width="20" height="20" viewBox="0 0 50 50" fill="none">
            <path
              d="M30 10L15 25L30 40"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Container de cards */}
        <div className="flex overflow-hidden w-full h-auto py-2 relative">
          <div
            className={`flex w-full ${isAnimating ? getAnimationClass() : ""}`}
          >
            {mostrarCards.map((jogo, index) => (
              <div
                key={`${jogo.id}-${startIndex}-${index}`}
                className={`flex-shrink-0 w-1/5 px-2 ${
                  !isAnimating && direction === "right"
                    ? "animate-slideInLeft"
                    : !isAnimating && direction === "left"
                      ? "animate-slideInRight"
                      : ""
                }`}
              >
                <CardJogo jogo={jogo} />
              </div>
            ))}
          </div>
        </div>

        {/* Botão Direita */}
        <button
          onClick={proxCards}
          disabled={isAnimating || startIndex + 5 >= jogos.length}
          className={`p-4 bg-stone-800 border border-stone-700 text-lime-500 rounded-full hover:border-lime-500 transition-all transform hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <svg width="20" height="20" viewBox="0 0 50 50" fill="none">
            <path
              d="M20 10L35 25L20 40"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
