import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CardJogo = ({ jogo }) => {
    const navigate = useNavigate();
    const precoOriginal = jogo.Preco.toFixed(2).replace('.', ',');
    const precoComDesconto = (jogo.Preco - (jogo.Desconto / 100) * jogo.Preco).toFixed(2).replace('.', ',');

    const handleClick = (e) => {
        e.preventDefault();
        navigate(`/jogo/${jogo.CodJogo}`, { 
            state: { 
                jogoData: jogo,
                fromCard: true 
            }
        });
    };

    return (
        <a 
            href={`/jogo/${jogo.CodJogo}`} 
            onClick={handleClick} 
            className="block h-full transition-all duration-300 hover:z-10"
        >
            <div className="bg-stone-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 h-full mx-2 hover:shadow-xl hover:scale-105 group">
                <div className="flex flex-col">
                    {/* Imagem do jogo com desconto badge */}
                    <div className="relative w-full h-40 bg-stone-700 flex items-center justify-center overflow-hidden mb-3">
                        {jogo.ImageUrl ? (
                            <img 
                                src={jogo.ImageUrl} 
                                alt={jogo.Nome} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <span className="text-white text-xs">Sem imagem</span>
                        )}
                        {jogo.Desconto > 0 && (
                            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-md transform -rotate-2 animate-pulse">
                                -{jogo.Desconto}%
                            </div>
                        )}
                    </div>

                    {/* Conteúdo com padding */}
                    <div className="p-3 flex flex-col h-full">
                        <div className="flex items-center">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((estrela) => (
                                    <svg
                                        key={estrela}
                                        className={`w-5 h-5 ${estrela <= jogo.Avaliacao ? 'text-yellow-400' : 'text-gray-600'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="ml-2 text-lime-500 font-bold">{jogo.Avaliacao}/5</span>
                        </div>

                        <p className="text-gray-100 font-semibold text-lg group-hover:text-lime-400 transition-colors duration-200">
                            {jogo.Nome}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-gray-500 text-xs">
                                Lançamento: {new Date(jogo.DtLancamento).toLocaleDateString()}
                            </span>
                            <div className="flex flex-col items-end">
                                {jogo.Desconto > 0 ? (
                                    <>
                                        <span className="line-through text-gray-400 text-xs">R$ {precoOriginal}</span>
                                        <span className="text-lime-500 font-bold">R$ {precoComDesconto}</span>
                                    </>
                                ) : (
                                    <span className="text-lime-500 font-bold">R$ {precoOriginal}</span>
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
        axios.get('http://localhost:5000/jogos')
            .then(response => {
                setJogos(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erro ao buscar jogos:', error);
                setLoading(false);
            });
    }, []);

    // Agrupa jogos por avaliação (1-5 estrelas)
    const jogosPorAvaliacao = {
        1: jogos.filter(j => j.Avaliacao === 1),
        2: jogos.filter(j => j.Avaliacao === 2),
        3: jogos.filter(j => j.Avaliacao === 3),
        4: jogos.filter(j => j.Avaliacao === 4),
        5: jogos.filter(j => j.Avaliacao === 5)
    };

    if (loading) {
        return <div className="text-center py-8">Carregando jogos...</div>;
    }

    return (
        <div className="space-y-12 mt-30 mb-20">
            {[5, 4, 3, 2, 1].map((estrelas) => (
                <div key={`estrelas-${estrelas}`} className="mb-12 px-6">
                    <div className="flex items-center max-w-6xl justify-between mb-6 px-4">
                        <h3 className="text-xl font-bold text-lime-500">
                            {estrelas} Estrela{estrelas !== 1 ? 's' : ''} ({jogosPorAvaliacao[estrelas].length})
                        </h3>
                    </div>

                    {jogosPorAvaliacao[estrelas].length > 0 ? (
                        <CarrosselJogos jogos={jogosPorAvaliacao[estrelas]} />
                    ) : (
                        <div className="text-gray-400 text-center py-4">
                            Nenhum jogo com {estrelas} estrela{estrelas !== 1 ? 's' : ''}
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
        if (newIndex !== startIndex) animateCards(newIndex, 'left');
    };

    const proxCards = () => {
        const newIndex = Math.min(startIndex + 3, jogos.length - 3);
        if (newIndex !== startIndex) animateCards(newIndex, 'right');
    };

    const mostrarCards = jogos.slice(startIndex, startIndex + 3);

    const getAnimationClass = () => {
        if (!isAnimating) return '';
        return direction === 'right' ? 'animate-slideOutLeft' : 'animate-slideOutRight';
    };

    return (
        <div className="relative w-full max-w-6xl mx-auto">
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

                <div className="flex overflow-hidden w-full h-75 py-2 relative">
                    {mostrarCards.map((jogo, index) => (
                        <div
                            key={`${jogo.CodJogo}-${startIndex}-${index}`}
                            className={`flex-shrink-0 w-1/3 px-2 ${
                                isAnimating ? getAnimationClass() :
                                direction === 'right' ? 'animate-slideInLeft' : 'animate-slideInRight'
                            }`}
                        >
                            <CardJogo jogo={jogo} />
                        </div>
                    ))}
                </div>

                <button
                    onClick={proxCards}
                    disabled={isAnimating || startIndex + 3 >= jogos.length}
                    className={`p-3 bg-stone-700 text-lime-500 rounded-full hover:bg-stone-600 transition-transform duration-200 transform hover:scale-110 ${
                        isAnimating || startIndex + 3 >= jogos.length ? 'opacity-50 cursor-not-allowed' : ''
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

export default CarrosselJogosPorAvaliacao;