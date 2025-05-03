import React, { useState } from "react";
import { CampoCadastro } from "./campocadastro";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const FormularioCadastro = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificação se a senha e a confirmação de senha coincidem
    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    try {
      // Enviar dados do novo usuário para o backend (json-server)
      const newUser = { username, password, email, token: "newToken123" };
      const response = await axios.post("http://localhost:5000/users", newUser);

      if (response.status === 201) {
        // Usuário criado com sucesso, redireciona para login
        navigate("/login");
      }
    } catch (err) {
      setError("Erro ao criar conta, tente novamente.");
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-b from-stone-800 to-stone-700 p-8 rounded-xl shadow-lg border-2 border-lime-800 
      relative before:absolute before:inset-0 before:border before:border-lime-800 before:rounded-xl before:shadow-[0_0_15px_#84cc16] before:animate-pulse mb-30">
      <h2 className="text-2xl font-bold text-lime-600 text-center mb-6 animate-fadeIn">Cadastro</h2>
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

        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

        <p className="text-sm text-lime-400 text-center mt-4">
          Já tem uma conta? <Link to="/login" className="text-lime-500 font-bold underline hover:text-lime-400">Faça login aqui</Link>
        </p>

        <button 
          type="submit"
          className="w-full mt-6 bg-lime-700 text-white p-3 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-lime-600"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export { FormularioCadastro };
