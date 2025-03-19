import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "@/components/ui/table";
import NavAdmin from "@/components/ui/navAdmin";
import { Pencil, Trash, X } from "lucide-react";

// Pegando a URL da API do backend
const API_URL = import.meta.env.VITE_URI_BACKEND || "http://localhost:5000";


export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    bloco: "",
    apartamento: "",
    telefone: ""
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // 🔹 Buscar usuários
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      setUsuarios(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
      setLoading(false);
    }
  };

  // 🔹 Abrir o modal (Edição ou Criação)
  const openModal = (usuario = null) => {
    if (usuario) {
      setIsEditing(true);
      setSelectedId(usuario._id);
      setFormData({
        nome: usuario.nome || "",
        email: usuario.email || "",
        password: "",
        bloco: usuario.bloco || "",
        apartamento: usuario.apartamento || "",
        telefone: usuario.telefone || ""
      });
    } else {
      setIsEditing(false);
      setSelectedId(null);
      setFormData({ nome: "", email: "", password: "", bloco: "", apartamento: "", telefone: "" });
    }
    setModalOpen(true);
  };

  // 🔹 Fechar o modal
  const closeModal = () => {
    setModalOpen(false);
    setIsEditing(false);
    setSelectedId(null);
    setFormData({ nome: "", email: "", password: "", bloco: "", apartamento: "", telefone: "" });
  };

  // 🔹 Enviar formulário (Criar ou Atualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  // 🔹 Criar usuário
  const handleCreate = async () => {
    if (!formData.telefone.trim()) {
      alert("O campo telefone é obrigatório!");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      fetchUsuarios();
      closeModal();
      alert("Usuário cadastrado com sucesso! ✅");
    } catch (error) {
      console.error("Erro ao criar usuário", error.response?.data || error.message);
    }
  };

  // 🔹 Atualizar usuário
  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/api/users/${selectedId}`, formData);
      fetchUsuarios();
      closeModal();
      alert("Usuário atualizado com sucesso! ✅");
    } catch (error) {
      console.error("Erro ao atualizar usuário", error.response?.data || error.message);
    }
  };

  // 🔹 Deletar usuário
  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await axios.delete(`${API_URL}/api/users/${id}`);
        fetchUsuarios();
        alert("Usuário excluído com sucesso! ❌");
      } catch (error) {
        console.error("Erro ao excluir usuário", error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavAdmin />
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 ">
        <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <div className="flex flex-row items-center justify-between w-full mb-6">
            <h1 className="text-4xl font-bold text-center w-full">Lista de Moradores</h1>
            <button onClick={() => openModal()} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Cadastrar
            </button>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-center">Carregando...</p>
            ) : (
              <Table className="w-full border border-gray-300 rounded-lg">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Nome</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Bloco</th>
                    <th className="px-4 py-3 text-left">Apartamento</th>
                    <th className="px-4 py-3 text-left">Telefone</th>
                    <th className="px-4 py-3 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {usuarios.map((usuario) => (
                    <tr key={usuario._id} className="hover:bg-gray-100">
                      <td className="px-4 py-3 whitespace-nowrap">{usuario.nome}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{usuario.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{usuario.bloco}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{usuario.apartamento}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{usuario.telefone}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button onClick={() => openModal(usuario)} className="text-yellow-500 hover:text-yellow-600">
                          <Pencil size={20} />
                        </button>
                        <button onClick={() => handleDelete(usuario._id)} className="text-red-500 hover:text-red-600">
                          <Trash size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 border border-gray-300 relative">
              <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                {isEditing ? "Editar Morador" : "Cadastrar Morador"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input className="w-full p-3 border rounded-lg" type="text" placeholder="Nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
                <input className="w-full p-3 border rounded-lg" type="email" placeholder="E-mail" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                {!isEditing && (
                  <input className="w-full p-3 border rounded-lg" type="password" placeholder="Senha" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                )}
                <input className="w-full p-3 border rounded-lg" type="text" placeholder="Bloco" value={formData.bloco} onChange={(e) => setFormData({ ...formData, bloco: e.target.value })} required />
                <input className="w-full p-3 border rounded-lg" type="text" placeholder="Apartamento" value={formData.apartamento} onChange={(e) => setFormData({ ...formData, apartamento: e.target.value })} required />
                <input className="w-full p-3 border rounded-lg" type="text" placeholder="Telefone" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} required />
                <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
                  {isEditing ? "Atualizar" : "Salvar"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
