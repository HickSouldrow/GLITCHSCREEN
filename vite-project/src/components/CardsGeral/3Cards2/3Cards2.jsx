import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../../services/firebase";
import { ref, get } from "firebase/database";

export const CardJogo = ({ jogo }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/jogo/${jogo.CodJogo}`, {
      state: {
        jogoData: jogo,
        fromCard: true,
      },
    });
  };

  const precoOriginal = (jogo.Preco || 0).toFixed(2).replace(".", ",");
  const precoFinal = (jogo.Preco * (1 - (jogo.Desconto || 0) / 100))
    .toFixed(2)
    .replace(".", ",");

  return (
    <div className="flex flex-col w-full bg-stone-800 rounded-lg shadow-lg overflow-hidden h-full transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <a href={`/jogo/${jogo.CodJogo}`} onClick={handleClick} className="block">
        <div className="h-48 bg-stone-900 flex items-center justify-center overflow-hidden">
          {jogo.ImageUrl || jogo.Imagem ? (
            <img
              src={jogo.ImageUrl || jogo.Imagem}
              alt={jogo.Nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-stone-500 text-sm italic">Sem imagem</span>
          )}
        </div>
        <div className="p-4 flex flex-col justify-between flex-grow">
          <h3 className="text-white font-bold text-md mb-2 truncate uppercase tracking-tighter">
            {jogo.Nome}
          </h3>

          {jogo.Preco === 0 ? (
            <span className="text-lime-500 font-bold">Gratuito</span>
          ) : (
            <div className="flex flex-col">
              {jogo.Desconto > 0 && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                    -{jogo.Desconto}%
                  </span>
                  <span className="line-through text-stone-500 text-xs">
                    R$ {precoOriginal}
                  </span>
                </div>
              )}
              <span className="text-lime-500 font-black text-lg">
                R$ {precoFinal}
              </span>
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export const ThreeCards2 = () => {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJogosProximosMedia = async () => {
      try {
        const jogosRef = ref(database, "jogos");
        const snapshot = await get(jogosRef);

        if (!snapshot.exists()) {
          setJogos([]);
          setLoading(false);
          return;
        }

        const data = snapshot.val();
        const listaJogos = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        const todosJogosPagos = listaJogos.filter(
          (jogo) => (jogo.Preco || 0) > 0,
        );

        if (todosJogosPagos.length === 0) {
          setJogos([]);
          setLoading(false);
          return;
        }

        // Cálculo da média
        const somaPrecos = todosJogosPagos.reduce((acc, jogo) => {
          const precoComDesconto =
            jogo.Preco * (1 - (jogo.Desconto || 0) / 100);
          return acc + precoComDesconto;
        }, 0);

        const mediaPrecos = somaPrecos / todosJogosPagos.length;

        // Lógica de distância da média
        const jogosComDistancia = todosJogosPagos.map((jogo) => {
          const precoComDesconto =
            jogo.Preco * (1 - (jogo.Desconto || 0) / 100);
          return {
            ...jogo,
            distanciaMedia: Math.abs(precoComDesconto - mediaPrecos),
          };
        });

        const jogosOrdenados = jogosComDistancia.sort(
          (a, b) => a.distanciaMedia - b.distanciaMedia,
        );

        setJogos(jogosOrdenados.slice(0, 3));
        setLoading(false);
      } catch (err) {
        console.error("Erro ao processar Realtime Database:", err);
        setError("Erro ao processar dados dos jogos.");
        setLoading(false);
      }
    };

    fetchJogosProximosMedia();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-lime-500 mb-4"></div>
        <p className="text-stone-400 text-xs uppercase tracking-widest">
          Sincronizando Preços...
        </p>
      </div>
    );
  }

  if (error || jogos.length === 0) {
    return (
      <div className="text-center text-stone-500 py-12 border border-dashed border-stone-800 rounded-xl">
        <p className="text-sm uppercase tracking-widest">
          {error || "Nenhum título disponível no momento."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-2xl bg-stone-900 border border-stone-800 shadow-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px bg-stone-800 flex-grow"></div>
        <h2 className="text-sm font-black text-lime-500 uppercase tracking-[0.3em]">
          Preços do Momento
        </h2>
        <div className="h-px bg-stone-800 flex-grow"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {jogos.map((jogo) => (
          <CardJogo key={jogo.id} jogo={jogo} />
        ))}
      </div>
    </div>
  );
};
