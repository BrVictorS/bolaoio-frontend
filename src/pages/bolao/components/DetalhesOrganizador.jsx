import { useState, useEffect } from "react";
import { adminService } from "../../../services/adminService";

export function DetalhesOrganizador({ bolaoId, onClose }) {
    const [participantes, setParticipantes] = useState([]);
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelando, setCancelando] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, tipo = "ok") => {
        setToast({ msg, tipo });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        const carregar = async () => {
            try {
                const [parts, res] = await Promise.all([
                    adminService.getParticipantesBolao(bolaoId),
                    adminService.getResultadoBolao(bolaoId).catch(() => null),
                ]);
                setParticipantes(parts || []);
                setResultado(res);
            } catch {
                showToast("Erro ao carregar dados do bolão", "erro");
            } finally {
                setLoading(false);
            }
        };
        carregar();
    }, [bolaoId]);

    const cancelarPalpite = async (palpiteId, nome) => {
        if (!confirm(`Cancelar o palpite de ${nome}? Se o pagamento foi confirmado, o reembolso será solicitado ao Mercado Pago.`)) return;
        setCancelando(palpiteId);
        try {
            await adminService.cancelarPalpite(palpiteId);
            setParticipantes(prev => prev.map(p =>
                p.palpiteId === palpiteId ? { ...p, statusPalpite: "Cancelado" } : p
            ));
            showToast("Palpite cancelado com sucesso");
        } catch (e) {
            showToast(e?.response?.data?.message || "Erro ao cancelar palpite", "erro");
        } finally {
            setCancelando(null);
        }
    };

    const totalPagos = participantes.filter(p => p.pago).length;
    const totalPendentes = participantes.filter(p => !p.pago && p.statusPalpite !== "Cancelado").length;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold
                    ${toast.tipo === "erro" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
                    {toast.msg}
                </div>
            )}

            <div className="bg-card border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-in fade-in duration-300">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div>
                        <h2 className="text-xl font-black text-white">Painel do Organizador</h2>
                        <p className="text-gray-400 text-sm mt-0.5">Gerencie participantes e pagamentos</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-xl transition">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-16">
                        <i className="fa-solid fa-spinner animate-spin text-2xl"></i>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-700">
                            <div className="bg-dark rounded-xl p-4 text-center">
                                <p className="text-2xl font-black text-white">{participantes.length}</p>
                                <p className="text-gray-400 text-xs mt-1">Total de Palpites</p>
                            </div>
                            <div className="bg-dark rounded-xl p-4 text-center">
                                <p className="text-2xl font-black text-green-400">{totalPagos}</p>
                                <p className="text-gray-400 text-xs mt-1">Pagos</p>
                            </div>
                            <div className="bg-dark rounded-xl p-4 text-center">
                                <p className="text-2xl font-black text-yellow-400">{totalPendentes}</p>
                                <p className="text-gray-400 text-xs mt-1">Aguardando Pagamento</p>
                            </div>
                        </div>

                        {resultado?.processado && resultado.vencedores?.length > 0 && (
                            <div className="p-6 border-b border-gray-700">
                                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                    <i className="fa-solid fa-trophy text-accent"></i>
                                    Resultado — {resultado.resultadoFinal}
                                </h3>
                                <div className="space-y-2">
                                    {resultado.vencedores.map((v, i) => (
                                        <div key={i} className="flex items-center justify-between bg-dark rounded-xl px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                                                    <i className="fa-solid fa-crown text-accent text-sm"></i>
                                                </div>
                                                <div>
                                                    <p className="text-white text-sm font-semibold">{v.nomeParticipante}</p>
                                                    <p className="text-gray-400 text-xs">Palpite: {v.golsTimeA} x {v.golsTimeB}</p>
                                                </div>
                                            </div>
                                            <span className="text-accent font-black">
                                                {v.premio?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-gray-500 text-xs mt-3">
                                    <i className="fa-solid fa-circle-info mr-1"></i>
                                    Você (organizador) deve transferir o prêmio para cada vencedor.
                                </p>
                            </div>
                        )}

                        <div className="p-6">
                            <h3 className="text-white font-bold mb-4">Participantes</h3>
                            {participantes.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Nenhum palpite registrado.</p>
                            ) : (
                                <div className="space-y-2">
                                    {participantes.map(p => (
                                        <div key={p.palpiteId} className={`flex items-center justify-between px-4 py-3 rounded-xl border
                                            ${p.statusPalpite === "Cancelado"
                                                ? "border-gray-700 bg-gray-800/20 opacity-50"
                                                : p.statusPalpite === "Vencedor"
                                                    ? "border-green-800 bg-green-900/10"
                                                    : "border-gray-700 bg-dark"}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                    <i className="fa-solid fa-user text-primary text-xs"></i>
                                                </div>
                                                <div>
                                                    <p className="text-white text-sm font-semibold">{p.nomeParticipante}</p>
                                                    <p className="text-gray-400 text-xs">{p.emailParticipante}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-center">
                                                    <p className="text-white text-sm font-bold">{p.golsTimeA} x {p.golsTimeB}</p>
                                                    <p className="text-gray-500 text-xs">Palpite</p>
                                                </div>

                                                <div className="text-center min-w-[70px]">
                                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                                                        ${p.pago ? 'bg-green-900/40 text-green-400'
                                                            : p.statusPalpite === "Cancelado" ? 'bg-gray-700 text-gray-400'
                                                            : 'bg-yellow-900/40 text-yellow-400'}`}>
                                                        {p.statusPalpite === "Cancelado" ? "Cancelado"
                                                            : p.pago ? "Pago" : "Pendente"}
                                                    </span>
                                                    {p.statusPalpite === "Vencedor" && (
                                                        <p className="text-green-400 text-xs mt-0.5 font-bold">Vencedor</p>
                                                    )}
                                                </div>

                                                {p.statusPalpite !== "Cancelado" && (
                                                    <button
                                                        onClick={() => cancelarPalpite(p.palpiteId, p.nomeParticipante)}
                                                        disabled={cancelando === p.palpiteId}
                                                        className="text-xs px-3 py-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition disabled:opacity-50">
                                                        {cancelando === p.palpiteId ? (
                                                            <i className="fa-solid fa-spinner animate-spin"></i>
                                                        ) : "Cancelar"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
