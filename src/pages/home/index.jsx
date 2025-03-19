/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import NavAdmin from "@/components/ui/navAdmin";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ userId: "", nome: "", email: "", telefone: "", bloco: "", apartamento: "" });

  // Pegando a URL da API do backend
  const API_URL = import.meta.env.VITE_URI_BACKEND || "http://localhost:5000";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users`);
      if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      if (!userId) {
        alert("Erro ao deletar: ID do usuário não encontrado.");
        return;
      }
      await fetch(`${API_URL}/api/users/${userId}`, { method: "DELETE" });
      fetchUsers();
    } catch {
      alert("Erro ao excluir usuário.");
    }
  };

  const saveEdit = async () => {
    if (!editingUser || !editingUser._id) {
      alert("Erro ao editar: ID do usuário não encontrado.");
      return;
    }
    try {
      await fetch(`${API_URL}/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      alert("Erro ao atualizar usuário.");
    }
  };

  const createUser = async () => {
    console.log("Cadastrando usuário:", newUser);
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }
      setShowCreateModal(false);
      setNewUser({ nome: "", email: "", telefone: "", bloco: "", apartamento: "" });
      fetchUsers();
    } catch (error) {
      alert("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavAdmin />
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Moradores Cadastrados</h2>
            <button onClick={() => setShowCreateModal(true)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Cadastrar
            </button>
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-center">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-gray-300 p-3">Nome</th>
                  <th className="border border-gray-300 p-3">E-mail</th>
                  <th className="border border-gray-300 p-3">Telefone</th>
                  <th className="border border-gray-300 p-3">Bloco</th>
                  <th className="border border-gray-300 p-3">Apartamento</th>
                  <th className="border border-gray-300 p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="bg-gray-50 hover:bg-gray-200">
                      <td className="border border-gray-300 p-3">{user.nome}</td>
                      <td className="border border-gray-300 p-3">{user.email}</td>
                      <td className="border border-gray-300 p-3">{user.telefone || "Não informado"}</td>
                      <td className="border border-gray-300 p-3">{user.bloco}</td>
                      <td className="border border-gray-300 p-3">{user.apartamento}</td>
                      <td className="border border-gray-300 p-3 flex gap-2">
                        <button onClick={() => setEditingUser(user)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Editar</button>
                        <button onClick={() => deleteUser(user._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Excluir</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="border border-gray-300 p-3 text-center">Nenhum usuário encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Cadastrar Usuário</h2>
              {Object.keys(newUser).map((field) => (
                <input key={field} type="text" placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={newUser[field]} onChange={(e) => setNewUser({ ...newUser, [field]: e.target.value })} className="w-full border border-gray-300 p-2 rounded mb-2" />
              ))}
              <div className="flex justify-between">
                <button onClick={() => setShowCreateModal(false)} className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600">Cancelar</button>
                <button onClick={createUser} className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">Cadastrar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
