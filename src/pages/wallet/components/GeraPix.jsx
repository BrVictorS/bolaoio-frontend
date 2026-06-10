import { useState } from "react";


export default function GeraPix({ onGerar, pixData }) {
    const [pixData, setPixData] = useState(null);



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
    
}