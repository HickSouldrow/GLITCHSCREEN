import { useState } from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative z-[60]"> {/* Aumente o z-index para acima do cabeçalho */}
      {/* Botão do menu Hamburger */}
      <button
        className="text-lime-500 focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Menu suspenso lateral com botão de fechar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-stone-900 border-r-4 border-lime-600 text-white shadow-2xl transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-[60]`}
      >
        {/* Botão de fechar */}
        <button
          className="absolute top-4 right-4 text-lime-500 focus:outline-none hover:text-lime-400"
          onClick={toggleMenu}
          aria-label="Close menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
<ul className="flex flex-col px-4 py-6 space-y-2 mt-10 text-base font-medium">
  <li>
    <Link
      to="/"
      className="block w-full text-lime-400 hover:bg-lime-600 hover:text-white px-4 py-2 rounded-lg transition"
      onClick={() => setMenuOpen(false)}
    >
       Home
    </Link>
  </li>
  <li>
    <Link
      to="/Classificacao"
      className="block w-full text-lime-400 hover:bg-lime-600 hover:text-white px-4 py-2 rounded-lg transition"
      onClick={() => setMenuOpen(false)}
    >
       Classificação Indicativa
    </Link>
  </li>
  <li>
    <Link
      to="/Avaliacoes"
      className="block w-full text-lime-400 hover:bg-lime-600 hover:text-white px-4 py-2 rounded-lg transition"
      onClick={() => setMenuOpen(false)}
    >
       Avaliações
    </Link>
  </li>
  <li>
    <Link
      to="/Novidades"
      className="block w-full text-lime-400 hover:bg-lime-600 hover:text-white px-4 py-2 rounded-lg transition"
      onClick={() => setMenuOpen(false)}
    >
       Novidades
    </Link>
  </li>
  <li>
    <Link
      to="/Descontos"
      className="block w-full text-lime-400 hover:bg-lime-600 hover:text-white px-4 py-2 rounded-lg transition"
      onClick={() => setMenuOpen(false)}
    >
       Descontos
    </Link>
  </li>
  <li>
    <Link
      to="/SobreNos"
      className="block w-full text-lime-400 hover:bg-lime-600 hover:text-white px-4 py-2 rounded-lg transition"
      onClick={() => setMenuOpen(false)}
    >
       Sobre
    </Link>
  </li>
  <li>
    <Link
      to="/Contato"
      className="block w-full text-lime-400 hover:bg-lime-600 hover:text-white px-4 py-2 rounded-lg transition"
      onClick={() => setMenuOpen(false)}
    >
       Contato
    </Link>
  </li>
  <li>
    <Link
      to="/Termos"
      className="block w-full text-lime-400 hover:bg-lime-600 hover:text-white px-4 py-2 rounded-lg transition"
      onClick={() => setMenuOpen(false)}
    >
       Termos
    </Link>
  </li>

  <hr className="border-stone-700 my-3" />

  <li>
    <Link
      to="/"
      className="block w-full text-gray-400 hover:bg-stone-800 hover:text-white px-4 py-2 rounded-lg transition"
      onClick={() => setMenuOpen(false)}
    >
       Em breve...
    </Link>
  </li>
</ul>

      </div>
    </div>
  );
};

export default Menu;
