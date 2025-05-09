import React, { useEffect, useState } from 'react';
import Card from '../../components/CardsGeral/Card/Card';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { FaSadTear, FaSearch } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

const Resultados = ({ pesquisaa }) => {
  const [searchParams] = useSearchParams();
  const pesquisa = searchParams.get('busca') || '';
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
        const filtrados = data.filter(element => 
          element.Nome.toLowerCase().includes(pesquisa.toLowerCase())
        );
        
        setResultados(filtrados);
      } catch (err) {
        setErro('Erro ao buscar jogos. Tente novamente mais tarde.');
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
    <div className="min-h-screen text-white pt-28 pb-16 px-4 mb-20 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-20">
        {/* Cabeçalho da pesquisa */}
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-bold text-lime-500 mb-2 flex items-center">
            <FaSearch className="mr-3" />
            Resultados para "{pesquisa}"
          </h2>
          <p className="text-stone-400 p-4">
            {resultados.length} {resultados.length === 1 ? 'jogo encontrado' : 'jogos encontrados'}
          </p>
        </div>

        {/* Estado de carregamento */}
        {carregando && (
          <div className="flex justify-center items-center py-20">
            <ImSpinner8 className="animate-spin text-lime-500 text-4xl" />
          </div>
        )}

        {/* Mensagem de erro */}
        {erro && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 max-w-2xl mx-auto text-center">
            {erro}
          </div>
        )}

        {/* Nenhum resultado encontrado */}
        {!carregando && resultados.length === 0 && !erro && (
          <div className="flex flex-col items-center mb-20 justify-center py-20 text-center">
            <FaSadTear className="text-6xl text-lime-500 mb-20" />
            <h3 className="text-2xl font-semibold text-stone-300 mb-2">
              Nenhum jogo encontrado
            </h3>
            <p className="text-stone-500 max-w-md">
              Não encontramos jogos correspondentes à sua pesquisa. Tente usar termos diferentes.
            </p>
          </div>
        )}

        {/* Grid de resultados */}
        {!carregando && resultados.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resultados.map((jogo) => (
              <Card 
                key={jogo.CodJogo} 
                jogo={jogo} 
                className="transition-transform hover:scale-105"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { Resultados };