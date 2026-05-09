import { useState, useEffect } from 'react';
import { bolaoService } from '../../services/bolaoService';

const VISIBILIDADE = { 1: 'Público', 2: 'Privado' };
const STATUS_BOLAO_COLOR = {
    Aberto: 'text-green-400',
    Fechado: 'text-yellow-400',
    Concluido: 'text-blue-400',
    Cancelado: 'text-red-400',
};

export function MeusBolaoes() {
    const [bolaoes, setBolaoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alterando, setAlterando] = useState(null);

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
        } catch (e) {
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
                        <div key={bolao.id} className="bg-card border border-gray-700 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
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
                    ))}
                </div>
            )}
        </div>
    );
}
