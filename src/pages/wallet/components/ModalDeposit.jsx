import { useState, useEffect } from "react";
import { walletService } from "../../../services/walletService";
import { bolaoService } from "../../../services/bolaoService";

export function ModalDeposit({ isOpen, onClose, onSuccess }) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [pixData, setPixData] = useState(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");
    const [taxaPercent, setTaxaPercent] = useState(null);

    useEffect(() => {
        if (!isOpen) return;
        bolaoService.getTaxas()
            .then(data => setTaxaPercent(Number(data.totalPercent)))
            .catch(() => setTaxaPercent(null));
    }, [isOpen]);

    if (!isOpen) return null;

    const valorNumerico = parseFloat(amount) || 0;
    const valorTaxa = taxaPercent !== null ? valorNumerico * (taxaPercent / 100) : null;
    const valorFinal = valorTaxa !== null ? valorNumerico + valorTaxa : null;

    function handleSelectAmount(value) {
        setAmount(String(value));
        setError("");
    }

    async function handleGerarPix() {
        const valor = parseFloat(amount);
        if (!valor || valor <= 0) {
            setError("Informe um valor válido para o depósito.");
            return;
        }

        setLoading(true);
        setError("");

        try {
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
        setAmount("");
        setError("");
        setCopied(false);
        if (pixData && onSuccess) onSuccess();
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-card border border-gray-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="p-5 bg-gradient-to-r from-green-900 to-emerald-900 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <i className="fa-solid fa-wallet"></i>
                        Adicionar Saldo
                    </h3>
                    <button onClick={handleFechar} className="text-green-200 hover:text-white transition">
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                <div className="p-6">
                    {!pixData ? (
                        <>
                            {/* Método de pagamento */}
                            <div className="flex gap-2 mb-6 bg-dark p-1 rounded-lg">
                                <button className="flex-1 py-2 bg-gray-700 text-white rounded-md text-sm font-bold shadow-sm">
                                    PIX (Instantâneo)
                                </button>
                                <button className="flex-1 py-2 text-gray-500 text-sm font-medium cursor-not-allowed" disabled>
                                    Cartão de Crédito
                                </button>
                            </div>

                            {/* Valor */}
                            <div className="mb-5">
                                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">
                                    Valor do Depósito
                                </label>

                                <div className="grid grid-cols-3 gap-3 mb-3">
                                    {[20, 50, 100].map(value => (
                                        <button
                                            key={value}
                                            onClick={() => handleSelectAmount(value)}
                                            className={`border rounded-lg py-2 text-sm font-mono transition ${
                                                amount === String(value)
                                                    ? 'border-primary text-primary bg-primary/10'
                                                    : 'border-gray-600 hover:border-primary hover:text-primary text-gray-300'
                                            }`}
                                        >
                                            R$ {value}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={e => { setAmount(e.target.value); setError(""); }}
                                        placeholder="0,00"
                                        className="w-full bg-dark border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-primary focus:outline-none font-bold text-lg"
                                    />
                                </div>

                                {valorNumerico > 0 && taxaPercent !== null && (
                                    <div className="mt-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg px-3 py-2 text-xs text-yellow-300 space-y-1">
                                        <div className="flex justify-between">
                                            <span>Taxa administrativa ({taxaPercent}%)</span>
                                            <span>+ {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTaxa)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold border-t border-yellow-700/30 pt-1">
                                            <span className="text-yellow-200">Total cobrado via PIX</span>
                                            <span className="text-yellow-200">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorFinal)}</span>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                        <i className="fa-solid fa-circle-exclamation"></i> {error}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleGerarPix}
                                disabled={loading}
                                className="w-full bg-primary hover:bg-green-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-green-900/50 transition flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <><i className="fa-solid fa-spinner animate-spin"></i> Gerando PIX...</>
                                ) : (
                                    <><i className="fa-brands fa-pix"></i> Gerar PIX</>
                                )}
                            </button>
                        </>
                    ) : (
                        /* Tela do QR Code */
                        <div className="fade-in">
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-700/40 rounded-full px-4 py-1.5 mb-3">
                                    <i className="fa-brands fa-pix text-green-400 text-sm"></i>
                                    <span className="text-green-400 text-xs font-bold">PIX Gerado com Sucesso</span>
                                </div>
                                <p className="text-white font-bold text-2xl">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pixData.valor)}
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                    Escaneie o QR code ou copie o código
                                </p>
                            </div>

                            {/* QR Code */}
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

                            {/* Copia e Cola */}
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

                            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mb-5 flex gap-2 text-xs text-yellow-300">
                                <i className="fa-solid fa-info-circle mt-0.5 flex-shrink-0"></i>
                                <span>Após o pagamento, seu saldo será atualizado automaticamente. Isso pode levar alguns segundos.</span>
                            </div>

                            <button
                                onClick={handleFechar}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold transition"
                            >
                                Fechar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
