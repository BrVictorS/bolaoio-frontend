import React from 'react';

export default function ConfirmacaoPalpiteModal({ bolao, palpite, onConfirm, onCancel, isLoading }) {
    const isTipoPlacarExato = bolao?.tipoBolao === 1;
    const isTipoVencedor = bolao?.tipoBolao === 2;

    const getVencedorText = () => {
        if (palpite.vencedor === 'A') return `Vitória de ${bolao.timeA}`;
        if (palpite.vencedor === 'E') return 'Empate';
        if (palpite.vencedor === 'B') return `Vitória de ${bolao.timeB}`;
        return '';
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-gray-700 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in scale-100 duration-300">
                {/* Ícone de Confirmação */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                        <i className="fa-solid fa-clipboard-check text-primary text-2xl"></i>
                    </div>
                </div>

                {/* Título */}
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                    Confirme seu Palpite
                </h2>
                <p className="text-gray-400 text-center text-sm mb-6">
                    Verifique os dados antes de confirmar
                </p>

                {/* Card do Bolão */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-4 mb-6">
                    <p className="text-gray-400 text-xs uppercase font-bold mb-2">Bolão</p>
                    <h3 className="text-white font-bold text-lg mb-1">{bolao.nome}</h3>
                    <p className="text-gray-500 text-xs flex items-center gap-2">
                        <i className="fa-solid fa-coins text-primary"></i>
                        Entrada: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bolao.valor)}
                    </p>
                </div>

                {/* Card do Palpite */}
                <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 mb-6">
                    <p className="text-primary text-xs uppercase font-bold mb-3">Seu Palpite</p>

                    <div className="flex items-center justify-between gap-4">
                        {/* Time A */}
                        <div className="flex-1 text-center">
                            <p className="text-white font-bold text-sm mb-1">{bolao.timeA}</p>
                            {isTipoPlacarExato && (
                                <p className="text-primary text-3xl font-bold font-mono">{palpite.golsTimeA}</p>
                            )}
                            {isTipoVencedor && (
                                <p className={`text-lg ${palpite.vencedor === 'A' ? 'text-primary font-bold' : 'text-gray-500'}`}>
                                    {palpite.vencedor === 'A' ? '✓ Vence' : '-'}
                                </p>
                            )}
                        </div>

                        {isTipoPlacarExato && (
                            <div className="text-gray-500 font-bold text-lg">×</div>
                        )}

                        {isTipoVencedor && palpite.vencedor === 'E' && (
                            <div className="text-primary font-bold text-lg">EMPATE</div>
                        )}

                        {/* Time B */}
                        <div className="flex-1 text-center">
                            <p className="text-white font-bold text-sm mb-1">{bolao.timeB}</p>
                            {isTipoPlacarExato && (
                                <p className="text-primary text-3xl font-bold font-mono">{palpite.golsTimeB}</p>
                            )}
                            {isTipoVencedor && (
                                <p className={`text-lg ${palpite.vencedor === 'B' ? 'text-primary font-bold' : 'text-gray-500'}`}>
                                    {palpite.vencedor === 'B' ? '✓ Vence' : '-'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tipo de Bolão */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 mb-6 text-center">
                    <p className="text-gray-400 text-xs mb-1">Tipo</p>
                    <p className="text-white font-bold text-sm">
                        {isTipoPlacarExato && '⚽ Placar Exato'}
                        {isTipoVencedor && '🏆 Vencedor (1x2)'}
                    </p>
                </div>

                {/* Aviso */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-6 flex gap-3">
                    <i className="fa-solid fa-info-circle text-yellow-400 flex-shrink-0 mt-0.5"></i>
                    <p className="text-yellow-300 text-xs">
                        Verifique se o palpite está correto. Após confirmar, não será possível editar.
                    </p>
                </div>

                {/* Botões */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
                    >
                        Revisar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 bg-primary hover:bg-green-600 text-black font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <i className="fa-solid fa-spinner animate-spin"></i>
                                Enviando...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-check"></i>
                                Confirmar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
