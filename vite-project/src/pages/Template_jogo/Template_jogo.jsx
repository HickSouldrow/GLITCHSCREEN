import React, { useState } from 'react';
import { FaStar, FaRegStar, FaShoppingCart, FaHeart, FaArrowLeft } from 'react-icons/fa';

const TemplateJogo = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Dados mockados para demonstração
  const game = {
    Nome: "Nome do Jogo",
    Descricao: "Descrição detalhada do jogo aqui...",
    Sinopse: "Sinopse do jogo aqui...",
    Preco: 99.99,
    Desconto: 20,
    Avaliacao: 4.5,
    Generos: ["Ação", "Aventura"],
    Categorias: ["Singleplayer", "Multiplayer"],
    Classificacao: "16+",
    DtLancamento: "2023-01-01",
    images: [
      "https://via.placeholder.com/800x450?text=Imagem+1",
      "https://via.placeholder.com/800x450?text=Imagem+2",
      "https://via.placeholder.com/800x450?text=Imagem+3"
    ],
    Desenvolvedora: {
      NomeDesenvolvedora: "Nome da Desenvolvedora",
      SiteOficial: "https://exemplo.com"
    },
    Requisitos: {
      SOMin: "Windows 10",
      CPUMin: "Intel Core i5",
      RAMmin: "8GB",
      GPUMin: "NVIDIA GTX 1060",
      Armazenamento: "50GB"
    }
  };

  const changeImage = (direction) => {
    setCurrentImageIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % game.images.length;
      } else {
        return (prev - 1 + game.images.length) % game.images.length;
      }
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.floor(rating) ? 
        <FaStar key={i} className="text-yellow-400 inline" /> : 
        <FaRegStar key={i} className="text-gray-400 inline" />
      );
    }
    return stars;
  };

  const discountedPrice = game.Preco * (1 - game.Desconto / 100);

  return (
<div className="justify-center mt-20 mb-30 min-h-screen">
{/* Container principal com efeito de borda brilhante */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Botão de voltar */}
        <button className="flex items-center text-lime-500 hover:text-lime-400 mb-6 transition-colors">
          <FaArrowLeft className="mr-2" /> Voltar
        </button>

        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          {/* Left Column - Game Content */}
          <div className="lg:w-2/3">
            <h1 className="text-4xl font-bold text-lime-500 mb-6 drop-shadow-[0_0_5px_rgba(132,204,22,0.5)]">
              {game.Nome}
            </h1>
            
            {/* Image Gallery */}
            <div className="mb-8 relative bg-gradient-to-br from-stone-800 to-stone-700 p-1 rounded-xl border border-lime-800 shadow-[0_0_10px_#84cc16]">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img 
                  src={game.images[currentImageIndex]} 
                  alt={game.Nome} 
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                
                {/* Navigation Arrows */}
                <button 
                  onClick={() => changeImage('prev')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-stone-800/80 hover:bg-stone-700/90 p-3 rounded-full transition-all shadow-lg"
                >
                  <svg className="w-6 h-6 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <button 
                  onClick={() => changeImage('next')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-stone-800/80 hover:bg-stone-700/90 p-3 rounded-full transition-all shadow-lg"
                >
                  <svg className="w-6 h-6 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
              
              {/* Thumbnails */}
              <div className="flex justify-center mt-4 space-x-2">
                {game.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-12 rounded overflow-hidden transition-all ${currentImageIndex === index ? 'ring-2 ring-lime-500 shadow-[0_0_5px_#84cc16]' : 'opacity-70 hover:opacity-100 border border-stone-600'}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-8 bg-stone-900 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16]">
              <h2 className="text-2xl font-semibold text-lime-400 mb-4">Descrição</h2>
              <p className="text-gray-300 whitespace-pre-line">{game.Descricao}</p>
            </div>
            
            {/* Synopsis */}
            <div className="mb-8 bg-stone-900 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16]">
              <h2 className="text-2xl font-semibold text-lime-400 mb-4">Sinopse</h2>
              <p className="text-gray-300 whitespace-pre-line">{game.Sinopse}</p>
            </div>
            
            {/* Requirements */}
            {game.Requisitos && (
              <div className="bg-stone-900 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16]">
                <h2 className="text-2xl font-semibold text-lime-400 mb-4">Requisitos do Sistema</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <h3 className="font-semibold text-lime-500 mb-2">Mínimos</h3>
                    <ul className="space-y-2">
                      <li><strong>SO:</strong> {game.Requisitos.SOMin}</li>
                      <li><strong>Processador:</strong> {game.Requisitos.CPUMin}</li>
                      <li><strong>Memória:</strong> {game.Requisitos.RAMmin}</li>
                      <li><strong>GPU:</strong> {game.Requisitos.GPUMin}</li>
                      <li><strong>Armazenamento:</strong> {game.Requisitos.Armazenamento}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Purchase Info */}
          <div className="lg:w-1/3">
            {/* Purchase Box */}
            <div className="bg-stone-900 p-6 rounded-xl border border-lime-800 shadow-[0_0_10px_#84cc16] ">
              <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Jogo Base</p>
              
              {/* Price */}
              <div className="mb-6">
                {game.Desconto > 0 && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      -{game.Desconto}%
                    </span>
                    <span className="text-gray-400 line-through text-sm">
                      R$ {game.Preco.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}
                <span className="text-3xl font-bold text-white">
                  R$ {discountedPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-gradient-to-r from-lime-700 to-lime-600 hover:from-lime-600 hover:to-lime-500 text-white font-bold py-3 rounded-lg shadow-md transition-transform transform hover:scale-[1.02]"
                >
                  Comprar agora
                </button>
                
                <button
                  className="w-full bg-gradient-to-r from-stone-700 to-stone-600 hover:from-stone-600 hover:to-stone-500 text-white font-bold py-3 rounded-lg shadow-md transition-transform transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <FaShoppingCart /> Adicionar ao carrinho
                </button>
                
                <button
                  className="w-full bg-gradient-to-r from-stone-700 to-stone-600 hover:from-stone-600 hover:to-stone-500 text-white font-bold py-3 rounded-lg shadow-md transition-transform transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <FaHeart /> Lista de desejos
                </button>
              </div>
              
              <p className="text-lime-400 text-center mt-4 text-sm">Ganhe 5% de volta</p>
            </div>
            
            {/* Game Info Box */}
            <div className=" bg-stone-900 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16] mt-6">
              <h3 className="text-2xl font-semibold text-lime-400 mb-4">Informações</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider">Avaliação</p>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(game.Avaliacao)}
                    <span className="text-white ml-1">({game.Avaliacao.toFixed(1)})</span>
                  </div>
                </div>
                
                {game.Generos?.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wider">Gênero</p>
                    <p className="text-white mt-1">{game.Generos.join(', ')}</p>
                  </div>
                )}
                
                {game.Categorias?.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wider">Categoria</p>
                    <p className="text-white mt-1">{game.Categorias.join(', ')}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider">Classificação</p>
                  <p className="text-white mt-1">{game.Classificacao}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider">Lançamento</p>
                  <p className="text-white mt-1">
                    {new Date(game.DtLancamento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Developer Info */}
            {game.Desenvolvedora && (
              <div className=" bg-stone-900 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16] mt-6">
                <h3 className="text-2xl font-semibold text-lime-400 mb-4">Desenvolvedora</h3>
                <div className="space-y-2">
                  <p className="text-white font-medium">{game.Desenvolvedora.NomeDesenvolvedora}</p>
                  {game.Desenvolvedora.SiteOficial && (
                    <a 
                      href={game.Desenvolvedora.SiteOficial} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lime-500 hover:underline text-sm block"
                    >
                      Site oficial
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-stone-800 to-stone-700 p-6 rounded-xl border border-lime-800 shadow-[0_0_15px_#84cc16] w-full max-w-md">
            <h2 className="text-2xl font-bold text-lime-500 mb-4">Forma de pagamento</h2>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Selecione o método:</label>
                <select
                  className="w-full bg-stone-700 border border-stone-600 rounded px-4 py-2 text-white focus:ring-lime-500 focus:border-lime-500"
                >
                  <option>Cartão de Crédito</option>
                  <option>Pix</option>
                  <option>Boleto Bancário</option>
                </select>
              </div>
              
              <div className="flex justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-stone-700 to-stone-600 hover:from-stone-600 hover:to-stone-500 rounded-lg shadow-md transition-transform transform hover:scale-[1.02]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-lime-700 to-lime-600 hover:from-lime-600 hover:to-lime-500 rounded-lg shadow-md transition-transform transform hover:scale-[1.02]"
                >
                  Finalizar compra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateJogo;