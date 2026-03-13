import React, { useState, useEffect } from "react";
import { CardJogo } from "../Card/Card";
import { database } from "../../../services/firebase"; // Importando o Realtime Database
import { ref, get } from "firebase/database"; // Funções do Realtime

const CardCarousel = () => {
  const [jogos, setJogos] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        // Mudança para Realtime Database
        const jogosRef = ref(database, "jogos");
        const snapshot = await get(jogosRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          // Converte o objeto do Realtime para Array
          const listaJogos = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setJogos(listaJogos);
        }
      } catch (error) {
        console.error("Erro ao buscar os dados no Realtime:", error);
      }
    };

    buscarDados();
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
    <div className="relative w-full max-w-6xl mx-auto py-4">
      {/* Correção do erro de atributo 'jsx' */}
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
        <button
          onClick={anteCards}
          disabled={isAnimating || startIndex === 0}
          className={`p-3 bg-stone-700 text-lime-500 rounded-full hover:bg-stone-600 transition-all transform hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <svg width="15" height="15" viewBox="0 0 50 50" fill="none">
            <rect width="10" height="10" fill="transparent" rx="25" />
            <path
              d="M30 10L15 25L30 40"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex overflow-hidden w-full h-auto py-2 relative">
          <div
            className={`flex w-full ${isAnimating ? getAnimationClass() : ""}`}
          >
            {mostrarCards.map((jogo, index) => (
              <div
                key={jogo.id || `${startIndex}-${index}`}
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

        <button
          onClick={proxCards}
          disabled={isAnimating || startIndex + 5 >= jogos.length}
          className={`p-3 bg-stone-700 text-lime-500 rounded-full hover:bg-stone-600 transition-all transform hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <svg width="15" height="15" viewBox="0 0 50 50" fill="none">
            <rect width="10" height="10" fill="transparent" rx="25" />
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

export { CardCarousel };
