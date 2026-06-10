import { useState } from "react";
import { walletService } from "../../../services/walletService";

const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);

function PixInfoModal({ pixData, onClose }) {
    const [copied, setCopied] = useState(false);

    function handleCopiar() {
        if (!pixData?.pixCopy) return;
        navigator.clipboard.writeText(pixData.pixCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    }

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-card border border-gray-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-5 bg-gradient-to-r from-green-900 to-emerald-900 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <i className="fa-brands fa-pix"></i>
                        PIX Pendente
                    </h3>
                    <button onClick={onClose} className="text-green-200 hover:text-white transition">
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                <div className="p-6">
                    <div className="text-center mb-4">
                        <p className="text-white font-bold text-2xl">{fmt(pixData.valor)}</p>
                        <p className="text-gray-500 text-xs mt-1">Escaneie o QR code ou copie o código PIX</p>
                    </div>

                    {/* QR Code */}
                    {pixData.qrCode && (
                        <div className="flex justify-center mb-4">
                            <div className="bg-white p-3 rounded-xl inline-block">
                                <img
                                    src={pixData.qrCode.startsWith('data:') ? pixData.qrCode : `data:image/png;base64,${pixData.qrCode}`}
                                    alt="QR Code PIX"
                                    className="w-44 h-44 object-contain"
                                />
                            </div>
                        </div>
                    )}

                    {/* Copia e Cola */}
                    {pixData.pixCopy && (
                        <div className="mb-4">
                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">
                                PIX Copia e Cola
                            </label>
                            <div className="flex items-center gap-2 bg-dark border border-gray-600 rounded-lg p-2">
                                <input
                                    type="text"
                                    value={pixData.pixCopy}
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
                                    {copied
                                        ? <><i className="fa-solid fa-check"></i> Copiado</>
                                        : 'Copiar'
                                    }
                                </button>
                            </div>
                        </div>
                    )}

                    {pixData.expiraEm && (
                        <p className="text-gray-600 text-xs text-center mb-4">
                            Expira em: {new Date(pixData.expiraEm).toLocaleString('pt-BR')}
                        </p>
                    )}

                    <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mb-5 flex gap-2 text-xs text-yellow-300">
                        <i className="fa-solid fa-info-circle mt-0.5 flex-shrink-0"></i>
                        <span>Após o pagamento, seu saldo será atualizado automaticamente em alguns segundos.</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold transition"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}

export function TransactionHistory({ extrato = [], loading = false }) {
    const [carregandoId, setCarregandoId] = useState(null);
    const [pixModal, setPixModal] = useState(null);
    const [erro, setErro] = useState("");

    async function handleExibirPix(id) {
        setCarregandoId(id);
        setErro("");
        try {
            const data = await walletService.getPixInfo(id);
            setPixModal(data);
        } catch (err) {
            setErro(err?.message || "Erro ao carregar informações do PIX.");
        } finally {
            setCarregandoId(null);
        }
    }

    return (
        <>
            <div className="lg:col-span-2 bg-card border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-list text-primary"></i>
                    Extrato Financeiro
                </h3>

                {erro && (
                    <div className="mb-3 bg-red-900/20 border border-red-700/30 rounded-lg px-3 py-2 text-xs text-red-400 flex items-center gap-2">
                        <i className="fa-solid fa-circle-exclamation"></i> {erro}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <i className="fa-solid fa-spinner animate-spin text-primary text-2xl"></i>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="text-xs uppercase bg-dark text-gray-300">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Data</th>
                                    <th className="px-4 py-3">Descrição</th>
                                    <th className="px-4 py-3 text-right">Entrada</th>
                                    <th className="px-4 py-3 text-right">Taxas</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                    <th className="px-4 py-3 rounded-tr-lg"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {extrato.length > 0 ? (
                                    extrato.map((item, index) => {
                                        const isDeposito = item.descricao?.toLowerCase().includes('deposito') ||
                                                           item.descricao?.toLowerCase().includes('depósito');
                                        const isAposta = item.descricao?.toLowerCase().includes('aposta');
                                        const isPendente = item.status === 'Processando';
                                        const isCarregando = carregandoId === item.id;

                                        return (
                                            <tr key={item.id ?? index} className="hover:bg-white/5 transition-colors">
                                                {/* Data */}
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-gray-300">
                                                        {new Date(item.data).toLocaleDateString('pt-BR')}
                                                    </span>
                                                    <span className="text-[10px] block text-gray-600">
                                                        {new Date(item.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </td>

                                                {/* Descrição + Status */}
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                        isDeposito
                                                            ? 'text-green-400 bg-green-900/20 border-green-500/30'
                                                            : 'text-red-400 bg-red-900/20 border-red-500/30'
                                                    }`}>
                                                        {item.descricao?.toUpperCase()}
                                                    </span>
                                                    {item.status && (
                                                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] border ${
                                                            item.status === 'Concluido'
                                                                ? 'text-green-400 border-green-700/50'
                                                                : item.status === 'Processando'
                                                                ? 'text-yellow-400 border-yellow-700/50'
                                                                : item.status === 'Cancelado'
                                                                ? 'text-red-400 border-red-700/50'
                                                                : 'text-gray-400 border-gray-700/50'
                                                        }`}>
                                                            {item.status}
                                                        </span>
                                                    )}
                                                    {item.statusSaque && (
                                                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] border font-bold ${
                                                            item.statusSaque === 'Pago'
                                                                ? 'text-green-400 border-green-700/50 bg-green-900/20'
                                                                : item.statusSaque === 'Pendente'
                                                                ? 'text-yellow-400 border-yellow-700/50 bg-yellow-900/20'
                                                                : item.statusSaque === 'Rejeitado'
                                                                ? 'text-red-400 border-red-700/50 bg-red-900/20'
                                                                : 'text-gray-400 border-gray-700/50'
                                                        }`}>
                                                            {item.statusSaque}
                                                        </span>
                                                    )}
                                                    {item.motivoRejeicao && (
                                                        <div className="mt-1 text-[9px] text-red-300 bg-red-900/20 border border-red-700/30 rounded px-2 py-1 inline-block">
                                                            <i className="fa-solid fa-exclamation-circle mr-1"></i>
                                                            {item.motivoRejeicao}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Entrada */}
                                                <td className="px-4 py-3 text-right font-mono text-xs">
                                                    {isDeposito
                                                        ? <span className="text-green-400 font-bold">{fmt(item.valor)}</span>
                                                        : isAposta
                                                        ? <span className="text-red-400 font-bold">-{fmt(item.valorEntrada)}</span>
                                                        : <span className="text-gray-600">—</span>
                                                    }
                                                </td>

                                                {/* Taxas */}
                                                <td className="px-4 py-3 text-right font-mono text-xs">
                                                    {item.valorTaxas != null && item.valorTaxas > 0
                                                        ? <span className="text-orange-400">{fmt(item.valorTaxas)}</span>
                                                        : <span className="text-gray-600">—</span>
                                                    }
                                                </td>

                                                {/* Total */}
                                                <td className={`px-4 py-3 text-right font-bold font-mono ${
                                                    isDeposito ? 'text-green-400' : isAposta ? 'text-red-400' : 'text-yellow-400'
                                                }`}>
                                                    {isDeposito ? '+' : '-'} 
                                                    {isAposta ? fmt(Math.abs(item.valorEntrada)) : fmt(Math.abs(item.valor+ item.valorTaxas))}
                                                </td>

                                                {/* Ação PIX — só para depósitos pendentes */}
                                                <td className="px-3 py-3 text-center">
                                                    {isDeposito && isPendente ? (
                                                        <button
                                                            onClick={() => handleExibirPix(item.id)}
                                                            disabled={isCarregando}
                                                            title="Ver QR Code PIX"
                                                            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                                                        >
                                                            {isCarregando ? (
                                                                <><i className="fa-solid fa-spinner animate-spin"></i> <span className="hidden sm:inline">Carregando</span></>
                                                            ) : (
                                                                <><i className="fa-solid fa-qrcode"></i> <span className="hidden sm:inline">PIX</span></>
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <span></span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-16 text-center">
                                            <i className="fa-solid fa-inbox text-gray-700 text-3xl mb-3 block"></i>
                                            <span className="text-gray-600 text-sm">Nenhuma movimentação encontrada.</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal do PIX */}
            {pixModal && (
                <PixInfoModal
                    pixData={pixModal}
                    onClose={() => setPixModal(null)}
                />
            )}
        </>
    );
}
