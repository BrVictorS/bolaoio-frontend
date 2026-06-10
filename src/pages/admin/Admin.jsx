import { useState, useEffect, useCallback } from "react";
import { adminService } from "../../services/adminService";
import { usuarioService } from "../../services/usuarioService";
import { ticketService } from "../../services/ticketService";
import { SaquesAdmin } from "./SaquesAdmin";

const TIPOS_CHAVE_PIX = [
    { value: 0, label: "CPF" },
    { value: 1, label: "E-mail" },
    { value: 2, label: "Telefone" },
    { value: 3, label: "Chave aleatória" },
];

const STATUS_PARTIDA = [
    { value: 0, label: "Agendada" },
    { value: 1, label: "Em Andamento" },
    { value: 2, label: "Concluída" },
    { value: 3, label: "Suspensa" },
    { value: 4, label: "Adiada" },
    { value: 5, label: "Cancelada" },
    { value: 6, label: "A Definir" },
];

function statusColor(status) {
    const map = {
        Agendada: "text-blue-400",
        EmAndamento: "text-yellow-400",
        Concluida: "text-green-400",
        Suspensa: "text-orange-400",
        Adiada: "text-gray-400",
        Cancelada: "text-red-400",
        ADefinir: "text-gray-500",
    };
    return map[status] || "text-gray-400";
}

