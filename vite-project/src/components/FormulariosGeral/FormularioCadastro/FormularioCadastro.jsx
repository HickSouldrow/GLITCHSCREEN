import React, { useState } from "react";
import { CampoCadastro } from "./campocadastro";
import { Link, useNavigate } from "react-router-dom";
import { database } from "../../../services/firebase";
import { ref, set, get, child } from "firebase/database"; // Funções do Realtime

const FormularioCadastro = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validações básicas
    if (!username || !password || !email) {
      setError("Preencha todos os campos!");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    try {
      // 1. Verificar se o usuário já existe
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `users/${username}`));

      if (snapshot.exists()) {
        setError("Este nome de usuário já está em uso.");
        return;
      }

      // 2. Salvar novo usuário no Realtime Database
      await set(ref(database, "users/" + username), {
        username,
        password,
        email,
        token: "newToken" + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      });

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o banco de dados.");
    }
  };

  return (
    <div
      className="max-w-sm mx-auto bg-gradient-to-b from-stone-800 to-stone-700 p-8 rounded-xl shadow-lg border-2 border-lime-800 
      relative before:absolute before:inset-0 before:border before:border-lime-800 before:rounded-xl before:shadow-[0_0_15px_#84cc16] before:animate-pulse mb-30"
    >
      <h2 className="text-2xl font-bold text-lime-600 text-center mb-6 animate-fadeIn">
        Cadastro
      </h2>
      <form onSubmit={handleSubmit} className="animate-fadeIn">
        <CampoCadastro
          label="Usuário:"
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <CampoCadastro
          label="Senha:"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <CampoCadastro
          label="Confirmar senha:"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <CampoCadastro
          label="Email:"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm text-center mt-2 font-semibold">
            {error}
          </p>
        )}

        <p className="text-sm text-lime-400 text-center mt-4">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-lime-500 font-bold underline hover:text-lime-400"
          >
            Faça login aqui
          </Link>
        </p>

        <button
          type="submit"
          className="w-full mt-6 bg-lime-700 text-white p-3 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-lime-600 font-bold uppercase tracking-wider"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export { FormularioCadastro };
