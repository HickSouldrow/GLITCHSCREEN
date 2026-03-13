import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../services/firebase";
import { collection, getDocs } from "firebase/firestore";

export const HorizontalGameCard = ({ jogo }) => {
  const navigate = useNavigate();

  const temDesconto = jogo.Desconto > 0;
  const precoOriginal = jogo.Preco.toFixed(2).replace(".", ",");
  const precoComDesconto = temDesconto
    ? (jogo.Preco * (1 - jogo.Desconto / 100)).toFixed(2).replace(".", ",")
    : null;

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/jogo/${jogo.CodJogo}`, {
      state: {
        jogoData: jogo,
        fromCard: true,
      },
    });
  };

  return (
    <a
      href={`/jogo/${jogo.CodJogo}`}
      onClick={handleClick}
      className="block hover:no-underline group"
    >
      <div className="flex bg-stone-800 rounded-lg hover:bg-stone-750 border border-transparent hover:border-stone-600 transition-all h-24 cursor-pointer overflow-hidden">
        <div className="w-20 h-24 flex-shrink-0">
          {jogo.ImageUrl ? (
            <img
              className="w-full h-full object-cover bg-stone-900"
              src={jogo.ImageUrl}
              alt={jogo.Nome}
            />
          ) : (
            <div className="w-full h-full bg-stone-900 flex items-center justify-center text-[10px] text-stone-500">
              Sem foto
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between p-3 w-full">
          <div className="flex w-full justify-between items-start gap-2">
            <p className="text-white font-bold text-xs line-clamp-2 group-hover:text-lime-400 transition-colors uppercase tracking-tight">
              {jogo.Nome}
            </p>

            {temDesconto && (
              <div className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                -{jogo.Desconto}%
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {temDesconto ? (
              <>
                <span className="line-through text-stone-500 text-[10px]">
                  R$ {precoOriginal}
                </span>
                <span className="text-lime-500 font-bold text-xs">
                  R$ {precoComDesconto}
                </span>
              </>
            ) : (
              <span className="text-lime-500 font-bold text-xs">
                R$ {precoOriginal}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export const SolidCards = () => {
  const [jogos, setJogos] = useState([]);

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jogos"));
        const jogosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJogos(jogosData);
      } catch (error) {
        console.error("Erro ao buscar os jogos no Firebase:", error);
      }
    };

    fetchJogos();
  }, []);

  const filtrarJogos = (filtro) => {
    return jogos.filter(filtro).slice(0, 5);
  };

  // Mantendo a sua lógica de filtros baseada na faixa etária
  const vendidos = filtrarJogos((j) => j.CodFaixaEtaria <= 2);
  const jogados = filtrarJogos(
    (j) => j.CodFaixaEtaria >= 3 && j.CodFaixaEtaria <= 4,
  );
  const aguardados = filtrarJogos((j) => j.CodFaixaEtaria >= 2);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        {/* Coluna 1 - Mais vendidos */}
        <div>
          <h4 className="text-stone-400 text-xs font-black uppercase tracking-widest mb-4 border-l-2 border-lime-500 pl-2">
            Mais vendidos
          </h4>
          <div className="space-y-3">
            {vendidos.map((jogo) => (
              <HorizontalGameCard key={jogo.id} jogo={jogo} />
            ))}
          </div>
        </div>

        {/* Coluna 2 - Mais jogados */}
        <div>
          <h4 className="text-stone-400 text-xs font-black uppercase tracking-widest mb-4 border-l-2 border-lime-500 pl-2">
            Mais jogados
          </h4>
          <div className="space-y-3">
            {jogados.map((jogo) => (
              <HorizontalGameCard key={jogo.id} jogo={jogo} />
            ))}
          </div>
        </div>

        {/* Coluna 3 - Mais aguardados */}
        <div>
          <h4 className="text-stone-400 text-xs font-black uppercase tracking-widest mb-4 border-l-2 border-lime-500 pl-2">
            Mais Aguardados
          </h4>
          <div className="space-y-3">
            {aguardados.map((jogo) => (
              <HorizontalGameCard key={jogo.id} jogo={jogo} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800 my-10"></div>
    </div>
  );
};
