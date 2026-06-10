import { useState, useEffect } from 'react';
import { ticketService } from '../../services/ticketService';

const STATUS_LABEL = { Aberto: 'Aberto', Respondido: 'Respondido', Fechado: 'Fechado' };
const STATUS_COLOR = {
    Aberto: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
    Respondido: 'bg-green-900/40 text-green-300 border-green-700/40',
    Fechado: 'bg-gray-800 text-gray-500 border-gray-700',
};

function Toast({ msg, tipo, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
    return (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold
            ${tipo === 'erro' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
            {msg}
        </div>
    );
}

export function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [novoTitulo, setNovoTitulo] = useState('');
    const [novaDescricao, setNovaDescricao] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [toast, setToast] = useState(null);

    const carregar = async () => {
        try {
            setLoading(true);
            const data = await ticketService.listarMeusTickets();
            setTickets(data);
        } catch {
            setToast({ msg: 'Erro ao carregar tickets', tipo: 'erro' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { carregar(); }, []);

    const handleCriar = async (e) => {
        e.preventDefault();
        if (!novoTitulo.trim() || !novaDescricao.trim()) return;
        setEnviando(true);
        try {
            await ticketService.criarTicket(novoTitulo.trim(), novaDescricao.trim());
            setNovoTitulo('');
            setNovaDescricao('');
            setMostrarForm(false);
            setToast({ msg: 'Ticket aberto com sucesso!', tipo: 'ok' });
            await carregar();
        } catch (e) {
            setToast({ msg: e?.detail || 'Erro ao criar ticket', tipo: 'erro' });
        } finally {
            setEnviando(false);
        }
    };

    const handleFechar = async (id) => {
        try {
            await ticketService.fecharTicket(id);
            setToast({ msg: 'Ticket fechado.', tipo: 'ok' });
            await carregar();
        } catch {
            setToast({ msg: 'Erro ao fechar ticket', tipo: 'erro' });
        }
    };

    const handleReabrir = async (id) => {
        try {
            await ticketService.reabrirTicket(id);
            setToast({ msg: 'Ticket reaberto.', tipo: 'ok' });
            await carregar();
        } catch {
            setToast({ msg: 'Erro ao reabrir ticket', tipo: 'erro' });
        }
    };

    return (
        <div className="flex-1 p-4 md:p-6 bg-dark min-h-screen">
            {toast && <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast(null)} />}

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <i className="fa-solid fa-headset text-primary"></i>
                        Suporte / Tickets
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Abra um chamado em caso de dúvidas ou problemas.</p>
                </div>
                <button
                    onClick={() => setMostrarForm(v => !v)}
                    className="bg-primary hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> Novo Ticket
                </button>
            </div>

            {mostrarForm && (
                <form onSubmit={handleCriar} className="bg-card border border-gray-700 rounded-2xl p-6 mb-6 space-y-4">
                    <h2 className="text-white font-bold text-lg">Abrir novo chamado</h2>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Título</label>
                        <input
                            type="text"
                            value={novoTitulo}
                            onChange={e => setNovoTitulo(e.target.value)}
                            placeholder="Descreva o problema resumidamente"
                            maxLength={120}
                            required
                            className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Descrição</label>
                        <textarea
                            value={novaDescricao}
                            onChange={e => setNovaDescricao(e.target.value)}
                            placeholder="Explique com detalhes o que aconteceu..."
                            rows={4}
                            required
                            className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm focus:border-primary outline-none resize-none"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={enviando}
                            className="bg-primary hover:bg-green-600 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition">
                            {enviando ? 'Enviando...' : 'Enviar ticket'}
                        </button>
                        <button type="button" onClick={() => setMostrarForm(false)}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="flex justify-center py-16">
                    <i className="fa-solid fa-spinner animate-spin text-primary text-2xl"></i>
                </div>
            ) : tickets.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <i className="fa-solid fa-ticket text-4xl mb-3 block opacity-30"></i>
                    <p>Você não tem tickets abertos.</p>
                    <p className="text-sm mt-1">Clique em "Novo Ticket" para abrir um chamado.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tickets.map(t => (
                        <div key={t.id} className="bg-card border border-gray-700 rounded-2xl p-5">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                    <h3 className="text-white font-bold">{t.titulo}</h3>
                                    <p className="text-gray-500 text-xs mt-0.5">
                                        Aberto em {new Date(t.criadoEm).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_COLOR[t.status] || ''}`}>
                                    {STATUS_LABEL[t.status] || t.status}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm whitespace-pre-wrap mb-4">{t.descricao}</p>

                            {t.respostaAdmin && (
                                <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-4 mb-4">
                                    <p className="text-xs text-green-400 font-bold mb-1 flex items-center gap-1">
                                        <i className="fa-solid fa-shield-halved"></i> Resposta do Suporte
                                        {t.respondidoEm && <span className="text-gray-500 font-normal ml-2">— {new Date(t.respondidoEm).toLocaleString('pt-BR')}</span>}
                                    </p>
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{t.respostaAdmin}</p>
                                </div>
                            )}

                            <div className="flex gap-2">
                                {t.status !== 'Fechado' && (
                                    <button onClick={() => handleFechar(t.id)}
                                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition">
                                        Fechar ticket
                                    </button>
                                )}
                                {t.status === 'Fechado' && (
                                    <button onClick={() => handleReabrir(t.id)}
                                        className="text-xs px-3 py-1.5 rounded-lg bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 border border-blue-700/30 transition">
                                        Reabrir
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
