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
    <div style={{ padding: '20px', minHeight: '80vh' }}>
      <h2>Resultados para "{pesquisa}"</h2>
      {carregando && <p>Carregando...</p>}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {/* Mensagem de “nenhum jogo” com estilo */}
      {!carregando && resultados.length === 0 && (
        <div
          style={{
            marginTop: '120px',      // empurra pra baixo
            textAlign: 'center',     // centraliza
            fontSize: '1.8rem',      // texto maior
            color: '#555',
            display: 'flex',         // alinhamento ícone + texto
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <FaSadTear size={56} />   {/* ícone grande */}
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
