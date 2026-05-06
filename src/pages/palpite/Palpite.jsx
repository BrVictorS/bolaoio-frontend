import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bolaoService } from "../../services/bolaoService";
import { palpiteService } from '../../services/palpiteService';
import { pixService } from '../../services/pixService';
import ConfirmacaoPalpiteModal from './components/ConfirmacaoPalpiteModal';
import ToastNotification from './components/ToastNotification';
import QRCodePixModal from './components/QRCodePixModal';

export default function Palpite() {
    const { idBolao } = useParams();
    const navigate = useNavigate();

    // Estados para dados
    const [dadosBolao, setDadosBolao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    // Estados para palpites
    const [palpiteData, setPalpiteData] = useState({
        golsTimeA: 0,
        golsTimeB: 0,
        vencedor: null, // 'A', 'E' (empate), 'B', 'ambos'
    });

    // Estados auxiliares
    const [erros, setErros] = useState({});
    const [isPrazoFechado, setIsPrazoFechado] = useState(false);

    // Estados para QR Code PIX
    const [showQRCode, setShowQRCode] = useState(false);
    const [palpiteIdCriado, setPalpiteIdCriado] = useState(null);
    const [qrCodeData, setQRCodeData] = useState(null);
    const [carregandoPix, setCarregandoPix] = useState(false);

    // Busca dados do bolão ao carregar
    useEffect(() => {
        const fetchBolao = async () => {
            try {
                setLoading(true);
                const data = await bolaoService.getBolaoById(idBolao);
                const bolao = data.data || data;

                setDadosBolao(bolao);

                // Validar se prazo passou
                if (bolao.dtFechamento) {
                    const dataFechamento = new Date(bolao.dtFechamento);
                    const agora = new Date();
                    if (agora > dataFechamento) {
                        setIsPrazoFechado(true);
                    }
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
            // Placar Exato
            if (typeof palpiteData.golsTimeA !== 'number' || palpiteData.golsTimeA < 0) {
                novoErros.golsTimeA = 'Gols válidos';
            }
            if (typeof palpiteData.golsTimeB !== 'number' || palpiteData.golsTimeB < 0) {
                novoErros.golsTimeB = 'Gols válidos';
            }
        } else if (dadosBolao?.tipoBolao === 2) {
            // Vencedor 1x2
            if (!palpiteData.vencedor) {
                novoErros.vencedor = 'Selecione um resultado';
            }
        }

        if (isPrazoFechado) {
            novoErros.prazo = 'O prazo para este bolão foi encerrado';
        }

        setErros(novoErros);
        return Object.keys(novoErros).length === 0;
    };

    const handleInputGols = (time, valor) => {
        const numValue = Math.max(0, parseInt(valor) || 0);
        if (numValue <= 99) { // Limite máximo de 99 gols
            setPalpiteData(prev => ({
                ...prev,
                [time === 'A' ? 'golsTimeA' : 'golsTimeB']: numValue
            }));
            // Limpar erro deste campo
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
            vencedor: palpiteData.vencedor
        };

        try {
            console.log("Enviando palpite:", payload);
            const result = await palpiteService.postPalpite(payload);

            if (result.success && result.data) {
                showToast('success', result.message || 'Palpite registrado com sucesso!');

                // O resultado agora contém RegistrarPalpiteResponseDto com ID e dados de PIX
                const { palpiteId, qrCode, pixCopy, prixCopiaECola, valor } = result.data;

                if (palpiteId) {
                    setPalpiteIdCriado(palpiteId);

                    // Preparar dados para o modal QR Code
                    const pixData = {
                        qrCode: qrCode || result.data.qr_code,
                        pixCopy: pixCopy || prixCopiaECola || result.data.pix_copy,
                        valor: valor || dadosBolao?.valor,
                        expiraEm: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
                    };

                    setQRCodeData(pixData);
                    setShowQRCode(true);
                } else {
                    // Se não conseguir extrair ID, redirecionar
                    showToast('error', 'Erro ao obter ID do palpite criado');
                    setTimeout(() => navigate('/meus-palpites'), 2000);
                }
            } else {
                showToast('error', result.message || 'Erro ao registrar palpite');
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            const errorMsg = error.response?.data?.message || error.message || 'Erro ao registrar palpite.';
            showToast('error', errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const gerarPixPalpite = async (palpiteId) => {
        setCarregandoPix(true);
        try {
            console.log(`Gerando PIX para palpite ${palpiteId}`);
            const result = await pixService.gerarPixParaPalpite(palpiteId);

            if (result.success && result.data) {
                setQRCodeData(result.data);
                setShowQRCode(true);
                showToast('success', 'PIX gerado com sucesso!');
            } else {
                // Se não conseguir gerar PIX, apenas redireciona
                console.log("Não foi possível gerar PIX, redirecionando...");
                setTimeout(() => navigate('/palpite'), 2000);
            }
        } catch (error) {
            console.error("Erro ao gerar PIX:", error);
            // Erro ao gerar PIX não deve bloquear o fluxo
            console.log("Continuando mesmo sem PIX...");
            setTimeout(() => navigate('/meus-palpites'), 3000);
        } finally {
            setCarregandoPix(false);
        }
    };

    const handleQRCodeFechado = () => {
        setShowQRCode(false);
        // Redirecionar para Meus Palpites após fechar o QR code
        setTimeout(() => navigate('/meus-palpites'), 500);
    };

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
                <div className="text-center">
                    <p className="text-red-400">Bolão não encontrado</p>
                </div>
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

    const formatarData = (data) => {
        if (!data) return '';
        return new Date(data).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatarValor = (valor) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
    };

    return (
        <div className="flex-1 p-6 bg-dark min-h-screen flex flex-col items-center justify-center">
            {/* Toast de Notificação */}
            {toast.show && (
                <ToastNotification
                    type={toast.type}
                    message={toast.message}
                />
            )}

            <div className="w-full max-w-3xl">
                {/* Card Principal */}
                <div className="bg-card border border-gray-700 rounded-3xl p-8 shadow-2xl">

                    {/* Cabeçalho */}
                    <div className="text-center mb-8">
                        <span className="text-primary font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 mb-3">
                            <i className="fa-solid fa-bullseye"></i>
                            Seu Palpite
                        </span>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {dadosBolao.nome}
                        </h1>

                        {/* Badges de Informação */}
                        <div className="flex flex-wrap justify-center gap-3 mt-4">
                            <div className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full text-green-400 text-xs font-bold">
                                {isTipoPlacarExato ? '⚽ Placar Exato' : isTipoVencedor ? '🏆 Vencedor (1x2)' : 'Bolão'}
                            </div>
                            <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400 text-xs font-bold">
                                Entrada: {formatarValor(dadosBolao.valor)}
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
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-400 text-xs uppercase font-bold">Partida</span>
                            <span className="text-gray-500 text-xs">{formatarData(dadosBolao.data)}</span>
                        </div>

                        <div className="flex items-center justify-around gap-4">
                            {/* Time A */}
                            <div className="flex flex-col items-center flex-1">
                                {dadosBolao.flagA && (
                                    <img
                                        src={dadosBolao.flagA}
                                        alt={dadosBolao.timeA}
                                        className="w-16 h-12 object-contain mb-2 rounded border border-gray-700"
                                    />
                                )}
                                <span className="font-bold text-white text-center text-lg">
                                    {dadosBolao.timeA}
                                </span>
                            </div>

                            <div className="text-3xl font-black text-gray-600">VS</div>

                            {/* Time B */}
                            <div className="flex flex-col items-center flex-1">
                                {dadosBolao.flagB && (
                                    <img
                                        src={dadosBolao.flagB}
                                        alt={dadosBolao.timeB}
                                        className="w-16 h-12 object-contain mb-2 rounded border border-gray-700"
                                    />
                                )}
                                <span className="font-bold text-white text-center text-lg">
                                    {dadosBolao.timeB}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-700/50 text-center">
                            <p className="text-gray-400 text-xs">
                                <span className="font-bold text-white">Encerramento:</span> {formatarData(dadosBolao.dtFechamento)}
                            </p>
                        </div>
                    </div>

                    {/* Aviso de Prazo Fechado */}
                    {isPrazoFechado && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
                            <i className="fa-solid fa-exclamation-circle text-red-400 text-xl"></i>
                            <div>
                                <p className="text-red-400 font-bold text-sm">Prazo Encerrado</p>
                                <p className="text-red-300 text-xs">Não é mais possível fazer palpites neste bolão.</p>
                            </div>
                        </div>
                    )}

                    {/* Formulário de Palpite */}
                    {!isPrazoFechado && (
                        <>
                            {/* Tipo: Placar Exato */}
                            {isTipoPlacarExato && (
                                <div className="mb-8">
                                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                        <i className="fa-solid fa-futbol text-primary"></i>
                                        Digite o Placar Exato
                                    </h3>

                                    <div className="flex items-end justify-center gap-6">
                                        {/* Gols Time A */}
                                        <div className="flex flex-col items-center gap-3">
                                            <label className="text-gray-400 text-xs uppercase font-bold">
                                                Gols - {dadosBolao.timeA}
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="99"
                                                value={palpiteData.golsTimeA}
                                                onChange={(e) => handleInputGols('A', e.target.value)}
                                                disabled={isPrazoFechado}
                                                className={`w-24 h-24 bg-gray-800 border-2 rounded-2xl text-center text-4xl font-bold text-white focus:border-primary outline-none transition ${
                                                    erros.golsTimeA
                                                        ? 'border-red-500 focus:border-red-500'
                                                        : 'border-gray-700'
                                                }`}
                                            />
                                            {erros.golsTimeA && (
                                                <span className="text-red-400 text-xs">{erros.golsTimeA}</span>
                                            )}
                                        </div>

                                        <div className="text-4xl font-black text-gray-600 mb-6">X</div>

                                        {/* Gols Time B */}
                                        <div className="flex flex-col items-center gap-3">
                                            <label className="text-gray-400 text-xs uppercase font-bold">
                                                Gols - {dadosBolao.timeB}
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="99"
                                                value={palpiteData.golsTimeB}
                                                onChange={(e) => handleInputGols('B', e.target.value)}
                                                disabled={isPrazoFechado}
                                                className={`w-24 h-24 bg-gray-800 border-2 rounded-2xl text-center text-4xl font-bold text-white focus:border-primary outline-none transition ${
                                                    erros.golsTimeB
                                                        ? 'border-red-500 focus:border-red-500'
                                                        : 'border-gray-700'
                                                }`}
                                            />
                                            {erros.golsTimeB && (
                                                <span className="text-red-400 text-xs">{erros.golsTimeB}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Resumo Visual */}
                                    <div className="mt-6 bg-black/30 rounded-xl p-4 border border-gray-700/50">
                                        <p className="text-center text-gray-400 text-sm">Seu palpite</p>
                                        <p className="text-center text-white text-3xl font-bold font-mono">
                                            {palpiteData.golsTimeA} × {palpiteData.golsTimeB}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Tipo: Vencedor 1x2 */}
                            {isTipoVencedor && (
                                <div className="mb-8">
                                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                        <i className="fa-solid fa-trophy text-primary"></i>
                                        Escolha o Vencedor
                                    </h3>

                                    <div className="grid grid-cols-3 gap-4">
                                        {/* Vitória Time A */}
                                        <button
                                            onClick={() => handleSelectVencedor('A')}
                                            className={`p-4 rounded-2xl border-2 transition-all text-center ${
                                                palpiteData.vencedor === 'A'
                                                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/30'
                                                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                                            }`}
                                        >
                                            <div className="text-2xl mb-2">{palpiteData.vencedor === 'A' && <i className="fa-solid fa-check text-primary"></i>}</div>
                                            <p className="text-white font-bold text-sm">{dadosBolao.timeA}</p>
                                            <p className="text-gray-400 text-xs">Vence</p>
                                        </button>

                                        {/* Empate */}
                                        <button
                                            onClick={() => handleSelectVencedor('E')}
                                            className={`p-4 rounded-2xl border-2 transition-all text-center ${
                                                palpiteData.vencedor === 'E'
                                                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/30'
                                                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                                            }`}
                                        >
                                            <div className="text-2xl mb-2">{palpiteData.vencedor === 'E' && <i className="fa-solid fa-check text-primary"></i>}</div>
                                            <p className="text-white font-bold text-sm">Empate</p>
                                            <p className="text-gray-400 text-xs">Igualdade</p>
                                        </button>

                                        {/* Vitória Time B */}
                                        <button
                                            onClick={() => handleSelectVencedor('B')}
                                            className={`p-4 rounded-2xl border-2 transition-all text-center ${
                                                palpiteData.vencedor === 'B'
                                                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/30'
                                                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                                            }`}
                                        >
                                            <div className="text-2xl mb-2">{palpiteData.vencedor === 'B' && <i className="fa-solid fa-check text-primary"></i>}</div>
                                            <p className="text-white font-bold text-sm">{dadosBolao.timeB}</p>
                                            <p className="text-gray-400 text-xs">Vence</p>
                                        </button>
                                    </div>

                                    {erros.vencedor && (
                                        <p className="text-red-400 text-xs text-center mt-3">{erros.vencedor}</p>
                                    )}

                                    {/* Resumo Visual */}
                                    {palpiteData.vencedor && (
                                        <div className="mt-6 bg-black/30 rounded-xl p-4 border border-gray-700/50">
                                            <p className="text-center text-gray-400 text-sm">Seu palpite</p>
                                            <p className="text-center text-white text-2xl font-bold">
                                                {palpiteData.vencedor === 'A' && `Vitória de ${dadosBolao.timeA}`}
                                                {palpiteData.vencedor === 'E' && 'Empate'}
                                                {palpiteData.vencedor === 'B' && `Vitória de ${dadosBolao.timeB}`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Botões de Ação */}
                            <div className="flex flex-col gap-3 border-t border-gray-700 pt-6">
                                <button
                                    onClick={handleConfirmarPalpite}
                                    disabled={submitting}
                                    className="w-full bg-primary hover:bg-green-600 disabled:bg-gray-600 text-black font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 duration-300 transform hover:-translate-y-1"
                                >
                                    {submitting ? (
                                        <>
                                            <i className="fa-solid fa-spinner animate-spin"></i>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-check"></i>
                                            Confirmar Palpite
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => navigate(-1)}
                                    disabled={submitting}
                                    className="w-full bg-transparent hover:bg-white/5 text-gray-400 font-medium py-3 rounded-xl transition disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </>
                    )}

                    {/* Se prazo fechado */}
                    {isPrazoFechado && (
                        <div className="flex flex-col gap-3 border-t border-gray-700 pt-6">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 rounded-2xl transition"
                            >
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
                    onConfirm={handleSalvarPalpite}
                    onCancel={() => setShowConfirmModal(false)}
                    isLoading={submitting}
                />
            )}

            {/* Modal de QR Code PIX */}
            {showQRCode && qrCodeData && (
                <QRCodePixModal
                    isOpen={showQRCode}
                    onClose={handleQRCodeFechado}
                    qrCode={qrCodeData.qrCode || qrCodeData.qr_code}
                    pixCopy={qrCodeData.pixCopy || qrCodeData.pix_copy}
                    valor={qrCodeData.valor || dadosBolao?.valor}
                    expiresAt={qrCodeData.expiraEm || qrCodeData.expira_em}
                    palpiteId={palpiteIdCriado}
                />
            )}
        </div>
    );
}
