import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { palpiteService } from "../../services/palpiteService";
import { pixService } from "../../services/pixService";
import QRCodePixModal from "./components/QRCodePixModal";
import ToastNotification from "./components/ToastNotification";

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);

const formatarData = (data) => {
    if (!data) return '—';
    return new Date(data).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatarDataCurta = (data) => {
    if (!data) return '—';
    return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

// ─── Modal de Detalhes do Bolão ───────────────────────────────────────────────
function ModalDetalhesBolao({ bolaoId, tipoBolao, onClose }) {
    const [detalhes, setDetalhes] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        const carregar = async () => {
            setCarregando(true);
            const res = await palpiteService.getDetalhesBolao(bolaoId);
            if (res.success) {
                setDetalhes(res.data);
            } else {
                setErro(res.message);
            }
            setCarregando(false);
        };
        carregar();
    }, [bolaoId]);

    const isTimeVencedor = tipoBolao === 'TimeVencedor';

    const renderPalpiteParticipante = (p) => {
        if (isTimeVencedor) {
            return (
                <span className="text-primary font-bold text-sm">{p.timeVencedorPalpitado}</span>
            );
        }
        return (
            <span className="text-primary font-bold text-sm font-mono">{p.palpiteGolsA} × {p.palpiteGolsB}</span>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4 py-6 overflow-y-auto">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full shadow-2xl my-auto">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <i className="fa-solid fa-binoculars text-purple-400"></i>
                        Detalhes do Bolão
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {carregando && (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <i className="fa-solid fa-spinner animate-spin text-primary text-2xl"></i>
                            <p className="text-gray-400 text-sm">Carregando detalhes...</p>
                        </div>
                    )}

                    {erro && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                            <i className="fa-solid fa-circle-exclamation text-red-400 mb-2"></i>
                            <p className="text-red-400 text-sm">{erro}</p>
                        </div>
                    )}

                    {detalhes && (
                        <>
                            {/* Info do Bolão */}
                            <div className="bg-gray-800/60 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Bolão</span>
                                    <span className="text-white font-bold">{detalhes.nomeBolao}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Organizador</span>
                                    <span className="text-white font-semibold">{detalhes.nomeOrganizador}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Partida</span>
                                    <span className="text-white font-semibold">{detalhes.timeA} × {detalhes.timeB}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Data do jogo</span>
                                    <span className="text-white font-semibold">{formatarData(detalhes.dataPartida)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Tipo de bolão</span>
                                    <span className="text-white font-semibold">
                                        {detalhes.tipoBolao === 'TimeVencedor' ? 'Time Vencedor' : 'Placar Exato'}
                                    </span>
                                </div>
                            </div>

                            {/* Card de Provisão de Ganhos */}
                            <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4">
                                <p className="text-green-400 font-bold text-sm mb-3 flex items-center gap-2">
                                    <i className="fa-solid fa-coins"></i>
                                    Provisão de Ganhos
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-black/30 rounded-lg p-3 text-center">
                                        <p className="text-gray-400 text-xs mb-1">Prêmio total</p>
                                        <p className="text-white font-bold text-base">{fmt(detalhes.premioPool)}</p>
                                    </div>
                                    <div className="bg-green-500/10 rounded-lg p-3 text-center border border-green-500/20">
                                        <p className="text-gray-400 text-xs mb-1">Sua estimativa</p>
                                        <p className="text-green-400 font-bold text-base">{fmt(detalhes.provisaoGanho)}</p>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-xs mt-3 text-center">
                                    * Estimativa baseada nos palpites pagos atuais. Pode variar.
                                </p>
                            </div>

                            {/* Lista de Participantes */}
                            <div>
                                <p className="text-gray-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                                    <i className="fa-solid fa-users text-gray-500"></i>
                                    Participantes ({detalhes.participantes?.length ?? 0})
                                </p>
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                    {detalhes.participantes?.map((p, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center justify-between rounded-lg px-4 py-3 border ${
                                                p.ehMeuPalpite
                                                    ? 'bg-primary/10 border-primary/30'
                                                    : 'bg-gray-800/40 border-gray-700/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {p.ehMeuPalpite && (
                                                    <span className="text-xs bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-bold">
                                                        Eu
                                                    </span>
                                                )}
                                                <span className={`text-sm ${p.ehMeuPalpite ? 'text-white font-bold' : 'text-gray-300'}`}>
                                                    {p.nomeParticipante}
                                                </span>
                                                {p.qtdCotas > 1 && (
                                                    <span className="text-xs text-gray-500">×{p.qtdCotas}</span>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                {renderPalpiteParticipante(p)}
                                            </div>
                                        </div>
                                    ))}
                                    {(!detalhes.participantes || detalhes.participantes.length === 0) && (
                                        <p className="text-gray-500 text-sm text-center py-4">Nenhum participante ainda.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="px-6 pb-5">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition text-sm"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Modal de Resgate ─────────────────────────────────────────────────────────
function ModalResgate({ palpiteId, valorPremio, onClose, onSuccess }) {
    const [tipo, setTipo] = useState('');
    const [chavePix, setChavePix] = useState('');
    const [etapa, setEtapa] = useState('escolha');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    const valorFormatado = fmt(valorPremio);

    const handleSelecionarTipo = (t) => {
        setTipo(t);
        setErro('');
        setEtapa(t === 'pix' ? 'pix-input' : 'carteira-confirmar');
    };

    const handleConfirmar = async () => {
        setCarregando(true);
        setErro('');
        try {
            const res = await palpiteService.resgatarPremio(palpiteId, {
                tipoResgate: tipo,
                chavePix: tipo === 'pix' ? chavePix.trim() : null,
            });
            if (res.success) {
                onSuccess(res.data, tipo);
            } else {
                setErro(res.message || 'Erro ao resgatar prêmio.');
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">

                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <i className="fa-solid fa-trophy text-yellow-400"></i>
                        Resgatar Prêmio
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>

                <div className="bg-green-900/20 border border-green-700/30 rounded-xl px-4 py-3 mb-5 text-center">
                    <p className="text-gray-400 text-xs mb-1">Valor do prêmio</p>
                    <p className="text-green-400 font-bold text-2xl">{valorFormatado}</p>
                </div>

                {etapa === 'escolha' && (
                    <>
                        <p className="text-gray-400 text-sm mb-4 text-center">Como deseja receber seu prêmio?</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleSelecionarTipo('pix')}
                                className="flex flex-col items-center gap-2 py-4 rounded-xl border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-400 transition font-bold text-sm"
                            >
                                <i className="fa-brands fa-pix text-xl"></i>
                                PIX externo
                            </button>
                            <button
                                onClick={() => handleSelecionarTipo('carteira')}
                                className="flex flex-col items-center gap-2 py-4 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition font-bold text-sm"
                            >
                                <i className="fa-solid fa-wallet text-xl"></i>
                                Minha Carteira
                            </button>
                        </div>
                    </>
                )}

                {etapa === 'pix-input' && (
                    <>
                        <p className="text-gray-400 text-sm mb-3">
                            Informe sua chave PIX para receber <span className="text-green-400 font-bold">{valorFormatado}</span>.
                        </p>
                        <input
                            type="text"
                            value={chavePix}
                            onChange={e => { setChavePix(e.target.value); setErro(''); }}
                            placeholder="CPF, e-mail, telefone ou chave aleatória"
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary mb-4"
                        />
                        {erro && <p className="text-red-400 text-xs mb-3"><i className="fa-solid fa-circle-exclamation mr-1"></i>{erro}</p>}
                        <div className="flex gap-3">
                            <button onClick={() => setEtapa('escolha')} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition text-sm">Voltar</button>
                            <button
                                onClick={() => setEtapa('confirmar')}
                                disabled={!chavePix.trim()}
                                className="flex-1 py-3 bg-primary hover:bg-green-600 disabled:opacity-50 text-black font-bold rounded-lg transition text-sm"
                            >
                                Continuar
                            </button>
                        </div>
                    </>
                )}

                {etapa === 'confirmar' && (
                    <>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                            <div className="flex gap-2 mb-2">
                                <i className="fa-solid fa-triangle-exclamation text-yellow-400 mt-0.5 flex-shrink-0"></i>
                                <p className="text-yellow-300 font-bold text-sm">Atenção — leia antes de confirmar</p>
                            </div>
                            <p className="text-yellow-200 text-xs leading-relaxed">
                                O sistema <strong>não se responsabiliza</strong> por pagamentos enviados a chaves PIX incorretas.
                                Verifique cuidadosamente. Após o envio, não é possível cancelar ou estornar.
                            </p>
                        </div>
                        <div className="bg-gray-800 rounded-lg px-4 py-3 mb-4 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Chave PIX</span>
                                <span className="text-white font-mono font-bold break-all text-right max-w-[60%]">{chavePix}</span>
                            </div>
                            <div className="flex justify-between text-xs border-t border-gray-700 pt-2">
                                <span className="text-gray-400">Valor</span>
                                <span className="text-green-400 font-bold">{valorFormatado}</span>
                            </div>
                        </div>
                        {erro && <p className="text-red-400 text-xs mb-3"><i className="fa-solid fa-circle-exclamation mr-1"></i>{erro}</p>}
                        <div className="flex gap-3">
                            <button onClick={() => setEtapa('pix-input')} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition text-sm">Corrigir</button>
                            <button
                                onClick={handleConfirmar}
                                disabled={carregando}
                                className="flex-1 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold rounded-lg transition text-sm flex items-center justify-center gap-2"
                            >
                                {carregando ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-check"></i>}
                                Confirmar
                            </button>
                        </div>
                    </>
                )}

                {etapa === 'carteira-confirmar' && (
                    <>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4 flex gap-3">
                            <i className="fa-solid fa-wallet text-blue-400 mt-0.5 flex-shrink-0"></i>
                            <div>
                                <p className="text-blue-300 font-bold text-sm mb-1">Depósito na carteira</p>
                                <p className="text-blue-200 text-xs leading-relaxed">
                                    O valor de <span className="font-bold text-white">{valorFormatado}</span> será creditado imediatamente na sua carteira e poderá ser usado em novos bolões.
                                </p>
                            </div>
                        </div>
                        {erro && <p className="text-red-400 text-xs mb-3"><i className="fa-solid fa-circle-exclamation mr-1"></i>{erro}</p>}
                        <div className="flex gap-3">
                            <button onClick={() => setEtapa('escolha')} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition text-sm">Voltar</button>
                            <button
                                onClick={handleConfirmar}
                                disabled={carregando}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-lg transition text-sm flex items-center justify-center gap-2"
                            >
                                {carregando ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wallet"></i>}
                                Depositar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── Página Principal ─────────────────────────────────────────────────────────
export function MeusPalpites() {
    const navigate = useNavigate();
    const [palpites, setPalpites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos');

    const [modalResgate, setModalResgate] = useState(null);
    const [modalDetalhes, setModalDetalhes] = useState(null); // { bolaoId, tipoBolao }

    const [showQRCode, setShowQRCode] = useState(false);
    const [qrCodeData, setQRCodeData] = useState(null);
    const [carregandoPix, setCarregandoPix] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
    };

    const handleExibirPix = async (palpiteId) => {
        setCarregandoPix(true);
        try {
            const result = await pixService.obterInfoPix(palpiteId);
            if (result.success && typeof result.data === "string" && result.data.startsWith("Este")) {
                showToast('success', result.data);
            } else if (result.success && result.data) {
                setQRCodeData(result.data);
                setShowQRCode(true);
                showToast('success', 'PIX carregado com sucesso!');
            } else {
                const resultGerar = await pixService.gerarPixParaPalpite(palpiteId);
                if (resultGerar.success && resultGerar.data) {
                    setQRCodeData(resultGerar.data);
                    setShowQRCode(true);
                    showToast('success', 'PIX gerado com sucesso!');
                } else {
                    showToast('error', 'Não foi possível gerar PIX. Tente novamente.');
                }
            }
        } catch {
            showToast('error', 'Erro ao carregar PIX');
        } finally {
            setCarregandoPix(false);
        }
    };

    useEffect(() => {
        const fetchPalpites = async () => {
            try {
                setLoading(true);
                const data = await palpiteService.getPalpiteByUser();
                setPalpites(Array.isArray(data) ? data : (data ? [data] : []));
            } catch (error) {
                console.error("Erro ao buscar palpites:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPalpites();
    }, []);

    const palpitesFiltrados = palpites.filter(p => {
        if (filtro === 'pendentes') return p.statusJogo !== 'Concluida';
        if (filtro === 'finalizados') return p.statusJogo === 'Concluida';
        return true;
    });

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'agendada':
                return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', label: '📅 Agendada', icon: 'fa-calendar' };
            case 'concluida':
            case 'finalizada':
                return { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', label: '✓ Finalizada', icon: 'fa-check-circle' };
            case 'em jogo':
                return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', label: '🔴 Em Jogo', icon: 'fa-circle-dot', animate: true };
            default:
                return { bg: 'bg-gray-500/10', border: 'border-gray-500/20', text: 'text-gray-400', label: status, icon: 'fa-question-circle' };
        }
    };

    const getStatusBadgeTransacao = (status) => {
        switch (status?.toLowerCase()) {
            case 'concluido':
                return { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', label: 'Palpite registrado', icon: 'fa-check-circle' };
            case 'pendente':
                return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400 text-xs font-bold', label: 'Pagamento pendente' };
            default:
                return { display: 'none' };
        }
    };

    const getStatusBadgePalpite = (status) => {
        switch (status?.toLowerCase()) {
            case 'vencedor':
                return { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', label: 'Palpite vencedor', icon: 'fa-check-circle' };
            case 'perdedor':
                return { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', label: 'Palpite perdedor', icon: 'fa-times-circle' };
            case 'cancelado':
                return { bg: 'bg-gray-500/10', border: 'border-gray-500/20', text: 'text-gray-400', label: 'Palpite cancelado', icon: 'fa-circle-dot' };
            default:
                return { hidden: true };
        }
    };

    const formatarValor = (valor) => {
        if (!valor) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    if (loading) {
        return (
            <div id="view-my-bets" className="fade-in p-10 text-center">
                <div className="flex flex-col items-center gap-4">
                    <i className="fa-solid fa-spinner animate-spin text-primary text-3xl"></i>
                    <p className="text-gray-400">Carregando seus palpites...</p>
                </div>
            </div>
        );
    }

    return (
        <div id="view-my-bets" className="fade-in">
            {/* Toast */}
            {toast.show && (
                <div className="fixed top-6 right-6 max-w-md z-50">
                    <div className={`backdrop-blur-md rounded-2xl p-4 shadow-2xl border ${
                        toast.type === 'success' ? 'bg-green-500/20 border-green-500/40' : 'bg-red-500/20 border-red-500/40'
                    }`}>
                        <div className="flex items-start gap-3">
                            <div className={`text-lg ${toast.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                <i className={`fa-solid ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                            </div>
                            <div className="flex-1">
                                <p className={`font-bold text-sm ${toast.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                    {toast.type === 'success' ? 'Sucesso!' : 'Erro!'}
                                </p>
                                <p className="text-gray-300 text-sm mt-1">{toast.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <i className="fa-solid fa-list-check text-primary"></i>
                        Meus Palpites
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Acompanhe todos os seus palpites e resultados</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 text-center flex-1 md:flex-none">
                        <p className="text-blue-400 text-xs font-bold">Total</p>
                        <p className="text-blue-300 text-lg font-bold">{palpites.length}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 text-center flex-1 md:flex-none">
                        <p className="text-yellow-400 text-xs font-bold">Pendentes</p>
                        <p className="text-yellow-300 text-lg font-bold">{palpites.filter(p => p.statusJogo !== 'Concluida').length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-center flex-1 md:flex-none">
                        <p className="text-green-400 text-xs font-bold">Finalizados</p>
                        <p className="text-green-300 text-lg font-bold">{palpites.filter(p => p.statusJogo === 'Concluida').length}</p>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 mb-6 border-b border-gray-700 pb-4">
                {[
                    { value: 'todos', label: 'Todos' },
                    { value: 'pendentes', label: 'Pendentes' },
                    { value: 'finalizados', label: 'Finalizados' }
                ].map(f => (
                    <button
                        key={f.value}
                        onClick={() => setFiltro(f.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            filtro === f.value ? 'bg-primary text-black' : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Lista de Palpites */}
            <div className="space-y-4 pb-10">
                {palpitesFiltrados.length > 0 ? (
                    palpitesFiltrados.map((palpite, index) => {
                        const statusBadge = getStatusBadge(palpite.statusJogo);
                        const statusBadge2 = getStatusBadgeTransacao(palpite.statusPagamento);
                        const statusBadge3 = getStatusBadgePalpite(palpite.statusPalpite);
                        const isTimeVencedor = palpite.tipoBolao === 'TimeVencedor';

                        return (
                            <div
                                key={index}
                                className="bg-card border border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 transition group"
                            >
                                <div className="p-4 md:p-6">
                                    {/* Linha Superior */}
                                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                                        <div className="flex-1">
                                            {/* Badges de status */}
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.bg} ${statusBadge.border} ${statusBadge.text} flex items-center gap-1 ${statusBadge.animate ? 'animate-pulse' : ''}`}>
                                                    <i className={`fa-solid ${statusBadge.icon}`}></i>
                                                    {statusBadge.label}
                                                </div>

                                                {statusBadge2.label && (
                                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge2.bg} ${statusBadge2.border} ${statusBadge2.text} flex items-center gap-1`}>
                                                        {statusBadge2.icon && <i className={`fa-solid ${statusBadge2.icon}`}></i>}
                                                        {statusBadge2.label}
                                                    </div>
                                                )}

                                                {palpite.statusJogo !== 'Pendente' && !statusBadge3.hidden && (
                                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge3.bg} ${statusBadge3.border} ${statusBadge3.text} flex items-center gap-1`}>
                                                        <i className={`fa-solid ${statusBadge3.icon}`}></i>
                                                        {statusBadge3.label}
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="text-lg font-bold text-white mb-1">
                                                {palpite.nomeBolao || 'Bolão sem nome'}
                                            </h3>
                                            <p className="text-gray-400 text-sm">
                                                {palpite.descricaoJogo || `${palpite.timeA} × ${palpite.timeB}`}
                                            </p>
                                        </div>

                                        {/* Entrada e Datas */}
                                        <div className="md:text-right border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-6 flex-shrink-0">
                                            <p className="text-gray-400 text-xs mb-1">Entrada</p>
                                            <p className="text-green-400 font-bold text-lg">{formatarValor(palpite.valorApostado)}</p>
                                            <div className="mt-2 space-y-1">
                                                <p className="text-gray-500 text-xs flex items-center gap-1 md:justify-end">
                                                    <i className="fa-solid fa-pen-to-square text-gray-600"></i>
                                                    Palpite: {formatarDataCurta(palpite.dataPalpite)}
                                                </p>
                                                <p className="text-gray-500 text-xs flex items-center gap-1 md:justify-end">
                                                    <i className="fa-solid fa-futbol text-gray-600"></i>
                                                    Jogo: {formatarData(palpite.dataPartida)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Palpite e Placar */}
                                    <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50 mb-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-400 text-xs uppercase font-bold mb-2">Seu Palpite</p>
                                                {isTimeVencedor ? (
                                                    <p className="text-primary font-bold text-lg">
                                                        {palpite.timeVencedor || '—'}
                                                    </p>
                                                ) : (
                                                    <p className="text-primary font-bold text-2xl font-mono">
                                                        {palpite.placarPalpite}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="border-l border-gray-700/50 pl-4">
                                                <p className="text-gray-400 text-xs uppercase font-bold mb-2">Placar do jogo</p>
                                                <p className="text-primary font-bold text-2xl font-mono">
                                                    {palpite.placarAtual}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ações */}
                                    <div className="flex flex-wrap gap-2">

                                        {/* Resgatar Prêmio */}
                                        {palpite.statusPalpite?.toLowerCase() === 'vencedor' && !palpite.premioEnviado && (
                                            <button
                                                onClick={() => setModalResgate({ id: palpite.id, valor: palpite.valorPremio })}
                                                className="flex-1 md:flex-none px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                <i className="fa-solid fa-trophy"></i>
                                                Resgatar Prêmio
                                            </button>
                                        )}

                                        {/* PIX */}
                                        {palpite.statusJogo !== 'Finalizada' && palpite.statusPagamento?.toLowerCase() !== 'concluido' && (
                                            <button
                                                onClick={() => handleExibirPix(palpite.id)}
                                                disabled={carregandoPix}
                                                className="flex-1 md:flex-none px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {carregandoPix ? (
                                                    <><i className="fa-solid fa-spinner animate-spin"></i> Carregando...</>
                                                ) : (
                                                    <><i className="fa-solid fa-qrcode"></i> PIX</>
                                                )}
                                            </button>
                                        )}

                                        {/* WhatsApp */}
                                        <button
                                            onClick={() => {
                                                const text = `Confira meu palpite no Bolão ${palpite.nomeBolao}!`;
                                                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                            }}
                                            className="flex-1 md:flex-none px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                                        >
                                            <i className="fa-brands fa-whatsapp"></i>
                                            ZAP
                                        </button>

                                        {/* Detalhes — sempre visível */}
                                        <button
                                            onClick={() => setModalDetalhes({ bolaoId: palpite.bolaoId, tipoBolao: palpite.tipoBolao })}
                                            className="flex-1 md:flex-none px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                            Detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-card border border-gray-700 rounded-2xl p-12 text-center">
                        <i className="fa-solid fa-inbox text-gray-600 text-4xl mb-4 block"></i>
                        <p className="text-gray-500 font-medium">
                            {filtro === 'todos'
                                ? 'Você ainda não tem nenhum palpite.'
                                : filtro === 'pendentes'
                                    ? 'Não há palpites pendentes.'
                                    : 'Não há palpites finalizados.'}
                        </p>
                        <p className="text-gray-600 text-sm mt-2">Crie seu primeiro palpite agora!</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="mt-4 px-6 py-2 bg-primary hover:bg-green-600 text-black font-bold rounded-lg transition-all"
                        >
                            Ir para Dashboard
                        </button>
                    </div>
                )}
            </div>

            {/* Modal QR Code PIX */}
            {showQRCode && qrCodeData && (
                <QRCodePixModal
                    isOpen={showQRCode}
                    onClose={() => setShowQRCode(false)}
                    qrCode={qrCodeData.qrCode || qrCodeData.qr_code}
                    pixCopy={qrCodeData.pixCopy || qrCodeData.pix_copy}
                    valor={qrCodeData.valor}
                    expiresAt={qrCodeData.expiraEm || qrCodeData.expira_em}
                    palpiteId={qrCodeData.palpiteId || qrCodeData.palpite_id}
                />
            )}

            {/* Modal Resgate */}
            {modalResgate && (
                <ModalResgate
                    palpiteId={modalResgate.id}
                    valorPremio={modalResgate.valor}
                    onClose={() => setModalResgate(null)}
                    onSuccess={(data, tipo) => {
                        setModalResgate(null);
                        const msg = tipo === 'carteira'
                            ? `Prêmio de ${fmt(data.valorEnviado)} creditado na sua carteira!`
                            : `Prêmio de ${fmt(data.valorEnviado)} enviado para a chave PIX informada!`;
                        showToast('success', msg);
                        setPalpites(prev => prev.map(p =>
                            p.id === data.palpiteId ? { ...p, premioEnviado: true } : p
                        ));
                    }}
                />
            )}

            {/* Modal Detalhes do Bolão */}
            {modalDetalhes && (
                <ModalDetalhesBolao
                    bolaoId={modalDetalhes.bolaoId}
                    tipoBolao={modalDetalhes.tipoBolao}
                    onClose={() => setModalDetalhes(null)}
                />
            )}
        </div>
    );
}
