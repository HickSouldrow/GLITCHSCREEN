import React from 'react';

const CardJogo = ({ jogo }) => {
    return (
        <div className="bg-stone-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-2xl w-40 mx-auto">
            <div className="w-full h-32 bg-lime-600"></div>
            <div className="p-3">
                <p className="text-gray-300 text-xs">Jogo Base</p>
                <p className="text-gray-300 text-sm font-semibold">{jogo.Nome}</p>
                <div className="mt-1">
                    <span className="bg-rose-700 rounded-full px-2 py-0.5 text-white font-bold text-xs">-{jogo.Desconto}%</span>
                    <div className="flex items-center mt-1">
                        <span className="line-through text-gray-400 mr-1 text-xs">R$ {jogo.Preco}</span>
                        <span className="text-lime-600 font-bold text-xs">R$ {jogo.Preco - (jogo.Desconto / 100) * jogo.Preco}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardJogo;