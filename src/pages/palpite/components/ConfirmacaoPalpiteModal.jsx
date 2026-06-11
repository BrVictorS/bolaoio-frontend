import React from 'react';

const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);

export default function ConfirmacaoPalpiteModal({ bolao, palpite, qtdCotas = 1, taxas, valorTotal, onConfirm, onCancel, isLoading }) {
    const isTipoPlacarExato = bolao?.tipoBolao === 1;
    const isTipoVencedor = bolao?.tipoBolao === 2;

    const valorBase = bolao?.valor ?? 0;
    const totalFinal = valorTotal ?? valorBase * qtdCotas;

    const getVencedorText = () => {
        if (palpite.vencedor === 'A') return `Vitória de ${bolao.timeA}`;
        if (palpite.vencedor === 'E') return 'Empate';
        if (palpite.vencedor === 'B') return `Vitória de ${bolao.timeB}`;
        return '';
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-gray-700 rounded-3xl shadow-2xl max-w-md w-full p-8">

                {/* Ícone */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                        <i className="fa-solid fa-clipboard-check text-primary text-2xl"></i>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-2">Confirme seu Palpite</h2>
                <p className="text-gray-400 text-center text-sm mb-6">Verifique os dados antes de confirmar</p>

                {/* Bolão */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-4 mb-4">
                    <p className="text-gray-400 text-xs uppercase font-bold mb-1">Bolão</p>
                    <h3 className="text-white font-bold text-lg">{bolao.nome}</h3>
                </div>

                {/* Palpite */}
                <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 mb-4">
                    <p className="text-primary text-xs uppercase font-bold mb-3">Seu Palpite</p>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 text-center">
                            <p className="text-white font-bold text-sm mb-1">{bolao.timeA}</p>
                            {isTipoPlacarExato && <p className="text-primary text-3xl font-bold font-mono">{palpite.golsTimeA}</p>}
                            {isTipoVencedor && (
                                <p className={`text-lg ${palpite.vencedor === 'A' ? 'text-primary font-bold' : 'text-gray-500'}`}>
                                    {palpite.vencedor === 'A' ? '✓ Vence' : '—'}
                                </p>
                            )}
                        </div>
                        {isTipoPlacarExato && <div className="text-gray-500 font-bold text-lg">×</div>}
                        {isTipoVencedor && palpite.vencedor === 'E' && (
                            <div className="text-primary font-bold text-lg">EMPATE</div>
                        )}
                        <div className="flex-1 text-center">
                            <p className="text-white font-bold text-sm mb-1">{bolao.timeB}</p>
                            {isTipoPlacarExato && <p className="text-primary text-3xl font-bold font-mono">{palpite.golsTimeB}</p>}
                            {isTipoVencedor && (
                                <p className={`text-lg ${palpite.vencedor === 'B' ? 'text-primary font-bold' : 'text-gray-500'}`}>
                                    {palpite.vencedor === 'B' ? '✓ Vence' : '—'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Resumo de Valores */}
                <div className="bg-dark border border-gray-700 rounded-xl p-3 mb-4 text-xs space-y-1">
                    <div className="flex justify-between text-gray-500">
                        <span>{qtdCotas} cota{qtdCotas > 1 ? 's' : ''} × {fmt(valorBase)}</span>
                        <span className="text-gray-300">{fmt(valorBase * qtdCotas)}</span>
                    </div>
                  
                    <div className="flex justify-between text-white font-bold border-t border-gray-700 pt-1">
                        <span>Total a debitar da carteira</span>
                        <span className="text-primary">{fmt(totalFinal)}</span>
                    </div>
                </div>

                {/* Aviso */}
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-3 mb-6 flex gap-3">
                    <i className="fa-solid fa-wallet text-blue-400 flex-shrink-0 mt-0.5"></i>
                    <p className="text-blue-200 text-xs">
                        O valor será debitado do saldo da sua carteira. Caso o saldo seja insuficiente,
                        você poderá recarregar via PIX e tentar novamente.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button onClick={onCancel} disabled={isLoading}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50">
                        Revisar
                    </button>
                    <button onClick={onConfirm} disabled={isLoading}
                        className="flex-1 bg-primary hover:bg-green-600 text-black font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2">
                        {isLoading ? (
                            <><i className="fa-solid fa-spinner animate-spin"></i> Enviando...</>
                        ) : (
                            <><i className="fa-solid fa-check"></i> Confirmar</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
