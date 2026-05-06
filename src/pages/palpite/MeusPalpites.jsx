import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { palpiteService } from "../../services/palpiteService";
import { pixService } from "../../services/pixService";
import QRCodePixModal from "./components/QRCodePixModal";
import ToastNotification from "./components/ToastNotification";

export function MeusPalpites() {
    const navigate = useNavigate();
    const [palpites, setPalpites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos'); // todos, pendentes, finalizados

    // Estados para QR Code
    const [showQRCode, setShowQRCode] = useState(false);
    const [qrCodeData, setQRCodeData] = useState(null);
    const [carregandoPix, setCarregandoPix] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
    };

    const handleExibirPix = async (palpiteId, valor) => {
        setCarregandoPix(true);
        try {
            console.log(`Recuperando PIX para palpite ${palpiteId}`);
            const result = await pixService.obterInfoPix(palpiteId);

            if (result.success && result.data) {
                setQRCodeData(result.data);
                setShowQRCode(true);
                showToast('success', 'PIX carregado com sucesso!');
            } else {
                // Se não encontrar PIX existente, tentar gerar novo
                console.log("Nenhum PIX encontrado, tentando gerar novo...");
                const resultGerar = await pixService.gerarPixParaPalpite(palpiteId);

                if (resultGerar.success && resultGerar.data) {
                    setQRCodeData(resultGerar.data);
                    setShowQRCode(true);
                    showToast('success', 'PIX gerado com sucesso!');
                } else {
                    showToast('error', 'Não foi possível gerar PIX. Tente novamente.');
                }
            }
        } catch (error) {
            console.error("Erro ao exibir PIX:", error);
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
                const palpitesArray = Array.isArray(data) ? data : (data ? [data] : []);
                setPalpites(palpitesArray);
            } catch (error) {
                console.error("Erro ao buscar palpites:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPalpites();
    }, []);

    // Filtrar palpites
    const palpitesFiltrados = palpites.filter(p => {
        if (filtro === 'pendentes') {
            return p.statusJogo !== 'Finalizada';
        }
        if (filtro === 'finalizados') {
            return p.statusJogo === 'Finalizada';
        }
        return true;
    });

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'agendada':
                return {
                    bg: 'bg-blue-500/10',
                    border: 'border-blue-500/20',
                    text: 'text-blue-400',
                    label: '📅 Agendada',
                    icon: 'fa-calendar'
                };
            case 'concluida':
                return {
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/20',
                    text: 'text-green-400',
                    label: 'Partida Finalizada',
                    icon: 'fa-check-circle'
                };
                
            case 'em jogo':
                return {
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/20',
                    text: 'text-yellow-400',
                    label: '🔴 Em Jogo',
                    icon: 'fa-circle-dot',
                    animate: true
                };
            case 'finalizada':
                return {
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/20',
                    text: 'text-green-400',
                    label: '✓ Finalizada',
                    icon: 'fa-check-circle'
                };
            default:
                return {
                    bg: 'bg-gray-500/10',
                    border: 'border-gray-500/20',
                    text: 'text-gray-400',
                    label: status,
                    icon: 'fa-question-circle'
                };
        }
    };

    const getStatusBadgeTransacao = (status) => {
    switch (status?.toLowerCase()) {
            case 'concluido':
                return {
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/20',
                    text: 'text-green-400',
                    label: 'Palpite registrado',
                    icon: 'fa-check-circle'
                };
            case 'processando':
                return {
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/20',
                    text: 'text-yellow-400 text-xs font-bold',
                    label: 'Pagamento pendente',
                    // icon: 'fa-calendar'
                };
                
            case 'cancelado':
                return {
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/20',
                    text: 'text-yellow-400',
                    label: '🔴 Em Jogo',
                    icon: 'fa-circle-dot',
                    animate: true
                };
            default:
                return {
                    display: 'none'
                };
        }
    };

    const getStatusBadgePalpite = (status) => {
        console.log("Status do palpite:", status);
    switch (status?.toLowerCase()) {
            case 'vencedor':
                return {
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/20',
                    text: 'text-green-400',
                    label: 'Palpite vencedor',
                    icon: 'fa-check-circle'
                };
            case 'pendente':
                return {
                    //display: 'none'
                    hidden: true
                };
                
            case 'perdedor':
                return {
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/20',
                    text: 'text-yellow-400',
                    label: 'Palpite perdedor',
                    //icon: 'fa-circle-dot',
                    animate: true
                };
            case 'cancelado':
                return {
                    bg: 'bg-gray-500/10',
                    border: 'border-gray-500/20',
                    text: 'text-gray-400',
                    label: 'Palpite cancelado',
                    icon: 'fa-circle-dot',
                    animate: true
                };

            default:
                return {
                    display: 'none'
                };
        }
    };


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
        if (!valor) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    const getPalpiteResume = (palpite) => {
        //const tipo = palpite.tipoBolao || 2;
        
        if(palpite.statusJogo === 'Concluída'){
            return '';
        }
            
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
            {/* Toast de Notificação */}
            {toast.show && (
                <div className="fixed top-6 right-6 max-w-md z-50">
                    <div className={`backdrop-blur-md rounded-2xl p-4 shadow-2xl animate-in slide-in-from-right-6 duration-300 border ${
                        toast.type === 'success'
                            ? 'bg-green-500/20 border-green-500/40'
                            : 'bg-red-500/20 border-red-500/40'
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
                    <p className="text-gray-400 text-sm mt-1">
                        Acompanhe todos os seus palpites e resultados
                    </p>
                </div>

                {/* Estatísticas Rápidas */}
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 text-center flex-1 md:flex-none">
                        <p className="text-blue-400 text-xs font-bold">Total</p>
                        <p className="text-blue-300 text-lg font-bold">{palpites.length}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 text-center flex-1 md:flex-none">
                        <p className="text-yellow-400 text-xs font-bold">Pendentes</p>
                        <p className="text-yellow-300 text-lg font-bold">
                            {palpites.filter(p => p.statusJogo !== 'Finalizada').length}
                        </p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-center flex-1 md:flex-none">
                        <p className="text-green-400 text-xs font-bold">Finalizados</p>
                        <p className="text-green-300 text-lg font-bold">
                            {palpites.filter(p => p.statusJogo === 'Finalizada').length}
                        </p>
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
                            filtro === f.value
                                ? 'bg-primary text-black'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
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
                        

                        return (
                            <div
                                key={index}
                                className="bg-card border border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 transition group"
                            >
                                <div className="p-4 md:p-6">
                                    {/* Linha Superior - Status, Bolão e Info */}
                                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                                        {/* Status e Nome do Bolão */}
                                        <div className="flex-1">
                                            <div className="flex-row flex items-center gap-3">
                                                <div className="flex items-center gap-3 mb-2">
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.bg} ${statusBadge.border} ${statusBadge.text} flex items-center gap-1 ${statusBadge.animate ? 'animate-pulse' : ''}`}>
                                                    <i className={`fa-solid ${statusBadge.icon}`}></i>
                                                    {statusBadge.label}
                                                </div>
                                            </div>

                                            {/*status de pago*/}
                                            <div className="flex items-center gap-3 mb-2">
                                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge2.bg} ${statusBadge2.border} ${statusBadge2.text} flex items-center gap-1 ${statusBadge2.animate ? 'animate-pulse' : ''}`}>
                                                        <i className={`fa-solid ${statusBadge2.icon}`}></i>
                                                        {statusBadge2.label}
                                                    </div>
                                                </div>
                                            </div>

                                            {/*status palpite */}
                                            {
                                                palpite.statusJogo !== 'Pendente' && !statusBadge3.hidden && (
                                                    <div className="flex items-center gap-3 mb-2">
                                                            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge3.bg} ${statusBadge3.border} ${statusBadge3.text} flex items-center gap-1 ${statusBadge3.animate ? 'animate-pulse' : ''}`}>
                                                                <i className={`fa-solid ${statusBadge3.icon}`}></i>
                                                                {statusBadge3.label}
                                                            </div>
                                                    </div>
                                                    )
                                            }
                                            


                                            <h3 className="text-lg font-bold text-white mb-1">
                                                {palpite.nomeBolao || 'Bolão sem nome'}
                                            </h3>
                                            <p className="text-gray-400 text-sm">
                                                {palpite.descricaoJogo || `${palpite.timeA} × ${palpite.timeB}`}
                                            </p>
                                        </div>

                                        {/* Entrada e Data */}
                                        <div className="md:text-right border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-6">
                                            <p className="text-gray-400 text-xs mb-1">Entrada</p>
                                            <p className="text-green-400 font-bold text-lg">
                                                {formatarValor(palpite.valorApostado)}
                                            </p>
                                            <p className="text-gray-500 text-xs mt-2">
                                                {formatarData(palpite.dataPalpite)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Linha Central - Palpite e Placar */}
                                    <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50 mb-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Primeiro Palpite */}
                                            <div>
                                                <p className="text-gray-400 text-xs uppercase font-bold mb-2">Seu Palpite</p>
                                                <p className="text-primary font-bold text-2xl font-mono">
                                                    {palpite.placarPalpite}
                                                </p>
                                            </div>

                                            {/* Segundo Palpite (com a linha vertical à esquerda) */}
                                            <div className="border-l border-gray-700/50 pl-4">
                                                <p className="text-gray-400 text-xs uppercase font-bold mb-2">Placar do jogo</p>
                                                <p className="text-primary font-bold text-2xl font-mono">
                                                    {palpite.placarAtual}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Linha Inferior - Ações */}
                                    <div className="flex flex-wrap gap-2">
                                        {palpite.statusJogo !== 'Finalizada' && (
                                            <button
                                                onClick={() => navigate(`/bolao/${palpite.bolaoId}/editar`)}
                                                className="flex-1 md:flex-none px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                                                title="Editar palpite"
                                            >
                                                <i className="fa-solid fa-edit"></i>
                                                Editar
                                            </button>
                                        )}

                                        {/* Botão PIX - Mostrar se ainda não foi pago */}
                                        {palpite.statusJogo !== 'Finalizada' && palpite.statusPagamento !== 'pago' && (
                                            <button
                                                onClick={() => handleExibirPix(palpite.id, palpite.valorApostado)}
                                                disabled={carregandoPix}
                                                className="flex-1 md:flex-none px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                title="Gerar PIX"
                                            >
                                                {carregandoPix ? (
                                                    <>
                                                        <i className="fa-solid fa-spinner animate-spin"></i>
                                                        Carregando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa-solid fa-qrcode"></i>
                                                        PIX
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                const text = `Confira meu palpite no Bolão ${palpite.nomeBolao}: ${getPalpiteResume(palpite)}`;
                                                const encoded = encodeURIComponent(text);
                                                window.open(`https://wa.me/?text=${encoded}`, '_blank');
                                            }}
                                            className="flex-1 md:flex-none px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                                            title="Compartilhar no WhatsApp"
                                        >
                                            <i className="fa-brands fa-whatsapp"></i>
                                            ZAP
                                        </button>

                                        {palpite.statusJogo === 'Finalizada' && (
                                            <button
                                                onClick={() => navigate(`/bolao/${palpite.bolaoId}`)}
                                                className="flex-1 md:flex-none px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                                                title="Ver detalhes"
                                            >
                                                <i className="fa-solid fa-eye"></i>
                                                Detalhes
                                            </button>
                                        )}
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
                        <p className="text-gray-600 text-sm mt-2">
                            Crie seu primeiro palpite agora!
                        </p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="mt-4 px-6 py-2 bg-primary hover:bg-green-600 text-black font-bold rounded-lg transition-all"
                        >
                            Ir para Dashboard
                        </button>
                    </div>
                )}
            </div>

            {/* Modal de QR Code PIX */}
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

            
        </div>

        
    );
}
