import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bolaoService } from "../../services/bolaoService";
import { palpiteService } from '../../services/palpiteService';
import ConfirmacaoPalpiteModal from './components/ConfirmacaoPalpiteModal';
import ToastNotification from './components/ToastNotification';
import PixRecargaModal from './components/PixRecargaModal';

export default function Palpite() {
    const { idBolao } = useParams();
    const navigate = useNavigate();

    const [dadosBolao, setDadosBolao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const [palpiteData, setPalpiteData] = useState({
        golsTimeA: 0,
        golsTimeB: 0,
        vencedor: null,
    });
    const [qtdCotas, setQtdCotas] = useState(1);
    const [erros, setErros] = useState({});
    const [isPrazoFechado, setIsPrazoFechado] = useState(false);
    const [taxas, setTaxas] = useState(null);

    // Estado para modal de recarga por saldo insuficiente
    const [showRecargaModal, setShowRecargaModal] = useState(false);
    const [valorNecessario, setValorNecessario] = useState(0);

    useEffect(() => {
        const fetchBolao = async () => {
            try {
                setLoading(true);
                const data = await bolaoService.getBolaoById(idBolao);
                const bolao = data.data || data;
                setDadosBolao(bolao);
                bolaoService.getTaxas()
                    .then(data => setTaxas(data))
                    .catch(() => {});

                if (bolao.dtFechamento) {
                    const dataFechamento = new Date(bolao.dtFechamento);
                    if (new Date() > dataFechamento) setIsPrazoFechado(true);
                }
            } catch (err) {
                console.error("Erro ao buscar dados do bolão:", err);
                showToast('error', 'Não foi possível carregar os dados do bolão.');
                setTimeout(() => navigate('/dashboard'), 2000);
            } finally {
                setLoading(false);
            }
        };
        fetchBolao();
    }, [idBolao, navigate]);

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
    };

    const validarPalpite = () => {
        const novoErros = {};
        if (dadosBolao?.tipoBolao === 1) {
            if (typeof palpiteData.golsTimeA !== 'number' || palpiteData.golsTimeA < 0)
                novoErros.golsTimeA = 'Gols válidos';
            if (typeof palpiteData.golsTimeB !== 'number' || palpiteData.golsTimeB < 0)
                novoErros.golsTimeB = 'Gols válidos';
        } else if (dadosBolao?.tipoBolao === 2) {
            if (!palpiteData.vencedor) novoErros.vencedor = 'Selecione um resultado';
        }
        if (isPrazoFechado) novoErros.prazo = 'O prazo para este bolão foi encerrado';
        setErros(novoErros);
        return Object.keys(novoErros).length === 0;
    };

    const handleInputGols = (time, valor) => {
        const numValue = Math.max(0, parseInt(valor) || 0);
        if (numValue <= 99) {
            setPalpiteData(prev => ({
                ...prev,
                [time === 'A' ? 'golsTimeA' : 'golsTimeB']: numValue
            }));
            setErros(prev => ({ ...prev, [time === 'A' ? 'golsTimeA' : 'golsTimeB']: '' }));
        }
    };

    const handleSelectVencedor = (vencedor) => {
        setPalpiteData(prev => ({ ...prev, vencedor }));
        setErros(prev => ({ ...prev, vencedor: '' }));
    };

    const handleConfirmarPalpite = () => {
        if (!validarPalpite()) {
            showToast('error', 'Verifique os erros no formulário');
            return;
        }
        setShowConfirmModal(true);
    };

    const handleSalvarPalpite = async () => {
        setSubmitting(true);
        setShowConfirmModal(false);

        const payload = {
            BolaoId: idBolao,
            golsTimeA: palpiteData.golsTimeA,
            golsTimeB: palpiteData.golsTimeB,
            vencedor: palpiteData.vencedor,
            QtdCotas: qtdCotas
        };

        try {
            const result = await palpiteService.postPalpite(payload);

            if (result.success && result.data) {
                const { saldoSuficiente, valorTotal } = result.data;

                // Saldo insuficiente: palpite NÃO foi salvo — abrir modal de recarga
                if (saldoSuficiente === false) {
                    setValorNecessario(valorTotal ?? 0);
                    setShowRecargaModal(true);
                    return;
                }

                // Saldo suficiente: palpite salvo com sucesso
                showToast('success', 'Palpite registrado! Entrada debitada da carteira.');
                setTimeout(() => navigate('/palpite'), 2000);
            } else {
                showToast('error', result.message || 'Erro ao registrar palpite');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Erro ao registrar palpite.';
            showToast('error', errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const formatarData = (data) => {
        if (!data) return '';
        return new Date(data).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatarValor = (valor) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);

    if (loading) {
        return (
            <div className="flex-1 p-6 bg-dark min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <i className="fa-solid fa-spinner animate-spin text-primary text-3xl mb-4"></i>
                    <p className="text-gray-400">Carregando bolão...</p>
                </div>
            </div>
        );
    }

    if (!dadosBolao) {
        return (
            <div className="flex-1 p-6 bg-dark min-h-screen flex items-center justify-center">
                <p className="text-red-400">Bolão não encontrado</p>
            </div>
        );
    }

    const isTipoPlacarExato = dadosBolao.tipoBolao === 1;
    const isTipoVencedor = dadosBolao.tipoBolao === 2;

    const dataFechamento = dadosBolao.dtFechamento ? new Date(dadosBolao.dtFechamento) : null;
    const agora = new Date();
    const tempoRestante = dataFechamento ? dataFechamento - agora : 0;
    const horasRestantes = Math.floor(tempoRestante / (1000 * 60 * 60));
    const minutosRestantes = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));

    // Cálculo do valor total com taxas
    const valorBase = dadosBolao?.valorEntrada ?? dadosBolao?.valor ?? 0;
    const taxaAdm = taxas ? taxas.taxaAdm / 100 : 0;
    const taxaMp = taxas ? taxas.taxaMp / 100 : 0;
    const valorTaxas = valorBase * (taxaAdm + taxaMp);
    const valorPorCota = dadosBolao?.valorEntrada;
    const valorTotal = valorPorCota * qtdCotas;

    return (
        <div className="flex-1 p-2 bg-dark min-h-screen flex flex-col items-center justify-center">
            {toast.show && <ToastNotification type={toast.type} message={toast.message} />}

            <div className="w-full max-w-3xl max-h-screen overflow-y-auto">
                <div className="bg-card border border-gray-700 rounded-3xl p-5 shadow-2xl m-2">

                    {/* Cabeçalho */}
                    <div className="text-center mb-4">
                        <span className="text-primary font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 mb-1">
                            <i className="fa-solid fa-bullseye"></i>
                            Seu Palpite
                        </span>
                        <h1 className="text-2xl font-bold text-white mb-2">{dadosBolao.nome}</h1>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            <div className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full text-green-400 text-xs font-bold">
                                {isTipoPlacarExato ? '⚽ Placar Exato' : isTipoVencedor ? '🏆 Vencedor (1x2)' : 'Bolão'}
                            </div>
                            <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400 text-xs font-bold">
                                Entrada: {formatarValor(valorPorCota)}
                            </div>
                            {isPrazoFechado ? (
                                <div className="bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-red-400 text-xs font-bold">
                                    ⏱️ Prazo Encerrado
                                </div>
                            ) : horasRestantes < 1 ? (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full text-yellow-400 text-xs font-bold animate-pulse">
                                    ⚠️ Fechando em {minutosRestantes}min
                                </div>
                            ) : (
                                <div className="bg-gray-500/10 border border-gray-500/20 px-3 py-1 rounded-full text-gray-400 text-xs font-bold">
                                    Fecha em {horasRestantes}h {minutosRestantes}min
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info da Partida */}
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-4 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-400 text-xs uppercase font-bold">Partida</span>
                            <span className="text-gray-500 text-xs">{formatarData(dadosBolao.data)}</span>
                        </div>
                        <div className="flex items-center justify-around gap-2">
                            <div className="flex flex-col items-center flex-1">
                                {dadosBolao.flagA && (
                                    <img src={dadosBolao.flagA} alt={dadosBolao.timeA}
                                        className="w-12 h-8 object-contain mb-1 rounded border border-gray-700" />
                                )}
                                <span className="font-bold text-white text-center text-sm">{dadosBolao.timeA}</span>
                            </div>
                            <div className="text-2xl font-black text-gray-600">VS</div>
                            <div className="flex flex-col items-center flex-1">
                                {dadosBolao.flagB && (
                                    <img src={dadosBolao.flagB} alt={dadosBolao.timeB}
                                        className="w-12 h-8 object-contain mb-1 rounded border border-gray-700" />
                                )}
                                <span className="font-bold text-white text-center text-sm">{dadosBolao.timeB}</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-700/50 text-center">
                            <p className="text-gray-400 text-xs">
                                <span className="font-bold text-white">Encerramento:</span> {formatarData(dadosBolao.dtFechamento)}
                            </p>
                        </div>
                    </div>

                    {/* Prazo fechado */}
                    {isPrazoFechado && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3 mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-exclamation-circle text-red-400 text-xl"></i>
                            <div>
                                <p className="text-red-400 font-bold text-sm">Prazo Encerrado</p>
                                <p className="text-red-300 text-xs">Não é mais possível fazer palpites neste bolão.</p>
                            </div>
                        </div>
                    )}

                    {/* Formulário */}
                    {!isPrazoFechado && (
                        <>
                            {/* Placar Exato */}
                            {isTipoPlacarExato && (
                                <div className="mb-4">
                                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                        <i className="fa-solid fa-futbol text-primary"></i>
                                        Digite o Placar Exato
                                    </h3>
                                    <div className="flex items-end justify-center gap-3">
                                        <div className="flex flex-col items-center gap-2">
                                            <label className="text-gray-400 text-xs uppercase font-bold">
                                                Gols - {dadosBolao.timeA}
                                            </label>
                                            <input
                                                type="number" min="0" max="99"
                                                value={palpiteData.golsTimeA}
                                                onChange={(e) => handleInputGols('A', e.target.value)}
                                                className={`w-20 h-20 bg-gray-800 border-2 rounded-2xl text-center text-3xl font-bold text-white focus:border-primary outline-none transition ${erros.golsTimeA ? 'border-red-500' : 'border-gray-700'}`}
                                            />
                                            {erros.golsTimeA && <span className="text-red-400 text-xs">{erros.golsTimeA}</span>}
                                        </div>
                                        <div className="text-3xl font-black text-gray-600 mb-3">X</div>
                                        <div className="flex flex-col items-center gap-2">
                                            <label className="text-gray-400 text-xs uppercase font-bold">
                                                Gols - {dadosBolao.timeB}
                                            </label>
                                            <input
                                                type="number" min="0" max="99"
                                                value={palpiteData.golsTimeB}
                                                onChange={(e) => handleInputGols('B', e.target.value)}
                                                className={`w-20 h-20 bg-gray-800 border-2 rounded-2xl text-center text-3xl font-bold text-white focus:border-primary outline-none transition ${erros.golsTimeB ? 'border-red-500' : 'border-gray-700'}`}
                                            />
                                            {erros.golsTimeB && <span className="text-red-400 text-xs">{erros.golsTimeB}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Vencedor 1x2 */}
                            {isTipoVencedor && (
                                <div className="mb-4">
                                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                        <i className="fa-solid fa-trophy text-primary"></i>
                                        Escolha o Vencedor
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { key: 'A', label: dadosBolao.timeA, sub: 'Vence' },
                                            { key: 'E', label: 'Empate', sub: 'Igualdade' },
                                            { key: 'B', label: dadosBolao.timeB, sub: 'Vence' },
                                        ].map(({ key, label, sub }) => (
                                            <button key={key} onClick={() => handleSelectVencedor(key)}
                                                className={`p-3 rounded-2xl border-2 transition-all text-center ${
                                                    palpiteData.vencedor === key
                                                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/30'
                                                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                                                }`}>
                                                <div className="text-2xl mb-2">
                                                    {palpiteData.vencedor === key && <i className="fa-solid fa-check text-primary"></i>}
                                                </div>
                                                <p className="text-white font-bold text-sm">{label}</p>
                                                <p className="text-gray-400 text-xs">{sub}</p>
                                            </button>
                                        ))}
                                    </div>
                                    {erros.vencedor && <p className="text-red-400 text-xs text-center mt-3">{erros.vencedor}</p>}
                                    {palpiteData.vencedor && (
                                        <div className="mt-3 bg-black/30 rounded-xl p-2 border border-gray-700/50">
                                            <p className="text-center text-gray-400 text-xs">Seu palpite</p>
                                            <p className="text-center text-white text-sm font-bold">
                                                {palpiteData.vencedor === 'A' && `Vitória de ${dadosBolao.timeA}`}
                                                {palpiteData.vencedor === 'E' && 'Empate'}
                                                {palpiteData.vencedor === 'B' && `Vitória de ${dadosBolao.timeB}`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Quantidade de Cotas e Resumo de Valores */}
                            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-white font-bold text-sm">Quantidade de cotas</p>
                                        <p className="text-gray-500 text-xs mt-0.5">Mais cotas = maior participação no prêmio</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setQtdCotas(q => Math.max(1, q - 1))}
                                            className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg flex items-center justify-center transition">
                                            −
                                        </button>
                                        <span className="text-white font-bold text-xl w-8 text-center">{qtdCotas}</span>
                                        <button onClick={() => setQtdCotas(q => Math.min(10, q + 1))}
                                            className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg flex items-center justify-center transition">
                                            +
                                        </button>
                                    </div>
                                </div>

                                {valorPorCota > 0 && (
                                    <div className="bg-dark border border-gray-700 rounded-lg px-3 py-2 text-xs space-y-1 mb-3">
                                        <div className="flex justify-between text-gray-500">
                                            <span>Entrada ({qtdCotas} cota{qtdCotas > 1 ? 's' : ''} × {formatarValor(valorPorCota)})</span>
                                            <span className="text-gray-300">{formatarValor(valorPorCota * qtdCotas)}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
                                    <span className="text-gray-400">Total a pagar</span>
                                    <span className="text-white font-bold">{formatarValor(valorPorCota * qtdCotas)}</span>
                                </div>

                                
                            </div>

                            {/* Botões */}
                            <div className="flex flex-col gap-2 border-t border-gray-700 pt-4">
                                <button onClick={handleConfirmarPalpite} disabled={submitting}
                                    className="w-full bg-primary hover:bg-green-600 disabled:bg-gray-600 text-black font-bold py-3 rounded-2xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 duration-300 transform hover:-translate-y-1">
                                    {submitting ? (
                                        <><i className="fa-solid fa-spinner animate-spin"></i> Enviando...</>
                                    ) : (
                                        <><i className="fa-solid fa-check"></i> Confirmar Palpite</>
                                    )}
                                </button>
                                <button onClick={() => navigate(-1)} disabled={submitting}
                                    className="w-full bg-transparent hover:bg-white/5 text-gray-400 font-medium py-3 rounded-xl transition disabled:opacity-50">
                                    Cancelar
                                </button>
                            </div>
                        </>
                    )}

                    {isPrazoFechado && (
                        <div className="flex flex-col gap-3 border-t border-gray-700 pt-6">
                            <button onClick={() => navigate('/dashboard')}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 rounded-2xl transition">
                                Voltar ao Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Confirmação */}
            {showConfirmModal && (
                <ConfirmacaoPalpiteModal
                    bolao={dadosBolao}
                    palpite={palpiteData}
                    qtdCotas={qtdCotas}
                    taxas={taxas}
                    
                    valorTotal={valorTotal}
                    onConfirm={handleSalvarPalpite}
                    onCancel={() => setShowConfirmModal(false)}
                    isLoading={submitting}
                />
            )}

            {/* Modal de Recarga por Saldo Insuficiente */}
            {showRecargaModal && (
                <PixRecargaModal
                    isOpen={showRecargaModal}
                    onClose={() => setShowRecargaModal(false)}
                    taxaspercentuais={taxas ? (taxas.taxaAdm + taxas.taxaMp) : 0}
                    valorEntrada={valorTotal}
                    valorNecessario={valorNecessario}
                />
            )}
        </div>
    );
}
