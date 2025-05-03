import React, { useState } from "react";
import { CampoLogin } from "./campologin";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormularioLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:5000/users?username=${username}`);
      const user = response.data[0];

      if (!user || user.password !== password) {
        setError("Erro ao fazer login");
        return;
      }

      // Se o login for bem-sucedido, salva o token ou outro dado necessário
      localStorage.setItem('token', user.token);

      // Redireciona para a tela inicial ("/")
      navigate("/");  // Redireciona para a página inicial após login

    } catch (err) {
      setError("Erro ao fazer login");
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-b from-stone-800 to-stone-700 p-8 rounded-xl shadow-lg border-2 border-lime-800 
      relative before:absolute before:inset-0 before:border before:border-lime-800 before:rounded-xl before:shadow-[0_0_15px_#84cc16] before:animate-pulse mb-30">
      <h2 className="text-2xl font-bold text-lime-600 text-center mb-6 animate-fadeIn">Login</h2>
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

        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

        <p className="text-sm text-lime-400 text-center mt-4">
          Ainda não tem uma conta? <Link to="/Cadastro" className="text-lime-500 font-bold underline hover:text-lime-400">Cadastre-se aqui</Link>
        </p>

        <button 
          type="submit"
          className="w-full mt-6 bg-lime-700 text-white p-3 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-lime-600"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export { FormularioLogin };
