import { useState, useEffect, useCallback } from "react";
import { adminService } from "../../services/adminService";

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

function AbaPartidas() {
    const [partidas, setPartidas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sincronizando, setSincronizando] = useState(false);
    const [processando, setProcessando] = useState(null);
    const [toast, setToast] = useState(null);
    const [expandida, setExpandida] = useState(null);
    const [statusEdit, setStatusEdit] = useState({});
    const [showCriar, setShowCriar] = useState(false);
    const [times, setTimes] = useState([]);
    const [novaPartida, setNovaPartida] = useState({ idTimeA: "", idTimeB: "", dataPartida: "" });

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

    const processar = async (partidaId) => {
        setProcessando(partidaId);
        try {
            const res = await adminService.processarResultado(partidaId);
            showToast(res.mensagem || "Resultado processado!");
            await carregar();
        } catch (e) {
            showToast(e?.response?.data?.title || "Erro ao processar resultado", "erro");
        } finally {
            setProcessando(null);
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

    return (
        <div>
            {toast && <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast(null)} />}
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
                                onClick={() => setExpandida(expandida === p.id ? null : p.id)}>
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
                                <div className="border-t border-gray-700 px-5 py-4 bg-gray-900/30">
                                    <div className="flex flex-wrap gap-4 items-end">
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

                                        {p.statusPartida === 'Concluida' && !p.resultadoProcessado && (
                                            <button
                                                onClick={() => processar(p.id)}
                                                disabled={processando === p.id}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-yellow-500 text-black text-sm font-bold transition disabled:opacity-60">
                                                <i className={`fa-solid fa-trophy ${processando === p.id ? "animate-pulse" : ""}`}></i>
                                                {processando === p.id ? "Processando..." : "Processar Resultado"}
                                            </button>
                                        )}

                                        {p.statusPartida === 'Concluida' && p.resultadoProcessado && (
                                            <button
                                                onClick={() => processar(p.id)}
                                                disabled={processando === p.id}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition disabled:opacity-60">
                                                <i className="fa-solid fa-rotate"></i>
                                                Reprocessar
                                            </button>
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

function AbaLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");

    useEffect(() => {
        adminService.getLogs()
            .then(data => setLogs(data || []))
            .finally(() => setLoading(false));
    }, []);

    const filtrados = logs.filter(l => l.toLowerCase().includes(busca.toLowerCase()));

    return (
        <div>
            <input
                type="text"
                placeholder="Filtrar logs..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2 text-white text-sm mb-5 placeholder-gray-500" />
            {loading ? (
                <div className="text-center text-gray-400 py-12">
                    <i className="fa-solid fa-spinner animate-spin text-2xl"></i>
                </div>
            ) : (
                <div className="bg-dark border border-gray-700 rounded-xl p-4 max-h-[520px] overflow-y-auto font-mono text-xs space-y-1">
                    {filtrados.slice(0, 200).map((log, i) => (
                        <p key={i} className={
                            log.includes("ERROR") ? "text-red-400" :
                            log.includes("SYSTEM") ? "text-blue-400" :
                            log.includes("FINANCE") ? "text-accent" :
                            "text-gray-400"
                        }>{log}</p>
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
        { key: "logs", label: "Logs do Sistema", icon: "fa-terminal" },
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-white">Gestão do Sistema</h1>
                <p className="text-gray-400 text-sm mt-1">Painel administrativo — Copa do Mundo 2026</p>
            </div>

            <div className="flex gap-1 bg-dark p-1 rounded-xl border border-gray-700 mb-6 w-fit">
                {abas.map(a => (
                    <button
                        key={a.key}
                        onClick={() => setAba(a.key)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition
                            ${aba === a.key ? 'bg-card text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}>
                        <i className={`fa-solid ${a.icon}`}></i>
                        {a.label}
                    </button>
                ))}
            </div>

            <div className="bg-card border border-gray-700 rounded-2xl p-6">
                {aba === "partidas" && <AbaPartidas />}
                {aba === "usuarios" && <AbaUsuarios />}
                {aba === "logs" && <AbaLogs />}
            </div>
        </div>
    );
}
