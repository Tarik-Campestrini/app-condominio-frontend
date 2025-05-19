import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "@/components/ui/table";
import NavAdmin from "@/components/ui/navAdmin";
import AlertaModal from "@/components/Modal/AlertaModal";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { Pencil, Trash, X, Plus } from "lucide-react";

const API_URL = import.meta.env.VITE_URI_BACKEND || "http://localhost:5000";

export default function ListaEntregas() {
  const [entregas, setEntregas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({ id: null, mensagem: "", tipo: "erro", acao: null });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    descricao: "",
    status: "pendente",
    dataEntrega: "",
    userId: "",
  });

  const [alerta, setAlerta] = useState({ open: false, tipo: "", mensagem: "" });

  const mostrarAlerta = (tipo, mensagem) => {
    setAlerta({ open: true, tipo, mensagem });
    setTimeout(() => {
      setAlerta((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  useEffect(() => {
    fetchEntregas();
    axios
      .get(`${API_URL}/api/users`)
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error("Erro ao buscar usuários", err));
  }, []);

  const fetchEntregas = () => {
    axios
      .get(`${API_URL}/api/entregas`)
      .then((res) => {
        setEntregas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar entregas", err);
        setLoading(false);
      });
  };

  const openModal = (entrega = null) => {
    if (entrega) {
      setIsEditing(true);
      setSelectedId(entrega._id);
      setFormData({
        descricao: entrega.descricao || "",
        status: entrega.status || "pendente",
        dataEntrega: entrega.dataEntrega ? entrega.dataEntrega.split("T")[0] : "",
        userId: entrega.userId?._id || "",
      });
    } else {
      setIsEditing(false);
      setSelectedId(null);
      setFormData({
        descricao: "",
        status: "pendente",
        dataEntrega: "",
        userId: "",
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setIsEditing(false);
    setSelectedId(null);
    setFormData({
      descricao: "",
      status: "pendente",
      dataEntrega: "",
      userId: "",
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const acao = isEditing ? handleUpdate : handleCreate;
    setModalOpen(false);
    setTimeout(() => {
      setConfirmData({
        mensagem: isEditing ? "Tem certeza que deseja atualizar esta entrega?" : "Tem certeza que deseja cadastrar esta entrega?",
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
      await axios.post(`${API_URL}/api/entregas`, formData);
      fetchEntregas();
      mostrarAlerta("sucesso", "Entrega cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar entrega", error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    try {
      await axios.put(`${API_URL}/api/entregas/${selectedId}`, formData);
      fetchEntregas();
      mostrarAlerta("info", "Entrega atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar entrega", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/entregas/${id}`);
      fetchEntregas();
      mostrarAlerta("erro", "Entrega deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir entrega", error);
    } finally {
      setConfirmOpen(false);
      setConfirmData({ id: null, mensagem: "", tipo: "erro", acao: null });
    }
  };

  const getStatusFormatted = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "";

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "text-red-500 font-semibold";
      case "entregue":
        return "text-green-500 font-semibold";
      default:
        return "text-gray-500 font-semibold";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <NavAdmin />
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 px-4  dark:bg-gray-900">
        <div className="w-full max-w-7xl bg-white  dark:bg-gray-900 shadow-lg rounded-lg p-4 sm:p-6 border border-gray-300">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-6 gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-center w-full sm:w-auto  dark:text-gray-100">Lista de Entregas</h1>
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
                  <tr >
                    <th className="px-4 py-3 text-left">Nome</th>
                    <th className="px-4 py-3 text-left">Telefone</th>
                    <th className="px-4 py-3 text-left">Descrição</th>
                    <th className="px-4 py-3 text-left">Data da Entrega</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {entregas.map((entrega) => (
                    <tr key={entrega._id} className="bg-gray-100 dark:bg-gray-800 ">
                      <td className="px-4 py-3 whitespace-nowrap">{entrega.userId?.nome || "Não informado"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{entrega.userId?.telefone || "Não informado"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{entrega.descricao}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{new Date(entrega.dataEntrega).toLocaleDateString("pt-BR")}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={getStatusClass(entrega.status)}>{getStatusFormatted(entrega.status)}</span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => openModal(entrega)}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => {
                            setConfirmData({
                              id: entrega._id,
                              mensagem: "Tem certeza que deseja excluir esta entrega?",
                              tipo: "erro",
                              acao: () => handleDelete(entrega._id), // aqui está o ponto importante
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
                {isEditing ? "Editar Entrega" : "Cadastrar Entrega"}
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <select
                  className="w-full p-3 border rounded-lg text-gray-800 dark:text-gray-800"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  required
                >
                  <option className="text-gray-800 dark:text-gray-800 mb-6 text-center" value="">Selecione o Morador</option>
                  {usuarios.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.nome}
                    </option>
                  ))}
                </select>
                <input
                  className="text-gray-800  dark:text-gray-800 w-full p-3 border rounded-lg"
                  type="text"
                  placeholder="Descrição"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  required
                />
                <input
                  className="text-gray-800  dark:text-gray-800 w-full p-3 border rounded-lg"
                  type="date"
                  value={formData.dataEntrega}
                  onChange={(e) => setFormData({ ...formData, dataEntrega: e.target.value })}
                  required
                />
                <select
                  className="w-full p-3 border rounded-lg text-gray-800  dark:text-gray-800"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="pendente">Pendente</option>
                  <option value="entregue">Entregue</option>
                </select>
                <button
                  type="submit"
                  className={`w-full p-3 rounded-lg text-white  ${
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
