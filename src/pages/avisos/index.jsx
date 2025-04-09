// src/pages/ListaAvisos.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "@/components/ui/table";
import NavAdmin from "@/components/ui/navAdmin";
import AlertaModal from "@/components/Modal/AlertaModal";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { Pencil, Trash, X, Plus } from "lucide-react";

const API_URL = import.meta.env.VITE_URI_BACKEND || "http://localhost:5000";

export default function ListaAvisos() {
    const [avisos, setAvisos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmData, setConfirmData] = useState({ id: null, mensagem: "", tipo: "erro", acao: null });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        titulo: "",
        mensagem: "",
        userId: "",
        dataAviso: "",
    });

    const [alerta, setAlerta] = useState({ open: false, tipo: "", mensagem: "" });
    const mostrarAlerta = (tipo, mensagem) => {
        setAlerta({ open: true, tipo, mensagem });
        setTimeout(() => {
            setAlerta((prev) => ({ ...prev, open: false }));
        }, 3000);
    };

    useEffect(() => {
        fetchAvisos();
        axios.get(`${API_URL}/api/users`)
            .then((res) => setUsuarios(res.data))
            .catch((err) => console.error("Erro ao buscar usuários", err));
    }, []);

    const fetchAvisos = () => {
        axios.get(`${API_URL}/api/avisos`)
            .then((res) => {
                setAvisos(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao buscar avisos", err);
                setLoading(false);
            });
    };

    const openModal = (aviso = null) => {
        if (aviso) {
            setIsEditing(true);
            setSelectedId(aviso._id);
            setFormData({
                titulo: aviso.titulo || "",
                mensagem: aviso.mensagem || "",
                userId: aviso.userId?._id || aviso.userId || "",
                dataAviso: aviso.dataAviso ? aviso.dataAviso.split("T")[0] : "",
            });
        } else {
            setIsEditing(false);
            setSelectedId(null);
            setFormData({
                titulo: "",
                mensagem: "",
                userId: "",
                dataAviso: "",
            });
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setIsEditing(false);
        setSelectedId(null);
        setFormData({
            titulo: "",
            mensagem: "",
            userId: "",
            dataAviso: "",
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const acao = isEditing ? handleUpdate : handleCreate;
        setModalOpen(false);
        setTimeout(() => {
            setConfirmData({
                mensagem: isEditing ? "Deseja atualizar este aviso?" : "Deseja cadastrar este aviso?",
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
            const payload = { ...formData };
            await axios.post(`${API_URL}/api/avisos`, payload);
            fetchAvisos();
            mostrarAlerta("sucesso", "Aviso cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao criar aviso", error);
            mostrarAlerta("erro", "Erro ao criar aviso");
        }
    };

    const handleUpdate = async () => {
        if (!selectedId) return;
        try {
            await axios.put(`${API_URL}/api/avisos/${selectedId}`, formData);
            fetchAvisos();
            mostrarAlerta("info", "Aviso atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar aviso", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/avisos/${id}`);
            fetchAvisos();
            mostrarAlerta("erro", "Aviso deletado com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir aviso", error);
        } finally {
            setConfirmOpen(false);
            setConfirmData({ id: null, mensagem: "", tipo: "erro", acao: null });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavAdmin />
            <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 px-4">
                <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-4 sm:p-6 border border-gray-300">
                    <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-6 gap-4">
                        <h1 className="text-3xl sm:text-4xl font-bold text-center w-full sm:w-auto">Lista de Avisos</h1>
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
                                        <th className="px-4 py-3 text-left">Usuário</th>
                                        <th className="px-4 py-3 text-left">Título</th>
                                        <th className="px-4 py-3 text-left">Mensagem</th>
                                        <th className="px-4 py-3 text-left">Data</th>
                                        <th className="px-4 py-3 text-left">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {avisos.map((aviso) => {
                                        let nomeUsuario = "Usuário não encontrado";

                                        // Se for aviso para todos os usuários
                                        if (
                                            typeof aviso.userId === "object" &&
                                            aviso.userId.nome === "Todos os usuários"
                                        ) {
                                            nomeUsuario = "Todos";
                                        }
                                        // Se for um usuário normal
                                        else {
                                            const idUsuario =
                                                typeof aviso.userId === "object" ? aviso.userId._id : aviso.userId;
                                        
                                            const usuario = usuarios.find((user) => user._id === idUsuario);
                                            if (usuario) nomeUsuario = usuario.nome;
                                        }
                                       

                                        if (
                                            aviso.userId === "todos" ||
                                            (typeof aviso.userId === "object" && aviso.userId._id === "todos")
                                        ) {
                                            nomeUsuario = "Todos";
                                        } else {
                                            const idUsuario =
                                                typeof aviso.userId === "object" ? aviso.userId._id : aviso.userId;

                                            const usuario = usuarios.find((user) => user._id === idUsuario);
                                            if (usuario) nomeUsuario = usuario.nome;
                                        }

                                        return (
                                            <tr key={aviso._id} className="hover:bg-gray-100">
                                                <td className="px-4 py-3">{nomeUsuario}</td>
                                                <td className="px-4 py-3">{aviso.titulo}</td>
                                                <td className="px-4 py-3">{aviso.mensagem}</td>
                                                <td className="px-4 py-3">{new Date(aviso.dataAviso).toLocaleDateString("pt-BR")}</td>
                                                <td className="px-4 py-3 flex gap-2">
                                                    <button onClick={() => openModal(aviso)} className="text-yellow-500 hover:text-yellow-600">
                                                        <Pencil size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setConfirmData({
                                                                id: aviso._id,
                                                                mensagem: "Tem certeza que deseja excluir este aviso?",
                                                                tipo: "erro",
                                                                acao: () => handleDelete(aviso._id),
                                                            });
                                                            setConfirmOpen(true);
                                                        }}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <Trash size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        )}
                    </div>
                </div>

                {/* Modais */}
                {modalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center px-2 z-50 bg-opacity-30 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md border border-gray-300 relative">
                            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                                {isEditing ? "Editar Aviso" : "Cadastrar Aviso"}
                            </h2>
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <select
                                    className="w-full p-3 border rounded-lg"
                                    value={formData.userId}
                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione o Usuário</option>
                                    <option value="todos">Todos os Usuários</option>
                                    {usuarios.map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.nome}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    className="w-full p-3 border rounded-lg"
                                    type="text"
                                    placeholder="Título"
                                    value={formData.titulo}
                                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                    required
                                />
                                <textarea
                                    className="w-full p-3 border rounded-lg"
                                    placeholder="Mensagem"
                                    value={formData.mensagem}
                                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                                    required
                                ></textarea>
                                <input
                                    className="w-full p-3 border rounded-lg"
                                    type="date"
                                    value={formData.dataAviso}
                                    onChange={(e) => setFormData({ ...formData, dataAviso: e.target.value })}
                                    required
                                />
                                <button
                                    type="submit"
                                    className={`w-full p-3 rounded-lg text-white ${isEditing ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}`}
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
