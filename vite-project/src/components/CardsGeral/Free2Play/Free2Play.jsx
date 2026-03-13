import React, { useState, useEffect } from "react";
import { CardJogo } from "../Card/Card";
import { database } from "../../../services/firebase"; // Importando o Realtime Database
import { ref, get } from "firebase/database"; // Funções do Realtime

const Free2Play = () => {
  const [freeGames, setFreeGames] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        // Conexão com o nó 'jogos' no Realtime Database
        const jogosRef = ref(database, "jogos");
        const snapshot = await get(jogosRef);

        if (snapshot.exists()) {
          const data = snapshot.val();

          // Converte o objeto do Realtime para Array
          const allGames = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          // Filtra jogos gratuitos (Preco === 0) ou com 100% de desconto
          const filteredGames = allGames.filter(
            (jogo) => (jogo.Preco || 0) === 0 || (jogo.Desconto || 0) === 100,
          );

          setFreeGames(filteredGames);
        } else {
          setFreeGames([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar jogos no Realtime Database:", err);
        setError("Não foi possível carregar os jogos gratuitos.");
        setLoading(false);
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
    const maxIndex = Math.max(0, freeGames.length - 5);
    const newIndex = Math.min(startIndex + 5, maxIndex);

    if (newIndex !== startIndex && newIndex < freeGames.length) {
      animateCards(newIndex, "right");
    }
  };

  const mostrarCards = freeGames.slice(startIndex, startIndex + 5);

  const getAnimationClass = () => {
    if (!isAnimating) return "";
    return direction === "right"
      ? "animate-slideOutLeft"
      : "animate-slideOutRight";
  };

  if (loading) {
    return (
      <div className="text-center text-white py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lime-500 mb-2"></div>
        <p>Carregando jogos gratuitos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <svg
          className="w-12 h-12 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p>Erro ao carregar jogos:</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (freeGames.length === 0) {
    return (
      <div className="text-center text-white py-8">
        <svg
          className="w-12 h-12 mx-auto mb-2 text-lime-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p>Nenhum jogo gratuito disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-8 bg-gradient-to-br from-stone-900 via-lime-950 rounded-xl p-6 shadow-2xl">
      <h2 className="text-xl font-bold text-lime-500 mb-6 text-center">
        {freeGames.some((jogo) => jogo.Desconto === 100)
          ? "JOGOS GRATUITOS E PROMOÇÕES"
          : "JOGOS GRATUITOS"}
      </h2>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideOutLeft { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-100%); opacity: 0; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        @keyframes slideInLeft { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slideOutLeft { animation: slideOutLeft 0.3s forwards; }
        .animate-slideOutRight { animation: slideOutRight 0.3s forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.3s forwards; }
        .animate-slideInRight { animation: slideInRight 0.3s forwards; }
      `,
        }}
      />

      <div className="flex items-center justify-between">
        <button
          onClick={anteCards}
          disabled={isAnimating || startIndex === 0}
          className={`p-3 bg-stone-700 text-lime-500 rounded-full hover:bg-stone-600 transition-transform duration-200 transform hover:scale-110 ${
            isAnimating || startIndex === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          aria-label="Voltar"
        >
          <svg width="15" height="15" viewBox="0 0 50 50" fill="none">
            <path
              d="M30 10L15 25L30 40"
              stroke="#84cc16"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex overflow-hidden w-full h-90 py-2 relative">
          {mostrarCards.map((jogo, index) => (
            <div
              key={jogo.id || `${startIndex}-${index}`}
              className={`flex-shrink-0 w-1/5 px-2 ${
                isAnimating
                  ? getAnimationClass()
                  : direction === "right"
                    ? "animate-slideInLeft"
                    : direction === "left"
                      ? "animate-slideInRight"
                      : ""
              }`}
            >
              <CardJogo jogo={jogo} />
            </div>
          ))}
        </div>

        <button
          onClick={proxCards}
          disabled={isAnimating || startIndex + 5 >= freeGames.length}
          className={`p-3 bg-stone-700 text-lime-500 rounded-full hover:bg-stone-600 transition-transform duration-200 transform hover:scale-110 ${
            isAnimating || startIndex + 5 >= freeGames.length
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          aria-label="Avançar"
        >
          <svg width="15" height="15" viewBox="0 0 50 50" fill="none">
            <path
              d="M20 10L35 25L20 40"
              stroke="#84cc16"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: Math.ceil(freeGames.length / 5) }).map(
          (_, idx) => (
            <button
              key={idx}
              onClick={() => setStartIndex(idx * 5)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${startIndex === idx * 5 ? "bg-lime-500" : "bg-stone-600"}`}
              aria-label={`Ir para página ${idx + 1}`}
            />
          ),
        )}
      </div>
    </div>
  );
};

export { Free2Play };
