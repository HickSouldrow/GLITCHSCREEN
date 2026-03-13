import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../services/firebase"; // Importando Realtime Database
import { ref, get } from "firebase/database"; // Funções do Realtime

const CardJogo = ({ jogo }) => {
  const navigate = useNavigate();

  // Fallbacks para evitar erros de renderização
  const preco = Number(jogo.Preco) || 0;
  const desconto = Number(jogo.Desconto) || 0;
  const avaliacao = Number(jogo.Avaliacao) || 0;
  const jogoId = jogo.id || jogo.CodJogo;

  const precoOriginal = preco.toFixed(2).replace(".", ",");
  const precoComDesconto = (preco - (desconto / 100) * preco)
    .toFixed(2)
    .replace(".", ",");

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/jogo/${jogoId}`, {
      state: {
        jogoData: jogo,
        fromCard: true,
      },
    });
  };

  return (
    <a
      href={`/jogo/${jogoId}`}
      onClick={handleClick}
      className="block h-full transition-all duration-300 hover:z-10"
    >
      <div className="bg-stone-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 h-full mx-2 hover:shadow-xl hover:scale-105 group">
        <div className="flex flex-col">
          <div className="relative w-full h-40 bg-stone-700 flex items-center justify-center overflow-hidden mb-3">
            {jogo.ImageUrl || jogo.Imagem ? (
              <img
                src={jogo.ImageUrl || jogo.Imagem}
                alt={jogo.Nome}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <span className="text-white text-xs">Sem imagem</span>
            )}
            {desconto > 0 && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-md transform -rotate-2 animate-pulse">
                -{desconto}%
              </div>
            )}
          </div>

          <div className="p-3 flex flex-col h-full">
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <svg
                    key={estrela}
                    className={`w-5 h-5 ${estrela <= avaliacao ? "text-yellow-400" : "text-gray-600"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-lime-500 font-bold">
                {avaliacao}/5
              </span>
            </div>

            <p className="text-gray-100 font-semibold text-lg group-hover:text-lime-400 transition-colors duration-200 truncate">
              {jogo.Nome}
            </p>

            <div className="flex items-center justify-between mt-auto pt-2">
              <span className="text-gray-500 text-[10px]">
                {jogo.DtLancamento
                  ? new Date(jogo.DtLancamento).toLocaleDateString()
                  : "N/A"}
              </span>
              <div className="flex flex-col items-end">
                {desconto > 0 ? (
                  <>
                    <span className="line-through text-gray-400 text-[10px]">
                      R$ {precoOriginal}
                    </span>
                    <span className="text-lime-500 font-bold text-sm">
                      R$ {precoComDesconto}
                    </span>
                  </>
                ) : (
                  <span className="text-lime-500 font-bold text-sm">
                    R$ {precoOriginal}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

const CarrosselJogosPorAvaliacao = () => {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const jogosRef = ref(database, "jogos");
        const snapshot = await get(jogosRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          // Converte o objeto do Realtime Database para Array
          const lista = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setJogos(lista);
        }
      } catch (error) {
        console.error("Erro ao buscar jogos no Realtime:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJogos();
  }, []);

  const jogosPorAvaliacao = {
    1: jogos.filter((j) => Math.floor(Number(j.Avaliacao)) === 1),
    2: jogos.filter((j) => Math.floor(Number(j.Avaliacao)) === 2),
    3: jogos.filter((j) => Math.floor(Number(j.Avaliacao)) === 3),
    4: jogos.filter((j) => Math.floor(Number(j.Avaliacao)) === 4),
    5: jogos.filter((j) => Math.floor(Number(j.Avaliacao)) === 5),
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-lime-500 animate-pulse">
        Carregando categorias...
      </div>
    );
  }

  return (
    <div className="space-y-12 mt-30 mb-20">
      {[5, 4, 3, 2, 1].map((estrelas) => (
        <div key={`estrelas-${estrelas}`} className="mb-12 px-6">
          <div className="flex items-center max-w-6xl justify-between mb-6 px-4">
            <h3 className="text-xl font-bold text-lime-500 flex items-center gap-2">
              {estrelas} ★ {estrelas !== 1 ? "estrelas" : "estrela"}
              <span className="text-sm text-gray-500 font-normal">
                ({jogosPorAvaliacao[estrelas].length} jogos)
              </span>
            </h3>
          </div>

          {jogosPorAvaliacao[estrelas].length > 0 ? (
            <CarrosselJogos jogos={jogosPorAvaliacao[estrelas]} />
          ) : (
            <div className="text-gray-600 text-center py-4 border border-dashed border-stone-700 rounded-lg mx-4">
              Nenhum jogo nesta categoria
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const CarrosselJogos = ({ jogos }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);

  const animateCards = (newStartIndex, dir) => {
    setIsAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setStartIndex(newStartIndex);
      setIsAnimating(false);
    }, 300);
  };

  const anteCards = () => {
    const newIndex = Math.max(startIndex - 3, 0);
    if (newIndex !== startIndex) animateCards(newIndex, "left");
  };

  const proxCards = () => {
    const newIndex = Math.min(
      startIndex + 3,
      jogos.length - (jogos.length > 3 ? 3 : jogos.length),
    );
    if (newIndex !== startIndex && newIndex >= 0)
      animateCards(newIndex, "right");
  };

  const mostrarCards = jogos.slice(startIndex, startIndex + 3);

  const getAnimationClass = () => {
    if (!isAnimating) return "";
    return direction === "right"
      ? "animate-slideOutLeft"
      : "animate-slideOutRight";
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto group/carousel">
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

      <div className="flex items-center">
        <button
          onClick={anteCards}
          disabled={isAnimating || startIndex === 0}
          className={`absolute -left-4 z-20 p-3 bg-stone-700/80 text-lime-500 rounded-full hover:bg-stone-600 transition-all ${
            isAnimating || startIndex === 0
              ? "opacity-0 cursor-default"
              : "opacity-100"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 50 50" fill="none">
            <path
              d="M30 10L15 25L30 40"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex overflow-hidden w-full py-4 relative">
          {mostrarCards.map((jogo, index) => (
            <div
              key={jogo.id || `${startIndex}-${index}`}
              className={`flex-shrink-0 w-full md:w-1/3 ${
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
          disabled={isAnimating || startIndex + 3 >= jogos.length}
          className={`absolute -right-4 z-20 p-3 bg-stone-700/80 text-lime-500 rounded-full hover:bg-stone-600 transition-all ${
            isAnimating || startIndex + 3 >= jogos.length
              ? "opacity-0 cursor-default"
              : "opacity-100"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 50 50" fill="none">
            <path
              d="M20 10L35 25L20 40"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CarrosselJogosPorAvaliacao;
