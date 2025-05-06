import React, { useState, useEffect } from "react";
import axios from "axios";

const CardJogo = ({ jogo }) => {
  return (
    <div className="flex flex-col w-full bg-stone-800 rounded-lg shadow-lg overflow-hidden h-full transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <div className="h-60 bg-lime-600 flex items-center justify-center transition duration-300 hover:bg-lime-500">
        {jogo.ImageUrl ? (
          <img 
            src={jogo.ImageUrl} 
            alt={jogo.Nome} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-lg">Sem imagem</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2">{jogo.Nome}</h3>
        {jogo.Preco === 0 ? (
          <span className="text-lime-600 font-bold">Gratuito</span>
        ) : (
          <div>
            {jogo.Desconto > 0 && (
              <div className="flex items-center">
                <span className="line-through text-gray-400 mr-2">R$ {jogo.Preco.toFixed(2).replace('.', ',')}</span>
                <span className="bg-rose-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{jogo.Desconto}%
                </span>
              </div>
            )}
            <span className="text-lime-600 font-bold">
              R$ {(jogo.Preco * (1 - jogo.Desconto/100)).toFixed(2).replace('.', ',')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const ThreeCards = () => {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJogosMaisCaros = async () => {
      try {
        const response = await axios.get('http://localhost:5000/jogos');
        
        // Ordena do mais caro para o mais barato
        const jogosOrdenados = response.data.sort((a, b) => {
          // Considera o preço com desconto para ordenação
          const precoA = a.Preco * (1 - a.Desconto/100);
          const precoB = b.Preco * (1 - b.Desconto/100);
          return precoB - precoA;
        });

        // Pega os 3 mais caros
        const tresMaisCaros = jogosOrdenados.slice(0, 3);
        
        setJogos(tresMaisCaros);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar jogos:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJogosMaisCaros();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-white py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lime-500 mb-2"></div>
        <p>Carregando jogos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p>Erro ao carregar jogos:</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (jogos.length === 0) {
    return (
      <div className="text-center text-white py-8">
        <svg className="w-12 h-12 mx-auto mb-2 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p>Nenhum jogo encontrado.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-stone-900 via-lime-950 shadow-2xl">
      <h2 className="text-xl font-bold text-lime-500 mb-6 text-center">JOGOS POPULARES</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jogos.map((jogo) => (
          <div key={jogo.id} className="flex">
            <CardJogo jogo={jogo} />
          </div>
        ))}
      </div>
    </div>
  );
};

export { ThreeCards };