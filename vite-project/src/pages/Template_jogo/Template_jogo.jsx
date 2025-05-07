import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaStar, FaRegStar, FaShoppingCart, FaHeart, FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Template_jogo = () => {
    // Hooks de roteamento
    const location = useLocation();
    const navigate = useNavigate();
    const { CodJogo } = useParams();
    
    // Estados
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isLoading, setIsLoading] = useState(!location.state?.jogoData);
    const [game, setGame] = useState(location.state?.jogoData || null);
    const [quantity, setQuantity] = useState(1);

    // Busca os dados da API se não vieram do card
    useEffect(() => {
        if (!location.state?.jogoData) {
            const fetchGame = async () => {
                try {
                    setIsLoading(true);
                    const response = await fetch(`http://localhost:5000/jogos?CodJogo=${CodJogo}`);
                    const data = await response.json();
                    setGame(data[0] || null);
                } catch (error) {
                    console.error("Erro ao carregar jogo:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchGame();
        }
    }, [CodJogo, location.state]);

    // Manipuladores de eventos
    const changeImage = (direction) => {
        setCurrentImageIndex(prev => {
            if (direction === 'next') {
                return (prev + 1) % game.images.length;
            } else {
                return (prev - 1 + game.images.length) % game.images.length;
            }
        });
    };

    const handleQuantityChange = (value) => {
        const newValue = quantity + value;
        if (newValue >= 1 && newValue <= 10) {
            setQuantity(newValue);
        }
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

    const handlePurchase = () => {
        Swal.fire({
            title: 'Compra realizada com sucesso!',
            text: `Você comprou ${quantity} cópia(s) de ${game.Nome}`,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#84cc16',
            background: '#1c1917',
            color: '#fff'
        });
        setShowPaymentModal(false);
    };

    // Estados de carregamento e erro
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-stone-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-white bg-stone-900">
                <h2 className="text-2xl mb-4">Jogo não encontrado</h2>
                <button 
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-lime-600 rounded hover:bg-lime-700 transition"
                >
                    Voltar para a loja
                </button>
            </div>
        );
    }

    // Cálculos de preço
    const discountedPrice = game.Preco * (1 - game.Desconto / 100);
    const totalPrice = discountedPrice * quantity;

    return (
        <div className="justify-center mt-20 mb-30 min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative py-8">
                {/* Botão de voltar */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-lime-500 hover:text-lime-400 mb-6 transition-colors"
                >
                    <FaArrowLeft className="mr-2" /> Voltar
                </button>

                {/* Conteúdo principal */}
                <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                    {/* Coluna esquerda - Conteúdo do jogo */}
                    <div className="lg:w-2/3">
                        <h1 className="text-4xl font-bold text-lime-500 mb-6 drop-shadow-[0_0_5px_rgba(132,204,22,0.5)]">
                            {game.Nome}
                        </h1>
                        
                        {/* Galeria de imagens */}
                        <div className="mb-8 relative bg-stone-800 p-1 rounded-xl border border-lime-800 shadow-[0_0_10px_#84cc16]">
                            <div className="relative aspect-video rounded-lg overflow-hidden">
                                <img 
                                    src={game.images?.[currentImageIndex] || 'https://via.placeholder.com/800x450?text=Imagem+Indisponível'} 
                                    alt={game.Nome} 
                                    className="w-full h-full object-cover transition-opacity duration-300"
                                />
                                
                                {/* Navegação */}
                                {game.images?.length > 1 && (
                                    <>
                                        <button 
                                            onClick={() => changeImage('prev')}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-stone-700 hover:bg-stone-600 p-3 rounded-full transition-all shadow-lg"
                                        >
                                            <FaChevronLeft className="w-5 h-5 text-lime-500" />
                                        </button>
                                        <button 
                                            onClick={() => changeImage('next')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-stone-700 hover:bg-stone-600 p-3 rounded-full transition-all shadow-lg"
                                        >
                                            <FaChevronRight className="w-5 h-5 text-lime-500" />
                                        </button>
                                    </>
                                )}
                            </div>
                            
                            {/* Miniaturas */}
                            {game.images?.length > 1 && (
                                <div className="flex justify-center mt-4 space-x-2">
                                    {game.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-16 h-12 rounded overflow-hidden transition-all ${currentImageIndex === index ? 'ring-2 ring-lime-500 shadow-[0_0_5px_#84cc16]' : 'opacity-70 hover:opacity-100 border border-stone-700'}`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Descrição */}
                        <div className="mb-8 bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16]">
                            <h2 className="text-2xl font-semibold text-lime-400 mb-4">Descrição</h2>
                            <p className="text-gray-300 whitespace-pre-line">
                                {game.Descricao || "Descrição não disponível."}
                            </p>
                        </div>
                        
                        {/* Sinopse */}
                        <div className="mb-8 bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16]">
                            <h2 className="text-2xl font-semibold text-lime-400 mb-4">Sinopse</h2>
                            <p className="text-gray-300 whitespace-pre-line">
                                {game.Sinopse || "Sinopse não disponível."}
                            </p>
                        </div>
                        
                        {/* Requisitos */}
                        <div className="bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16]">
                            <h2 className="text-2xl font-semibold text-lime-400 mb-4">Requisitos do Sistema</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                                <div>
                                    <h3 className="font-semibold text-lime-500 mb-2">Mínimos</h3>
                                    <ul className="space-y-2">
                                        <li><strong>SO:</strong> {game.Requisitos?.SOMin || "Não especificado"}</li>
                                        <li><strong>Processador:</strong> {game.Requisitos?.CPUMin || "Não especificado"}</li>
                                        <li><strong>Memória:</strong> {game.Requisitos?.RAMmin || "Não especificado"}</li>
                                        <li><strong>GPU:</strong> {game.Requisitos?.GPUMin || "Não especificado"}</li>
                                        <li><strong>Armazenamento:</strong> {game.Requisitos?.Armazenamento || "Não especificado"}</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lime-500 mb-2">Recomendados</h3>
                                    <ul className="space-y-2">
                                        <li><strong>SO:</strong> {game.Requisitos?.SORecomendado || "Não especificado"}</li>
                                        <li><strong>Processador:</strong> {game.Requisitos?.CPURecomendado || "Não especificado"}</li>
                                        <li><strong>Memória:</strong> {game.Requisitos?.RAMrecomendada || "Não especificado"}</li>
                                        <li><strong>GPU:</strong> {game.Requisitos?.GPURecomendada || "Não especificado"}</li>
                                        <li><strong>Armazenamento:</strong> {game.Requisitos?.Armazenamento || "Não especificado"}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Coluna direita - Informações de compra */}
                    <div className="lg:w-1/3">
                        {/* Box de compra */}
                        <div className="bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_10px_#84cc16]">
                            <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Jogo Base</p>
                            
                            {/* Preço */}
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
                                <span className="text-3xl font-bold text-lime-500">
                                    R$ {discountedPrice.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                            
                            {/* Quantidade */}
                            <div className="mb-6">
                                <label className="block text-gray-300 mb-2">Quantidade:</label>
                                <div className="flex items-center">
                                    <button 
                                        onClick={() => handleQuantityChange(-1)}
                                        className="bg-stone-700 hover:bg-stone-600 px-3 py-1 rounded-l"
                                    >
                                        -
                                    </button>
                                    <span className="bg-stone-700 px-4 py-1 text-center">
                                        {quantity}
                                    </span>
                                    <button 
                                        onClick={() => handleQuantityChange(1)}
                                        className="bg-stone-700 hover:bg-stone-600 px-3 py-1 rounded-r"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            
                            {/* Total */}
                            <div className="mb-6 border-t border-stone-700 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Total:</span>
                                    <span className="text-xl font-bold text-gray-300">
                                        R$ {totalPrice.toFixed(2).replace('.', ',')}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Botões de ação */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    className="w-full bg-lime-600 hover:bg-lime-500 text-white font-bold py-3 rounded-lg shadow-md transition-transform transform hover:scale-[1.02]"
                                >
                                    Comprar agora
                                </button>
                                
                                <button
                                    className="w-full bg-stone-700 hover:bg-stone-600 text-white font-bold py-3 rounded-lg shadow-md transition-transform transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                >
                                    <FaShoppingCart /> Adicionar ao carrinho
                                </button>
                                
                                <button
                                    className="w-full bg-stone-700 hover:bg-stone-600 text-white font-bold py-3 rounded-lg shadow-md transition-transform transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                >
                                    <FaHeart /> Lista de desejos
                                </button>
                            </div>
                            
                            <p className="text-lime-400 text-center mt-4 text-sm">Ganhe 5% de volta</p>
                        </div>
                        
                        {/* Informações do jogo */}
                        <div className="bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16] mt-6">
                            <h3 className="text-2xl font-semibold text-lime-400 mb-4">Informações</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-400 text-sm uppercase tracking-wider">Avaliação</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        {renderStars(game.Avaliacao || 0)}
                                        <span className="text-white ml-1">({(game.Avaliacao || 0).toFixed(1)})</span>
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
                                    <p className="text-white mt-1">{game.Classificacao || "Não classificada"}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-400 text-sm uppercase tracking-wider">Lançamento</p>
                                    <p className="text-white mt-1">
                                        {game.DtLancamento ? new Date(game.DtLancamento).toLocaleDateString('pt-BR') : "Data não disponível"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Informações da desenvolvedora */}
                        {game.Desenvolvedora && (
                            <div className="bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16] mt-6">
                                <h3 className="text-2xl font-semibold text-lime-400 mb-4">Desenvolvedora</h3>
                                <div className="space-y-2">
                                    <p className="text-white font-medium">{game.Desenvolvedora.NomeDesenvolvedora || "Não informado"}</p>
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
            
            {/* Modal de pagamento */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_15px_#84cc16] w-full max-w-md">
                        <h2 className="text-2xl font-bold text-lime-500 mb-4">Finalizar Compra</h2>
                        
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white mb-2">{game.Nome}</h3>
                            <div className="flex justify-between text-gray-300">
                                <span>Quantidade:</span>
                                <span>{quantity}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Preço unitário:</span>
                                <span>R$ {discountedPrice.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-between text-white font-bold mt-2 pt-2 border-t border-stone-700">
                                <span>Total:</span>
                                <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                        
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handlePurchase();
                        }} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2">Método de pagamento:</label>
                                <select
                                    className="w-full bg-stone-700 border border-stone-600 rounded px-4 py-2 text-white focus:ring-lime-500 focus:border-lime-500"
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    <option>Cartão de Crédito</option>
                                    <option>Pix</option>
                                    <option>Boleto Bancário</option>
                                </select>
                            </div>
                            
                            <div className="flex justify-between gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 px-4 py-2 bg-stone-700 hover:bg-stone-600 rounded-lg shadow-md transition-transform transform hover:scale-[1.02]"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-lime-600 hover:bg-lime-500 rounded-lg shadow-md transition-transform transform hover:scale-[1.02]"
                                >
                                    Confirmar compra
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Template_jogo;