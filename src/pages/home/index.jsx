import React, { useEffect, useState } from "react";
import NavAdmin from "@/components/ui/navAdmin";
import axios from "axios";

const API_URL = import.meta.env.VITE_URI_BACKEND || "http://localhost:5000";

export default function HomeDashboard() {
  const [entregas, setEntregas] = useState([]);
  const [avisos, setAvisos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resEntregas, resAvisos] = await Promise.all([
          axios.get(`${API_URL}/api/entregas`),
          axios.get(`${API_URL}/api/avisos`),
        ]);
        setEntregas(resEntregas.data.slice(0, 5)); // últimos 5
        setAvisos(resAvisos.data.slice(0, 5));     // últimos 5
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <NavAdmin />

      <div className="px-4 sm:px-6 mt-10 mb-6">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
          Últimas Atualizações
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Entregas */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 transition-colors duration-500">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
              Últimas Entregas
            </h2>
            {entregas.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Nenhuma entrega encontrada.</p>
            ) : (
              <ul className="space-y-3">
                {entregas.map((entrega) => (
                  <li key={entrega._id} className="border-b border-gray-300 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
                    <p><span className="font-semibold">Nome:</span> {entrega.userId?.nome || "Não informado"}</p>
                    <p><span className="font-semibold">Telefone:</span> {entrega.userId?.telefone || "Não informado"}</p>
                    <p><span className="font-semibold">Descrição:</span> {entrega.descricao}</p>
                    <p><span className="font-semibold">Data:</span> {new Date(entrega.dataEntrega).toLocaleDateString("pt-BR")}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Card Avisos */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 transition-colors duration-500">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
              Últimos Avisos
            </h2>
            {avisos.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Nenhum aviso encontrado.</p>
            ) : (
              <ul className="space-y-3">
                {avisos.map((aviso) => (
                  <li key={aviso._id} className="border-b border-gray-300 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
                    <p><span className="font-semibold">Título:</span> {aviso.titulo}</p>
                    <p><span className="font-semibold">Mensagem:</span> {aviso.mensagem}</p>
                    <p><span className="font-semibold">Data:</span> {new Date(aviso.dataAviso).toLocaleDateString("pt-BR")}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
