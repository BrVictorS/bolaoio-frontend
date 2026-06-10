import { useState } from "react";
import { saqueService } from "../../../services/saqueService";

export function ModalSaque({ isOpen, onClose, onSuccess, balance }) {
    const [valor, setValor] = useState('');
    const [tipoChavePix, setTipoChavePix] = useState(0); // 0=Cpf, 1=Email, 2=Telefone, 3=Aleatoria
    const [chavePix, setChavePix] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setSucesso('');

        const v = parseFloat(valor);
        if (!v || v <= 0) {
            setErro('Informe um valor válido maior que zero.');
            return;
        }

        if (v > balance) {
            setErro('Saldo insuficiente para este saque.');
            return;
        }

        if (!chavePix.trim()) {
            setErro('Informe sua chave PIX.');
            return;
        }

        setLoading(true);
        try {
            await saqueService.solicitarSaque(v, tipoChavePix, chavePix.trim());
            setSucesso('Solicitação de saque criada com sucesso! Saques podem levar até 24 horas para serem efetivados.');

            setTimeout(() => {
                onSuccess?.();
                onClose();
                setValor('');
                setChavePix('');
                setTipoChavePix(0);
                setSucesso('');
            }, 2000);
        } catch (err) {
            setErro(err?.erro || err?.message || 'Erro ao processar o saque.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-card border border-gray-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <i className="fa-solid fa-arrow-up-from-bracket"></i> Solicitar Saque
                    </h3>
                    <button onClick={onClose} className="text-blue-200 hover:text-white transition">
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Aviso importante */}
                    <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 text-xs text-yellow-300 flex gap-2">
                        <i className="fa-solid fa-circle-info mt-0.5 flex-shrink-0"></i>
                        <span><strong>Atenção:</strong> Saques podem levar até 24 horas para serem efetivados.</span>
                    </div>

                    {/* Info saldo */}
                    <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 text-xs text-blue-300 flex gap-2">
                        <i className="fa-solid fa-wallet mt-0.5 flex-shrink-0"></i>
                        <span>Saldo disponível: <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}</strong></span>
                    </div>

                    {/* Valor */}
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Valor do saque (R$) *</label>
                        <input
                            type="number"
                            value={valor}
                            onChange={e => setValor(e.target.value)}
                            placeholder="0,00"
                            min="1"
                            step="0.01"
                            disabled={loading}
                            className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none font-bold text-lg disabled:opacity-50"
                        />
                    </div>

                    {/* Tipo PIX */}
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Tipo de chave PIX *</label>
                        <select
                            value={tipoChavePix}
                            onChange={e => setTipoChavePix(parseInt(e.target.value))}
                            disabled={loading}
                            className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none disabled:opacity-50"
                        >
                            <option value="0">CPF</option>
                            <option value="1">E-mail</option>
                            <option value="2">Telefone</option>
                            <option value="3">Chave Aleatória</option>
                        </select>
                    </div>

                    {/* Chave PIX */}
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Chave PIX *</label>
                        <input
                            type="text"
                            value={chavePix}
                            onChange={e => setChavePix(e.target.value)}
                            placeholder={
                                tipoChavePix === 0 ? '000.000.000-00' :
                                tipoChavePix === 1 ? 'seu@email.com' :
                                tipoChavePix === 2 ? '(11) 99999-9999' :
                                'Chave aleatória'
                            }
                            disabled={loading}
                            className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none disabled:opacity-50"
                        />
                    </div>

                    {/* Erros */}
                    {erro && (
                        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-sm text-red-300 flex items-center gap-2">
                            <i className="fa-solid fa-circle-exclamation flex-shrink-0"></i>
                            <span>{erro}</span>
                        </div>
                    )}

                    {/* Sucesso */}
                    {sucesso && (
                        <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-3 text-sm text-green-300 flex items-center gap-2">
                            <i className="fa-solid fa-circle-check flex-shrink-0"></i>
                            <span>{sucesso}</span>
                        </div>
                    )}

                    {/* Botão */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white py-3 rounded-lg font-bold shadow-lg transition flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <i className="fa-solid fa-spinner animate-spin"></i> Processando...
                            </>
                        ) : (
                            <>
                                <i className="fa-brands fa-pix"></i> Confirmar Saque
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
