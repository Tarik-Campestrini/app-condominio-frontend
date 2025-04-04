import { useEffect, useState } from "react";
import axios from "axios";
import NavAdmin from "@/components/ui/navAdmin";
import { Pencil, Trash, X } from "lucide-react";

const API_URL = import.meta.env.VITE_URI_BACKEND || "http://localhost:5000";

export default function ListaAvisos() {
    const [avisos, setAvisos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({ titulo: "", menssagem: "", userId: "todos" });

    useEffect(() => {
        fetchAvisos();
        fetchUsuarios();
    }, []);

    const fetchAvisos = () => {
        axios.get(`${API_URL}/api/avisos`)
            .then(response => {
                const avisosUnicos = Object.values(
                    response.data.reduce((acc, aviso) => {
                        const key = `${aviso.titulo}-${aviso.menssagem}`;
                        if (!acc[key]) {
                            acc[key] = aviso;
                        }
                        return acc;
                    }, {})
                );
                setAvisos(avisosUnicos);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar avisos", error);
                setLoading(false);
            });
    };

    const fetchUsuarios = () => {
        axios.get(`${API_URL}/api/users`)
            .then(response => setUsuarios(response.data))
            .catch(error => console.error("Erro ao buscar usuários", error));
    };

    const openModal = (aviso = null) => {
        if (aviso) {
            setIsEditing(true);
            setSelectedId(aviso._id);
            setFormData({ titulo: aviso.titulo || "", menssagem: aviso.menssagem || "", userId: aviso.userId || "todos" });
        } else {
            setIsEditing(false);
            setSelectedId(null);
            setFormData({ titulo: "", menssagem: "", userId: "todos" });
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setIsEditing(false);
        setSelectedId(null);
        setFormData({ titulo: "", menssagem: "", userId: "todos" });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        isEditing ? handleUpdate() : handleCreate();
    };

    const handleCreate = async () => {
        try {
            const payload = {
                ...formData,
                userId: formData.userId === "todos" ? "todos" : formData.userId, 
            };
    
            await axios.post(`${API_URL}/api/avisos`, payload);
            fetchAvisos();
            closeModal();
        } catch (error) {
            console.error("Erro ao criar aviso", error);
        }
    };

    const handleUpdate = async () => {
        if (!selectedId) return;
        try {
            await axios.put(`${API_URL}/api/avisos/${selectedId}`, formData);
            fetchAvisos();
            closeModal();
        } catch (error) {
            console.error("Erro ao atualizar aviso:", error.response?.data || error.message);
        }
    };

    const handleDelete = async (id) => {
        console.log("Tentando excluir aviso com ID:", id);
    
        if (!id) {
            console.error("ID inválido, cancelando requisição.");
            return;
        }
    
        if (confirm("Tem certeza que deseja excluir este aviso?")) {
            try {
                const avisoId = id === "todos" ? "todos" : id;
                await axios.delete(`${API_URL}/api/avisos/${avisoId}`);
                console.log("Aviso deletado com sucesso!");
                fetchAvisos();
            } catch (error) {
                console.error("Erro ao excluir aviso:", error.response?.data || error.message);
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavAdmin />
            <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-6">
                <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg border border-gray-300">
                    <div className="flex flex-row items-center justify-between w-full mb-6 bg-blue-600 text-white p-4 rounded-t">
                        <h1 className="text-4xl font-bold text-center w-full">Lista de Avisos</h1>
                        <button onClick={() => openModal()} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Cadastrar</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {loading ? (
                            <p className="text-center">Carregando...</p>
                        ) : (
                            avisos.map((aviso) => (
                                <div key={aviso._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-300">
                                    <h2 className="text-xl font-bold bg-blue-600 text-white p-2 rounded text-center">{aviso.titulo}</h2>
                                    <p className="text-gray-700 mt-2 p-2">{aviso.menssagem}</p>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => openModal(aviso)} className="text-yellow-500 hover:text-yellow-600">
                                            <Pencil size={20} />
                                        </button>
                                        <button onClick={() => handleDelete(aviso.userId === "todos" ? "todos" : aviso._id)}
                                            className="text-red-500 hover:text-red-600">
                                            <Trash size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{isEditing ? "Editar Aviso" : "Novo Aviso"}</h2>
                            <button onClick={closeModal} className="text-red-500 hover:text-red-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <select name="userId" value={formData.userId} onChange={handleChange} className="w-full border p-2 rounded mb-2">
                                <option value="todos">Todos os usuários</option>
                                {usuarios.map((user) => (
                                    <option key={user._id} value={user._id}>{user.nome}</option>
                                ))}
                            </select>
                            <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Título" className="w-full border p-2 rounded mb-2" required />
                            <textarea name="menssagem" value={formData.menssagem} onChange={handleChange} placeholder="Mensagem" className="w-full border p-2 rounded mb-2" required />
                            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">{isEditing ? "Atualizar" : "Cadastrar"}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
