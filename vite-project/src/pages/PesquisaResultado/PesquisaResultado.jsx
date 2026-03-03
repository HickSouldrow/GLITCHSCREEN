import React, { useEffect, useState } from "react";
import Card from "../../components/CardsGeral/Card/Card";
import { useSearchParams } from "react-router-dom";
import { FaSadTear, FaSearch } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

const Resultados = () => {
  const [searchParams] = useSearchParams();
  const pesquisa = searchParams.get("busca") || "";
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarJogos = async () => {
      setCarregando(true);
      setErro(null);

      try {
        const res = await fetch(`http://localhost:5000/jogos`);
        const data = await res.json();

        const filtrados = data.filter((element) =>
          element.Nome.toLowerCase().includes(pesquisa.toLowerCase()),
        );

        setResultados(filtrados);
      } catch (err) {
        setErro("Erro ao buscar jogos. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setCarregando(false);
      }
    };

    if (pesquisa) {
      buscarJogos();
    } else {
      setResultados([]);
    }
  }, [pesquisa]);

  return (
    <div className="min-h-screen text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-900 to-stone-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-lime-500 flex justify-center items-center gap-3">
            <FaSearch />
            Resultados da busca
          </h2>

          {pesquisa && (
            <p className="text-stone-400 mt-3 text-lg">
              Você pesquisou por:
              <span className="text-lime-400 font-semibold ml-2">
                "{pesquisa}"
              </span>
            </p>
          )}

          {!carregando && (
            <p className="text-stone-500 mt-2">
              {resultados.length}{" "}
              {resultados.length === 1
                ? "jogo encontrado"
                : "jogos encontrados"}
            </p>
          )}
        </div>

        {carregando && (
          <div className="flex flex-col items-center justify-center py-24">
            <ImSpinner8 className="animate-spin text-lime-500 text-5xl mb-4" />
            <p className="text-stone-400 animate-pulse">Buscando jogos...</p>
          </div>
        )}

        {erro && (
          <div className="bg-red-900/40 border border-red-700 rounded-xl p-6 max-w-xl mx-auto text-center shadow-lg">
            <p className="text-red-400 font-semibold">{erro}</p>
          </div>
        )}

        {!carregando && resultados.length === 0 && !erro && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FaSadTear className="text-7xl text-lime-600 mb-6 opacity-80" />
            <h3 className="text-2xl font-semibold text-stone-300 mb-3">
              Nenhum jogo encontrado
            </h3>
            <p className="text-stone-500 max-w-md">
              Não encontramos jogos correspondentes à sua pesquisa. Tente usar
              termos diferentes ou mais gerais.
            </p>
          </div>
        )}

        {!carregando && resultados.length > 0 && (
          <div
            className="grid 
    grid-cols-1 
    sm:grid-cols-2 
    md:grid-cols-3 
    lg:grid-cols-4 
    gap-x-4 
    gap-y-12
    justify-items-center
    animate-fadeIn"
          >
            {resultados.map((jogo) => (
              <div
                key={jogo.CodJogo}
                className="w-full max-w-[260px] transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
              >
                <Card jogo={jogo} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { Resultados };
