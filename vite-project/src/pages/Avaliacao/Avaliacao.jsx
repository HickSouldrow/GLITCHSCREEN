import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Classificacao = () => {
  const [jogosPorClassificacao, setJogosPorClassificacao] = useState({});
  const [loading, setLoading] = useState(true);
  const [carrosselState, setCarrosselState] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/jogos')
      .then((response) => {
        const jogos = response.data;

        const agrupados = jogos.reduce((acc, jogo) => {
          const classificacao = jogo.ClassificacaoIndicativa || 'Não classificados';
          if (!acc[classificacao]) acc[classificacao] = [];
          acc[classificacao].push(jogo);
          return acc;
        }, {});

        const estadoInicial = {};
        Object.keys(agrupados).forEach(cl => {
          estadoInicial[cl] = { startIndex: 0, isAnimating: false, direction: null };
        });

        setJogosPorClassificacao(agrupados);
        setCarrosselState(estadoInicial);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar os jogos:', error);
        setLoading(false);
      });
  }, []);

  const animateCards = (classificacao, newStartIndex, dir) => {
    setCarrosselState(prev => ({
      ...prev,
      [classificacao]: {
        ...prev[classificacao],
        isAnimating: true,
        direction: dir
      }
    }));
    setTimeout(() => {
      setCarrosselState(prev => ({
        ...prev,
        [classificacao]: {
          ...prev[classificacao],
          startIndex: newStartIndex,
          isAnimating: false,
          direction: null
        }
      }));
    }, 300);
  };

  const handleNavegar = (jogo) => (e) => {
    e.preventDefault();
    navigate(`/jogo/${jogo.CodJogo}`, {
      state: { jogoData: jogo, fromCard: true }
    });
  };

  const getAnimationClass = (state) => {
    if (!state.isAnimating) return '';
    return state.direction === 'right' ? 'animate-slideOutLeft' : 'animate-slideOutRight';
  };

  if (loading) return <div className="text-white text-center py-10">Carregando jogos...</div>;

  return (
    <div className="bg-stone-900 text-white min-h-screen px-4 py-10">
      <style>{`
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
        .animate-slideOutLeft { animation: slideOutLeft 0.3s forwards; }
        .animate-slideOutRight { animation: slideOutRight 0.3s forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.3s forwards; }
        .animate-slideInRight { animation: slideInRight 0.3s forwards; }
      `}</style>

      {Object.entries(jogosPorClassificacao).map(([classificacao, jogos]) => {
        const state = carrosselState[classificacao];
        const startIndex = state?.startIndex || 0;
        const mostrarCards = jogos.slice(startIndex, startIndex + 5);

        return (
          <div key={classificacao} className="mb-16">
            <h2 className="text-2xl font-bold text-lime-500 mb-4">Classificação: {classificacao}</h2>

            <div className="relative w-full max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                {/* Botão Esquerda */}
                <button
                  onClick={() => {
                    const newIndex = Math.max(startIndex - 5, 0);
                    if (newIndex !== startIndex) animateCards(classificacao, newIndex, 'left');
                  }}
                  disabled={state?.isAnimating || startIndex === 0}
                  className={`p-3 bg-stone-700 text-lime-500 rounded-full hover:bg-stone-600 transition-transform duration-200 transform hover:scale-110 ${
                    state?.isAnimating || startIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <svg width="15" height="15" viewBox="0 0 50 50" fill="none">
                    <rect width="10" height="10" fill="#44403c" rx="25" />
                    <path d="M30 10L15 25L30 40" stroke="#84cc16" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Cards */}
                <div className="flex overflow-hidden w-full h-90 py-2 relative">
                  {mostrarCards.map((jogo, index) => {
                    const precoOriginal = jogo.Preco.toFixed(2).replace('.', ',');
                    const precoDesconto = (jogo.Preco - (jogo.Desconto / 100) * jogo.Preco).toFixed(2).replace('.', ',');

                    return (
                      <div
                        key={`${startIndex}-${index}`}
                        className={`flex-shrink-0 w-1/5 px-2 ${
                          state?.isAnimating ? getAnimationClass(state) :
                          state?.direction === 'right' ? 'animate-slideInLeft' : 'animate-slideInRight'
                        }`}
                      >
                        <a
                          href={`/jogo/${jogo.CodJogo}`}
                          onClick={handleNavegar(jogo)}
                          className="block"
                        >
                          <div className="bg-stone-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-transform hover:scale-105 w-full group">
                            <div className="relative w-full h-48 bg-lime-600 flex items-center justify-center overflow-hidden">
                              {jogo.ImageUrl ? (
                                <img
                                  src={jogo.ImageUrl}
                                  alt={jogo.Nome}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <span className="text-white text-sm">Sem imagem</span>
                              )}
                              {jogo.Desconto > 0 && (
                                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md transform -rotate-2">
                                  -{jogo.Desconto}%
                                </div>
                              )}
                            </div>
                            <div className="p-3 flex flex-col justify-between h-28">
                              <div>
                                <p className="text-gray-400 text-xs">Jogo Base</p>
                                <p className="text-gray-100 font-semibold text-sm truncate" title={jogo.Nome}>
                                  {jogo.Nome}
                                </p>
                              </div>
                              <div className="mt-2">
                                {jogo.Desconto > 0 ? (
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="line-through text-gray-400 text-xs">R$ {precoOriginal}</span>
                                    <span className="text-lime-500 font-bold text-sm">R$ {precoDesconto}</span>
                                  </div>
                                ) : (
                                  <span className="text-lime-500 font-bold text-sm">R$ {precoOriginal}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  })}
                </div>

                {/* Botão Direita */}
                <button
                  onClick={() => {
                    const newIndex = Math.min(startIndex + 5, jogos.length - 5);
                    if (newIndex !== startIndex) animateCards(classificacao, newIndex, 'right');
                  }}
                  disabled={state?.isAnimating || startIndex + 5 >= jogos.length}
                  className={`p-3 bg-stone-700 text-lime-500 rounded-full hover:bg-stone-600 transition-transform duration-200 transform hover:scale-110 ${
                    state?.isAnimating || startIndex + 5 >= jogos.length ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <svg width="15" height="15" viewBox="0 0 50 50" fill="none">
                    <rect width="10" height="10" fill="#44403c" rx="25" />
                    <path d="M20 10L35 25L20 40" stroke="#84cc16" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Classificacao;
