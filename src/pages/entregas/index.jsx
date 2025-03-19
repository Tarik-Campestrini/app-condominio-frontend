import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "@/components/ui/table";
import NavAdmin from "@/components/ui/navAdmin";
import { Pencil, Trash, X } from "lucide-react";

// Pegando a URL da API do backend
const API_URL = import.meta.env.VITE_URI_BACKEND || "http://localhost:5000";

export default function ListaEntregas() {
    const [entregas, setEntregas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        descricao: "",
        status: "pendente",
        dataEntrega: "",
        userId: ""
    });

    useEffect(() => {
        fetchEntregas();
        axios.get("/api/users")
            .then(response => setUsuarios(response.data))
            .catch(error => console.error("Erro ao buscar usuários", error));
    }, []);

    const fetchEntregas = () => {
        axios.get(`${API_URL}/api/entregas`)
            .then(response => {
                setEntregas(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar entregas", error);
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
                userId: entrega.userId?._id || ""
            });
        } else {
            setIsEditing(false);
            setSelectedId(null);
            setFormData({ descricao: "", status: "pendente", dataEntrega: "", userId: "" });
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setIsEditing(false);
        setSelectedId(null);
        setFormData({ descricao: "", status: "pendente", dataEntrega: "", userId: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            handleUpdate();
        } else {
            handleCreate();
        }
    };

    const handleCreate = async () => {
        try {
            await axios.post(`${API_URL}/api/entregas`, formData);
            fetchEntregas();
            closeModal();
        } catch (error) {
            console.error("Erro ao criar entrega", error);
        }
    };

    const handleUpdate = async () => {
        if (!selectedId) {
            console.error("Erro: ID da entrega não encontrado.");
            return;
        }

        try {
            await axios.put(`${API_URL}/api/entregas/${selectedId}`, formData);
            fetchEntregas();
            closeModal();
        } catch (error) {
            console.error("Erro ao atualizar entrega", error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Tem certeza que deseja excluir esta entrega?")) {
            try {
                await axios.delete(`${API_URL}/api/entregas/${id}`);
                fetchEntregas();
            } catch (error) {
                console.error("Erro ao excluir entrega", error);
            }
        }
    };

    const getStatusFormatted = (status) => {
        if (!status) return "";
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case "pendente": return "text-red-500 font-semibold";
            case "entregue": return "text-green-500 font-semibold";
            default: return "text-gray-500 font-semibold";
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavAdmin />
            <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 ">
                <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-6 border border-gray-300">
                    <div className="flex flex-row items-center justify-between w-full mb-6">
                        <h1 className="text-4xl font-bold text-center w-full">Lista de Entregas</h1>
                        <button onClick={() => openModal()} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Cadastrar</button>
                    </div>
                    <div className="overflow-x-auto">
                        {loading ? (
                            <p className="text-center">Carregando...</p>
                        ) : (
                            <Table className="w-full border border-gray-300 rounded-lg">
                                <thead className="bg-blue-600 text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Nome</th>
                                        <th className="px-4 py-3 text-left">telefone</th>
                                        <th className="px-4 py-3 text-left">Descrição</th>
                                        <th className="px-4 py-3 text-left">Data da Entrega</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {entregas.map((entrega) => (
                                        <tr key={entrega._id} className="hover:bg-gray-100">
                                            <td className="px-4 py-3 whitespace-nowrap">{entrega.userId?.nome || "Não informado"}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{entrega.userId?.telefone || "Não informado"}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{entrega.descricao}</td>

                                            <td className="px-4 py-3 whitespace-nowrap">{new Date(entrega.dataEntrega).toLocaleDateString("pt-BR")}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={getStatusClass(entrega.status)}>
                                                    {getStatusFormatted(entrega.status)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 flex gap-2">
                                                <button onClick={() => openModal(entrega)} className="text-yellow-500 hover:text-yellow-600">
                                                    <Pencil size={20} />
                                                </button>
                                                <button onClick={() => handleDelete(entrega._id)} className="text-red-500 hover:text-red-600">
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
                                {isEditing ? "Editar Entrega" : "Cadastrar Entrega"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <select className="w-full p-3 border rounded-lg" value={formData.userId} onChange={(e) => setFormData({ ...formData, userId: e.target.value })} required>
                                    <option value="">Selecione o Morador</option>
                                    {usuarios.map(user => (
                                        <option key={user._id} value={user._id}>{user.nome}</option>
                                    ))}
                                </select>
                                <input className="w-full p-3 border rounded-lg" type="text" placeholder="Descrição" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} required />
                                <input className="w-full p-3 border rounded-lg" type="date" value={formData.dataEntrega} onChange={(e) => setFormData({ ...formData, dataEntrega: e.target.value })} required />
                                <select className="w-full p-3 border rounded-lg" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} required>
                                    <option value="pendente">Pendente</option>
                                    <option value="entregue">Entregue</option>
                                </select>
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
