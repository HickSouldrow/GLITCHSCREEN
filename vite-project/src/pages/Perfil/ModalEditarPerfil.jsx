import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase"; // Certifique-se de que o caminho está correto
import { doc, updateDoc } from "firebase/firestore";

const ModalEditarPerfil = ({ usuario, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: usuario.name,
    email: usuario.email,
    username: usuario.username,
    senha: usuario.senha,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setForm({
      name: usuario.name,
      email: usuario.email,
      username: usuario.username,
      senha: usuario.senha,
    });
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const salvar = async () => {
    if (!form.name || !form.email || !form.username || !form.senha) {
      setError("Todos os campos são obrigatórios!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Referência do documento no Firestore
      // Substitua "usuarios" pelo nome da sua coleção no Firebase
      const usuarioRef = doc(db, "usuarios", usuario.id);

      // Atualiza apenas os campos necessários
      await updateDoc(usuarioRef, {
        name: form.name,
        email: form.email,
        username: form.username,
        senha: form.senha,
      });

      if (onSave) onSave({ ...usuario, ...form });
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar perfil no Firebase:", err);
      setError("Erro ao atualizar perfil. Verifique as permissões do banco.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

export { ModalEditarPerfil };
