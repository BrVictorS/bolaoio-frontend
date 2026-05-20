import { useState } from "react";
import { walletService } from "../../../services/walletService";

const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);

export default function PixRecargaModal({ isOpen, onClose, valorNecessario = 0, taxaspercentuais = 0, valorEntrada = 0 }) {
    const [amount, setAmount] = useState(String(valorEntrada));
    const [loading, setLoading] = useState(false);
    const [pixData, setPixData] = useState(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");    

    if (!isOpen) return null;

   async function handleGerarPix() {
    // 1. Substitui vírgula por ponto para evitar bugs no parseFloat
    const stringValor = String(amount).replace(',', '.');    

    const valor = parseFloat(stringValor);
    

    // Valida o valor principal
    if (!valor || valor <= 0 || isNaN(valor)) {
        setError("Informe um valor válido.");
        return;
    }

    setLoading(true);
    setError("");
    try {
        // Envia o valor (numero) e a taxa (numero ou null)
        const data = await walletService.gerarPixDeposito(valor);
        setPixData(data);
    } catch (err) {
        setError(err?.erro || err?.message || "Erro ao gerar PIX. Tente novamente.");
    } finally {
        setLoading(false);
    }
}

    function handleCopiar() {
        if (!pixData?.pixCopiaECola) return;
        navigator.clipboard.writeText(pixData.pixCopiaECola);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    }

    function handleFechar() {
        setPixData(null);
        setAmount(String(valorNecessario));
        setError("");
        setCopied(false);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-card border border-gray-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="p-5 bg-gradient-to-r from-orange-900/80 to-red-900/80 border-b border-orange-700/40 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-triangle-exclamation text-orange-400"></i>
                            Saldo Insuficiente
                        </h3>
                        <p className="text-orange-200/70 text-xs mt-0.5">Recarregue sua carteira para continuar</p>
                    </div>
                    <button onClick={handleFechar} className="text-orange-200 hover:text-white transition">
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                <div className="p-6">
                    {!pixData ? (
                        <>
                            {/* Info sobre o valor necessário */}
                            {valorNecessario > 0 && (
                                <div className="bg-orange-900/20 border border-orange-700/30 rounded-xl p-4 mb-5 flex-row items-center gap-3">
                                    <i className="fa-solid fa-coins text-orange-400 text-xl flex-shrink-0"></i>
                                    <div>
                                        <p className="text-gray-400 text-xs">Valor necessário para este palpite</p>
                                        <p className="text-white font-bold text-lg">{fmt(valorNecessario)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs">Valor entrada: {fmt(valorEntrada)}</p>
                                        <p className="text-gray-400 text-xs">Taxas: {taxaspercentuais}%</p>
                                    </div>
                                </div>
                            )}

                            {/* Valor a depositar */}
                            <div className="mb-5">
                                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">
                                    Valor do Depósito
                                </label>

                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {[valorNecessario, valorNecessario * 2, valorNecessario * 3]
                                        .filter(v => v > 0)
                                        .map((value, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setAmount(String(value.toFixed(2))); setError(""); }}
                                            className={`border rounded-lg py-2 text-xs font-mono transition ${
                                                parseFloat(amount) === value
                                                    ? 'border-primary text-primary bg-primary/10'
                                                    : 'border-gray-600 hover:border-primary hover:text-primary text-gray-300'
                                            }`}
                                        >
                                            {fmt(value)}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                                    <input
                                        type="number"
                                        value={valorNecessario}
                                        onChange={e => { setAmount(e.target.value); setError(""); }}
                                        placeholder="0,00"
                                        className="w-full bg-dark border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-primary focus:outline-none font-bold text-lg"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                        <i className="fa-solid fa-circle-exclamation"></i> {error}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleFechar}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleGerarPix}
                                    disabled={loading}
                                    className="flex-1 bg-primary hover:bg-green-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-green-900/50 transition flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <><i className="fa-solid fa-spinner animate-spin"></i> Gerando...</>
                                    ) : (
                                        <><i className="fa-brands fa-pix"></i> Gerar PIX</>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        /* Tela do QR Code */
                        <div className="fade-in">
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-700/40 rounded-full px-4 py-1.5 mb-3">
                                    <i className="fa-brands fa-pix text-green-400 text-sm"></i>
                                    <span className="text-green-400 text-xs font-bold">PIX Gerado</span>
                                </div>
                                <p className="text-white font-bold text-2xl">{fmt(pixData.valor)}</p>
                                <p className="text-gray-500 text-xs mt-1">Escaneie o QR code ou copie o código</p>
                            </div>

                            {pixData.qrCodeBase64 && (
                                <div className="flex justify-center mb-4">
                                    <div className="bg-white p-3 rounded-xl inline-block">
                                        <img
                                            src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                                            alt="QR Code PIX"
                                            className="w-44 h-44 object-contain"
                                        />
                                    </div>
                                </div>
                            )}

                            {pixData.pixCopiaECola && (
                                <div className="mb-4">
                                    <label className="block text-xs uppercase font-bold text-gray-500 mb-1">
                                        PIX Copia e Cola
                                    </label>
                                    <div className="flex items-center gap-2 bg-dark border border-gray-600 rounded-lg p-2">
                                        <input
                                            type="text"
                                            value={pixData.pixCopiaECola}
                                            readOnly
                                            className="flex-1 text-xs text-gray-400 bg-transparent outline-none truncate"
                                        />
                                        <button
                                            onClick={handleCopiar}
                                            className={`text-xs font-bold px-3 py-1 rounded transition ${
                                                copied
                                                    ? 'text-green-400 bg-green-900/30'
                                                    : 'text-primary hover:text-green-400'
                                            }`}
                                        >
                                            {copied ? <><i className="fa-solid fa-check"></i> Copiado</> : 'Copiar'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 mb-5 flex gap-2 text-xs text-blue-300">
                                <i className="fa-solid fa-info-circle mt-0.5 flex-shrink-0"></i>
                                <span>
                                    Após confirmar o pagamento, seu saldo será atualizado automaticamente.
                                    Volte aqui e tente registrar o palpite novamente.
                                </span>
                            </div>

                            <button
                                onClick={handleFechar}
                                className="w-full bg-primary hover:bg-green-600 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                Voltar e Tentar Novamente
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
