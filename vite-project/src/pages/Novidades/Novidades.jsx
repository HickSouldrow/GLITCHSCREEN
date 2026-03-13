import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../services/firebase";
import { ref, get } from "firebase/database";

const CardJogoCarrossel = ({ jogo }) => {
  const navigate = useNavigate();

  const preco = Number(jogo.Preco) || 0;
  const desconto = Number(jogo.Desconto) || 0;
  const jogoId = jogo.id || jogo.CodJogo;

  const precoComDesconto = (preco - (desconto / 100) * preco)
    .toFixed(2)
    .replace(".", ",");

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/jogo/${jogoId}`, {
      state: { jogoData: jogo, fromCard: true },
    });
  };

  return (
    <a
      href={`/jogo/${jogoId}`}
      onClick={handleClick}
      className="block h-full transition-all duration-300 hover:z-10"
    >
      <div className="bg-stone-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 h-full mx-1 sm:mx-2 group relative">
        <div className="relative w-full h-32 sm:h-40 md:h-48 bg-stone-700 flex items-center justify-center overflow-hidden">
          {jogo.ImageUrl || jogo.Imagem ? (
            <img
              src={jogo.ImageUrl || jogo.Imagem}
              alt={jogo.Nome}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <span className="text-white text-[10px] sm:text-xs">
              Sem imagem
            </span>
          )}
          {desconto > 0 && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-md transform -rotate-2 animate-pulse">
              -{desconto}%
            </div>
          )}
        </div>
        <div className="p-2 sm:p-3 flex flex-col justify-between min-h-[80px] sm:min-h-[96px] transition-all duration-200">
          <div>
            <p className="text-gray-400 text-[0.5rem] sm:text-[0.6rem] mb-1 uppercase tracking-wider">
              Nova Entrada
            </p>
            <p className="text-gray-100 font-semibold text-[0.7rem] sm:text-xs truncate group-hover:text-lime-400 transition-colors duration-200">
              {jogo.Nome}
            </p>
          </div>
          <div className="mt-1 sm:mt-2">
            <span className="text-lime-500 font-bold text-[0.75rem] sm:text-xs">
              R$ {precoComDesconto}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

const Carrossel = ({ jogos }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(4);

  // Ajusta a quantidade de itens conforme a largura da tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(1);
      else if (window.innerWidth < 768) setItemsToShow(2);
      else if (window.innerWidth < 1024) setItemsToShow(3);
      else setItemsToShow(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    const newIndex = Math.max(startIndex - 1, 0);
    if (newIndex !== startIndex) animateCards(newIndex, "left");
  };

  const proxCards = () => {
    const newIndex = Math.min(startIndex + 1, jogos.length - itemsToShow);
    if (newIndex !== startIndex && newIndex >= 0)
      animateCards(newIndex, "right");
  };

  const mostrarCards = jogos.slice(startIndex, startIndex + itemsToShow);

  const getAnimationClass = () => {
    if (!isAnimating) return "";
    return direction === "right"
      ? "animate-slideOutLeft"
      : "animate-slideOutRight";
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideOutLeft { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-20%); opacity: 0; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(20%); opacity: 0; } }
        @keyframes slideInLeft { from { transform: translateX(20%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(-20%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
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
          className="absolute left-0 sm:-left-4 z-20 p-2 bg-stone-700/80 text-lime-500 rounded-full disabled:opacity-0 hover:bg-stone-600 transition-all"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex overflow-hidden w-full py-4">
          {mostrarCards.map((jogo, index) => (
            <div
              key={jogo.id || `${startIndex}-${index}`}
              className={`flex-shrink-0 transition-all duration-300
                ${
                  itemsToShow === 1
                    ? "w-full"
                    : itemsToShow === 2
                      ? "w-1/2"
                      : itemsToShow === 3
                        ? "w-1/3"
                        : "w-1/4"
                } 
                ${isAnimating ? getAnimationClass() : "animate-slideInLeft"}`}
            >
              <CardJogoCarrossel jogo={jogo} />
            </div>
          ))}
        </div>

        <button
          onClick={proxCards}
          disabled={isAnimating || startIndex + itemsToShow >= jogos.length}
          className="absolute right-0 sm:-right-4 z-20 p-2 bg-stone-700/80 text-lime-500 rounded-full disabled:opacity-0 hover:bg-stone-600 transition-all"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Novidades = () => {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(database, "jogos"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const listaJogos = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setJogos(listaJogos);
        }
      } catch (error) {
        console.error("Erro ao buscar novidades:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const parseDate = (dateVal) => (dateVal ? new Date(dateVal) : new Date(0));

  const jogosOrdenados = [...jogos].sort(
    (a, b) => parseDate(b.DtLancamento) - parseDate(a.DtLancamento),
  );

  const lancamentosRecentes = jogosOrdenados.slice(0, 12);
  const lancamentosAntigos = [...jogosOrdenados].reverse().slice(0, 12);

  return (
    <div className="bg-stone-950 text-white mt-16 sm:mt-20 min-h-screen py-6 sm:py-10 px-2 sm:px-4">
      <header className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight">
          Novidades
        </h1>
        <div className="w-16 sm:w-24 h-1 bg-lime-700 mx-auto mt-2"></div>
      </header>

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-20">
        <section>
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 px-4">
            <div className="w-1.5 h-6 sm:w-2 sm:h-8 bg-lime-500"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-lime-500 uppercase">
              Lançamentos Recentes
            </h2>
          </div>
          <Carrossel jogos={lancamentosRecentes} />
        </section>

        <section className="mb-20 sm:mb-20">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 px-4">
            <div className="w-1.5 h-6 sm:w-2 sm:h-8 bg-stone-600"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-400 uppercase">
              Coletâneas Anteriores
              <span className="text-[10px] sm:text-xs font-normal normal-case block text-stone-500">
                Para quem curte os clássicos
              </span>
            </h2>
          </div>
          <Carrossel jogos={lancamentosAntigos} />
        </section>
      </div>
    </div>
  );
};

export default Novidades;
