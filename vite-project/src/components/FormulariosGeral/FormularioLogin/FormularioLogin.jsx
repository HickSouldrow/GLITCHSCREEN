import React, { useState } from "react";
import { CampoLogin } from "./campologin";
import { Link, useNavigate } from "react-router-dom";
import { database } from "../../../services/firebase";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";

const FormularioLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      const usersRef = ref(database, "users");
      const userQuery = query(
        usersRef,
        orderByChild("email"),
        equalTo(cleanEmail),
      );

      const snapshot = await get(userQuery);

      if (snapshot.exists()) {
        const userDataRaw = snapshot.val();
        const userId = Object.keys(userDataRaw)[0];
        const user = userDataRaw[userId];

        if (user.password === password) {
          const sessionData = {
            username: user.username,
            email: user.email,
            token: user.token,
          };

          localStorage.setItem("usuario", JSON.stringify(sessionData));

          navigate("/", { replace: true });
          window.location.reload();
        } else {
          setError("E-mail ou senha incorretos.");
        }
      } else {
        setError("E-mail não cadastrado.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-b from-stone-800 to-stone-700 p-8 rounded-xl shadow-lg border-2 border-lime-800 relative before:absolute before:inset-0 before:border before:border-lime-800 before:rounded-xl before:shadow-[0_0_15px_#84cc16] before:animate-pulse mb-30">
      <h2 className="text-2xl font-bold text-lime-600 text-center mb-6 animate-fadeIn">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="animate-fadeIn">
        <CampoLogin
          label="E-mail:"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <CampoLogin
          label="Senha:"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        {error && (
          <p className="text-red-500 text-sm text-center mt-2 font-semibold">
            {error}
          </p>
        )}

        {/* O link de redirect que eu tinha esquecido: */}
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
          disabled={loading}
          className={`w-full mt-6 p-3 rounded-lg shadow-md transition-transform transform font-bold uppercase tracking-wider ${
            loading
              ? "bg-stone-600 cursor-not-allowed"
              : "bg-lime-700 hover:scale-105 hover:bg-lime-600"
          } text-white`}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export { FormularioLogin };
