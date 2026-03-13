import { Link } from "react-router-dom";
import GlitchScreen from "../../../assets/GlitchScreen.png";
import { useState, useEffect } from "react";

const Rodape = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Verifica se chegou no final da página (com 50px de tolerância)
      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50;

      setIsAtBottom(isBottom);
    };

    // Adiciona o listener e executa uma vez para verificar o estado inicial
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Verifica o estado inicial

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Footer principal - aparece só no final */}
      <footer
        className={`fixed bottom-0 left-0 right-0 z-40 bg-stone-900 shadow-inner transition-transform duration-300 ${
          isAtBottom ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between px-8 py-6 border-t-4 border-lime-600">
          {/* Conteúdo do footer... */}
          <Link to="/">
            <div className="flex items-center space-x-3">
              <img
                src={GlitchScreen}
                alt="GlitchScreen Logo"
                className="w-10 h-10"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-lime-600 font-extrabold text-2xl font-roboto">
                  GlitchScreen
                </span>
                <span className="text-gray-400 text-xs">
                  play different, play indie!
                </span>
              </div>
            </div>
          </Link>

          <div className="flex items-center space-x-6 text-sm">
            <Link
              to="/SobreNos"
              className="text-gray-300 hover:text-lime-500 transition"
            >
              Sobre
            </Link>
            <Link
              to="/Contato"
              className="text-gray-300 hover:text-lime-500 transition"
            >
              Contato
            </Link>
            <Link
              to="/Termos"
              className="text-gray-300 hover:text-lime-500 transition"
            >
              Termos
            </Link>
          </div>

          <div className="text-gray-400 text-xs">
            © {new Date().getFullYear()} GlitchScreen. Todos os direitos
            reservados aos membros do repositório.
          </div>
        </div>
      </footer>

      {/* Borda superior do footer - visível durante toda a rolagem */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-1 bg-lime-600 z-30 ${
          isAtBottom ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
      />
    </>
  );
};

export { Rodape };
