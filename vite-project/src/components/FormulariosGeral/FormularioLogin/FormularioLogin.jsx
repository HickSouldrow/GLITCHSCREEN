import React, { useState } from "react";
import { CampoLogin } from "./campologin";
import { Link, useNavigate } from "react-router-dom";
import { database } from "../../../services/firebase";
import { ref, get, child } from "firebase/database";

const FormularioLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const dbRef = ref(database);
      // Busca diretamente no nó do usuário específico
      const snapshot = await get(child(dbRef, `users/${username}`));

      if (snapshot.exists()) {
        const user = snapshot.val();

        // Verifica se a senha coincide
        if (user.password === password) {
          // Salva os dados básicos no localStorage (evite salvar a senha se possível)
          const userData = {
            username: user.username,
            email: user.email,
            token: user.token,
          };

          localStorage.setItem("usuario", JSON.stringify(userData));

          navigate("/", { replace: true });

          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          setError("Usuário ou senha inválidos");
        }
      } else {
        setError("Usuário ou senha inválidos");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor");
    }
  };

  return (
    <div
      className="max-w-sm mx-auto bg-gradient-to-b from-stone-800 to-stone-700 p-8 rounded-xl shadow-lg border-2 border-lime-800 
      relative before:absolute before:inset-0 before:border before:border-lime-800 before:rounded-xl before:shadow-[0_0_15px_#84cc16] before:animate-pulse mb-30"
    >
      <h2 className="text-2xl font-bold text-lime-600 text-center mb-6 animate-fadeIn">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="animate-fadeIn">
        <CampoLogin
          label="Usuário:"
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <CampoLogin
          label="Senha:"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm text-center mt-2 font-semibold">
            {error}
          </p>
        )}

        <p className="text-sm text-lime-400 text-center mt-4">
          Ainda não tem uma conta?{" "}
          <Link
            to="/Cadastro"
            className="text-lime-500 font-bold underline hover:text-lime-400"
          >
            Cadastre-se aqui
          </Link>
        </p>

        <button
          type="submit"
          className="w-full mt-6 bg-lime-700 text-white p-3 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-lime-600 font-bold uppercase tracking-wider"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export { FormularioLogin };
