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

  const precoFinal = (jogo.Preco * (1 - (jogo.Desconto || 0) / 100))
    .toFixed(2)
    .replace(".", ",");

  return (
    <div className="flex flex-col w-full bg-stone-800 rounded-lg shadow-lg overflow-hidden h-full transform transition duration-300 hover:scale-105 hover:shadow-xl border border-stone-700/50">
      <a href={`/jogo/${jogo.CodJogo}`} onClick={handleClick} className="block">
        <div className="h-60 bg-stone-900 flex items-center justify-center relative transition duration-300 group">
          {jogo.ImageUrl || jogo.Imagem ? (
            <img
              src={jogo.ImageUrl || jogo.Imagem}
              alt={jogo.Nome}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100"
            />
          ) : (
            <span className="text-stone-500 text-sm italic">Sem imagem</span>
          )}

          {jogo.Desconto > 0 && (
            <span className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg">
              -{jogo.Desconto}%
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-white font-bold text-md mb-3 line-clamp-1 uppercase tracking-tight">
            {jogo.Nome}
          </h3>

          {jogo.Preco === 0 ? (
            <span className="text-lime-500 font-bold text-sm">Gratuito</span>
          ) : (
            <div className="flex flex-col">
              {jogo.Desconto > 0 && (
                <span className="line-through text-stone-500 text-xs mb-1">
                  R$ {jogo.Preco.toFixed(2).replace(".", ",")}
                </span>
              )}
              <span className="text-lime-500 font-black text-xl">
                R$ {precoFinal}
              </span>
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export const ThreeCards = () => {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJogosMaisCaros = async () => {
      try {
        const jogosRef = ref(database, "jogos");
        const snapshot = await get(jogosRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          // Converte o objeto do Realtime para Array
          const listaJogos = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          // Ordenação pelos mais caros (Preço com desconto)
          const jogosOrdenados = listaJogos.sort((a, b) => {
            const precoA = a.Preco * (1 - (a.Desconto || 0) / 100);
            const precoB = b.Preco * (1 - (b.Desconto || 0) / 100);
            return precoB - precoA;
          });

          setJogos(jogosOrdenados.slice(0, 3));
        }
        setLoading(false);
      } catch (err) {
        console.error("Erro no Realtime Database:", err);
        setError("Não foi possível carregar os títulos populares.");
        setLoading(false);
      }
    };

    fetchJogosMaisCaros();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || jogos.length === 0) {
    return (
      <div className="text-center text-stone-500 py-10 uppercase tracking-widest text-xs">
        {error || "Nenhum jogo encontrado"}
      </div>
    );
  }

  return (
    <div className="p-8 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-lime-950/20 shadow-2xl border border-stone-800">
      <h2 className="text-sm font-black text-lime-500 mb-8 text-center uppercase tracking-[0.4em]">
        Jogos Populares
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {jogos.map((jogo) => (
          <div key={jogo.id} className="flex h-full">
            <CardJogo jogo={jogo} />
          </div>
        ))}
      </div>
    </div>
  );
};
