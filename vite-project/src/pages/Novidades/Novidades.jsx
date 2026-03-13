import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";

const CardJogoCarrossel = ({ jogo }) => {
  const navigate = useNavigate();

  // Fallbacks de segurança
  const preco = jogo.Preco || 0;
  const desconto = jogo.Desconto || 0;
  const jogoId = jogo.id || jogo.CodJogo;

  const precoOriginal = preco.toFixed(2).replace(".", ",");
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
      <div className="bg-stone-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 h-75 mx-2 group relative">
        <div className="relative w-full h-48 bg-stone-700 flex items-center justify-center overflow-hidden">
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
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-md transform -rotate-2 animate-pulse">
              -{desconto}%
            </div>
          )}
        </div>
        <div className="p-3 flex flex-col justify-between h-24 transition-all duration-200">
          <div>
            <p className="text-gray-400 text-[0.6rem] mb-1 uppercase tracking-wider">
              Nova Entrada
            </p>
            <p className="text-gray-100 font-semibold text-xs truncate group-hover:text-lime-400 transition-colors duration-200">
              {jogo.Nome}
            </p>
          </div>
          <div className="mt-2">
            <span className="text-lime-500 font-bold text-xs">
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

  const animateCards = (newStartIndex, dir) => {
    setIsAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setStartIndex(newStartIndex);
      setIsAnimating(false);
    }, 300);
  };

  const anteCards = () => {
    const newIndex = Math.max(startIndex - 4, 0);
    if (newIndex !== startIndex) animateCards(newIndex, "left");
  };

  const proxCards = () => {
    const newIndex = Math.min(startIndex + 4, jogos.length - 4);
    if (newIndex !== startIndex && newIndex >= 0)
      animateCards(newIndex, "right");
  };

  const mostrarCards = jogos.slice(startIndex, startIndex + 4);

  const getAnimationClass = () => {
    if (!isAnimating) return "";
    return direction === "right"
      ? "animate-slideOutLeft"
      : "animate-slideOutRight";
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <style>{`
                @keyframes slideOutLeft { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-100%); opacity: 0; } }
                @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
                @keyframes slideInLeft { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes slideInRight { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                .animate-slideOutLeft { animation: slideOutLeft 0.3s forwards; }
                .animate-slideOutRight { animation: slideOutRight 0.3s forwards; }
                .animate-slideInLeft { animation: slideInLeft 0.3s forwards; }
                .animate-slideInRight { animation: slideInRight 0.3s forwards; }
            `}</style>

      <div className="flex items-center justify-between">
        <button
          onClick={anteCards}
          disabled={isAnimating || startIndex === 0}
          className="p-3 bg-stone-700 text-lime-500 rounded-full disabled:opacity-30 hover:bg-stone-600 transition-all hover:scale-110"
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

        <div className="flex overflow-hidden w-full h-90 py-2 relative">
          {mostrarCards.map((jogo, index) => (
            <div
              key={jogo.id || index}
              className={`flex-shrink-0 w-1/4 px-2 ${isAnimating ? getAnimationClass() : "animate-slideInLeft"}`}
            >
              <CardJogoCarrossel jogo={jogo} />
            </div>
          ))}
        </div>

        <button
          onClick={proxCards}
          disabled={isAnimating || startIndex + 4 >= jogos.length}
          className="p-3 bg-stone-700 text-lime-500 rounded-full disabled:opacity-30 hover:bg-stone-600 transition-all hover:scale-110"
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
        const querySnapshot = await getDocs(collection(db, "jogos"));
        const listaJogos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJogos(listaJogos);
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

  // Função para converter data do Firebase ou String para objeto Date
  const parseDate = (dateVal) => {
    if (!dateVal) return new Date(0);
    // Se for Timestamp do Firebase
    if (dateVal.seconds) return dateVal.toDate();
    return new Date(dateVal);
  };

  // Ordenação
  const jogosOrdenados = [...jogos].sort(
    (a, b) => parseDate(b.DtLancamento) - parseDate(a.DtLancamento),
  );
  const lancamentosRecentes = jogosOrdenados.slice(0, 12);
  const lancamentosAntigos = [...jogosOrdenados].reverse().slice(0, 12);

  return (
    <div className="bg-stone-950 text-white mt-20 min-h-screen py-10 px-4">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold uppercase tracking-tight">
          Novidades
        </h1>
        <div className="w-24 h-1 bg-lime-700 mx-auto mt-2"></div>
      </header>

      <div className="max-w-7xl mx-auto space-y-20">
        <section>
          <div className="flex items-center gap-4 mb-6 px-4">
            <div className="w-2 h-8 bg-lime-500"></div>
            <h2 className="text-2xl font-bold text-lime-500 uppercase">
              Lançamentos Recentes
            </h2>
          </div>
          <Carrossel jogos={lancamentosRecentes} />
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6 px-4">
            <div className="w-2 h-8 bg-stone-600"></div>
            <h2 className="text-2xl font-bold text-stone-400 uppercase">
              Coletâneas Anteriores{" "}
              <span className="text-sm font-normal normal-case block text-stone-500">
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
