import React, { useState, useEffect } from "react";
import { CardJogo } from "../Card/Card";
import { database } from "../../../services/firebase";
import { ref, get } from "firebase/database";

export const RandomCarousel = () => {
  const [jogos, setJogos] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const jogosRef = ref(database, "jogos");
        const snapshot = await get(jogosRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          // Converte objeto para Array para podermos embaralhar
          let jogosData = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          // Mantendo seu algoritmo Fisher-Yates para embaralhamento real
          for (let i = jogosData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [jogosData[i], jogosData[j]] = [jogosData[j], jogosData[i]];
          }

          setJogos(jogosData);
        }
      } catch (error) {
        console.error("Erro ao buscar jogos no Realtime Database:", error);
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
    const maxIndex = Math.max(0, jogos.length - 5);
    const newIndex = Math.min(startIndex + 5, maxIndex);

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
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideOutLeft {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-30px); opacity: 0; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(30px); opacity: 0; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideOutLeft { animation: slideOutLeft 0.3s ease-in-out forwards; }
        .animate-slideOutRight { animation: slideOutRight 0.3s ease-in-out forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.3s ease-in-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-in-out forwards; }
      `,
        }}
      />

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={anteCards}
          disabled={isAnimating || startIndex === 0}
          className="p-4 bg-stone-800 border border-stone-700 text-lime-500 rounded-full hover:border-lime-500 transition-all transform hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Anterior"
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

        <div className="flex overflow-hidden w-full py-2 relative">
          <div
            className={`flex w-full gap-4 ${isAnimating ? getAnimationClass() : ""}`}
          >
            {mostrarCards.map((jogo, index) => (
              <div
                key={`${jogo.id}-${startIndex}-${index}`}
                className={`flex-shrink-0 w-[calc(20%-1rem)] ${
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
          className="p-4 bg-stone-800 border border-stone-700 text-lime-500 rounded-full hover:border-lime-500 transition-all transform hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Próximo"
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
