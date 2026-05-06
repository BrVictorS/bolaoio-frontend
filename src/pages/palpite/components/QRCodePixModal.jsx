import { useState, useEffect } from 'react';

/**
 * Modal para exibir QR Code de PIX e código para copiar
 *
 * Props:
 * - isOpen: boolean - Se modal está aberto
 * - onClose: function - Função para fechar modal
 * - qrCode: string - URL/base64 da imagem do QR code
 * - pixCopy: string - Código PIX para copiar e colar
 * - valor: number - Valor do palpite
 * - expiresAt: ISO8601 | null - Quando o PIX expira
 * - palpiteId: number - ID do palpite
 */
export default function QRCodePixModal({
    isOpen,
    onClose,
    qrCode,
    pixCopy,
    valor,
    expiresAt,
    palpiteId
}) {
    const [copiado, setCopiado] = useState(false);
    const [tempoRestante, setTempoRestante] = useState(null);

    if (!isOpen || !qrCode) {
        return null;
    }

    // Calcular tempo restante para expiração usando useEffect
    useEffect(() => {
        if (expiresAt) {
            const expira = new Date(expiresAt);
            const agora = new Date();
            const diferenca = Math.floor((expira - agora) / 1000);

            if (diferenca > 0) {
                const horas = Math.floor(diferenca / 3600);
                const minutos = Math.floor((diferenca % 3600) / 60);
                setTempoRestante(`${horas}h ${minutos}min`);
            } else {
                setTempoRestante('Expirado');
            }
        }
    }, [expiresAt]);

    const handleCopiar = () => {
        navigator.clipboard.writeText(pixCopy).then(() => {
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        });
    };

    const handleCompartilharWhatsApp = () => {
        const texto = `🎯 Palpite criado!\n\n💰 Valor: R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n📱 Pague pelo PIX escaneando o QR code ou use o código: ${pixCopy.substring(0, 30)}...`;
        const encoded = encodeURIComponent(texto);
        window.open(`https://wa.me/?text=${encoded}`, '_blank');
    };

    const handleBaixarQRCode = () => {
        // Se for base64
        if (qrCode.startsWith('data:image')) {
            const link = document.createElement('a');
            link.href = qrCode;
            link.download = `pix-palpite-${palpiteId}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-gray-700 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in scale-100 duration-300">

                {/* Botão Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
                >
                    <i className="fa-solid fa-xmark text-xl"></i>
                </button>

                {/* Cabeçalho */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30 mx-auto mb-4">
                        <i className="fa-solid fa-money-bill-wave text-green-400 text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">PIX Disponível</h2>
                    <p className="text-gray-400 text-sm">Escaneie o código abaixo para pagar</p>
                </div>

                {/* Informações do Valor */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-6 text-center">
                    <p className="text-gray-400 text-xs uppercase font-bold mb-1">Valor a Pagar</p>
                    <p className="text-green-400 font-bold text-3xl">
                        R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                {/* QR Code */}
                <div className="bg-white rounded-2xl p-4 mb-6 flex justify-center">
                    {qrCode.startsWith('data:image') ? (
                        <img
                            src={qrCode}
                            alt="QR Code PIX"
                            className="w-64 h-64 object-contain"
                        />
                    ) : (
                        // Se for URL
                        <img
                            src={qrCode}
                            alt="QR Code PIX"
                            className="w-64 h-64 object-contain"
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext x="50" y="50" font-size="12" text-anchor="middle" dominant-baseline="middle"%3EErro ao carregar QR%3C/text%3E%3C/svg%3E';
                            }}
                        />
                    )}
                </div>

                {/* Código PIX para Copiar */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 mb-6">
                    <p className="text-gray-400 text-xs uppercase font-bold mb-2">Copiar e Colar</p>
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={pixCopy}
                            readOnly
                            className="flex-1 bg-dark border border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-300 font-mono focus:border-primary outline-none"
                        />
                        <button
                            onClick={handleCopiar}
                            className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                                copiado
                                    ? 'bg-green-500 text-white'
                                    : 'bg-primary hover:bg-green-600 text-black'
                            }`}
                        >
                            {copiado ? (
                                <>
                                    <i className="fa-solid fa-check mr-1"></i>
                                    Copiado!
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-copy mr-1"></i>
                                    Copiar
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Informações Adicionais */}
                <div className="space-y-2 mb-6">
                    {tempoRestante && (
                        <div className="bg-gray-800/30 rounded-lg px-3 py-2 flex items-center gap-2 text-xs">
                            <i className="fa-solid fa-hourglass-end text-yellow-400"></i>
                            <span className="text-gray-300">
                                Válido por: <span className="font-bold text-yellow-400">{tempoRestante}</span>
                            </span>
                        </div>
                    )}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 flex items-center gap-2 text-xs">
                        <i className="fa-solid fa-info-circle text-blue-400"></i>
                        <span className="text-blue-300">
                            O pagamento é processado automaticamente após confirmação
                        </span>
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                        onClick={handleBaixarQRCode}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                        title="Baixar imagem do QR code"
                    >
                        <i className="fa-solid fa-download"></i>
                        <span className="hidden sm:inline">QR Code</span>
                    </button>
                    <button
                        onClick={handleCompartilharWhatsApp}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                        title="Compartilhar pelo WhatsApp"
                    >
                        <i className="fa-brands fa-whatsapp"></i>
                        <span className="hidden sm:inline">ZAP</span>
                    </button>
                </div>

                {/* Botão Fechar */}
                <button
                    onClick={onClose}
                    className="w-full bg-primary hover:bg-green-600 text-black font-bold py-3 rounded-lg transition"
                >
                    Feito, Vou Pagar
                </button>

                {/* Footer com dica */}
                <p className="text-gray-500 text-xs text-center mt-4">
                    💡 Dica: Você pode pagar agora ou depois. O palpite já foi registrado!
                </p>
            </div>
        </div>
    );
}
