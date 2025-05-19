/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "@/components/ui/table";
import NavAdmin from "@/components/ui/navAdmin";
import AlertaModal from "@/components/Modal/AlertaModal";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { Pencil, Trash, X, Plus } from "lucide-react";

const API_URL = import.meta.env.VITE_URI_BACKEND || "http://localhost:5000";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({ id: null, mensagem: "", tipo: "erro", acao: null });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    telefone: "",
    bloco: "",
    apartamento: ""
  });
  const [alerta, setAlerta] = useState({ open: false, tipo: "", mensagem: "" });

  const mostrarAlerta = (tipo, mensagem) => {
    setAlerta({ open: true, tipo, mensagem });
    setTimeout(() => {
      setAlerta((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  const fetchUsuarios = () => {
    axios
      .get(`${API_URL}/api/users`)
      .then((res) => {
        setUsuarios(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar usuários", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const openModal = (usuario = null) => {
    if (usuario) {
      setIsEditing(true);
      setSelectedId(usuario._id);
      setFormData({
        nome: usuario.nome || "",
        email: usuario.email || "",
        password: "",
        telefone: usuario.telefone || "",
        bloco: usuario.bloco || "",
        apartamento: usuario.apartamento || "",
      });
    } else {
      setIsEditing(false);
      setSelectedId(null);
      setFormData({
        nome: "",
        email: "",
        password: "",
        telefone: "",
        bloco: "",
        apartamento: ""
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setIsEditing(false);
    setSelectedId(null);
    setFormData({
      nome: "",
      email: "",
      password: "",
      telefone: "",
      bloco: "",
      apartamento: ""
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const acao = isEditing ? handleUpdate : handleCreate;
    setModalOpen(false);
    setTimeout(() => {
      setConfirmData({
        mensagem: isEditing ? "Tem certeza que deseja atualizar este usuário?" : "Tem certeza que deseja cadastrar este usuário?",
        tipo: isEditing ? "info" : "sucesso",
        acao: () => {
          acao();
          setConfirmOpen(false);
        },
      });
      setConfirmOpen(true);
    }, 300);
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      fetchUsuarios();
      mostrarAlerta("sucesso", "Usuário cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar usuário", error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    try {
      const dataParaAtualizar = { ...formData };
  
      // Se o campo de senha estiver vazio, remove ele do objeto
      if (!dataParaAtualizar.password) {
        delete dataParaAtualizar.password;
      }
  
      await axios.put(`${API_URL}/api/users/${selectedId}`, dataParaAtualizar);
      fetchUsuarios();
      mostrarAlerta("info", "Usuário atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar usuário", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/users/${id}`);
      fetchUsuarios();
      mostrarAlerta("erro", "Usuário deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir usuário", error);
    } finally {
      setConfirmOpen(false);
      setConfirmData({ id: null, mensagem: "", tipo: "erro", acao: null });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <NavAdmin />
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 px-4  dark:bg-gray-900">
        <div className="w-full max-w-7xl bg-white  dark:bg-gray-900 shadow-lg rounded-lg p-4 sm:p-6 border border-gray-300">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-6 gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-center w-full sm:w-auto  dark:text-gray-100">Lista de Moradores</h1>
            <button
              onClick={() => openModal()}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
            >
              <Plus size={18} /> Cadastrar
            </button>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-center">Carregando...</p>
            ) : (
              <Table className="w-full border border-gray-300 rounded-lg text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Nome</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Telefone</th>
                    <th className="px-4 py-3 text-left">Bloco</th>
                    <th className="px-4 py-3 text-left">Apartamento</th>
                    <th className="px-4 py-3 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {usuarios.map((user) => (
                    <tr key={user._id} className="bg-gray-100 dark:bg-gray-800">
                      <td className="px-4 py-3 whitespace-nowrap">{user.nome}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{user.telefone}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{user.bloco}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{user.apartamento}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => openModal(user)}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => {
                            setConfirmData({
                              id: user._id,
                              mensagem: "Tem certeza que deseja excluir este usuário?",
                              tipo: "erro",
                              acao: () => handleDelete(user._id),
                            });
                            setConfirmOpen(true);
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
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
          <div className="fixed inset-0 flex items-center justify-center px-2 z-50 bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white  dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-md border border-gray-300 relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-semibold text-gray-800  dark:text-gray-100 mb-6 text-center">
                {isEditing ? "Editar Usuário" : "Cadastrar Usuário"}
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input
                  className="text-gray-800  dark:text-gray-800 w-full p-3 border rounded-lg"
                  type="text"
                  placeholder="Nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
                <input
                  className="text-gray-800  dark:text-gray-800 w-full p-3 border rounded-lg"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                {!isEditing && (
                  <input
                    className="text-gray-800  dark:text-gray-800 w-full p-3 border rounded-lg"
                    type="password"
                    placeholder="Senha"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                )}
                <input
                  className="w-full p-3 border rounded-lg"
                  type="text"
                  placeholder="Telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  required
                />
                <input
                  className="text-gray-800  dark:text-gray-800 w-full p-3 border rounded-lg"
                  type="text"
                  placeholder="Bloco"
                  value={formData.bloco}
                  onChange={(e) => setFormData({ ...formData, bloco: e.target.value })}
                  required
                />
                <input
                  className="text-gray-800  dark:text-gray-800 w-full p-3 border rounded-lg"
                  type="text"
                  placeholder="Apartamento"
                  value={formData.apartamento}
                  onChange={(e) => setFormData({ ...formData, apartamento: e.target.value })}
                  required
                />
                <button
                  type="submit"
                  className={`w-full p-3 rounded-lg text-white ${
                    isEditing ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isEditing ? "Atualizar" : "Salvar"}
                </button>
              </form>
            </div>
          </div>
        )}

        {confirmOpen && (
          <ConfirmModal
            mensagem={confirmData.mensagem}
            onConfirm={confirmData.acao}
            onCancel={() => setConfirmOpen(false)}
            tipo={confirmData.tipo}
          />
        )}

        {alerta.open && (
          <AlertaModal
            tipo={alerta.tipo}
            mensagem={alerta.mensagem}
            onClose={() => setAlerta({ ...alerta, open: false })}
          />
        )}
      </main>
    </div>
  );
}
