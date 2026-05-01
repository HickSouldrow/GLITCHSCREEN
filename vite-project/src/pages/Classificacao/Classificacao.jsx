import React, { useState, useEffect } from "react";
import { database } from "../../services/firebase";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

// Componente de Card (Mantendo o estilo do Avaliação)
const CardJogo = ({ jogo }) => {
  const navigate = useNavigate();
  const preco = Number(String(jogo.Preco).replace(",", ".")) || 0;
  const desconto = Number(jogo.Desconto) || 0;
  const jogoId = jogo.id || jogo.CodJogo;

  const precoOriginal = preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const precoComDesconto = (preco - (desconto / 100) * preco).toLocaleString(
    "pt-BR",
    { style: "currency", currency: "BRL" },
  );

  return (
    <div
      onClick={() =>
        navigate(`/jogo/${jogoId}`, {
          state: { jogoData: jogo, fromCard: true },
        })
      }
      className="cursor-pointer bg-stone-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 h-full mx-2 hover:shadow-xl hover:scale-105 group"
    >
      <div className="relative w-full h-40 bg-stone-700 flex items-center justify-center overflow-hidden">
        {jogo.ImageUrl || jogo.Imagem ? (
          <img
            src={jogo.ImageUrl || jogo.Imagem}
            alt={jogo.Nome}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span className="text-white text-[10px]">Sem imagem</span>
        )}
        {desconto > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-md animate-pulse">
            -{desconto}%
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-gray-400 text-[9px] uppercase mb-1">Jogo Base</p>
        <p className="text-gray-100 font-semibold text-xs group-hover:text-lime-400 transition-colors duration-200 truncate">
          {jogo.Nome}
        </p>
        <div className="mt-2 text-lime-500 font-bold text-sm">
          {desconto > 0 ? precoComDesconto : precoOriginal}
        </div>
      </div>
    </div>
  );
};

// Componente do Carrossel (Igual ao de Avaliação)
const CarrosselGenerico = ({ jogos }) => {
  const [startIndex, setStartIndex] = useState(0);
  const cardsPorVez = 3;

  const anteCards = () =>
    setStartIndex((prev) => Math.max(prev - cardsPorVez, 0));
  const proxCards = () =>
    setStartIndex((prev) =>
      Math.min(prev + cardsPorVez, jogos.length - cardsPorVez),
    );

  const mostrarCards = jogos.slice(startIndex, startIndex + cardsPorVez);

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-10 mb-40">
      <div className="flex items-center">
        {startIndex > 0 && (
          <button
            onClick={anteCards}
            className="absolute -left-4 z-20 p-2 bg-stone-700 text-lime-500 rounded-full shadow-lg"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        <div className="flex overflow-hidden w-full py-4 transition-all duration-500">
          {mostrarCards.map((jogo) => (
            <div key={jogo.id} className="flex-shrink-0 w-full md:w-1/3">
              <CardJogo jogo={jogo} />
            </div>
          ))}
        </div>

        {startIndex + cardsPorVez < jogos.length && (
          <button
            onClick={proxCards}
            className="absolute -right-4 z-20 p-2 bg-stone-700 text-lime-500 rounded-full shadow-lg"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="rotate-180"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

const Classificacao = () => {
  const [dadosAgrupados, setDadosAgrupados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classSnap, jogosSnap] = await Promise.all([
          get(ref(database, "classificacoes")),
          get(ref(database, "jogos")),
        ]);

        if (classSnap.exists() && jogosSnap.exists()) {
          const listaClass = Object.keys(classSnap.val()).map((k) => ({
            id_firebase: k,
            ...classSnap.val()[k],
          }));
          const listaJogos = Object.keys(jogosSnap.val()).map((k) => ({
            id: k,
            ...jogosSnap.val()[k],
          }));

          // LÓGICA DE FILTRAGEM CORRIGIDA
          const resultado = listaClass
            .map((cls) => {
              // Tentamos comparar pelo CodFaixaEtaria que você enviou (1, 2, 3...)
              const valorParaComparar = cls.CodFaixaEtaria;

              const filtrados = listaJogos.filter((j) => {
                // Comparamos o CodFaixaEtaria do jogo com o da categoria
                return Number(j.CodFaixaEtaria) === Number(valorParaComparar);
              });

              return { ...cls, jogos: filtrados };
            })
            .filter((item) => item.jogos.length > 0);

          setDadosAgrupados(resultado);
        }
      } catch (error) {
        console.error("Erro na busca:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-lime-500 animate-pulse font-bold">
        CARREGANDO CLASSIFICAÇÕES...
      </div>
    );

  return (
    <div className=" text-white min-h-screen py-10 mt-30 px-6">
      <header className="max-w-7xl mx-auto mb-16 text-center">
        <h2 className="text-4xl font-black text-lime-500 mb-2 uppercase tracking-tighter">
          Classificação Indicativa
        </h2>
        <div className="h-1 w-24 bg-lime-500 mx-auto rounded-full"></div>
      </header>

      <div className="space-y-16">
        {dadosAgrupados.map((cat) => (
          <div key={cat.id_firebase} className="max-w-6xl mx-auto px-4">
            <h3 className="text-xl font-bold text-lime-500 mb-6 flex items-center gap-3 border-l-4 border-lime-500 pl-4">
              {cat.ClassificacaoIndicativa}
              <span className="text-sm text-gray-500 font-normal">
                ({cat.jogos.length} jogos encontrados)
              </span>
            </h3>
            <CarrosselGenerico jogos={cat.jogos} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classificacao;
