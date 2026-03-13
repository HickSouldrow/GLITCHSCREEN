import React, { useState, useEffect, useCallback, useMemo } from "react";
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

const Template_jogo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { CodJogo } = useParams();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(!location.state?.jogoData);
  const [game, setGame] = useState(location.state?.jogoData || null);
  const [quantity, setQuantity] = useState(1);
  const [classificacao, setClassificacao] = useState(null);
  const [requisitosMinimos, setRequisitosMinimos] = useState(null);
  const [isChangingImage, setIsChangingImage] = useState(false);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setIsLoading(true);
        let gameData = location.state?.jogoData;

        if (!gameData) {
          const response = await fetch(
            `http://localhost:5000/jogos?CodJogo=${CodJogo}`,
          );
          const data = await response.json();
          gameData = data[0] || null;
        }

        if (gameData) {
          setGame(gameData);

          const [resClass, resReq] = await Promise.all([
            fetch(
              `http://localhost:5000/classificacoes?CodFaixaEtaria=${gameData.CodFaixaEtaria}`,
            ),
            fetch(
              `http://localhost:5000/reqminimos?ReqMinId=${gameData.ReqMinId}`,
            ),
          ]);

          const dataClass = await resClass.json();
          const dataReq = await resReq.json();

          setClassificacao(dataClass[0] || null);
          setRequisitosMinimos(dataReq[0] || null);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do jogo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();
  }, [CodJogo, location.state]);

  const gameImages = useMemo(() => {
    const images = [];
    if (game?.ImageUrl) images.push(game.ImageUrl);

    let i = 2;
    while (game?.[`ImageUrl${i}`]) {
      images.push(game[`ImageUrl${i}`]);
      i++;
    }
    return images.length > 0
      ? images
      : ["https://via.placeholder.com/800x450?text=Imagem+Indisponível"];
  }, [game]);

  const changeImage = useCallback(
    async (direction) => {
      if (isChangingImage || gameImages.length <= 1) return;

      setIsChangingImage(true);
      await new Promise((resolve) => setTimeout(resolve, 200));

      setCurrentImageIndex((prev) => {
        if (direction === "next") return (prev + 1) % gameImages.length;
        return (prev - 1 + gameImages.length) % gameImages.length;
      });

      setTimeout(() => setIsChangingImage(false), 50);
    },
    [isChangingImage, gameImages.length],
  );

  const handleQuantityChange = (value) => {
    setQuantity((prev) => {
      const next = prev + value;
      return next >= 1 && next <= 10 ? next : prev;
    });
  };

  const renderStars = useCallback((rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return starValue <= Math.floor(rating) ? (
        <FaStar key={i} className="text-yellow-400 inline" />
      ) : (
        <FaRegStar key={i} className="text-gray-400 inline" />
      );
    });
  }, []);

  const handlePurchase = () => {
    Swal.fire({
      title: "Compra realizada!",
      text: `Nós processamos seu pedido de ${quantity}x ${game.Nome}`,
      icon: "success",
      confirmButtonColor: "#84cc16",
      background: "#1c1917",
      color: "#fff",
    });
    setShowPaymentModal(false);
  };

  const discountedPrice = useMemo(
    () => (game ? game.Preco * (1 - (game.Desconto || 0) / 100) : 0),
    [game],
  );

  const totalPrice = useMemo(
    () => discountedPrice * quantity,
    [discountedPrice, quantity],
  );

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
            <h1 className="text-4xl font-bold text-lime-500 mb-6 drop-shadow-[0_0_5px_rgba(132,204,22,0.5)]">
              {game.Nome}
            </h1>

            <div className="mb-8 relative bg-stone-800 p-1 rounded-xl border border-lime-800 shadow-[0_0_10px_#84cc16]">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-stone-900">
                <img
                  src={gameImages[currentImageIndex]}
                  alt={game.Nome}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isChangingImage ? "opacity-0" : "opacity-100"}`}
                />

                {gameImages.length > 1 && (
                  <>
                    <button
                      onClick={() => changeImage("prev")}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-stone-900/80 hover:bg-lime-600 p-3 rounded-full transition-all text-white"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={() => changeImage("next")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-stone-900/80 hover:bg-lime-600 p-3 rounded-full transition-all text-white"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </div>

              <div className="flex justify-center mt-4 gap-2 overflow-x-auto pb-2">
                {gameImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-12 flex-shrink-0 rounded border-2 transition-all ${currentImageIndex === index ? "border-lime-500 scale-105" : "border-transparent opacity-50"}`}
                  >
                    <img
                      src={img}
                      alt="thumbnail"
                      className="w-full h-full object-cover rounded-sm"
                    />
                  </button>
                ))}
              </div>
            </div>

            <Section title="Descrição" content={game.Descricao} />
            <Section title="Sinopse" content={game.Sinopse} />

            {requisitosMinimos && (
              <div className="bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16]">
                <h2 className="text-2xl font-semibold text-lime-400 mb-4">
                  Requisitos do Sistema
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-gray-300">
                  <li>
                    <strong>SO:</strong> {requisitosMinimos.SOMin}
                  </li>
                  <li>
                    <strong>Processador:</strong> {requisitosMinimos.CPUMin}
                  </li>
                  <li>
                    <strong>Memória:</strong> {requisitosMinimos.RAMmin}
                  </li>
                  <li>
                    <strong>GPU:</strong> {requisitosMinimos.GPUMin}
                  </li>
                  <li className="md:col-span-2">
                    <strong>Armazenamento:</strong>{" "}
                    {requisitosMinimos.Armazenamento}
                  </li>
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:w-1/3 space-y-6">
            <div className="bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_10px_#84cc16]">
              <p className="text-gray-400 text-xs uppercase mb-2">Jogo Base</p>
              <div className="mb-6">
                {game.Desconto > 0 && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                      -{game.Desconto}%
                    </span>
                    <span className="text-gray-500 line-through text-sm">
                      R$ {game.Preco.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="text-3xl font-bold text-white">
                  R$ {discountedPrice.toFixed(2).replace(".", ",")}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 bg-stone-900/50 p-2 rounded">
                <span className="text-gray-300">Quantidade</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-8 h-8 bg-stone-700 rounded hover:bg-stone-600"
                  >
                    -
                  </button>
                  <span className="font-mono">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-8 h-8 bg-stone-700 rounded hover:bg-stone-600"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t border-stone-700 pt-4 mb-6 flex justify-between items-end">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-2xl font-bold text-lime-500">
                  R$ {totalPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <div className="grid gap-3">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-lime-600 hover:bg-lime-500 py-3 rounded-lg font-bold transition-all active:scale-95"
                >
                  Comprar agora
                </button>
                <button className="w-full bg-stone-700 hover:bg-stone-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                  <FaShoppingCart /> Carrinho
                </button>
              </div>
            </div>

            <div className="bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16]">
              <h3 className="text-xl font-semibold text-lime-400 mb-4">
                Informações
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-400 uppercase tracking-tighter">
                    Avaliação
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(game.Avaliacao || 0)}
                    <span className="text-white ml-1">
                      ({(game.Avaliacao || 0).toFixed(1)})
                    </span>
                  </div>
                </div>
                {classificacao && (
                  <div>
                    <p className="text-gray-400 uppercase tracking-tighter">
                      Classificação
                    </p>
                    <p className="text-white mt-1">
                      {classificacao.ClassificacaoIndicativa}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-stone-900 p-8 rounded-2xl border border-lime-500 shadow-[0_0_20px_rgba(132,204,22,0.3)] w-full max-w-md">
            <h2 className="text-3xl font-bold text-lime-500 mb-6">Checkout</h2>

            <div className="space-y-3 mb-8 bg-stone-800/50 p-4 rounded-lg border border-stone-700">
              <div className="flex justify-between text-gray-400">
                <span>Produto:</span>
                <span className="text-white font-medium">{game.Nome}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Quantidade:</span>
                <span className="text-white">{quantity}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-stone-700">
                <span className="text-lg font-bold text-white">Total:</span>
                <span className="text-2xl font-black text-lime-500">
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
                <label className="block text-sm font-medium text-lime-400 mb-2 uppercase tracking-widest">
                  Forma de Pagamento
                </label>
                <select
                  required
                  className="w-full bg-stone-800 border border-stone-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-lime-500 outline-none transition-all"
                >
                  <option value="">Selecione uma opção...</option>
                  <option value="pix">Pix (Aprovação imediata)</option>
                  <option value="card">Cartão de Crédito</option>
                  <option value="boleto">Boleto</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-3 bg-stone-800 hover:bg-stone-700 text-gray-300 rounded-xl transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-lime-600 hover:bg-lime-500 text-white font-bold rounded-xl shadow-lg shadow-lime-900/20 transition-transform active:scale-95"
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

const Section = ({ title, content }) => (
  <div className="mb-8 bg-stone-800 p-6 rounded-xl border border-lime-800 shadow-[0_0_5px_#84cc16]">
    <h2 className="text-2xl font-semibold text-lime-400 mb-4">{title}</h2>
    <p className="text-gray-300 whitespace-pre-line leading-relaxed">
      {content || "Informação não disponível."}
    </p>
  </div>
);

export default Template_jogo;
