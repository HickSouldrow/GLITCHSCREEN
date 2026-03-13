import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
  FaShoppingCart,
  FaHeart,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { database } from "../../services/firebase"; // Ajuste o caminho conforme seu projeto
import { ref, get, child } from "firebase/database";

const Template_jogo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { CodJogo } = useParams();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [game, setGame] = useState(location.state?.jogoData || null);
  const [quantity, setQuantity] = useState(1);
  const [classificacao, setClassificacao] = useState(null);
  const [requisitosMinimos, setRequisitosMinimos] = useState(null);
  const [isChangingImage, setIsChangingImage] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const dbRef = ref(database);
        let gameData = game;

        // 1. Busca o Jogo se não veio pelo state
        if (!gameData) {
          const gameSnapshot = await get(child(dbRef, `jogos/${CodJogo}`));
          if (gameSnapshot.exists()) {
            gameData = { id: CodJogo, ...gameSnapshot.val() };
            setGame(gameData);
          }
        }

        if (gameData) {
          // 2. Busca Classificação Indicativa
          if (gameData.CodFaixaEtaria) {
            const classSnapshot = await get(
              child(dbRef, `classificacoes/${gameData.CodFaixaEtaria}`),
            );
            if (classSnapshot.exists()) {
              setClassificacao(classSnapshot.val());
            }
          }

          // 3. Busca Requisitos Mínimos
          if (gameData.ReqMinId) {
            const reqSnapshot = await get(
              child(dbRef, `reqminimos/${gameData.ReqMinId}`),
            );
            if (reqSnapshot.exists()) {
              setRequisitosMinimos(reqSnapshot.val());
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do Firebase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [CodJogo, game]);

  const getGameImages = () => {
    const images = [];
    if (game?.ImageUrl) images.push(game.ImageUrl);
    if (game?.Imagem) images.push(game.Imagem);

    let i = 2;
    while (game?.[`ImageUrl${i}`]) {
      images.push(game[`ImageUrl${i}`]);
      i++;
    }
    // Remove duplicatas caso ImageUrl e Imagem sejam iguais
    return [...new Set(images)];
  };

  const gameImages = getGameImages();

  const changeImage = async (direction) => {
    if (isChangingImage || gameImages.length <= 1) return;

    setIsChangingImage(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    setCurrentImageIndex((prev) => {
      if (direction === "next") {
        return (prev + 1) % gameImages.length;
      } else {
        return (prev - 1 + gameImages.length) % gameImages.length;
      }
    });

    setTimeout(() => setIsChangingImage(false), 50);
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
        i <= Math.floor(rating) ? (
          <FaStar key={i} className="text-yellow-400 inline" />
        ) : (
          <FaRegStar key={i} className="text-gray-400 inline" />
        ),
      );
    }
    return stars;
  };

  const handlePurchase = () => {
    Swal.fire({
      title: "Compra realizada com sucesso!",
      text: `Você comprou ${quantity} cópia(s) de ${game.Nome}`,
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#84cc16",
      background: "#1c1917",
      color: "#fff",
    });
    setShowPaymentModal(false);
  };

  const renderRequisitos = () => {
    if (!requisitosMinimos) return null;

    return (
      <div className="bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16]">
        <h2 className="text-2xl font-semibold text-lime-400 mb-4">
          Requisitos do Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <div>
            <h3 className="font-semibold text-lime-500 mb-2">Mínimos</h3>
            <ul className="space-y-2">
              <li>
                <strong>SO:</strong>{" "}
                {requisitosMinimos.SOMin || "Não especificado"}
              </li>
              <li>
                <strong>Processador:</strong>{" "}
                {requisitosMinimos.CPUMin || "Não especificado"}
              </li>
              <li>
                <strong>Memória:</strong>{" "}
                {requisitosMinimos.RAMmin || "Não especificado"}
              </li>
              <li>
                <strong>GPU:</strong>{" "}
                {requisitosMinimos.GPUMin || "Não especificado"}
              </li>
              <li>
                <strong>Armazenamento:</strong>{" "}
                {requisitosMinimos.Armazenamento || "Não especificado"}
              </li>
              {requisitosMinimos.DirectXMin && (
                <li>
                  <strong>DirectX:</strong> {requisitosMinimos.DirectXMin}
                </li>
              )}
              {requisitosMinimos.OBS && (
                <li className="text-sm italic text-gray-400">
                  {requisitosMinimos.OBS}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-white">
        <h2 className="text-2xl mb-4">Jogo não encontrado</h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-lime-600 rounded hover:bg-lime-700 transition"
        >
          Voltar para a loja
        </button>
      </div>
    );
  }

  const discountedPrice = game.Preco * (1 - (game.Desconto || 0) / 100);
  const totalPrice = discountedPrice * quantity;

  return (
    <div className="justify-center mt-12 mb-30 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-lime-500 hover:text-lime-400 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Voltar
        </button>

        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          <div className="lg:w-2/3">
            <h1 className="text-4xl font-bold text-lime-500 mb-6 drop-shadow-[0_0_5px_rgba(132,204,22,0.5)] uppercase tracking-tighter">
              {game.Nome}
            </h1>

            <div className="mb-8 relative bg-stone-800 p-1 rounded-xl border border-lime-800 shadow-[0_0_10px_#84cc16]">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-stone-900">
                <div className="relative w-full h-full">
                  <img
                    src={
                      gameImages[currentImageIndex] ||
                      "https://via.placeholder.com/800x450?text=Imagem+Indisponível"
                    }
                    alt={game.Nome}
                    className={`absolute w-full h-full object-cover transition-opacity duration-200 ${isChangingImage ? "opacity-0" : "opacity-100"}`}
                    key={currentImageIndex}
                  />
                </div>

                {gameImages.length > 1 && (
                  <>
                    <button
                      onClick={() => changeImage("prev")}
                      disabled={isChangingImage}
                      className={`absolute left-2 top-1/2 -translate-y-1/2 bg-stone-700/80 hover:bg-stone-600 p-3 rounded-full transition-all shadow-lg ${isChangingImage ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <FaChevronLeft className="w-5 h-5 text-lime-500" />
                    </button>
                    <button
                      onClick={() => changeImage("next")}
                      disabled={isChangingImage}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 bg-stone-700/80 hover:bg-stone-600 p-3 rounded-full transition-all shadow-lg ${isChangingImage ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <FaChevronRight className="w-5 h-5 text-lime-500" />
                    </button>
                  </>
                )}
              </div>

              {gameImages.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2 pb-2">
                  {gameImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isChangingImage && index !== currentImageIndex) {
                          setCurrentImageIndex(index);
                        }
                      }}
                      className={`w-16 h-12 rounded overflow-hidden transition-all ${currentImageIndex === index ? "ring-2 ring-lime-500 shadow-[0_0_5px_#84cc16]" : "opacity-50 hover:opacity-100"}`}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8 bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16]">
              <h2 className="text-2xl font-semibold text-lime-400 mb-4 uppercase tracking-widest text-sm">
                Descrição
              </h2>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {game.Descricao || "Descrição não disponível."}
              </p>
            </div>

            <div className="mb-8 bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16]">
              <h2 className="text-2xl font-semibold text-lime-400 mb-4 uppercase tracking-widest text-sm">
                Sinopse
              </h2>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed italic">
                {game.Sinopse || "Sinopse não disponível."}
              </p>
            </div>

            {renderRequisitos()}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_10px_#84cc16] top-24">
              <p className="text-gray-400 text-xs mb-2 uppercase tracking-[0.2em] font-black">
                Jogo Base
              </p>

              <div className="mb-6">
                {game.Desconto > 0 && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      -{game.Desconto}%
                    </span>
                    <span className="text-gray-500 line-through text-sm">
                      R$ {game.Preco.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                )}
                <span className="text-4xl font-black text-white">
                  R$ {discountedPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <div className="mb-6">
                <label className="block text-gray-400 text-xs uppercase mb-2 font-bold">
                  Quantidade:
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="bg-stone-700 hover:bg-stone-600 px-4 py-2 rounded-l font-bold text-white"
                  >
                    -
                  </button>
                  <span className="bg-stone-900 px-6 py-2 text-center text-white min-w-[50px] font-mono border-x border-stone-700">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="bg-stone-700 hover:bg-stone-600 px-4 py-2 rounded-r font-bold text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-6 border-t border-stone-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase text-xs font-bold">
                    Total:
                  </span>
                  <span className="text-2xl font-black text-lime-500">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-lime-600 hover:bg-lime-500 text-white font-black py-4 rounded-lg shadow-lg transition-all uppercase text-sm tracking-widest transform hover:scale-[1.03]"
                >
                  Comprar agora
                </button>
                <button className="w-full bg-stone-700 hover:bg-stone-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all text-sm uppercase">
                  <FaShoppingCart /> Carrinho
                </button>
                <button className="w-full bg-stone-700/50 hover:bg-stone-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all text-sm uppercase">
                  <FaHeart /> Desejos
                </button>
              </div>
            </div>

            <div className="bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16] mt-6">
              <h3 className="text-xs font-black text-lime-500 mb-6 uppercase tracking-[0.3em]">
                Informações Gerais
              </h3>
              <div className="space-y-5">
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">
                    Avaliação
                  </p>
                  <div className="flex items-center gap-1">
                    {renderStars(game.Avaliacao || 0)}
                    <span className="text-white text-xs font-bold ml-2">
                      ({(game.Avaliacao || 0).toFixed(1)})
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">
                    Gênero
                  </p>
                  <p className="text-white text-sm font-medium">
                    {Array.isArray(game.Generos)
                      ? game.Generos.join(", ")
                      : game.Genero || "Ação"}
                  </p>
                </div>
                {classificacao && (
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">
                      Classificação
                    </p>
                    <p className="text-white text-sm font-medium uppercase">
                      {classificacao.ClassificacaoIndicativa || "Livre"}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">
                    Lançamento
                  </p>
                  <p className="text-white text-sm font-medium">
                    {game.DtLancamento
                      ? new Date(game.DtLancamento).toLocaleDateString("pt-BR")
                      : "Disponível"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-stone-800 p-8 rounded-2xl border border-lime-800 shadow-[0_0_30px_rgba(132,204,22,0.3)] w-full max-w-md">
            <h2 className="text-2xl font-black text-lime-500 mb-6 uppercase tracking-tighter">
              Finalizar Pedido
            </h2>
            <div className="mb-8 space-y-2 bg-stone-900/50 p-4 rounded-lg">
              <h3 className="text-white font-bold uppercase text-sm">
                {game.Nome}
              </h3>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Quantidade: {quantity}x</span>
                <span className="text-lime-500 font-bold">
                  R$ {totalPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePurchase();
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-gray-400 text-[10px] uppercase font-black mb-2">
                  Método de Pagamento
                </label>
                <select className="w-full bg-stone-900 border border-stone-700 rounded-lg px-4 py-3 text-white text-sm focus:ring-2 focus:ring-lime-500 outline-none transition-all cursor-pointer">
                  <option value="">Selecione...</option>
                  <option>Cartão de Crédito</option>
                  <option>Pix (5% OFF)</option>
                  <option>Boleto Bancário</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-3 bg-stone-700 text-white rounded-lg text-xs font-bold uppercase hover:bg-stone-600 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-lime-600 text-white rounded-lg text-xs font-black uppercase hover:bg-lime-500 transition-all shadow-lg shadow-lime-900/20"
                >
                  Confirmar
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
