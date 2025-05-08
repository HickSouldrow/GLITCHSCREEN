import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Componente do card do jogo (igual ao anterior)
const CardJogoCarrossel = ({ jogo }) => {
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
            className="block transition-all duration-300 hover:z-10"
        >
            <div className="bg-stone-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 w-36 md:w-40 mx-auto group relative">
                <div className="relative w-full h-40 bg-stone-700 flex items-center justify-center overflow-hidden">
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
                <div className="p-2 flex flex-col justify-between h-24 transition-all duration-200">
                    <div>
                        <p className="text-gray-400 text-[0.65rem] mb-0.5">Jogo Base</p>
                        <p 
                            className="text-gray-100 font-semibold text-xs truncate group-hover:text-lime-400 transition-colors duration-200" 
                            title={jogo.Nome}
                        >
                            {jogo.Nome}
                        </p>
                    </div>
                    <div className="mt-1">
                        {jogo.Desconto > 0 ? (
                            <div className="flex items-center gap-0.5">
                                <span className="line-through text-gray-400 text-[0.65rem]">R$ {precoOriginal}</span>
                                <span className="text-lime-500 font-bold text-xs">R$ {precoComDesconto}</span>
                            </div>
                        ) : (
                            <span className="text-lime-500 font-bold text-xs">R$ {precoOriginal}</span>
                        )}
                    </div>
                </div>
            </div>
        </a>
    );
};

// Componente do carrossel para uma classificação específica
const CarrosselClassificacao = ({ classificacao, jogos }) => {
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
        if (newIndex !== startIndex) animateCards(newIndex, 'left');
    };

    const proxCards = () => {
        const newIndex = Math.min(startIndex + 4, jogos.length - 4);
        if (newIndex !== startIndex) animateCards(newIndex, 'right');
    };

    const mostrarCards = jogos.slice(startIndex, startIndex + 4);

    const getAnimationClass = () => {
        if (!isAnimating) return '';
        return direction === 'right' ? 'animate-slideOutLeft' : 'animate-slideOutRight';
    };

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-xl font-bold text-lime-500">
                    {classificacao.ClassificacaoIndicativa}
                </h3>
                <span className="text-gray-400 text-sm">
                    {jogos.length} {jogos.length === 1 ? 'jogo' : 'jogos'}
                </span>
            </div>

            <div className="relative w-full max-w-4xl mx-auto px-2">
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
                        className={`p-2 bg-stone-700/80 text-lime-500 rounded-full hover:bg-stone-600 transition-all duration-200 transform hover:scale-110 z-20 ${
                            isAnimating || startIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
                        }`}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    <div className="flex-1 mx-2 overflow-hidden">
                        <div className="flex justify-center space-x-3 relative">
                            {mostrarCards.map((jogo, index) => (
                                <div
                                    key={`${classificacao.CodFaixaEtaria}-${startIndex}-${index}`}
                                    className={`flex-shrink-0 transition-all duration-300 ${
                                        isAnimating ? getAnimationClass() :
                                        direction === 'right' ? 'animate-slideInLeft' : 'animate-slideInRight'
                                    }`}
                                >
                                    <CardJogoCarrossel jogo={jogo} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={proxCards}
                        disabled={isAnimating || startIndex + 4 >= jogos.length}
                        className={`p-2 bg-stone-700/80 text-lime-500 rounded-full hover:bg-stone-600 transition-all duration-200 transform hover:scale-110 z-20 ${
                            isAnimating || startIndex + 4 >= jogos.length ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
                        }`}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>

                <div className="flex justify-center mt-4 space-x-1.5">
                    {Array.from({ length: Math.ceil(jogos.length / 4) }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setStartIndex(idx * 4)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                startIndex >= idx * 4 && startIndex < (idx + 1) * 4 ? 'bg-lime-500 w-4' : 'bg-stone-600'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Componente principal que agrupa tudo
const Classificacao = () => {
    const [classificacoes, setClassificacoes] = useState([]);
    const [jogosPorClassificacao, setJogosPorClassificacao] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Busca classificações e jogos em paralelo
                const [classResponse, jogosResponse] = await Promise.all([
                    axios.get('http://localhost:5000/classificacoes'),
                    axios.get('http://localhost:5000/jogos')
                ]);

                const classificacoes = classResponse.data;
                const jogos = jogosResponse.data;

                // Organiza jogos por classificação
                const jogosAgrupados = {};
                classificacoes.forEach(classificacao => {
                    jogosAgrupados[classificacao.CodFaixaEtaria] = {
                        classificacao,
                        jogos: jogos.filter(jogo => jogo.CodFaixaEtaria === classificacao.CodFaixaEtaria)
                    };
                });

                setClassificacoes(classificacoes);
                setJogosPorClassificacao(jogosAgrupados);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen text-white flex items-center justify-center">
                <div className="animate-pulse">Carregando jogos...</div>
            </div>
        );
    }

    return (
        <div className=" text-white mt-40 min-h-screen py-10 px-4">
            <h2 className="text-3xl font-bold text-lime-500 mb-8 text-center">
                Jogos por Classificação Indicativa
            </h2>

            <div className="max-w-5xl mx-auto">
                {classificacoes.map(classificacao => {
                    const dados = jogosPorClassificacao[classificacao.CodFaixaEtaria];
                    if (!dados || dados.jogos.length === 0) return null;

                    return (
                        <CarrosselClassificacao
                            key={classificacao.CodFaixaEtaria}
                            classificacao={classificacao}
                            jogos={dados.jogos}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Classificacao;