function Toast({ msg, tipo, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);
    return (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold
            ${tipo === "erro" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
            {msg}
        </div>
    );
}

function ModalResultadoPagamento({ resultado, onClose }) {
    if (!resultado) return null;
    const { boloesProcessados, totalVencedores, totalReembolsados, totalErros,
        totalArrecadado, mensagem, detalhesPagamentos } = resultado;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-card border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-700 flex justify-between items-start">
                    <div>
                        <h2 className="text-white font-bold text-lg">Resultado do Processamento</h2>
                        <p className="text-gray-400 text-sm mt-1">{mensagem}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl"><i className="fa-solid fa-xmark"></i></button>
                </div>

                <div className="p-6 grid grid-cols-3 gap-4 border-b border-gray-700">
                    <div className="bg-dark rounded-xl p-4 text-center">
                        <p className="text-gray-400 text-xs mb-1">Total em jogo</p>
                        <p className="text-white font-bold text-lg">R${totalArrecadado?.toFixed(2)}</p>
                    </div>
                    <div className="bg-dark rounded-xl p-4 text-center">
                        <p className="text-gray-400 text-xs mb-1">Vencedores</p>
                        <p className="text-green-400 font-bold text-lg">{totalVencedores}</p>
                    </div>
                    <div className="bg-dark rounded-xl p-4 text-center">
                        <p className="text-gray-400 text-xs mb-1">Bolões</p>
                        <p className="text-white font-bold text-lg">{boloesProcessados}</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-3 gap-4 border-b border-gray-700">
                    <div className="text-center">
                        <div className="text-2xl font-black text-green-400">{totalVencedores}</div>
                        <div className="text-gray-400 text-xs mt-1">Vencedores</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-blue-400">{totalReembolsados}</div>
                        <div className="text-gray-400 text-xs mt-1">Reembolsados</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-black ${totalErros > 0 ? 'text-red-400' : 'text-gray-500'}`}>{totalErros}</div>
                        <div className="text-gray-400 text-xs mt-1">Erros</div>
                    </div>
                </div>

                {detalhesPagamentos?.length > 0 && (
                    <div className="p-6">
                        <h3 className="text-white font-semibold mb-3 text-sm">Detalhes por participante</h3>
                        <div className="space-y-2">
                            {detalhesPagamentos.map((d, i) => (
                                <div key={i} className={`rounded-lg px-4 py-3 text-sm border
                                    ${d.sucesso ? 'bg-green-900/20 border-green-800/40' : 'bg-red-900/20 border-red-800/40'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <i className={`fa-solid ${d.sucesso ? 'fa-check text-green-400' : 'fa-xmark text-red-400'}`}></i>
                                            <div>
                                                <p className="text-white font-medium">{d.nomeParticipante}</p>
                                                {d.erro && <p className="text-red-400 text-xs mt-0.5">{d.erro}</p>}
                                            </div>
                                        </div>
                                        <span className={`font-bold ${d.sucesso ? 'text-green-400' : 'text-gray-500'}`}>
                                            R${d.valorEnviado?.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ModalFinalizarPartida({ partida, onConfirm, onClose }) {
    const [golsA, setGolsA] = useState(0);
    const [golsB, setGolsB] = useState(0);
    const [loading, setLoading] = useState(false);

    const confirmar = async () => {
        setLoading(true);
        try {
            await onConfirm(golsA, golsB);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-card border border-gray-700 rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-white font-bold text-lg mb-1">Finalizar Partida</h2>
                <p className="text-gray-400 text-sm mb-5">Informe o placar final. O sistema processará os pagamentos automaticamente.</p>
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-gray-400 text-xs font-semibold">{partida.timeA}</span>
                        <input
                            type="number" min="0" max="99" value={golsA}
                            onChange={e => setGolsA(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-20 h-20 bg-dark border-2 border-gray-600 rounded-2xl text-center text-3xl font-bold text-white focus:border-primary outline-none" />
                    </div>
                    <span className="text-gray-500 text-2xl font-black mt-5">×</span>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-gray-400 text-xs font-semibold">{partida.timeB}</span>
                        <input
                            type="number" min="0" max="99" value={golsB}
                            onChange={e => setGolsB(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-20 h-20 bg-dark border-2 border-gray-600 rounded-2xl text-center text-3xl font-bold text-white focus:border-primary outline-none" />
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={confirmar}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-green-600 text-black text-sm font-bold transition disabled:opacity-60">
                        {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Confirmar e Processar'}
                    </button>
                    <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm transition">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

function ModalPagamentosBolao({ bolaoId, nomeBolao, onClose }) {
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reenviando, setReenviando] = useState({});
    const [statusLocal, setStatusLocal] = useState({});

    useEffect(() => {
        adminService.getPagamentosBolao(bolaoId)
            .then(data => setDados(data?.[0] || null))
            .finally(() => setLoading(false));
    }, [bolaoId]);

    const reenviar = async (palpiteId) => {
        setReenviando(prev => ({ ...prev, [palpiteId]: true }));
        try {
            const res = await adminService.reenviarPremio(palpiteId);
            setStatusLocal(prev => ({ ...prev, [palpiteId]: { sucesso: res.sucesso, erro: res.erro, transacaoId: res.transacaoId } }));
        } catch (e) {
            setStatusLocal(prev => ({ ...prev, [palpiteId]: { sucesso: false, erro: e?.response?.data?.detail || 'Erro ao reenviar' } }));
        } finally {
            setReenviando(prev => ({ ...prev, [palpiteId]: false }));
        }
    };

    const statusPalpiteLabel = (s) => {
        const map = { Pendente: 'Pendente', Vencedor: 'Vencedor', Perdedor: 'Perdedor', Cancelado: 'Cancelado' };
        return map[s] || s;
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-card border border-gray-700 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-700 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-white font-bold">{nomeBolao}</h2>
                        <p className="text-gray-500 text-xs mt-0.5">Status de pagamentos dos palpites</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-5">
                    {loading ? (
                        <div className="text-center py-10 text-gray-400">
                            <i className="fa-solid fa-spinner animate-spin text-2xl"></i>
                        </div>
                    ) : !dados || dados.palpites?.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Nenhum palpite encontrado.</p>
                    ) : (
                        <div className="space-y-2">
                            {dados.palpites.map(p => {
                                const local = statusLocal[p.palpiteId];
                                const premioEnviado = local?.sucesso ?? p.premioEnviado;
                                const premioErro = local?.sucesso ? null : (local?.erro ?? p.premioErro);
                                const transacaoId = local?.transacaoId ?? p.transacaoId;
                                const eVencedor = p.statusPalpite === 'Vencedor';
                                const podeTentar = eVencedor && !premioEnviado && p.pago;

                                return (
                                    <div key={p.palpiteId} className={`rounded-lg px-4 py-3 text-sm border
                                        ${!eVencedor ? 'bg-gray-800/30 border-gray-700/40' :
                                            premioEnviado ? 'bg-green-900/20 border-green-800/40' :
                                            premioErro ? 'bg-red-900/20 border-red-800/40' :
                                            'bg-yellow-900/20 border-yellow-800/40'}`}>
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <i className={`fa-solid shrink-0 ${
                                                    premioEnviado ? 'fa-circle-check text-green-400' :
                                                    eVencedor && premioErro ? 'fa-circle-xmark text-red-400' :
                                                    eVencedor ? 'fa-trophy text-yellow-400' :
                                                    'fa-circle text-gray-600'
                                                }`}></i>
                                                <div className="min-w-0">
                                                    <p className="text-white font-medium truncate">{p.nomeParticipante}</p>
                                                    <p className="text-gray-500 text-xs">{statusPalpiteLabel(p.statusPalpite)}</p>
                                                    {premioErro && <p className="text-red-400 text-xs mt-0.5 truncate">{premioErro}</p>}
                                                    {transacaoId && <p className="text-gray-600 text-xs mt-0.5 truncate">ID: {transacaoId}</p>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {p.valorPremio != null && (
                                                    <span className={`font-bold text-sm ${premioEnviado ? 'text-green-400' : 'text-gray-500'}`}>
                                                        R${p.valorPremio?.toFixed(2)}
                                                    </span>
                                                )}
                                                {podeTentar && !reenviando[p.palpiteId] && (
                                                    <button
                                                        onClick={() => reenviar(p.palpiteId)}
                                                        className="text-xs px-3 py-1.5 rounded-lg bg-blue-900/40 text-blue-400 hover:bg-blue-900/60 transition font-semibold">
                                                        <i className="fa-solid fa-rotate mr-1"></i>Reenviar
                                                    </button>
                                                )}
                                                {reenviando[p.palpiteId] && (
                                                    <i className="fa-solid fa-spinner animate-spin text-blue-400 text-sm"></i>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function AbaPartidas() {
    const [partidas, setPartidas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sincronizando, setSincronizando] = useState(false);
    const [toast, setToast] = useState(null);
    const [expandida, setExpandida] = useState(null);
    const [statusEdit, setStatusEdit] = useState({});
    const [showCriar, setShowCriar] = useState(false);
    const [times, setTimes] = useState([]);
    const [novaPartida, setNovaPartida] = useState({ idTimeA: "", idTimeB: "", dataPartida: "" });
    const [resultadoPagamento, setResultadoPagamento] = useState(null);
    const [consultandoResultado, setConsultandoResultado] = useState({});
    const [modalFinalizar, setModalFinalizar] = useState(null);
    const [modalPagamentos, setModalPagamentos] = useState(null);
    const [boloesPartida, setBoloesPartida] = useState({});
    const [carregandoBolaoes, setCarregandoBolaoes] = useState({});

    const showToast = (msg, tipo = "ok") => setToast({ msg, tipo });

    const carregar = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminService.listarPartidasDetalhes();
            setPartidas(data || []);
        } catch {
            showToast("Erro ao carregar partidas", "erro");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { carregar(); }, [carregar]);

    const carregarBoloesPartida = async (partidaId) => {
        if (boloesPartida[partidaId] || carregandoBolaoes[partidaId]) return;
        setCarregandoBolaoes(prev => ({ ...prev, [partidaId]: true }));
        try {
            const data = await adminService.getBoloesPartida(partidaId);
            setBoloesPartida(prev => ({ ...prev, [partidaId]: data || [] }));
        } catch {
            setBoloesPartida(prev => ({ ...prev, [partidaId]: [] }));
        } finally {
            setCarregandoBolaoes(prev => ({ ...prev, [partidaId]: false }));
        }
    };

    const handleExpandir = (partidaId) => {
        const novaExpandida = expandida === partidaId ? null : partidaId;
        setExpandida(novaExpandida);
        if (novaExpandida) carregarBoloesPartida(novaExpandida);
    };

    const sincronizar = async () => {
        setSincronizando(true);
        try {
            await adminService.sincronizarPartidas();
            showToast("Partidas sincronizadas com sucesso!");
            await carregar();
        } catch {
            showToast("Erro ao sincronizar com API Football", "erro");
        } finally {
            setSincronizando(false);
        }
    };

    const finalizar = async (partida, golsA, golsB) => {
        try {
            const res = await adminService.finalizarPartida(partida.id, golsA, golsB);
            setModalFinalizar(null);
            setResultadoPagamento(res);
            setBoloesPartida(prev => { const n = { ...prev }; delete n[partida.id]; return n; });
            await carregar();
        } catch (e) {
            showToast(e?.response?.data?.detail || "Erro ao finalizar partida", "erro");
            setModalFinalizar(null);
        }
    };

    const processar = async (partidaId) => {
        try {
            const res = await adminService.processarResultado(partidaId);
            setResultadoPagamento(res);
            setBoloesPartida(prev => { const n = { ...prev }; delete n[partidaId]; return n; });
            await carregar();
        } catch (e) {
            showToast(e?.response?.data?.title || "Erro ao processar resultado", "erro");
        }
    };

    const alterarStatus = async (partidaId) => {
        const novoStatus = statusEdit[partidaId];
        if (novoStatus === undefined) return;
        try {
            await adminService.alterarStatusPartida(partidaId, parseInt(novoStatus));
            showToast("Status atualizado!");
            await carregar();
        } catch {
            showToast("Erro ao atualizar status", "erro");
        }
    };

    const carregarTimes = async () => {
        if (times.length > 0) return;
        try {
            const data = await adminService.getTimes();
            setTimes(data || []);
        } catch {
            showToast("Erro ao carregar times", "erro");
        }
    };

    const criarPartida = async () => {
        if (!novaPartida.idTimeA || !novaPartida.idTimeB || !novaPartida.dataPartida) {
            showToast("Preencha todos os campos", "erro");
            return;
        }
        try {
            await adminService.criarPartida(novaPartida.idTimeA, novaPartida.idTimeB, novaPartida.dataPartida);
            showToast("Partida criada com sucesso!");
            setShowCriar(false);
            setNovaPartida({ idTimeA: "", idTimeB: "", dataPartida: "" });
            await carregar();
        } catch {
            showToast("Erro ao criar partida", "erro");
        }
    };

    const verResultado = async (partidaId) => {
        setConsultandoResultado(prev => ({ ...prev, [partidaId]: true }));
        try {
            const res = await adminService.consultarResultado(partidaId);
            setResultadoPagamento(res);
        } catch {
            showToast("Erro ao consultar resultado da partida", "erro");
        } finally {
            setConsultandoResultado(prev => ({ ...prev, [partidaId]: false }));
        }
    };

    const podeFinalizar = (p) => !['Concluida', 'Cancelada'].includes(p.statusPartida) && p.boloesAtivos > 0;

    return (
        <div>
            {toast && <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast(null)} />}
            {resultadoPagamento && <ModalResultadoPagamento resultado={resultadoPagamento} onClose={() => setResultadoPagamento(null)} />}
            {modalFinalizar && (
                <ModalFinalizarPartida
                    partida={modalFinalizar}
                    onConfirm={(golsA, golsB) => finalizar(modalFinalizar, golsA, golsB)}
                    onClose={() => setModalFinalizar(null)} />
            )}
            {modalPagamentos && (
                <ModalPagamentosBolao
                    bolaoId={modalPagamentos.bolaoId}
                    nomeBolao={modalPagamentos.nomeBolao}
                    onClose={() => setModalPagamentos(null)} />
            )}

            <div className="flex flex-wrap gap-3 mb-6">
                <button
                    onClick={sincronizar}
                    disabled={sincronizando}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-60 transition">
                    <i className={`fa-solid fa-rotate ${sincronizando ? "animate-spin" : ""}`}></i>
                    {sincronizando ? "Sincronizando..." : "Sincronizar com API Football"}
                </button>
                <button
                    onClick={() => { setShowCriar(true); carregarTimes(); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-green-600 text-black text-sm font-semibold transition">
                    <i className="fa-solid fa-plus"></i>
                    Criar Partida Manual
                </button>
            </div>

            {showCriar && (
                <div className="bg-dark border border-gray-700 rounded-xl p-5 mb-6">
                    <h3 className="text-white font-bold mb-4">Nova Partida</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Time A (Mandante)</label>
                            <select
                                value={novaPartida.idTimeA}
                                onChange={e => setNovaPartida(p => ({ ...p, idTimeA: e.target.value }))}
                                className="w-full bg-card border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
                                <option value="">Selecionar time</option>
                                {times.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Time B (Visitante)</label>
                            <select
                                value={novaPartida.idTimeB}
                                onChange={e => setNovaPartida(p => ({ ...p, idTimeB: e.target.value }))}
                                className="w-full bg-card border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
                                <option value="">Selecionar time</option>
                                {times.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Data e Hora</label>
                            <input
                                type="datetime-local"
                                value={novaPartida.dataPartida}
                                onChange={e => setNovaPartida(p => ({ ...p, dataPartida: e.target.value }))}
                                className="w-full bg-card border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={criarPartida} className="px-4 py-2 rounded-lg bg-primary text-black text-sm font-semibold hover:bg-green-600 transition">
                            Confirmar
                        </button>
                        <button onClick={() => setShowCriar(false)} className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600 transition">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="text-center text-gray-400 py-12">
                    <i className="fa-solid fa-spinner animate-spin text-2xl"></i>
                </div>
            ) : partidas.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    Nenhuma partida cadastrada. Sincronize com a API Football ou crie manualmente.
                </div>
            ) : (
                <div className="space-y-3">
                    {partidas.map(p => (
                        <div key={p.id} className="bg-dark border border-gray-700 rounded-xl overflow-hidden">
                            <div
                                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-800/30 transition"
                                onClick={() => handleExpandir(p.id)}>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        {p.flagA && <img src={p.flagA} alt="" className="w-6 h-6 object-contain" />}
                                        <span className="text-white font-semibold">{p.timeA}</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-gray-400 text-xs block">
                                            {new Date(p.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="text-white font-bold text-lg">
                                            {p.statusPartida === 'Concluida' || p.statusPartida === 'EmAndamento'
                                                ? `${p.resultadoTimeA} x ${p.resultadoTimeB}`
                                                : 'x'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-semibold">{p.timeB}</span>
                                        {p.flagB && <img src={p.flagB} alt="" className="w-6 h-6 object-contain" />}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-semibold ${statusColor(p.statusPartida)}`}>
                                        {p.statusPartida}
                                    </span>
                                    {p.boloesAtivos > 0 && (
                                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                            {p.boloesAtivos} bolão(ões)
                                        </span>
                                    )}
                                    {p.resultadoProcessado && (
                                        <span className="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">
                                            <i className="fa-solid fa-check mr-1"></i>Processado
                                        </span>
                                    )}
                                    <i className={`fa-solid fa-chevron-down text-gray-500 transition-transform ${expandida === p.id ? 'rotate-180' : ''}`}></i>
                                </div>
                            </div>

                            {expandida === p.id && (
                                <div className="border-t border-gray-700 px-5 py-4 bg-gray-900/30 space-y-4">
                                    <div className="flex flex-wrap gap-3 items-end">
                                        <div>
                                            <label className="text-gray-400 text-xs mb-1 block">Alterar status</label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={statusEdit[p.id] ?? ""}
                                                    onChange={e => setStatusEdit(s => ({ ...s, [p.id]: e.target.value }))}
                                                    className="bg-card border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
                                                    <option value="">Selecionar...</option>
                                                    {STATUS_PARTIDA.map(s => (
                                                        <option key={s.value} value={s.value}>{s.label}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => alterarStatus(p.id)}
                                                    className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition">
                                                    Salvar
                                                </button>
                                            </div>
                                        </div>

                                        {podeFinalizar(p) && (
                                            <button
                                                onClick={e => { e.stopPropagation(); setModalFinalizar(p); }}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-green-600 text-black text-sm font-bold transition">
                                                <i className="fa-solid fa-flag-checkered"></i>
                                                Finalizar Partida
                                            </button>
                                        )}

                                        {(p.statusPartida === 'Concluida' || p.statusPartida === 'Cancelada') && !p.resultadoProcessado && (
                                            <button
                                                onClick={() => processar(p.id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition
                                                    ${p.statusPartida === 'Cancelada'
                                                        ? 'bg-red-700 hover:bg-red-600 text-white'
                                                        : 'bg-accent hover:bg-yellow-500 text-black'}`}>
                                                <i className={`fa-solid ${p.statusPartida === 'Cancelada' ? 'fa-rotate-left' : 'fa-trophy'}`}></i>
                                                {p.statusPartida === 'Cancelada' ? 'Reembolsar Palpites' : 'Processar Resultado'}
                                            </button>
                                        )}

                                        {p.resultadoProcessado && (
                                            <button
                                                onClick={() => verResultado(p.id)}
                                                disabled={consultandoResultado[p.id]}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-60 text-white text-sm transition">
                                                {consultandoResultado[p.id]
                                                    ? <i className="fa-solid fa-spinner animate-spin"></i>
                                                    : <i className="fa-solid fa-magnifying-glass-chart"></i>}
                                                Ver Resultado
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-xs font-semibold uppercase mb-2">Bolões desta partida</p>
                                        {carregandoBolaoes[p.id] ? (
                                            <div className="text-gray-500 text-xs py-2"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Carregando...</div>
                                        ) : (boloesPartida[p.id] || []).length === 0 ? (
                                            <p className="text-gray-600 text-xs">Nenhum bolão cadastrado para esta partida.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {(boloesPartida[p.id] || []).map(b => (
                                                    <button
                                                        key={b.bolaoId}
                                                        onClick={() => setModalPagamentos({ bolaoId: b.bolaoId, nomeBolao: b.nomeBolao })}
                                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 transition text-left">
                                                        <div className="flex items-center gap-3">
                                                            <i className="fa-solid fa-coins text-accent text-sm"></i>
                                                            <div>
                                                                <p className="text-white text-sm font-semibold">{b.nomeBolao}</p>
                                                                <p className="text-gray-500 text-xs">{b.totalPalpites} palpite(s) pagos</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {b.premiosEnviados > 0 && (
                                                                <span className="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full font-semibold">
                                                                    <i className="fa-solid fa-check mr-1"></i>{b.premiosEnviados} pagos
                                                                </span>
                                                            )}
                                                            {b.erros > 0 && (
                                                                <span className="text-xs bg-red-900/40 text-red-400 px-2 py-0.5 rounded-full font-semibold">
                                                                    <i className="fa-solid fa-xmark mr-1"></i>{b.erros} erro(s)
                                                                </span>
                                                            )}
                                                            <i className="fa-solid fa-chevron-right text-gray-600 text-xs"></i>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function AbaUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [busca, setBusca] = useState("");

    const showToast = (msg, tipo = "ok") => setToast({ msg, tipo });

    useEffect(() => {
        adminService.listarUsuarios()
            .then(data => setUsuarios(data || []))
            .catch(() => showToast("Erro ao carregar usuários", "erro"))
            .finally(() => setLoading(false));
    }, []);

    const toggleAtivo = async (usuario) => {
        try {
            await adminService.alterarStatusUsuario(usuario.id, !usuario.ativo);
            setUsuarios(prev => prev.map(u => u.id === usuario.id ? { ...u, ativo: !u.ativo } : u));
            showToast(`Usuário ${!usuario.ativo ? "ativado" : "desativado"} com sucesso`);
        } catch {
            showToast("Erro ao alterar status do usuário", "erro");
        }
    };

    const filtrados = usuarios.filter(u =>
        u.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        u.email?.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div>
            {toast && <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast(null)} />}
            <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2 text-white text-sm mb-5 placeholder-gray-500" />

            {loading ? (
                <div className="text-center text-gray-400 py-12">
                    <i className="fa-solid fa-spinner animate-spin text-2xl"></i>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-700">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-800/60 text-gray-400 text-left">
                                <th className="px-4 py-3 font-semibold">Nome</th>
                                <th className="px-4 py-3 font-semibold">Email</th>
                                <th className="px-4 py-3 font-semibold text-center">Status</th>
                                <th className="px-4 py-3 font-semibold text-center">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.map((u, i) => (
                                <tr key={u.id} className={`border-t border-gray-700 ${i % 2 === 0 ? '' : 'bg-gray-800/20'}`}>
                                    <td className="px-4 py-3 text-white">{u.nome}</td>
                                    <td className="px-4 py-3 text-gray-400">{u.email}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                                            ${u.ativo ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                                            {u.ativo ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => toggleAtivo(u)}
                                            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition
                                                ${u.ativo
                                                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                                                    : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'}`}>
                                            {u.ativo ? 'Desativar' : 'Ativar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtrados.length === 0 && (
                        <div className="text-center text-gray-500 py-8">Nenhum usuário encontrado.</div>
                    )}
                </div>
            )}
        </div>
    );
}

const TIPOS_LOG = [
    { value: null, label: "Todos", color: "text-gray-400", bg: "bg-gray-700/40" },
    { value: 0, label: "Bolão Criado", color: "text-blue-400", bg: "bg-blue-900/30" },
    { value: 1, label: "Palpite Criado", color: "text-purple-400", bg: "bg-purple-900/30" },
    { value: 2, label: "Jogo Finalizado", color: "text-green-400", bg: "bg-green-900/30" },
    { value: 3, label: "Prêmio Resgatado", color: "text-yellow-400", bg: "bg-yellow-900/30" },
    { value: 4, label: "Transação", color: "text-accent", bg: "bg-green-900/20" },
    { value: 5, label: "Notif. MP", color: "text-cyan-400", bg: "bg-cyan-900/30" },
    { value: 6, label: "Carteira Creditada", color: "text-emerald-400", bg: "bg-emerald-900/30" },
    { value: 7, label: "Reembolso", color: "text-orange-400", bg: "bg-orange-900/30" },
];

function tipoLogInfo(tipo) {
    return TIPOS_LOG.find(t => t.value === tipo) || TIPOS_LOG[0];
}

function AbaLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tipoFiltro, setTipoFiltro] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [temMais, setTemMais] = useState(false);

    const carregar = useCallback(async (tipo, pg) => {
        setLoading(true);
        try {
            const data = await adminService.getLogs(tipo, pg);
            const lista = Array.isArray(data) ? data : (data?.items || data?.logs || []);
            if (pg === 1) {
                setLogs(lista);
            } else {
                setLogs(prev => [...prev, ...lista]);
            }
            setTemMais(lista.length >= 50);
        } catch {
            setLogs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setPagina(1);
        carregar(tipoFiltro, 1);
    }, [tipoFiltro, carregar]);

    const carregarMais = () => {
        const prox = pagina + 1;
        setPagina(prox);
        carregar(tipoFiltro, prox);
    };

    const formatarData = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-5">
                {TIPOS_LOG.map(t => (
                    <button
                        key={String(t.value)}
                        onClick={() => setTipoFiltro(t.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border
                            ${tipoFiltro === t.value
                                ? `${t.bg} ${t.color} border-current`
                                : 'bg-transparent text-gray-500 border-gray-700 hover:text-gray-300'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {loading && pagina === 1 ? (
                <div className="text-center text-gray-400 py-12">
                    <i className="fa-solid fa-spinner animate-spin text-2xl"></i>
                </div>
            ) : logs.length === 0 ? (
                <p className="text-gray-500 text-center py-10">Nenhum log encontrado.</p>
            ) : (
                <div className="space-y-1.5">
                    {logs.map((log, i) => {
                        const info = tipoLogInfo(log.tipo);
                        return (
                            <div key={log.id || i} className="bg-dark border border-gray-700/60 rounded-xl px-4 py-3 flex items-start gap-3 text-sm">
                                <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-md mt-0.5 ${info.bg} ${info.color}`}>
                                    {info.label}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm leading-snug">{log.mensagem}</p>
                                    {log.referencia && (
                                        <p className="text-gray-600 text-xs mt-0.5 font-mono truncate">ref: {log.referencia}</p>
                                    )}
                                </div>
                                <span className="shrink-0 text-gray-600 text-xs whitespace-nowrap mt-0.5">
                                    {formatarData(log.dataHora)}
                                </span>
                            </div>
                        );
                    })}
                    {temMais && (
                        <div className="text-center pt-3">
                            <button
                                onClick={carregarMais}
                                disabled={loading}
                                className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition disabled:opacity-60">
                                {loading ? <i className="fa-solid fa-spinner animate-spin mr-2"></i> : null}
                                Carregar mais
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function AbaChavePix() {
    const [tipo, setTipo] = useState(0);
    const [chave, setChave] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, t = "ok") => setToast({ msg, tipo: t });

    const salvar = async () => {
        if (!chave.trim()) { showToast("Informe a chave PIX", "erro"); return; }
        setSalvando(true);
        try {
            await usuarioService.registrarChavePix(tipo, chave.trim());
            showToast("Chave PIX registrada com sucesso!");
        } catch {
            showToast("Erro ao registrar chave PIX", "erro");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="max-w-md">
            {toast && <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast(null)} />}
            <p className="text-gray-400 text-sm mb-6">
                Cadastre sua chave PIX para receber o prêmio automaticamente quando ganhar um bolão.
            </p>
            <div className="space-y-4">
                <div>
                    <label className="text-gray-400 text-sm mb-1 block">Tipo de chave</label>
                    <select
                        value={tipo}
                        onChange={e => setTipo(parseInt(e.target.value))}
                        className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm">
                        {TIPOS_CHAVE_PIX.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-gray-400 text-sm mb-1 block">Chave PIX</label>
                    <input
                        type="text"
                        value={chave}
                        onChange={e => setChave(e.target.value)}
                        placeholder={tipo === 0 ? "000.000.000-00" : tipo === 1 ? "email@exemplo.com" : tipo === 2 ? "+55 (11) 00000-0000" : "Chave aleatória"}
                        className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600" />
                </div>
                <button
                    onClick={salvar}
                    disabled={salvando}
                    className="w-full py-2.5 rounded-lg bg-primary hover:bg-green-600 text-black text-sm font-bold transition disabled:opacity-60">
                    {salvando ? "Salvando..." : "Salvar chave PIX"}
                </button>
            </div>
            <div className="mt-6 bg-dark border border-gray-700 rounded-xl p-4">
                <p className="text-gray-400 text-xs leading-relaxed">
                    <i className="fa-solid fa-circle-info text-blue-400 mr-2"></i>
                    A chave PIX é usada para enviar automaticamente os prêmios dos bolões ao processar o resultado de uma partida. Certifique-se de usar uma chave válida e ativa.
                </p>
            </div>
        </div>
    );
}

/* ─── Aba: Fluxo de Caixa ─── */
function AbaFluxoCaixa() {
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        adminService.getFluxoCaixa()
            .then(setDados)
            .catch(() => setErro('Erro ao carregar dados financeiros.'))
            .finally(() => setLoading(false));
    }, []);

    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);

    if (loading) return <div className="flex justify-center py-16"><i className="fa-solid fa-spinner animate-spin text-primary text-2xl"></i></div>;
    if (erro) return <p className="text-red-400 text-sm">{erro}</p>;

    const cards = [
        { label: 'Total Depositado', value: fmt(dados?.totalDepositado), icon: 'fa-arrow-down', color: 'text-green-400' },
        { label: 'Taxas Arrecadadas (caixa)', value: fmt(dados?.totalTaxasColetadas), icon: 'fa-percent', color: 'text-yellow-400' },
        { label: 'Total Saques', value: fmt(dados?.totalSaques), icon: 'fa-arrow-up', color: 'text-red-400' },
        { label: 'Prêmios Pagos', value: fmt(dados?.totalPremiosPagos), icon: 'fa-trophy', color: 'text-blue-400' },
        { label: 'Reembolsos', value: fmt(dados?.totalReembolsos), icon: 'fa-rotate-left', color: 'text-orange-400' },
        { label: 'Saldo do Caixa', value: fmt(dados?.saldoCaixaSistema), icon: 'fa-vault', color: 'text-emerald-400' },
    ];

    return (
        <div>
            <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <i className="fa-solid fa-chart-line text-primary"></i> Relatório de Fluxo de Caixa
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {cards.map(c => (
                    <div key={c.label} className="bg-dark border border-gray-700 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <i className={`fa-solid ${c.icon} ${c.color} text-sm`}></i>
                            <p className="text-gray-500 text-xs">{c.label}</p>
                        </div>
                        <p className={`text-xl font-bold font-mono ${c.color}`}>{c.value}</p>
                    </div>
                ))}
            </div>

            <h3 className="text-white font-semibold mb-3 text-sm">Movimentações — últimos 30 dias</h3>
            {dados?.ultimas30Dias?.length === 0 ? (
                <p className="text-gray-500 text-sm">Sem movimentações no período.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 border-b border-gray-700">
                                <th className="text-left py-2 pr-4">Data</th>
                                <th className="text-right py-2 pr-4 text-green-400">Entradas</th>
                                <th className="text-right py-2 pr-4 text-red-400">Saídas</th>
                                <th className="text-right py-2 text-yellow-400">Taxas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dados?.ultimas30Dias?.map(d => (
                                <tr key={d.data} className="border-b border-gray-800 hover:bg-gray-800/30">
                                    <td className="py-2 pr-4 text-gray-400">{new Date(d.data).toLocaleDateString('pt-BR')}</td>
                                    <td className="py-2 pr-4 text-right text-green-400 font-mono">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(d.entradas)}</td>
                                    <td className="py-2 pr-4 text-right text-red-400 font-mono">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(d.saidas)}</td>
                                    <td className="py-2 text-right text-yellow-400 font-mono">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(d.taxas)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

/* ─── Aba: Tickets de Suporte (visão admin) ─── */
function AbaTicketsAdmin() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [respostas, setRespostas] = useState({});
    const [enviando, setEnviando] = useState({});
    const [toast, setToast] = useState(null);

    const carregar = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminService.listarTodosTicketsAdmin();
            setTickets(data);
        } catch { setToast({ msg: 'Erro ao carregar tickets', tipo: 'erro' }); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { carregar(); }, [carregar]);

    const handleResponder = async (ticketId) => {
        const resp = respostas[ticketId]?.trim();
        if (!resp) return;
        setEnviando(v => ({ ...v, [ticketId]: true }));
        try {
            await adminService.responderTicket(ticketId, resp);
            setToast({ msg: 'Resposta enviada!', tipo: 'ok' });
            setRespostas(v => ({ ...v, [ticketId]: '' }));
            await carregar();
        } catch { setToast({ msg: 'Erro ao responder ticket', tipo: 'erro' }); }
        finally { setEnviando(v => ({ ...v, [ticketId]: false })); }
    };

    const handleFechar = async (ticketId) => {
        try {
            await adminService.fecharTicketAdmin(ticketId);
            setToast({ msg: 'Ticket fechado.', tipo: 'ok' });
            await carregar();
        } catch { setToast({ msg: 'Erro ao fechar ticket', tipo: 'erro' }); }
    };

    const STATUS_COLOR = {
        Aberto: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
        Respondido: 'bg-green-900/40 text-green-300 border-green-700/40',
        Fechado: 'bg-gray-800 text-gray-500 border-gray-700',
    };

    return (
        <div>
            {toast && <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast(null)} />}
            <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <i className="fa-solid fa-headset text-primary"></i> Tickets de Suporte
            </h2>
            {loading ? (
                <div className="flex justify-center py-12"><i className="fa-solid fa-spinner animate-spin text-primary text-2xl"></i></div>
            ) : tickets.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-12">Nenhum ticket aberto.</p>
            ) : (
                <div className="space-y-4">
                    {tickets.map(t => (
                        <div key={t.id} className="bg-dark border border-gray-700 rounded-xl p-5">
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div>
                                    <p className="text-white font-bold">{t.titulo}</p>
                                    <p className="text-gray-500 text-xs">{t.nomeUsuario} · {t.emailUsuario} · {new Date(t.criadoEm).toLocaleString('pt-BR')}</p>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border flex-shrink-0 ${STATUS_COLOR[t.status] || ''}`}>
                                    {t.status}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3 whitespace-pre-wrap">{t.descricao}</p>
                            {t.respostaAdmin && (
                                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3 mb-3 text-xs text-green-300">
                                    <strong>Resposta enviada:</strong> {t.respostaAdmin}
                                </div>
                            )}
                            {t.status !== 'Fechado' && (
                                <div className="flex gap-2 mt-3">
                                    <textarea
                                        value={respostas[t.id] || ''}
                                        onChange={e => setRespostas(v => ({ ...v, [t.id]: e.target.value }))}
                                        placeholder="Escreva uma resposta..."
                                        rows={2}
                                        className="flex-1 bg-card border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:border-primary outline-none"
                                    />
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => handleResponder(t.id)} disabled={enviando[t.id]}
                                            className="px-3 py-2 bg-primary hover:bg-green-600 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition">
                                            {enviando[t.id] ? '...' : 'Responder'}
                                        </button>
                                        <button onClick={() => handleFechar(t.id)}
                                            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-bold rounded-lg transition">
                                            Fechar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function Admin() {
    const [aba, setAba] = useState("partidas");

    const abas = [
        { key: "partidas", label: "Partidas", icon: "fa-futbol" },
        { key: "usuarios", label: "Usuários", icon: "fa-users" },
        { key: "saques", label: "Saques", icon: "fa-money-bill-transfer" },
        { key: "logs", label: "Logs do Sistema", icon: "fa-terminal" },
        { key: "pix", label: "Minha Chave PIX", icon: "fa-qrcode" },
        { key: "caixa", label: "Fluxo de Caixa", icon: "fa-chart-line" },
        { key: "tickets", label: "Tickets", icon: "fa-headset" },
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-white">Gestão do Sistema</h1>
                <p className="text-gray-400 text-sm mt-1">Painel administrativo — Copa do Mundo 2026</p>
            </div>

            <div className="flex flex-wrap gap-1 bg-dark p-1 rounded-xl border border-gray-700 mb-6 w-fit">
                {abas.map(a => (
                    <button
                        key={a.key}
                        onClick={() => setAba(a.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition
                            ${aba === a.key ? 'bg-card text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}>
                        <i className={`fa-solid ${a.icon}`}></i>
                        {a.label}
                    </button>
                ))}
            </div>

            <div className="bg-card border border-gray-700 rounded-2xl p-6">
                {aba === "partidas" && <AbaPartidas />}
                {aba === "usuarios" && <AbaUsuarios />}
                {aba === "saques" && <SaquesAdmin />}
                {aba === "logs" && <AbaLogs />}
                {aba === "pix" && <AbaChavePix />}
                {aba === "caixa" && <AbaFluxoCaixa />}
                {aba === "tickets" && <AbaTicketsAdmin />}
            </div>
        </div>
    );
}
