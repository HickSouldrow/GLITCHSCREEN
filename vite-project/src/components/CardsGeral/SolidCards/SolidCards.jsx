import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HorizontalGameCard = ({ jogo }) => {
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
      className="block hover:no-underline"
    >
      <div className="flex bg-stone-800 rounded-lg hover:bg-stone-700 transition-all h-26 cursor-pointer">
        <div className="w-22 h-26 flex-shrink-0">
          <img 
            className="w-full h-full bg-lime-600 rounded-l-lg flex items-center justify-center" 
            src={jogo.ImageUrl} 
            alt={jogo.Nome}
          />
        </div>

        <div className="flex flex-col justify-between ml-3 w-full mt-3 mb-3">
          <div className="flex w-full justify-between">
            {/*Título*/}
            <p className="text-white font-bold text-sm truncate hover:text-lime-400 transition-colors">
              {jogo.Nome}
            </p>
            
            {/*Ícone de desconto*/}
            {jogo.Desconto > 0 && (
                <div className="bg-red-600 text-white text-xs font-bold px-1 py-0 rounded shadow-md transform -rotate-2 mr-3">
                  -{jogo.Desconto}%
                </div>
            )}
          </div>

          <div className="flex items-center mt-1">
            <div className="flex items-center gap-1 mt-1 flex-col">
              <span className="line-through text-gray-400 text-xs">R$ {precoOriginal}</span>
              <span className="text-lime-500 font-bold text-sm">R$ {precoComDesconto}</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

const SolidCards = () => {
  const [jogos, setJogos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/jogos")
      .then((response) => setJogos(response.data))
      .catch((error) => console.error("Erro ao buscar os jogos:", error));
  }, []);

  const filtrarJogos = (filtro) => {
    return jogos
      .filter(filtro)
      .slice(0, 5); // Pega no máximo 5 jogos por categoria
  };

  const vendidos = filtrarJogos((j) => j.CodFaixaEtaria <= 2);
  const jogados = filtrarJogos((j) => j.CodFaixaEtaria >= 3 && j.CodFaixaEtaria <= 4);
  const aguardados = filtrarJogos((j) => j.CodFaixaEtaria >= 2);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Coluna 1 - Mais vendidos */}
        <div className="relative">
          <h4 className="text-lg font-bold mb-4">Mais vendidos</h4>
          <div className="space-y-3">
            {vendidos.map((jogo) => (
              <HorizontalGameCard key={jogo.CodJogo} jogo={jogo} />
            ))}
          </div>
        </div>

        {/* Coluna 2 - Mais jogados */}
        <div className="relative">
          <h4 className="text-lg font-bold mb-4">Mais jogados</h4>
          <div className="space-y-3">
            {jogados.map((jogo) => (
              <HorizontalGameCard key={jogo.CodJogo} jogo={jogo} />
            ))}
          </div>
        </div>

        {/* Coluna 3 - Mais aguardados */}
        <div className="relative">
          <h4 className="text-lg font-bold mb-4">Títulos Mais Aguardados</h4>
          <div className="space-y-3">
            {aguardados.map((jogo) => (
              <HorizontalGameCard key={jogo.CodJogo} jogo={jogo} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t-2 border-b-2 border-lime-700 my-6"></div>
    </div>
  );
};

export { SolidCards };