import React, { useEffect, useState } from 'react';
import Card from '../../components/CardsGeral/Card/Card'
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { FaSadTear } from 'react-icons/fa';

const Resultados = ({pesquisaa}) => {
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
        const res = (await fetch(`http://localhost:5000/jogos`));
        const data = await res.json();
        const filtrados = [];
  
        data.forEach(element => {
          if (element.Nome.toLowerCase().includes(pesquisa.toLowerCase())) {
            filtrados.push(element);
          }
        });

        setResultados(filtrados);
      } catch (err) {
        setErro('Erro ao buscar jogos');
      } finally {
        setCarregando(false);
      }
    };

    if (pesquisa) {
      buscarJogos();
    } else {
      setResultados([]); // limpa resultados se não houver pesquisa
    }
  }, [pesquisa]);

  return (
    <div className='container mx-auto relative w-full px-4 py-20'>
      <h2 className='text-xl font-bold text-lime-500 mb-6 text-center'>Resultados para "{pesquisa}"</h2>
      {carregando && <p>Carregando...</p>}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {/* Mensagem de “nenhum jogo” com estilo */}
      {!carregando && resultados.length === 0 && (
        <div className="mt-28 text-2xl text-gray-600 flex items-center gap-3">
          <FaSadTear size={56} /> {/* ícone grande */}
          <span>Nenhum jogo encontrado.</span>
        </div>
      
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {resultados.map((jogo) => (
          <li key={jogo.id} style={{ marginBottom: '16px' }}>
            <Card jogo={jogo} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export { Resultados };
