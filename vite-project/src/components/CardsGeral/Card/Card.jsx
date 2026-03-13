import React from "react";
import { useNavigate } from "react-router-dom";

export const CardJogo = ({ jogo }) => {
  const navigate = useNavigate();

  // Cálculo centralizado para evitar repetição
  const temDesconto = jogo.Desconto > 0;
  const precoOriginal = jogo.Preco.toFixed(2).replace(".", ",");
  const precoComDesconto = temDesconto
    ? (jogo.Preco * (1 - jogo.Desconto / 100)).toFixed(2).replace(".", ",")
    : null;

  const handleClick = (e) => {
    e.preventDefault();
    // Envia os dados para o Template_jogo via state
    navigate(`/jogo/${jogo.CodJogo}`, {
      state: {
        jogoData: jogo,
        fromCard: true,
      },
    });
  };

  return (
    <a href={`/jogo/${jogo.CodJogo}`} onClick={handleClick} className="block">
      <div className="bg-stone-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:scale-105 w-40 md:w-44 mx-auto group border border-stone-700 hover:border-lime-500/50">
        {/* Container da Imagem */}
        <div className="relative w-full h-48 bg-stone-900 flex items-center justify-center overflow-hidden">
          {jogo.ImageUrl ? (
            <img
              src={jogo.ImageUrl}
              alt={jogo.Nome}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <span className="text-stone-500 text-xs">Sem imagem</span>
          )}

          {/* Badge de desconto estilizado */}
          {temDesconto && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg">
              -{jogo.Desconto}%
            </div>
          )}
        </div>

        {/* Informações do Jogo */}
        <div className="p-3 flex flex-col justify-between h-28">
          <div>
            <p className="text-stone-500 text-[10px] uppercase tracking-wider font-bold">
              Jogo Base
            </p>
            <p
              className="text-gray-100 font-semibold text-sm truncate leading-tight mt-1"
              title={jogo.Nome}
            >
              {jogo.Nome}
            </p>
          </div>

          <div className="mt-auto">
            {temDesconto ? (
              <div className="flex flex-col">
                <span className="line-through text-stone-500 text-[10px]">
                  R$ {precoOriginal}
                </span>
                <span className="text-lime-500 font-black text-sm">
                  R$ {precoComDesconto}
                </span>
              </div>
            ) : (
              <span className="text-lime-500 font-black text-sm">
                R$ {precoOriginal}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default CardJogo;
