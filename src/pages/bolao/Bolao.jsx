import React, { useState, useEffect } from 'react';
import { FootballGames } from './components/FootballGames';
import { bolaoService } from '../../services/bolaoService';
import { partidaService } from '../../services/partidaService';
import { usuarioService } from '../../services/usuarioService';
import MercadoPagoTokenModal from './components/MercadoPagoTokenModal';

export function Bolao() {
    const [matches, setMatches] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [fetchingMatches, setFetchingMatches] = useState(true);
    const [verificandoToken, setVerificandoToken] = useState(true);
    const [showTokenModal, setShowTokenModal] = useState(false);
    const [mpRedirectUrl, setMpRedirectUrl] = useState('');

    const [formData, setFormData] = useState({
        nome: '',
        visibilidade: 1,
        valor: '',
        dtFechamento: '',
        tipoBolao: 1,
        partidaId: ''
    });

    useEffect(() => {
        usuarioService.verificarMercadoPago()
            .then(data => {
                if (data.redirect) {
                    setMpRedirectUrl(data.redirect);
                    setShowTokenModal(true);
                }
            })
            .catch(() => setShowTokenModal(true))
            .finally(() => setVerificandoToken(false));
    }, []);

    useEffect(() => {
        partidaService.getAllPartidas()
            .then(data => setMatches(data))
            .catch(err => console.error("Erro ao buscar partidas:", err))
            .finally(() => setFetchingMatches(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGameSelect = (game) => {
        setSelectedGame(game);
        setFormData(prev => ({
            ...prev,
            nome: `Bolao ${game.timeA} x ${game.timeB}`,
            partidaId: game.id,
            dtFechamento: game.data ? game.data.slice(0, 10) : ''
        }));
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            nome: formData.nome,
            visibilidade: Number(formData.visibilidade),
            valor: Number(formData.valor),
            dtFechamento: formData.dtFechamento,
            tipoBolao: Number(formData.tipoBolao),
            partidaId: formData.partidaId
        };

        try {
            await bolaoService.createBolao(payload);
            alert("Bolão criado com sucesso!");
            setStep(1);
        } catch (error) {
            console.error("Erro capturado:", error);
            if (error.response?.status === 500) {
                alert("Atenção: O bolão pode ter sido criado, mas o servidor encontrou um erro ao processar o nome com acentos. Verifique sua lista de bolões.");
            } else {
                alert("Erro ao criar o bolão. Tente remover acentos do nome.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (verificandoToken) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-3">
                    <i className="fa-solid fa-spinner animate-spin text-primary text-3xl"></i>
                    <p className="text-gray-400 text-sm">Verificando configurações...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <MercadoPagoTokenModal
                isOpen={showTokenModal}
                redirectUrl={mpRedirectUrl}
            />

            <div id="view-create-pool" className="fade-in max-w-4xl mx-auto p-4 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Criar Novo Bolão</h2>
                        <p className="text-gray-400 text-sm">
                            Etapa {step}: {step === 1 ? "Selecione a partida" : "Configure as regras"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {[1, 2].map((i) => (
                            <React.Fragment key={i}>
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                                    step === i ? 'bg-primary text-black' : 'bg-gray-700 text-gray-400'
                                }`}>
                                    {i}
                                </span>
                                {i === 1 && <div className="w-8 h-px bg-gray-700" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-6">
                        {fetchingMatches ? (
                            <div className="text-center py-10 text-gray-500">Carregando partidas...</div>
                        ) : (
                            <FootballGames
                                games={matches}
                                onSelect={handleGameSelect}
                                selectedGameId={selectedGame?.id}
                            />
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-card p-6 rounded-xl border border-gray-700 shadow-xl text-white animate-in slide-in-from-right-4 duration-300">
                        <div className="mb-8 flex items-center justify-between bg-dark/40 p-4 rounded-lg border border-gray-700/50">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-center">
                                    <img src={selectedGame?.flagA} alt="" className="w-10 h-10 object-contain mb-1" />
                                    <span className="text-[10px] uppercase text-gray-400">{selectedGame?.timeA}</span>
                                </div>
                                <div className="text-primary font-black italic text-xl">VS</div>
                                <div className="flex flex-col items-center">
                                    <img src={selectedGame?.flagB} alt="" className="w-10 h-10 object-contain mb-1" />
                                    <span className="text-[10px] uppercase text-gray-400">{selectedGame?.timeB}</span>
                                </div>
                            </div>
                            <button onClick={() => setStep(1)} className="text-xs text-gray-500 hover:text-primary transition-colors">
                                <i className="fa-solid fa-arrow-left-long mr-1"></i> Alterar Partida
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Nome do Bolão</label>
                                    <input
                                        name="nome"
                                        type="text"
                                        required
                                        value={formData.nome}
                                        onChange={handleChange}
                                        className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Visibilidade</label>
                                    <select
                                        name="visibilidade"
                                        value={formData.visibilidade}
                                        onChange={handleChange}
                                        className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:border-primary outline-none"
                                    >
                                        <option value={1}>Publico (Todos podem ver)</option>
                                        <option value={2}>Privado (Apenas convidados)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Tipo do Bolão</label>
                                    <select
                                        name="tipoBolao"
                                        value={formData.tipoBolao}
                                        onChange={handleChange}
                                        className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:border-primary outline-none"
                                    >
                                        <option value={1}>Placar Exato</option>
                                        <option value={2}>Vencedor (1x2)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Cota de Entrada (R$)</label>
                                    <input
                                        name="valor"
                                        type="number"
                                        required
                                        value={formData.valor}
                                        onChange={handleChange}
                                        placeholder="Ex: 40"
                                        className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:border-primary outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Data Limite</label>
                                    <input
                                        name="dtFechamento"
                                        type="date"
                                        required
                                        value={formData.dtFechamento}
                                        onChange={handleChange}
                                        className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:border-primary outline-none"
                                    />
                                </div>


                            </div>

                            <div className="pt-6 border-t border-gray-800 flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Voltar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-10 py-3 rounded-lg font-bold shadow-lg transition-all ${
                                        loading
                                        ? 'bg-gray-700 cursor-wait'
                                        : 'bg-primary hover:bg-green-600 text-black transform hover:-translate-y-1'
                                    }`}
                                >
                                    {loading ? 'Criando...' : 'Confirmar e Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}
