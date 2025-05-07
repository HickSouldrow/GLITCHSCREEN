import React, { useEffect, useState } from "react";
import axios from "axios";

const HorizontalGameCard = ({ jogo }) => {
  return (
    <div className="flex p-3 bg-stone-800 rounded-lg hover:bg-stone-700 transition-all">
      <div className="w-16 h-20 flex-shrink-0">
        <div className="w-full h-full bg-lime-600 rounded-l-lg flex items-center justify-center">
          {/* Um espaço para imagem no futuro */}
        </div>
      </div>

      <div className="flex flex-col justify-between ml-3 w-full">
        <p className="text-white font-bold text-sm truncate">{jogo.Nome}</p>
        <div className="flex items-center mt-1">
          <span className="text-lime-500 font-bold text-sm">
            R$ {jogo.Preco.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
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
