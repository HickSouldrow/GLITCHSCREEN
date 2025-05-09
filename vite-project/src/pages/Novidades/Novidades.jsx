import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Componente do card do jogo (mantido igual)
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
            className="block h-full transition-all duration-300 hover:z-10"
        >
            <div className="bg-stone-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 h-75 mx-2 group relative">
                <div className="relative w-full h-48 bg-stone-700 flex items-center justify-center overflow-hidden">
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
                <div className="p-3 flex flex-col justify-between h-24 transition-all duration-200">
                    <div>
                        <p className="text-gray-400 text-[0.7rem] mb-1">Jogo Base</p>
                        <p 
                            className="text-gray-100 font-semibold text-sm truncate group-hover:text-lime-400 transition-colors duration-200" 
                            title={jogo.Nome}
                        >
                            {jogo.Nome}
                        </p>
                    </div>
                    <div className="mt-2">
                        {jogo.Desconto > 0 ? (
                            <div className="flex items-center gap-1">
                                <span className="line-through text-gray-400 text-[0.7rem]">R$ {precoOriginal}</span>
                                <span className="text-lime-500 font-bold text-sm">R$ {precoComDesconto}</span>
                            </div>
                        ) : (
                            <span className="text-lime-500 font-bold text-sm">R$ {precoOriginal}</span>
                        )}
                    </div>
                </div>
            </div>
        </a>
    );
};

// Componente do carrossel com animações
const Carrossel = ({ titulo, jogos }) => {
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
        <div className="mb-16">
            <div className="flex items-center max-w-6xl justify-between mb-6 px-4">
                <h3 className="text-2xl font-bold text-lime-500">{titulo}</h3>
            </div>

            <div className="relative w-full max-w-6xl mx-auto">
                {/* Estilos das animações */}
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

                    <div className="flex overflow-hidden w-full h-90 py-2 relative">
                        {mostrarCards.map((jogo, index) => (
                            <div
                                key={`${startIndex}-${index}`}
                                className={`flex-shrink-0 w-1/4 px-2 ${
                                    isAnimating ? getAnimationClass() :
                                    direction === 'right' ? 'animate-slideInLeft' : 'animate-slideInRight'
                                }`}
                            >
                                <CardJogoCarrossel jogo={jogo} />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={proxCards}
                        disabled={isAnimating || startIndex + 4 >= jogos.length}
                        className={`p-3 bg-stone-700 text-lime-500 rounded-full hover:bg-stone-600 transition-transform duration-200 transform hover:scale-110 ${
                            isAnimating || startIndex + 4 >= jogos.length ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        <svg width="15" height="15" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="10" height="10" fill="#44403c" rx="25" />
                            <path d="M20 10L35 25L20 40" stroke="#84cc16" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente principal
const Novidades = () => {
    const [jogos, setJogos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/jogos');
                setJogos(response.data);
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

    // Ordena jogos por data de lançamento (mais recentes primeiro)
    const jogosPorDataRecente = [...jogos].sort((a, b) => 
        new Date(b.DtLancamento) - new Date(a.DtLancamento)
    );

    // Ordena jogos por data de lançamento (mais antigos primeiro)
    const jogosPorDataAntiga = [...jogos].sort((a, b) => 
        new Date(a.DtLancamento) - new Date(b.DtLancamento)
    );

    // Filtra apenas jogos com desconto para os carrosseis
    const lancamentosRecentes = jogosPorDataRecente.filter(jogo => jogo.Desconto > 0).slice(0, 12);
    const lancamentosAntigos = jogosPorDataAntiga.filter(jogo => jogo.Desconto > 0).slice(0, 12);

    return (
        <div className="text-white mt-20 min-h-screen py-10 px-4">
            <div className="text-center">
                <h1 className="text-white text-3xl font-bold">Novidades</h1>
                <div className="w-40 h-1 bg-lime-800 mb-20 mx-auto mt-2"></div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div>
                    <li className="text-lime-500 px-15 text-2xl mt-20 font-bold">Lançamentos Recentes</li>
                </div>
                <Carrossel 
                    jogos={lancamentosRecentes} 
                />
                <div>
                    <li className="text-lime-500 px-15 text-2xl mt-20 font-bold">Coletâneas Anteriores (Para Aqueles que Gostam dos Clássicos):</li>
                </div>
                <Carrossel 
                    titulo=""
                    jogos={lancamentosAntigos} 
                />
            </div>
        </div>
    );
};

export default Novidades;