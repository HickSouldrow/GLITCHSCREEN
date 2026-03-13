import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/firebase";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const Perfil = () => {
  const [usuario, setUsuario] = useState(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  });

  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: usuario?.name || "",
    email: usuario?.email || "",
    username: usuario?.username || "",
    senha: usuario?.password || "",
  });

  const logout = () => {
    localStorage.removeItem("usuario");
    navigate(-1);
  };

  useEffect(() => {
    if (usuario && usuario.id) {
      const buscarJogos = async () => {
        try {
          // 1. Busca a relação na coleção usuariosJogos
          const qRelacao = query(
            collection(db, "usuariosJogos"),
            where("usuarioId", "==", usuario.id),
          );
          const snapshotRelacao = await getDocs(qRelacao);
          const codigosJogos = snapshotRelacao.docs.map(
            (doc) => doc.data().CodJogo,
          );

          if (codigosJogos.length > 0) {
            // 2. Busca os detalhes de cada jogo na coleção jogos
            // O Firestore não suporta o operador 'in' para listas muito grandes (>30),
            // mas para uma biblioteca de perfil funciona bem:
            const qJogos = query(
              collection(db, "jogos"),
              where("CodJogo", "in", codigosJogos),
            );
            const snapshotJogos = await getDocs(qJogos);
            const jogosDetalhados = snapshotJogos.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setJogos(jogosDetalhados);
          }
        } catch (err) {
          console.error("Erro ao buscar jogos do usuário no Firestore:", err);
        }
      };

      buscarJogos();
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const salvar = async () => {
    setLoading(true);
    setError(null);
    try {
      const usuarioRef = doc(db, "usuarios", usuario.id);

      const dadosAtualizados = {
        name: form.name,
        email: form.email,
        username: form.username,
        senha: form.senha,
      };

      await updateDoc(usuarioRef, dadosAtualizados);

      const novoEstadoUsuario = { ...usuario, ...dadosAtualizados };
      setUsuario(novoEstadoUsuario);
      localStorage.setItem("usuario", JSON.stringify(novoEstadoUsuario));
      setMostrarModal(false);
    } catch (err) {
      setError("Erro ao atualizar perfil no Firebase");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    setMostrarModal(false);
  };

  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen mt-20 flex flex-col md:flex-row justify-center items-start px-4 py-10 gap-10 text-white">
      <div className="w-full md:w-1/3 bg-gradient-to-b from-stone-800 to-stone-700 p-6 rounded-xl shadow-lg border-2 border-lime-800 relative before:absolute before:inset-0 before:border before:border-lime-800 before:rounded-xl before:shadow-[0_0_15px_#84cc16] before:animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-24 h-24 mx-auto rounded-full border-4 stroke-width-2 border-lime-600 mb-4 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A8.966 8.966 0 0112 15c2.21 0 4.21.8 5.879 2.121M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>

        <h2 className="text-2xl font-bold text-lime-500 mb-2 text-center">
          {usuario.name}
        </h2>
        <p className="font-semibold text-sm text-gray-400 mb-6 text-center">
          {usuario.email}
        </p>

        <div className="text-left space-y-3">
          <p>
            <span className="font-semibold text-gray-300">Username: </span>
            <span className="text-lime-500">{usuario.username}</span>
          </p>

          <p>
            <span className="font-semibold text-gray-300">Senha: </span>
            <input
              type="password"
              value={usuario.senha}
              readOnly
              className="text-lime-500 bg-transparent border-none outline-none"
            />
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <button
            className="px-4 py-2 bg-lime-600 text-white font-semibold rounded-md hover:bg-lime-500 transition text-sm w-full"
            onClick={() => setMostrarModal(true)}
          >
            Editar perfil
          </button>

          <button
            className="font-semibold text-red-500 hover:underline mt-2"
            onClick={logout}
          >
            Sair
          </button>
        </div>
      </div>

      <div className="w-full md:w-2/3 bg-stone-800 border border-stone-600 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-lime-500">Meus jogos</h3>
          <a
            href="/"
            className="text-sm text-lime-400 hover:underline transition"
          >
            Conheça nossa vasta biblioteca de jogos &rarr;
          </a>
        </div>

        {jogos.length > 0 ? (
          <ul className="space-y-4">
            {jogos.map((jogo) => (
              <li
                key={jogo.id}
                className="flex items-start gap-4 border-b border-stone-600 pb-4"
              >
                <img
                  src={jogo.Imagem}
                  alt={jogo.Nome}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-lg font-semibold text-white">
                    {jogo.Nome}
                  </p>
                  <p className="text-sm text-gray-400">{jogo.Sinopse}</p>
                  <p className="text-sm text-lime-400 mt-1">
                    R${" "}
                    {(jogo.Preco * (1 - (jogo.Desconto || 0) / 100))
                      .toFixed(2)
                      .replace(".", ",")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Nenhum jogo adquirido ainda.</p>
        )}
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="space-y-4">
              <input
                autoFocus
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nome"
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Usuário"
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                placeholder="Senha"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                className={`px-4 py-2 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-lime-600 text-white"} rounded hover:bg-lime-500`}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Perfil };
