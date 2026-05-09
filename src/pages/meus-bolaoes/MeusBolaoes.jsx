import { useState, useEffect } from 'react';
import { bolaoService } from '../../services/bolaoService';

const VISIBILIDADE = { 1: 'Público', 2: 'Privado' };
const STATUS_BOLAO_COLOR = {
    Aberto: 'text-green-400',
    Fechado: 'text-yellow-400',
    Concluido: 'text-blue-400',
    Cancelado: 'text-red-400',
};
const STATUS_PALPITE_COLOR = {
    Pendente: 'text-yellow-400',
    Pago: 'text-green-400',
    Cancelado: 'text-red-400',
    Vencedor: 'text-blue-400',
};

export function MeusBolaoes() {
    const [bolaoes, setBolaoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alterando, setAlterando] = useState(null);
    const [bolaoExpandido, setBolaoExpandido] = useState(null);
    const [participantes, setParticipantes] = useState({});
    const [loadingParticipantes, setLoadingParticipantes] = useState(null);
    const [cancelando, setCancelando] = useState(null);

    useEffect(() => {
        bolaoService.getMeusBolaoes()
            .then(setBolaoes)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleVisibilidade = async (bolao) => {
        const novaVis = bolao.visibilidade === 1 ? 2 : 1;
        setAlterando(bolao.id);
        try {
            await bolaoService.alterarVisibilidade(bolao.id, novaVis);
            setBolaoes(prev => prev.map(b => b.id === bolao.id ? { ...b, visibilidade: novaVis } : b));
        } catch {
            alert('Erro ao alterar visibilidade.');
        } finally {
            setAlterando(null);
        }
    };

    const handleCompartilhar = (bolao) => {
        const link = `${window.location.origin}/bolao/${bolao.id}/convite`;
        const texto = `🏆 Participe do meu bolão: *${bolao.nome}*!\n⚽ ${bolao.timeA} vs ${bolao.timeB}\n💰 Entrada: R$ ${Number(bolao.valor).toFixed(2)}\n👉 ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
    };

    const handleVerParticipantes = async (bolaoId) => {
        if (bolaoExpandido === bolaoId) {
            setBolaoExpandido(null);
            return;
        }
        setBolaoExpandido(bolaoId);
        if (participantes[bolaoId]) return;
        setLoadingParticipantes(bolaoId);
        try {
            const data = await bolaoService.getParticipantes(bolaoId);
            setParticipantes(prev => ({ ...prev, [bolaoId]: data }));
        } catch {
            alert('Erro ao carregar participantes.');
            setBolaoExpandido(null);
        } finally {
            setLoadingParticipantes(null);
        }
    };

    const handleCancelarPalpite = async (palpiteId, bolaoId) => {
        if (!confirm('Cancelar este palpite e estornar o pagamento?')) return;
        setCancelando(palpiteId);
        try {
            await bolaoService.cancelarPalpite(palpiteId);
            setParticipantes(prev => ({
                ...prev,
                [bolaoId]: prev[bolaoId].map(p =>
                    p.palpiteId === palpiteId ? { ...p, statusPalpite: 'Cancelado', pago: false } : p
                )
            }));
        } catch (e) {
            const msg = e.response?.data?.detail || 'Erro ao cancelar palpite.';
            alert(msg);
        } finally {
            setCancelando(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <i className="fa-solid fa-spinner animate-spin text-primary text-3xl"></i>
            </div>
        );
    }

    return (
        <div className="fade-in max-w-4xl mx-auto p-4 pb-20">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Meus Bolões</h2>
                <p className="text-gray-400 text-sm mt-1">Gerencie os bolões que você criou</p>
            </div>

            {bolaoes.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <i className="fa-solid fa-futbol text-4xl mb-4 block opacity-30"></i>
                    <p>Você ainda não criou nenhum bolão.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bolaoes.map(bolao => (
                        <div key={bolao.id} className="bg-card border border-gray-700 rounded-xl overflow-hidden">
                            <div className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-white truncate">{bolao.nome}</h4>
                                        <span className={`text-xs font-semibold ${STATUS_BOLAO_COLOR[bolao.statusBolao] || 'text-gray-400'}`}>
                                            {bolao.statusBolao}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        {bolao.timeA} vs {bolao.timeB}
                                    </p>
                                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                                        <span><i className="fa-solid fa-users mr-1"></i>{bolao.qtdParticipantes} participantes</span>
                                        <span><i className="fa-solid fa-coins mr-1"></i>R$ {Number(bolao.valor).toFixed(2)}</span>
                                        <span><i className="fa-solid fa-calendar mr-1"></i>Até {new Date(bolao.dtFechamento).toLocaleDateString('pt-BR')}</span>
                                        <span><i className="fa-solid fa-trophy mr-1"></i>{bolao.premio}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 shrink-0">
                                    <button
                                        onClick={() => handleVerParticipantes(bolao.id)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 text-sm font-medium transition"
                                    >
                                        <i className={`fa-solid ${bolaoExpandido === bolao.id ? 'fa-chevron-up' : 'fa-users'}`}></i>
                                        Participantes
                                    </button>

                                    <button
                                        onClick={() => handleVisibilidade(bolao)}
                                        disabled={alterando === bolao.id}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${
                                            bolao.visibilidade === 1
                                                ? 'border-blue-500/40 text-blue-400 hover:bg-blue-500/10'
                                                : 'border-gray-600 text-gray-400 hover:bg-gray-700'
                                        }`}
                                    >
                                        {alterando === bolao.id
                                            ? <i className="fa-solid fa-spinner animate-spin"></i>
                                            : <i className={`fa-solid ${bolao.visibilidade === 1 ? 'fa-globe' : 'fa-lock'}`}></i>
                                        }
                                        {VISIBILIDADE[bolao.visibilidade]}
                                    </button>

                                    <button
                                        onClick={() => handleCompartilhar(bolao)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-green-500/40 text-green-400 hover:bg-green-500/10 text-sm font-medium transition"
                                    >
                                        <i className="fa-brands fa-whatsapp"></i>
                                        Compartilhar
                                    </button>
                                </div>
                            </div>

                            {bolaoExpandido === bolao.id && (
                                <div className="border-t border-gray-700/60 bg-dark/40 p-4">
                                    {loadingParticipantes === bolao.id ? (
                                        <div className="text-center py-6 text-gray-500">
                                            <i className="fa-solid fa-spinner animate-spin mr-2"></i>Carregando participantes...
                                        </div>
                                    ) : participantes[bolao.id]?.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-gray-500 text-xs uppercase border-b border-gray-700">
                                                        <th className="text-left py-2 pr-3">Participante</th>
                                                        <th className="text-left py-2 pr-3">Palpite</th>
                                                        <th className="text-left py-2 pr-3">Status</th>
                                                        <th className="text-left py-2 pr-3">Pago</th>
                                                        <th className="text-right py-2">Ação</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-700/40">
                                                    {participantes[bolao.id].map(p => (
                                                        <tr key={p.palpiteId} className="text-gray-300">
                                                            <td className="py-2 pr-3">
                                                                <span className="font-medium text-white">{p.nomeParticipante}</span>
                                                                <br/>
                                                                <span className="text-xs text-gray-500">{p.emailParticipante}</span>
                                                            </td>
                                                            <td className="py-2 pr-3">
                                                                {p.golsTimeA} x {p.golsTimeB}
                                                            </td>
                                                            <td className="py-2 pr-3">
                                                                <span className={`text-xs font-semibold ${STATUS_PALPITE_COLOR[p.statusPalpite] || 'text-gray-400'}`}>
                                                                    {p.statusPalpite}
                                                                </span>
                                                            </td>
                                                            <td className="py-2 pr-3">
                                                                {p.pago
                                                                    ? <i className="fa-solid fa-circle-check text-green-400"></i>
                                                                    : <i className="fa-solid fa-circle-xmark text-gray-600"></i>
                                                                }
                                                            </td>
                                                            <td className="py-2 text-right">
                                                                {p.statusPalpite !== 'Cancelado' && (
                                                                    <button
                                                                        onClick={() => handleCancelarPalpite(p.palpiteId, bolao.id)}
                                                                        disabled={cancelando === p.palpiteId}
                                                                        className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/60 px-2 py-1 rounded transition disabled:opacity-50"
                                                                    >
                                                                        {cancelando === p.palpiteId
                                                                            ? <i className="fa-solid fa-spinner animate-spin"></i>
                                                                            : <><i className="fa-solid fa-ban mr-1"></i>Cancelar</>
                                                                        }
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm text-center py-4">Nenhum participante ainda.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
