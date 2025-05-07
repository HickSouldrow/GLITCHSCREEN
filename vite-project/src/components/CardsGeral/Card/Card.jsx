import React from 'react';
import { useNavigate } from 'react-router-dom';

const CardJogo = ({ jogo }) => {
    const navigate = useNavigate();
    const precoOriginal = jogo.Preco.toFixed(2).replace('.', ',');
    const precoComDesconto = (jogo.Preco - (jogo.Desconto / 100) * jogo.Preco).toFixed(2).replace('.', ',');

    const handleClick = (e) => {
        e.preventDefault();
        // Envia TODOS os dados do jogo para a página de detalhes
        navigate(`/jogo/${jogo.CodJogo}`, { 
            state: { 
                jogoData: jogo,
                fromCard: true 
            }
        });
    };

    return (
        <a href={`/jogo/${jogo.CodJogo}`} onClick={handleClick} className="block">
            <div className="bg-stone-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-transform hover:scale-105 w-40 md:w-44 mx-auto group">
                {/* Imagem */}
                <div className="relative w-full h-40 bg-lime-600 flex items-center justify-center overflow-hidden">
                    {jogo.ImageUrl ? (
                        <img 
                            src={jogo.ImageUrl} 
                            alt={jogo.Nome} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    ) : (
                        <span className="text-white text-sm">Sem imagem</span>
                    )}

                    {/* Badge de desconto */}
                    {jogo.Desconto > 0 && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md transform -rotate-2">
                            -{jogo.Desconto}%
                        </div>
                    )}
                </div>

                {/* Informações */}
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

export default CardJogo;